(function(){
  'use strict';
  var isDesktop = window.matchMedia('(min-width:768px) and (hover:hover)').matches;
  var isMobile = !window.matchMedia('(min-width:768px)').matches;
  var W = window.innerWidth, H = window.innerHeight;
  window.addEventListener('resize', function(){ W = window.innerWidth; H = window.innerHeight; });

  /* ══════════════════════════════════════════════════════════════
     GLOBAL STATE
     ══════════════════════════════════════════════════════════════ */
  var scrollY = 0, mouseX = 0, mouseY = 0;
  var smoothMX = 0, smoothMY = 0;
  var scrollDir = 0, lastScrollY = 0;

  window.addEventListener('scroll', function(){ scrollY = window.scrollY; scrollDir = scrollY > lastScrollY ? 1 : -1; lastScrollY = scrollY; }, { passive: true });
  if (isDesktop) document.addEventListener('mousemove', function(e){ mouseX = (e.clientX / W - 0.5) * 2; mouseY = (e.clientY / H - 0.5) * 2; }, { passive: true });

  /* ══════════════════════════════════════════════════════════════
     SCROLL REVEAL
     ══════════════════════════════════════════════════════════════ */
  var els = document.querySelectorAll('.an');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('v');obs.unobserve(e.target)} }); }, { threshold: 0.04, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function(el){ obs.observe(el); });
  } else els.forEach(function(el){ el.classList.add('v'); });

  /* ══════════════════════════════════════════════════════════════
     COUNTERS
     ══════════════════════════════════════════════════════════════ */
  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function(entries){ entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el=e.target,target=parseInt(el.getAttribute('data-target')),st=null;
      (function step(ts){if(!st)st=ts;var p=Math.min((ts-st)/2200,1);el.textContent=Math.floor((1-Math.pow(1-p,4))*target).toLocaleString()+'+';if(p<1)requestAnimationFrame(step)})(performance.now());
      cObs.unobserve(el);
    }); }, { threshold: 0.5 });
    counters.forEach(function(c){ cObs.observe(c); });
  }

  /* ══════════════════════════════════════════════════════════════
     NAV + MENU + ANCHORS
     ══════════════════════════════════════════════════════════════ */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger'), navLinks = document.getElementById('navL');
  burger.addEventListener('click', function(){ burger.classList.toggle('open'); navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ burger.classList.remove('open'); navLinks.classList.remove('open'); }); });
  document.querySelectorAll('a[href^="#"]').forEach(function(a){ a.addEventListener('click', function(e){ var id=this.getAttribute('href');if(id==='#')return;var t=document.querySelector(id);if(!t)return;e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'}); }); });

  /* ══════════════════════════════════════════════════════════════
     MASTER RAF LOOP — everything animates here
     ══════════════════════════════════════════════════════════════ */
  var o1 = document.querySelector('.orb-hero-1');
  var o2 = document.querySelector('.orb-hero-2');
  var o3 = document.querySelector('.orb-hero-3');
  var phoneFrame = document.querySelector('.phone-main .ph-frame');
  var phoneLeft = document.querySelector('.phone-left');
  var phoneRight = document.querySelector('.phone-right');
  var heroText = document.querySelector('.hero-top');
  var heroGrid = document.querySelector('.hero-grid');
  var allParallax = document.querySelectorAll('[data-p]');
  var allScrollScale = document.querySelectorAll('[data-scroll-scale]');
  var pmX = 0, pmY = 0;

  function masterLoop() {
    // smooth mouse
    smoothMX += (mouseX - smoothMX) * 0.03;
    smoothMY += (mouseY - smoothMY) * 0.03;

    // nav
    nav.classList.toggle('scrolled', scrollY > 40);

    if (isDesktop) {
      // ── HERO PARALLAX ──
      // orbs track mouse
      if(o1) o1.style.transform = 'translate('+smoothMX*45+'px,'+smoothMY*40+'px)';
      if(o2) o2.style.transform = 'translate('+smoothMX*-30+'px,'+smoothMY*-28+'px)';
      if(o3) o3.style.transform = 'translate('+smoothMX*20+'px,'+smoothMY*16+'px)';

      // hero text parallax on scroll
      if(heroText) {
        var heroOff = scrollY * 0.3;
        heroText.style.transform = 'translateY('+heroOff+'px)';
        heroText.style.opacity = Math.max(0, 1 - scrollY / 600);
      }

      // hero grid parallax
      if(heroGrid) heroGrid.style.transform = 'translateY('+scrollY*0.15+'px)';

      // phone 3D: mouse + scroll combined
      pmX += (smoothMX - pmX) * 0.05;
      pmY += (smoothMY - pmY) * 0.05;
      var phoneScroll = Math.min(scrollY / 500, 1);
      if(phoneFrame) {
        phoneFrame.style.transform = 'rotateY('+(pmX*10)+'deg) rotateX('+(pmY*-6 + phoneScroll*8)+'deg)';
      }
      // side phones spread on scroll
      if(phoneLeft) {
        phoneLeft.style.transform = 'perspective(1000px) rotateY('+(20-phoneScroll*8)+'deg) translateX('+(30-phoneScroll*15)+'px) translateZ('+(-80+phoneScroll*30)+'px) scale('+(0.78+phoneScroll*0.04)+')';
        phoneLeft.style.opacity = 0.65 + phoneScroll * 0.15;
      }
      if(phoneRight) {
        phoneRight.style.transform = 'perspective(1000px) rotateY('+(-20+phoneScroll*8)+'deg) translateX('+(-30+phoneScroll*15)+'px) translateZ('+(-80+phoneScroll*30)+'px) scale('+(0.78+phoneScroll*0.04)+')';
        phoneRight.style.opacity = 0.65 + phoneScroll * 0.15;
      }
    }

    // ── SCROLL PARALLAX for all data-p elements ──
    if (!isMobile) {
      allParallax.forEach(function(el) {
        var speed = parseFloat(el.getAttribute('data-p'));
        var rect = el.getBoundingClientRect();
        var vis = (rect.top + rect.height/2 - H/2);
        el.style.transform = 'translateY('+(vis * speed)+'px)';
      });
    }

    // ── SCROLL SCALE: elements scale down as they scroll away ──
    allScrollScale.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height/2;
      var dist = Math.abs(center - H/2) / H;
      var scale = Math.max(0.92, 1 - dist * 0.12);
      var opacity = Math.max(0.6, 1 - dist * 0.5);
      el.style.transform = 'scale('+scale+')';
      el.style.opacity = opacity;
    });

    requestAnimationFrame(masterLoop);
  }
  requestAnimationFrame(masterLoop);

  /* ══════════════════════════════════════════════════════════════
     3D TILT — universal function
     ══════════════════════════════════════════════════════════════ */
  if (isDesktop) {
    function addTilt(sel, intensity, liftY, scaleVal) {
      document.querySelectorAll(sel).forEach(function(el) {
        el.style.transformStyle = 'preserve-3d';
        el.addEventListener('mousemove', function(e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = 'perspective(600px) rotateX('+(y*-intensity)+'deg) rotateY('+(x*intensity)+'deg) translateY('+(-liftY)+'px) scale('+(scaleVal||1.02)+')';
          // move inner highlight
          var shine = el.querySelector('.fc-shine');
          if(shine) { shine.style.left = (e.clientX-r.left)+'px'; shine.style.top = (e.clientY-r.top)+'px'; }
        });
        el.addEventListener('mouseleave', function() {
          el.style.transform = '';
          el.style.transition = 'transform 0.7s cubic-bezier(.25,.46,.45,.94)';
          setTimeout(function(){ el.style.transition = ''; }, 700);
        });
      });
    }
    addTilt('.fc', 8, 10, 1.03);
    addTilt('.test-card', 6, 8, 1.02);
    addTilt('.how-scene', 14, 4, 1.06);
    addTilt('.panel', 5, 8, 1.01);
    addTilt('.store', 8, 4, 1.04);
    addTilt('.sc-frame', 10, 12, 1.04);

    /* ── Magnetic buttons ── */
    document.querySelectorAll('.btn-gold, .nav-cta').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top - r.height/2;
        btn.style.transform = 'translate('+x*0.2+'px,'+y*0.2+'px) scale(1.05)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(.25,.46,.45,.94)';
        setTimeout(function(){ btn.style.transition=''; }, 500);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SHOWCASE AUTO-SCROLL
     ══════════════════════════════════════════════════════════════ */
  var showcase = document.getElementById('showcaseScroll');
  if (showcase) {
    var auto = true, sPos = 0;
    showcase.addEventListener('mouseenter', function(){ auto=false; });
    showcase.addEventListener('mouseleave', function(){ auto=true; });
    showcase.addEventListener('touchstart', function(){ auto=false; }, { passive:true });
    showcase.addEventListener('touchend', function(){ setTimeout(function(){ auto=true; sPos=showcase.scrollLeft; }, 2000); });
    (function asr(){ if(auto){sPos+=0.5;if(sPos>=showcase.scrollWidth-showcase.clientWidth)sPos=0;showcase.scrollLeft=sPos;} requestAnimationFrame(asr); })();
  }

  /* ══════════════════════════════════════════════════════════════
     FLOATING SHAPES
     ══════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.float-shape').forEach(function(s, i) {
    var dur = 12 + Math.random() * 25;
    var del = Math.random() * -20;
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = del + 's';
  });

  /* ══════════════════════════════════════════════════════════════
     WAITLIST FORM
     ══════════════════════════════════════════════════════════════ */
  var form = document.getElementById('wlForm');
  if(form) form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email=document.getElementById('wlEmail'),btn=document.getElementById('wlBtn');
    if(!email.value||!email.validity.valid) return;
    var t=btn.querySelector('.wl-t'),ok=btn.querySelector('.wl-ok');
    t.hidden=true;ok.hidden=false;btn.style.background='#34C759';btn.style.boxShadow='0 8px 32px rgba(52,199,89,.18)';btn.disabled=true;email.disabled=true;
    setTimeout(function(){t.hidden=false;ok.hidden=true;btn.style.background='';btn.style.boxShadow='';btn.disabled=false;email.disabled=false;email.value='';},3500);
  });
})();
