/**
 * KOFI'N MORE — Premium Menu
 * script.js
 *
 * What this does:
 *   1. Tracks scroll position → highlights the active category
 *      in both the desktop sidebar and the mobile tab strip.
 *   2. Handles click / tap on nav items → smooth-scrolls to section.
 *   3. Keeps the active mobile tab always scrolled into view.
 *
 * No libraries. No framework. Pure, purposeful JS.
 */

(function () {
  'use strict';

  /* ── Grab elements ──────────────────────────────────────── */
  const sideLinks  = document.querySelectorAll('.nav-link');
  const mobileTabs = document.querySelectorAll('.m-tab');
  const categories = document.querySelectorAll('.category[id]');
  const tabStrip   = document.querySelector('.tabs-inner');

  let currentId = null;

  /* ── IntersectionObserver: which section is in view? ────── */
  const io = new IntersectionObserver(
    (entries) => {
      // Find the entry that just became visible
      const visible = entries.filter(e => e.isIntersecting);
      if (!visible.length) return;

      // Pick the topmost one
      const topEntry = visible.reduce((a, b) =>
        a.boundingClientRect.top < b.boundingClientRect.top ? a : b
      );

      markActive(topEntry.target.id);
    },
    {
      root: null,
      // Trigger when section crosses the top 20% of viewport
      rootMargin: '-5% 0px -70% 0px',
      threshold: 0,
    }
  );

  categories.forEach(cat => io.observe(cat));

  /* ── Mark active ─────────────────────────────────────────── */
  function markActive(id) {
    if (id === currentId) return;
    currentId = id;

    sideLinks.forEach(el => {
      el.classList.toggle('active', el.dataset.target === id);
    });

    mobileTabs.forEach(el => {
      const isMatch = el.dataset.target === id;
      el.classList.toggle('active', isMatch);

      // Keep active tab visible inside the scroll strip
      if (isMatch && tabStrip) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  /* ── Click / tap: scroll to section ─────────────────────── */
  const isMobile = () => window.innerWidth <= 900;

  function goTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = isMobile() ? 58 : 20;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  sideLinks.forEach(el =>
    el.addEventListener('click', () => goTo(el.dataset.target))
  );
  mobileTabs.forEach(el =>
    el.addEventListener('click', () => goTo(el.dataset.target))
  );

  /* ── Keyboard support for sidebar nav items ──────────────── */
  sideLinks.forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goTo(el.dataset.target);
      }
    });
  });

})();
