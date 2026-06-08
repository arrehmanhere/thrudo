/* =============================================================
   Thru Do — reviews.js
   Testimonials marquee: clones the review cards once so the row
   can scroll horizontally in a seamless, never-ending loop. The
   shift distance + duration are measured from the live layout, so
   adding more review cards just makes the loop longer — never the
   page taller. Pauses on hover; honours reduced-motion.
   No dependencies. Runs after DOM parse (loaded with `defer`).
   ============================================================= */
(function () {
  'use strict';

  var marquee = document.querySelector('[data-tm-marquee]');
  if (!marquee) return;

  var track = marquee.querySelector('.tm-track');
  if (!track) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var originals = Array.prototype.slice.call(track.children);
  if (!originals.length) return;

  /* Duplicate the set so translateX(-shift) wraps with no visible gap */
  originals.forEach(function (node) {
    var clone = node.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('tm-clone');
    track.appendChild(clone);
  });

  var SPEED = 70; // px per second — tune for faster/slower drift

  /* Measure the exact width of one set (incl. the trailing gap) and
     pin the animation distance + duration to it. */
  function measure() {
    var firstClone = track.children[originals.length];
    if (!firstClone) return;
    var shift = firstClone.offsetLeft - track.children[0].offsetLeft;
    if (shift <= 0) return;
    track.style.setProperty('--tm-shift', shift + 'px');
    track.style.animationDuration = (shift / SPEED) + 's';
  }

  if (prefersReduced) return; // CSS already disables the animation

  // Wait for fonts/images so widths are final, then lock the loop in.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }
  window.addEventListener('load', measure);
  measure();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  });
})();
