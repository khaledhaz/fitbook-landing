(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────────
  var isDesktop = window.matchMedia('(min-width:768px) and (hover:hover)').matches;
  var isMobile = !window.matchMedia('(min-width:768px)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var W = window.innerWidth, H = window.innerHeight;
  window.addEventListener('resize', function () { W = window.innerWidth; H = window.innerHeight; });

  // ── STATE ───────────────────────────────────────────────────
  var scrollY = 0, mouseX = 0, mouseY = 0;
  var smx = 0, smy = 0; // smoothed mouse
  var curX = 0, curY = 0, curDotX = 0, curDotY = 0; // cursor positions

  window.addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });
  if (isDesktop) document.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / W - 0.5) * 2;
    mouseY = (e.clientY / H - 0.5) * 2;
    curX = e.clientX; curY = e.clientY;
  }, { passive: true });

  // ═══════════════════════════════════════════════════════════════
  // SCROLL REVEAL
  // ═══════════════════════════════════════════════════════════════
  var anEls = document.querySelectorAll('.an');
  if ('IntersectionObserver' in window) {
    var anObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('v'); anObs.unobserve(e.target); } });
    }, { threshold: 0.04, rootMargin: '0px 0px -60px 0px' });
    anEls.forEach(function (el) { anObs.observe(el); });
  } else anEls.forEach(function (el) { el.classList.add('v'); });

  // ═══════════════════════════════════════════════════════════════
  // TEXT SPLIT — hero headline
  // ═══════════════════════════════════════════════════════════════
  var splitEl = document.querySelector('[data-split]');
  if (splitEl && !reduceMotion) {
    var text = splitEl.textContent;
    splitEl.innerHTML = '';
    var goldWords = ['serious', 'coaching.'];
    var words = text.split(' ');
    var charIdx = 0;
    words.forEach(function (word, wi) {
      var isGold = goldWords.some(function (gw) { return word.toLowerCase().indexOf(gw.toLowerCase()) >= 0; });
      for (var ci = 0; ci < word.length; ci++) {
        var span = document.createElement('span');
        span.className = 'char' + (isGold ? ' char-gold' : '');
        span.textContent = word[ci];
        span.style.transitionDelay = (charIdx * 28) + 'ms';
        splitEl.appendChild(span);
        charIdx++;
      }
      if (wi < words.length - 1) {
        var space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.className = 'char';
        space.style.transitionDelay = (charIdx * 28) + 'ms';
        splitEl.appendChild(space);
        charIdx++;
      }
    });
    // Trigger after small delay
    setTimeout(function () {
      splitEl.querySelectorAll('.char').forEach(function (c) { c.classList.add('vis'); });
    }, 400);
  } else if (splitEl) {
    // Reduced motion: just show text
    splitEl.style.opacity = '1';
    splitEl.style.transform = 'none';
  }

  // ═══════════════════════════════════════════════════════════════
  // COUNTER ANIMATION
  // ═══════════════════════════════════════════════════════════════
  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseInt(el.getAttribute('data-target')), st = null;
        (function step(ts) {
          if (!st) st = ts;
          var p = Math.min((ts - st) / 2200, 1);
          var eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.floor(eased * target).toLocaleString() + '+';
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cObs.observe(c); });
  }

  // ═══════════════════════════════════════════════════════════════
  // NAV + MENU + ANCHORS
  // ═══════════════════════════════════════════════════════════════
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger'), navL = document.getElementById('navL');
  burger.addEventListener('click', function () { burger.classList.toggle('open'); navL.classList.toggle('open'); });
  navL.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { burger.classList.remove('open'); navL.classList.remove('open'); }); });
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href'); if (id === '#') return;
      var t = document.querySelector(id); if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // PARTICLE SYSTEM (canvas)
  // ═══════════════════════════════════════════════════════════════
  var canvas = document.getElementById('particles');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var particles = [];
  var PARTICLE_COUNT = isMobile ? 0 : (W < 1080 ? 50 : 90);
  var CONNECT_DIST = 110;
  var particlesActive = true;

  function initParticles() {
    if (!canvas || !ctx || PARTICLE_COUNT === 0) return;
    canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function createParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      size: 1 + Math.random() * 1.5, alpha: 0.1 + Math.random() * 0.35,
      mag: 0.5 + Math.random() * 3
    };
  }

  function drawParticles() {
    if (!ctx || !particlesActive || PARTICLE_COUNT === 0) return;
    var cw = canvas.offsetWidth, ch = canvas.offsetHeight;
    ctx.clearRect(0, 0, cw, ch);

    // Mouse in canvas coords
    var mx = curX, my = curY;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      // Mouse attraction
      if (isDesktop) {
        var dx = mx - p.x, dy = my - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          var force = (200 - dist) / 200 * 0.02 * p.mag;
          p.vx += dx / dist * force;
          p.vy += dy / dist * force;
        }
      }

      p.x += p.vx; p.y += p.vy;
      // Damping
      p.vx *= 0.99; p.vy *= 0.99;
      // Bounce
      if (p.x < 0 || p.x > cw) p.vx *= -1;
      if (p.y < 0 || p.y > ch) p.vy *= -1;
      p.x = Math.max(0, Math.min(cw, p.x));
      p.y = Math.max(0, Math.min(ch, p.y));

      // Edge fade
      var edgeFade = Math.min(p.x, cw - p.x, p.y, ch - p.y) / 30;
      edgeFade = Math.min(1, Math.max(0, edgeFade));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240,181,29,' + (p.alpha * edgeFade) + ')';
      ctx.fill();
    }

    // Connection lines
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx2 = particles[a].x - particles[b].x;
        var dy2 = particles[a].y - particles[b].y;
        var d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d < CONNECT_DIST) {
          var alpha = (1 - d / CONNECT_DIST) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = 'rgba(240,181,29,' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  if (canvas && PARTICLE_COUNT > 0) {
    initParticles();
    window.addEventListener('resize', function () { initParticles(); });
    // Pause when offscreen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        particlesActive = entries[0].isIntersecting;
      }).observe(canvas);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CUSTOM CURSOR
  // ═══════════════════════════════════════════════════════════════
  var curRing = document.getElementById('curRing');
  var curDot = document.getElementById('curDot');
  var ringX = 0, ringY = 0, dotX = 0, dotY = 0;

  if (isDesktop && curRing && curDot) {
    // Hover detection
    document.querySelectorAll('[data-hover]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { curRing.classList.add('hover'); curDot.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { curRing.classList.remove('hover'); curDot.classList.remove('hover'); });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 3D TILT SYSTEM
  // ═══════════════════════════════════════════════════════════════
  if (isDesktop && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var intensity = parseFloat(el.getAttribute('data-tilt')) || 8;
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(700px) rotateX(' + (y * -intensity) + 'deg) rotateY(' + (x * intensity) + 'deg) translateY(-8px) scale(1.02)';

        // Move spotlight
        var shine = el.querySelector('.fc-shine');
        if (shine) {
          shine.style.left = (e.clientX - r.left) + 'px';
          shine.style.top = (e.clientY - r.top) + 'px';
        }
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
        el.style.transition = 'transform .6s cubic-bezier(.25,.46,.45,.94)';
        setTimeout(function () { el.style.transition = ''; }, 600);
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // MAGNETIC BUTTONS
  // ═══════════════════════════════════════════════════════════════
  if (isDesktop && !reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + x * 0.2 + 'px,' + y * 0.2 + 'px) scale(1.05)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94)';
        setTimeout(function () { btn.style.transition = ''; }, 500);
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SHOWCASE AUTO-SCROLL
  // ═══════════════════════════════════════════════════════════════
  var scScroll = document.getElementById('scScroll');
  if (scScroll) {
    var scAuto = true, scPos = 0;
    scScroll.addEventListener('mouseenter', function () { scAuto = false; });
    scScroll.addEventListener('mouseleave', function () { scAuto = true; });
    scScroll.addEventListener('touchstart', function () { scAuto = false; }, { passive: true });
    scScroll.addEventListener('touchend', function () { setTimeout(function () { scAuto = true; scPos = scScroll.scrollLeft; }, 2000); });
    (function scRaf() {
      if (scAuto) { scPos += 0.5; if (scPos >= scScroll.scrollWidth - scScroll.clientWidth) scPos = 0; scScroll.scrollLeft = scPos; }
      requestAnimationFrame(scRaf);
    })();
  }

  // ═══════════════════════════════════════════════════════════════
  // FLOATING SHAPES — randomize animation duration
  // ═══════════════════════════════════════════════════════════════
  document.querySelectorAll('.float-shape').forEach(function (s) {
    s.style.setProperty('--dur', (12 + Math.random() * 22) + 's');
  });

  // ═══════════════════════════════════════════════════════════════
  // WAITLIST FORM
  // ═══════════════════════════════════════════════════════════════
  var form = document.getElementById('wlForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('wlEmail'), btn = document.getElementById('wlBtn');
    if (!email.value || !email.validity.valid) return;
    var t = btn.querySelector('.wl-t'), ok = btn.querySelector('.wl-ok');
    t.hidden = true; ok.hidden = false;
    btn.style.background = '#34C759'; btn.style.boxShadow = '0 8px 32px rgba(52,199,89,.18)';
    btn.disabled = true; email.disabled = true;
    setTimeout(function () { t.hidden = false; ok.hidden = true; btn.style.background = ''; btn.style.boxShadow = ''; btn.disabled = false; email.disabled = false; email.value = ''; }, 3500);
  });

  // ═══════════════════════════════════════════════════════════════
  // MASTER RAF LOOP — drives everything at 60fps
  // ═══════════════════════════════════════════════════════════════
  var orb1 = document.getElementById('orb1');
  var orb2 = document.getElementById('orb2');
  var orb3 = document.getElementById('orb3');
  var heroText = document.getElementById('heroText');
  var heroGrid = document.querySelector('.hero-grid');
  var phoneFrame = document.getElementById('phoneFrame');
  var scrollBar = document.getElementById('scrollBar');
  var curGlow = document.getElementById('curGlow');
  var phoneL = document.querySelector('.phone-l');
  var phoneR = document.querySelector('.phone-r');
  var parallaxEls = document.querySelectorAll('[data-speed]');
  var pmX = 0, pmY = 0;
  var glowX = 0, glowY = 0;
  var docH = document.documentElement.scrollHeight - H;

  function masterLoop() {
    // Smooth mouse
    smx += (mouseX - smx) * 0.025;
    smy += (mouseY - smy) * 0.025;

    // Nav
    nav.classList.toggle('scrolled', scrollY > 40);

    // Scroll progress bar
    if (scrollBar) {
      var progress = docH > 0 ? scrollY / docH : 0;
      scrollBar.style.transform = 'scaleX(' + progress + ')';
      scrollBar.style.width = '100%';
    }

    if (isDesktop && !reduceMotion) {
      // Custom cursor
      if (curRing && curDot) {
        ringX += (curX - ringX) * 0.12;
        ringY += (curY - ringY) * 0.12;
        dotX += (curX - dotX) * 0.28;
        dotY += (curY - dotY) * 0.28;
        curRing.style.transform = 'translate(' + (ringX - 18) + 'px,' + (ringY - 18) + 'px)';
        curDot.style.transform = 'translate(' + (dotX - 3) + 'px,' + (dotY - 3) + 'px)';
      }

      // Page-wide cursor glow — illuminates surfaces
      if (curGlow) {
        glowX += (curX - glowX) * 0.06;
        glowY += (curY - glowY) * 0.06;
        curGlow.style.transform = 'translate(' + (glowX - 300) + 'px,' + (glowY - 300) + 'px)';
      }

      // Orbs track mouse
      if (orb1) orb1.style.transform = 'translate(' + smx * 45 + 'px,' + smy * 40 + 'px)';
      if (orb2) orb2.style.transform = 'translate(' + smx * -30 + 'px,' + smy * -25 + 'px)';
      if (orb3) orb3.style.transform = 'translate(' + smx * 20 + 'px,' + smy * 16 + 'px)';

      // Hero text parallax + fade
      if (heroText) {
        var hOff = scrollY * 0.25;
        heroText.style.transform = 'translateY(' + hOff + 'px)';
        heroText.style.opacity = Math.max(0, 1 - scrollY / 600);
      }

      // Hero grid parallax
      if (heroGrid) heroGrid.style.transform = 'translateY(' + scrollY * 0.15 + 'px)';

      // Phone 3D: mouse tracking
      pmX += (smx - pmX) * 0.05;
      pmY += (smy - pmY) * 0.05;
      var phoneScroll = Math.min(scrollY / 500, 1);
      if (phoneFrame) {
        phoneFrame.style.transform = 'rotateY(' + (pmX * 10) + 'deg) rotateX(' + (pmY * -6 + phoneScroll * 6) + 'deg)';
      }

      // Side phones spread on scroll
      if (phoneL) {
        var sAngle = 22 - phoneScroll * 8;
        var sTz = -100 + phoneScroll * 40;
        var sScale = 0.75 + phoneScroll * 0.05;
        var sBright = 0.55 + phoneScroll * 0.17;
        phoneL.style.transform = 'perspective(1200px) rotateY(' + sAngle + 'deg) translateX(' + (35 - phoneScroll * 15) + 'px) translateZ(' + sTz + 'px) scale(' + sScale + ')';
        phoneL.style.filter = 'brightness(' + sBright + ') blur(' + (0.5 - phoneScroll * 0.5) + 'px)';
      }
      if (phoneR) {
        var sAngleR = -22 + phoneScroll * 8;
        phoneR.style.transform = 'perspective(1200px) rotateY(' + sAngleR + 'deg) translateX(' + (-35 + phoneScroll * 15) + 'px) translateZ(' + sTz + 'px) scale(' + sScale + ')';
        phoneR.style.filter = 'brightness(' + sBright + ') blur(' + (0.5 - phoneScroll * 0.5) + 'px)';
      }

      // Scroll parallax for data-speed elements
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-speed'));
        if (!speed) return;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - H / 2) * speed;
        el.style.transform = 'translateY(' + offset + 'px)';
      });
    }

    // Particles
    drawParticles();

    requestAnimationFrame(masterLoop);
  }

  if (!reduceMotion) {
    requestAnimationFrame(masterLoop);
  } else {
    // Still need nav scroll and scroll bar
    function simpleLoop() {
      nav.classList.toggle('scrolled', scrollY > 40);
      if (scrollBar) { scrollBar.style.transform = 'scaleX(' + (docH > 0 ? scrollY / docH : 0) + ')'; scrollBar.style.width = '100%'; }
      requestAnimationFrame(simpleLoop);
    }
    requestAnimationFrame(simpleLoop);
  }
})();
