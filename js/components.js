/* =============================================================
   Thru Do — components.js
   Packages carousel: snap scrolling, dots, arrows, drag-to-scroll,
   active-card detection, and an auto-focus on the featured plan
   the first time the section scrolls into view.
   ============================================================= */
(function () {
  'use strict';

  var scroller = document.getElementById('pkgScroller');
  if (!scroller) return;

  var cards = Array.prototype.slice.call(scroller.querySelectorAll('.pkg'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.pkg-dots button'));
  var prev = document.getElementById('pkgPrev');
  var next = document.getElementById('pkgNext');
  if (!cards.length) return;

  /* Scroll a given card to the start of the viewport (horizontal only) */
  function scrollToIndex(i) {
    var target = cards[i];
    if (!target) return;
    var left = target.offsetLeft - scroller.offsetLeft;
    scroller.scrollTo({ left: left, behavior: 'smooth' });
  }

  /* Find the card nearest the scroller centre and sync UI to it */
  function computeActive() {
    var center = scroller.scrollLeft + scroller.clientWidth / 2;
    var best = 0, bestDist = Infinity;

    cards.forEach(function (c, i) {
      var cCenter = c.offsetLeft + c.clientWidth / 2;
      var d = Math.abs(cCenter - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });

    cards.forEach(function (c, i) { c.classList.toggle('is-active', i === best); });
    dots.forEach(function (d, i) { d.setAttribute('aria-current', i === best ? 'true' : 'false'); });

    var maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (prev) prev.toggleAttribute('disabled', scroller.scrollLeft <= 2);
    if (next) next.toggleAttribute('disabled', scroller.scrollLeft >= maxScroll - 2);
  }

  /* Throttle scroll work to one rAF per frame */
  var ticking = false;
  scroller.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { computeActive(); ticking = false; });
    }
  });

  /* Dots + arrows */
  dots.forEach(function (d, i) { d.addEventListener('click', function () { scrollToIndex(i); }); });

  function activeIndex() {
    return cards.findIndex(function (c) { return c.classList.contains('is-active'); });
  }
  if (prev) prev.addEventListener('click', function () { scrollToIndex(Math.max(0, activeIndex() - 1)); });
  if (next) next.addEventListener('click', function () { scrollToIndex(Math.min(cards.length - 1, activeIndex() + 1)); });

  /* Drag-to-scroll on desktop pointers */
  var isDown = false, startX = 0, startScroll = 0;
  scroller.addEventListener('mousedown', function (e) {
    isDown = true;
    startX = e.pageX;
    startScroll = scroller.scrollLeft;
    scroller.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', function () {
    if (isDown) { isDown = false; scroller.style.cursor = ''; }
  });
  scroller.addEventListener('mouseleave', function () {
    if (isDown) { isDown = false; scroller.style.cursor = ''; }
  });
  scroller.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    e.preventDefault();
    scroller.scrollLeft = startScroll - (e.pageX - startX);
  });

  /* Keep active state accurate after layout changes */
  window.addEventListener('resize', computeActive);

  /* Auto-focus the featured (Growth) card once, when in view */
  var packagesSection = document.getElementById('packages');
  if (packagesSection && 'IntersectionObserver' in window) {
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () { scrollToIndex(1); }, 220);
          sectionIO.disconnect();
        }
      });
    }, { threshold: 0.35 });
    sectionIO.observe(packagesSection);
  }

  computeActive();
})();
