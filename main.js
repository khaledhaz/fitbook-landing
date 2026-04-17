(function(){
  'use strict';

  /* ── Scroll Reveal ──────────────────────────────────────────── */
  var els = document.querySelectorAll('.anim');
  if('IntersectionObserver' in window){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('v');obs.unobserve(e.target)}
      });
    },{threshold:0.06,rootMargin:'0px 0px -80px 0px'});
    els.forEach(function(el){obs.observe(el)});
  }else{
    els.forEach(function(el){el.classList.add('v')});
  }

  /* ── Nav scroll ─────────────────────────────────────────────── */
  var nav=document.getElementById('nav'),tick=false;
  function scrollNav(){
    nav.classList.toggle('scrolled',window.scrollY>40);tick=false;
  }
  window.addEventListener('scroll',function(){
    if(!tick){requestAnimationFrame(scrollNav);tick=true}
  },{passive:true});
  scrollNav();

  /* ── Mobile menu ────────────────────────────────────────────── */
  var burger=document.getElementById('burger'),links=document.getElementById('navLinks');
  burger.addEventListener('click',function(){
    burger.classList.toggle('open');links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){burger.classList.remove('open');links.classList.remove('open')});
  });

  /* ── Smooth anchor scroll ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=this.getAttribute('href');
      if(id==='#')return;
      var t=document.querySelector(id);
      if(!t)return;
      e.preventDefault();
      window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'});
    });
  });

  /* ── Parallax orbs on mouse ─────────────────────────────────── */
  if(window.matchMedia('(min-width:768px)').matches){
    var o1=document.querySelector('.hero-orb-1');
    var o2=document.querySelector('.hero-orb-2');
    var o3=document.querySelector('.hero-orb-3');
    var mx=0,my=0,cx=0,cy=0;
    document.addEventListener('mousemove',function(e){
      mx=(e.clientX/window.innerWidth-.5)*2;
      my=(e.clientY/window.innerHeight-.5)*2;
    },{passive:true});
    function raf(){
      cx+=(mx-cx)*.04;cy+=(my-cy)*.04;
      if(o1)o1.style.transform='translate('+cx*25+'px,'+cy*20+'px)';
      if(o2)o2.style.transform='translate('+cx*-18+'px,'+cy*-15+'px)';
      if(o3)o3.style.transform='translate('+cx*12+'px,'+cy*10+'px)';
      requestAnimationFrame(raf);
    }
    raf();
  }

  /* ── Waitlist form ──────────────────────────────────────────── */
  var form=document.getElementById('wlForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var email=document.getElementById('wlEmail');
      var btn=document.getElementById('wlBtn');
      if(!email.value||!email.validity.valid)return;
      var t=btn.querySelector('.wl-t'),ok=btn.querySelector('.wl-ok');
      t.hidden=true;ok.hidden=false;
      btn.style.background='#34C759';btn.style.boxShadow='0 8px 32px rgba(52,199,89,.18)';
      btn.disabled=true;email.disabled=true;
      setTimeout(function(){
        t.hidden=false;ok.hidden=true;
        btn.style.background='';btn.style.boxShadow='';
        btn.disabled=false;email.disabled=false;email.value='';
      },3500);
    });
  }

  /* ── Feature card tilt on hover ─────────────────────────────── */
  if(window.matchMedia('(min-width:768px) and (hover:hover)').matches){
    document.querySelectorAll('.fc').forEach(function(card){
      card.addEventListener('mousemove',function(e){
        var r=card.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width-.5;
        var y=(e.clientY-r.top)/r.height-.5;
        card.style.transform='translateY(-8px) rotateX('+y*-4+'deg) rotateY('+x*4+'deg)';
      });
      card.addEventListener('mouseleave',function(){
        card.style.transform='';
      });
    });
  }
})();
