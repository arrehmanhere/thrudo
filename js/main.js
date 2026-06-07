/* =============================================================
   Thru Do — main.js
   Site chrome: mobile navigation, scroll-spy, footer year, and
   pointer-driven flourishes (cursor glow + hero parallax).
   No dependencies. Runs after DOM parse (loaded with `defer`).
   ============================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer:fine)').matches;

  /* -----------------------------------------------------------
     1. Mobile navigation drawer
     ----------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    var openMenu = function () {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    var closeMenu = function () {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
      else openMenu();
    });

    // Close after navigating to an in-page section
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Reset when resizing up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 880 && menu.classList.contains('is-open')) closeMenu();
    });
  }

  /* -----------------------------------------------------------
     2. Scroll-spy — highlight the active section in the nav
     ----------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
  var linkFor = {};
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) {
      linkFor[id] = link;
      sections.push(section);
    }
  });

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* -----------------------------------------------------------
     3. Footer year (keeps the copyright current)
     ----------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -----------------------------------------------------------
     4. Cursor glow — desktop, fine pointer, motion allowed
     ----------------------------------------------------------- */
  var glow = document.getElementById('glow');
  if (glow) {
    if (finePointer && !prefersReduced) {
      var x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;
      window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
      (function loop() {
        x += (tx - x) * 0.08;
        y += (ty - y) * 0.08;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        requestAnimationFrame(loop);
      })();
    } else {
      glow.style.display = 'none';
    }
  }

  /* -----------------------------------------------------------
     5. Hero orbit parallax — subtle pointer tracking
     ----------------------------------------------------------- */
  var orbit = document.querySelector('.orbit-wrap');
  if (orbit && finePointer && !prefersReduced) {
    var stage = orbit.parentElement;
    stage.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      var mx = (e.clientX - r.left) / r.width - 0.5;
      var my = (e.clientY - r.top) / r.height - 0.5;
      orbit.style.transform = 'translate(' + (mx * -8) + 'px,' + (my * -8) + 'px)';
    });
    stage.addEventListener('mouseleave', function () { orbit.style.transform = ''; });
  }
})();
