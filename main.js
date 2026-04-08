/* ============================================================
   DEAN LAW — SHARED JAVASCRIPT
   ============================================================ */
(function () {
  'use strict';

  /* ── Helpers ── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

  /* ── Mobile nav ── */
  const navToggle = $('.nav-toggle');
  const navLinks  = $('.nav-links');

  if (navToggle && navLinks) {
    const openNav  = () => { navLinks.classList.add('open');    navToggle.classList.add('open'); };
    const closeNav = () => { navLinks.classList.remove('open'); navToggle.classList.remove('open'); };
    const toggleNav = () => navLinks.classList.contains('open') ? closeNav() : openNav();

    navToggle.addEventListener('click', toggleNav);

    /* Close when a link is tapped */
    $$('a', navLinks).forEach(a => a.addEventListener('click', closeNav));

    /* Close on outside click */
    document.addEventListener('click', e => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) closeNav();
    });

    /* Close on Escape */
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Scroll reveal ── */
  const reveals = $$('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay) || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ── Animated counters ── */
  function animateCounter(el, target, duration) {
    const suffix = el.dataset.suffix || '';
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target, parseInt(entry.target.dataset.target, 10), 1800);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  $$('[data-counter]').forEach(el => counterObserver.observe(el));

  /* ── Testimonials carousel ── */
  const track = $('.testimonial-track');
  const cards = $$('.testimonial-card');
  const dots  = $$('.carousel-dot');

  if (track && cards.length) {
    let current  = 0;
    let autoTimer = null;

    function goTo(idx) {
      current = ((idx % cards.length) + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5000);
    }

    $('.carousel-next')?.addEventListener('click', () => { next(); resetAuto(); });
    $('.carousel-prev')?.addEventListener('click', () => { prev(); resetAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

    /* Pause on hover / focus */
    track.closest('.testimonials-carousel')?.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.closest('.testimonials-carousel')?.addEventListener('mouseleave', resetAuto);

    /* Touch swipe support */
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
      resetAuto();
    }, { passive: true });

    goTo(0);
    resetAuto();
  }

  /* ── Footer year ── */
  const fyEl = document.getElementById('footerYear');
  if (fyEl) fyEl.textContent = new Date().getFullYear();

  /* ── Smooth scroll for same-page anchors ── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 88;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();