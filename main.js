(function(){
  'use strict';

  /* ── Scroll reveal ───────────────────────────────────────── */
  var els=document.querySelectorAll('.an');
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('v');obs.unobserve(e.target)}});
    },{threshold:.06,rootMargin:'0px 0px -60px 0px'});
    els.forEach(function(el){obs.observe(el)});
  }else{els.forEach(function(el){el.classList.add('v')})}

  /* ── Counter animation ───────────────────────────────────── */
  var counters=document.querySelectorAll('.counter');
  if('IntersectionObserver' in window){
    var cObs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting)return;
        var el=e.target,target=parseInt(el.getAttribute('data-target')),start=0;
        var duration=1800,startTime=null;
        function step(ts){
          if(!startTime)startTime=ts;
          var progress=Math.min((ts-startTime)/duration,1);
          var eased=1-Math.pow(1-progress,3);
          var current=Math.floor(eased*target);
          el.textContent=current.toLocaleString()+'+';
          if(progress<1)requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    },{threshold:.5});
    counters.forEach(function(c){cObs.observe(c)});
  }

  /* ── Nav scroll ──────────────────────────────────────────── */
  var nav=document.getElementById('nav'),tick=false;
  function scrollNav(){nav.classList.toggle('scrolled',window.scrollY>40);tick=false}
  window.addEventListener('scroll',function(){if(!tick){requestAnimationFrame(scrollNav);tick=true}},{passive:true});
  scrollNav();

  /* ── Mobile menu ─────────────────────────────────────────── */
  var burger=document.getElementById('burger'),links=document.getElementById('navL');
  burger.addEventListener('click',function(){burger.classList.toggle('open');links.classList.toggle('open')});
  links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){burger.classList.remove('open');links.classList.remove('open')})});

  /* ── Smooth anchors ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=this.getAttribute('href');if(id==='#')return;
      var t=document.querySelector(id);if(!t)return;
      e.preventDefault();
      window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'});
    });
  });

  /* ── Parallax orbs ───────────────────────────────────────── */
  if(window.matchMedia('(min-width:768px)').matches){
    var o1=document.querySelector('.orb-hero-1'),o2=document.querySelector('.orb-hero-2'),o3=document.querySelector('.orb-hero-3');
    var mx=0,my=0,cx=0,cy=0;
    document.addEventListener('mousemove',function(e){mx=(e.clientX/window.innerWidth-.5)*2;my=(e.clientY/window.innerHeight-.5)*2},{passive:true});
    (function raf(){cx+=(mx-cx)*.03;cy+=(my-cy)*.03;
      if(o1)o1.style.transform='translate('+cx*30+'px,'+cy*25+'px)';
      if(o2)o2.style.transform='translate('+cx*-20+'px,'+cy*-18+'px)';
      if(o3)o3.style.transform='translate('+cx*15+'px,'+cy*12+'px)';
      requestAnimationFrame(raf);
    })();
  }

  /* ── Feature card tilt ───────────────────────────────────── */
  if(window.matchMedia('(min-width:768px) and (hover:hover)').matches){
    document.querySelectorAll('.fc').forEach(function(card){
      card.addEventListener('mousemove',function(e){
        var r=card.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        card.style.transform='translateY(-8px) perspective(600px) rotateX('+y*-3+'deg) rotateY('+x*3+'deg)';
      });
      card.addEventListener('mouseleave',function(){card.style.transform=''});
    });
  }

  /* ── Waitlist form ───────────────────────────────────────── */
  var form=document.getElementById('wlForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var email=document.getElementById('wlEmail'),btn=document.getElementById('wlBtn');
      if(!email.value||!email.validity.valid)return;
      var t=btn.querySelector('.wl-t'),ok=btn.querySelector('.wl-ok');
      t.hidden=true;ok.hidden=false;
      btn.style.background='#34C759';btn.style.boxShadow='0 8px 32px rgba(52,199,89,.18)';
      btn.disabled=true;email.disabled=true;
      setTimeout(function(){t.hidden=false;ok.hidden=true;btn.style.background='';btn.style.boxShadow='';btn.disabled=false;email.disabled=false;email.value=''},3500);
    });
  }
})();
