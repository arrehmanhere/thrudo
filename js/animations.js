/* =============================================================
   Thru Do — animations.js
   Scroll-triggered reveals + count-up stats, built on
   IntersectionObserver so nothing runs off the main scroll thread.
   Falls back gracefully when IO is unavailable or motion is reduced.
   ============================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* -----------------------------------------------------------
     1. Reveal-on-scroll
     CSS keeps `.reveal` hidden only while `.js` is on <html>.
     If IO is missing, reveal everything immediately.
     ----------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (!hasIO || prefersReduced) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* -----------------------------------------------------------
     2. Animated counters (stats strip)
     ----------------------------------------------------------- */
  var counters = document.querySelectorAll('.counter');

  var setFinal = function (el) {
    el.textContent = el.dataset.to;
  };

  if (!hasIO || prefersReduced) {
    counters.forEach(setFinal);
  } else {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var to = parseInt(el.dataset.to, 10);
        var duration = 1100;
        var start = performance.now();

        var tick = function (now) {
          var t = Math.min(1, (now - start) / duration);
          var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          el.textContent = Math.round(to * eased).toString();
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { countIO.observe(el); });
  }
})();
