(function () {
  'use strict';

  // ── Intersection Observer — scroll reveal ────────────────────────────
  var anims = document.querySelectorAll('.anim');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    anims.forEach(function (el) { observer.observe(el); });
  } else {
    anims.forEach(function (el) { el.classList.add('in'); });
  }

  // ── Nav scroll state ─────────────────────────────────────────────────
  var nav = document.getElementById('nav');
  var ticking = false;

  function onScroll() {
    if (window.scrollY > 32) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  // ── Mobile menu ──────────────────────────────────────────────────────
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  burger.addEventListener('click', function () {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      burger.classList.remove('open');
      links.classList.remove('open');
    });
  });

  // ── Smooth anchor scroll ─────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ── Waitlist form ────────────────────────────────────────────────────
  var form = document.getElementById('waitlistForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('wlEmail');
      var btn = document.getElementById('wlBtn');
      if (!email.value || !email.validity.valid) return;

      var txt = btn.querySelector('.wl-txt');
      var ok = btn.querySelector('.wl-ok');
      txt.hidden = true;
      ok.hidden = false;
      btn.style.background = '#34C759';
      btn.style.boxShadow = '0 4px 24px rgba(52,199,89,.2)';
      btn.disabled = true;
      email.disabled = true;

      setTimeout(function () {
        txt.hidden = false;
        ok.hidden = true;
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
        email.disabled = false;
        email.value = '';
      }, 3000);
    });
  }

  // ── Parallax-lite on hero orbs ───────────────────────────────────────
  var orb1 = document.querySelector('.hero__orb--1');
  var orb2 = document.querySelector('.hero__orb--2');

  if (orb1 && window.matchMedia('(min-width:768px)').matches) {
    window.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 20;
      var y = (e.clientY / window.innerHeight - 0.5) * 20;
      orb1.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      orb2.style.transform = 'translate(' + (-x) + 'px,' + (-y) + 'px)';
    }, { passive: true });
  }
})();
