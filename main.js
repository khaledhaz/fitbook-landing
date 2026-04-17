/* ═══════════════════════════════════════════════════════════════════════════
   FITBOOK LANDING — JS
   Scroll reveals, nav state, mobile menu, waitlist form
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Scroll Reveal via IntersectionObserver ────────────────────────────
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  // ── Nav scroll state ─────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  let ticking = false;

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  updateNav();

  // ── Mobile burger ────────────────────────────────────────────────────
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const spans = burger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ── Smooth scroll for anchor links ───────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ── Waitlist form ────────────────────────────────────────────────────
  var form = document.getElementById('waitlistForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('waitlistEmail');
      var btn = document.getElementById('waitlistBtn');
      var btnText = btn.querySelector('.waitlist__btn-text');
      var btnDone = btn.querySelector('.waitlist__btn-done');

      if (!email.value || !email.validity.valid) return;

      btn.disabled = true;
      btnText.style.display = 'none';
      btnDone.style.display = 'inline';
      btn.style.background = '#34C759';
      btn.style.boxShadow = '0 4px 20px rgba(52, 199, 89, 0.25)';
      email.disabled = true;

      setTimeout(function () {
        btn.disabled = false;
        btnText.style.display = '';
        btnDone.style.display = 'none';
        btn.style.background = '';
        btn.style.boxShadow = '';
        email.disabled = false;
        email.value = '';
      }, 3000);
    });
  }
})();
