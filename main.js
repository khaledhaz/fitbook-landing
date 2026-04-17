(function(){
  'use strict';
  var isDesktop = window.matchMedia('(min-width:768px) and (hover:hover)').matches;
  var isMobile = !window.matchMedia('(min-width:768px)').matches;

  /* ══════════════════════════════════════════════════════════════
     SCROLL REVEAL — staggered with 3D entrance
     ══════════════════════════════════════════════════════════════ */
  var els = document.querySelectorAll('.an');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -80px 0px' });
    els.forEach(function(el) { obs.observe(el); });
  } else { els.forEach(function(el) { el.classList.add('v'); }); }

  /* ══════════════════════════════════════════════════════════════
     COUNTER ANIMATION — with eased count-up
     ══════════════════════════════════════════════════════════════ */
  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseInt(el.getAttribute('data-target'));
        var duration = 2200, startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.floor(eased * target).toLocaleString() + '+';
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { cObs.observe(c); });
  }

  /* ══════════════════════════════════════════════════════════════
     NAV
     ══════════════════════════════════════════════════════════════ */
  var nav = document.getElementById('nav'), tick = false;
  function scrollNav() { nav.classList.toggle('scrolled', window.scrollY > 40); tick = false; }
  window.addEventListener('scroll', function() { if (!tick) { requestAnimationFrame(scrollNav); tick = true; } }, { passive: true });
  scrollNav();

  /* ── Mobile menu ── */
  var burger = document.getElementById('burger'), links = document.getElementById('navL');
  burger.addEventListener('click', function() { burger.classList.toggle('open'); links.classList.toggle('open'); });
  links.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', function() { burger.classList.remove('open'); links.classList.remove('open'); }); });

  /* ── Smooth anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id = this.getAttribute('href'); if (id === '#') return;
      var t = document.querySelector(id); if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════════════════════════════
     3D MOUSE TRACKING — global cursor position
     ══════════════════════════════════════════════════════════════ */
  var mouseX = 0, mouseY = 0, smoothX = 0, smoothY = 0;

  if (isDesktop) {
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    /* ── Parallax orbs with smooth lerp ── */
    var o1 = document.querySelector('.orb-hero-1');
    var o2 = document.querySelector('.orb-hero-2');
    var o3 = document.querySelector('.orb-hero-3');

    (function raf() {
      smoothX += (mouseX - smoothX) * 0.025;
      smoothY += (mouseY - smoothY) * 0.025;
      if (o1) o1.style.transform = 'translate(' + smoothX * 40 + 'px,' + smoothY * 35 + 'px)';
      if (o2) o2.style.transform = 'translate(' + smoothX * -25 + 'px,' + smoothY * -22 + 'px)';
      if (o3) o3.style.transform = 'translate(' + smoothX * 18 + 'px,' + smoothY * 14 + 'px)';
      requestAnimationFrame(raf);
    })();

    /* ══════════════════════════════════════════════════════════════
       3D TILT ON CARDS — perspective-based mouse tracking
       ══════════════════════════════════════════════════════════════ */
    function addTilt(selector, intensity) {
      document.querySelectorAll(selector).forEach(function(el) {
        el.style.transformStyle = 'preserve-3d';
        el.addEventListener('mousemove', function(e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = 'perspective(800px) rotateX(' + (y * -intensity) + 'deg) rotateY(' + (x * intensity) + 'deg) translateY(-8px) scale(1.02)';
        });
        el.addEventListener('mouseleave', function() {
          el.style.transform = '';
          el.style.transition = 'transform 0.6s cubic-bezier(.25,.46,.45,.94)';
          setTimeout(function() { el.style.transition = ''; }, 600);
        });
      });
    }
    addTilt('.fc', 6);
    addTilt('.test-card', 5);
    addTilt('.how-scene', 10);
    addTilt('.panel', 4);

    /* ══════════════════════════════════════════════════════════════
       PHONE CLUSTER — mouse-reactive 3D
       ══════════════════════════════════════════════════════════════ */
    var phoneMain = document.querySelector('.phone-main .ph-frame');
    if (phoneMain) {
      var pmSmooth = { x: 0, y: 0 };
      (function phoneRaf() {
        pmSmooth.x += (mouseX - pmSmooth.x) * 0.04;
        pmSmooth.y += (mouseY - pmSmooth.y) * 0.04;
        phoneMain.style.transform = 'rotateY(' + (pmSmooth.x * 8) + 'deg) rotateX(' + (pmSmooth.y * -5) + 'deg)';
        requestAnimationFrame(phoneRaf);
      })();
    }
  }

  /* ══════════════════════════════════════════════════════════════
     SCROLL-BASED PARALLAX — elements move at different speeds
     ══════════════════════════════════════════════════════════════ */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !isMobile) {
    var scrollTick = false;
    window.addEventListener('scroll', function() {
      if (!scrollTick) {
        requestAnimationFrame(function() {
          var scrollY = window.scrollY;
          parallaxEls.forEach(function(el) {
            var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
            var rect = el.getBoundingClientRect();
            var center = rect.top + rect.height / 2;
            var offset = (center - window.innerHeight / 2) * speed;
            el.style.transform = 'translateY(' + offset + 'px)';
          });
          scrollTick = false;
        });
        scrollTick = true;
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════════
     SHOWCASE — auto-scroll with momentum
     ══════════════════════════════════════════════════════════════ */
  var showcase = document.getElementById('showcaseScroll');
  if (showcase) {
    var autoScroll = true;
    var scrollPos = 0;
    var scrollSpeed = 0.4;

    showcase.addEventListener('mouseenter', function() { autoScroll = false; });
    showcase.addEventListener('mouseleave', function() { autoScroll = true; });
    showcase.addEventListener('touchstart', function() { autoScroll = false; }, { passive: true });
    showcase.addEventListener('touchend', function() { setTimeout(function() { autoScroll = true; scrollPos = showcase.scrollLeft; }, 2000); });

    (function autoScrollRaf() {
      if (autoScroll) {
        scrollPos += scrollSpeed;
        if (scrollPos >= showcase.scrollWidth - showcase.clientWidth) scrollPos = 0;
        showcase.scrollLeft = scrollPos;
      }
      requestAnimationFrame(autoScrollRaf);
    })();
  }

  /* ══════════════════════════════════════════════════════════════
     FLOATING SHAPES — background geometric elements
     ══════════════════════════════════════════════════════════════ */
  function createFloatingShapes() {
    var shapes = document.querySelectorAll('.float-shape');
    shapes.forEach(function(shape, i) {
      var duration = 15 + Math.random() * 20;
      var delay = Math.random() * -20;
      shape.style.animation = 'floatShape ' + duration + 's ' + delay + 's ease-in-out infinite';
    });
  }
  createFloatingShapes();

  /* ══════════════════════════════════════════════════════════════
     MAGNETIC BUTTONS — slight pull toward cursor
     ══════════════════════════════════════════════════════════════ */
  if (isDesktop) {
    document.querySelectorAll('.btn-gold, .nav-cta').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + x * 0.15 + 'px,' + y * 0.15 + 'px) scale(1.03)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(.25,.46,.45,.94)';
        setTimeout(function() { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     WAITLIST FORM
     ══════════════════════════════════════════════════════════════ */
  var form = document.getElementById('wlForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('wlEmail'), btn = document.getElementById('wlBtn');
      if (!email.value || !email.validity.valid) return;
      var t = btn.querySelector('.wl-t'), ok = btn.querySelector('.wl-ok');
      t.hidden = true; ok.hidden = false;
      btn.style.background = '#34C759'; btn.style.boxShadow = '0 8px 32px rgba(52,199,89,.18)';
      btn.disabled = true; email.disabled = true;
      setTimeout(function() { t.hidden = false; ok.hidden = true; btn.style.background = ''; btn.style.boxShadow = ''; btn.disabled = false; email.disabled = false; email.value = ''; }, 3500);
    });
  }
})();
