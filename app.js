(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',zamknij)});
  var tk=false;function sc(){if(tk)return;tk=true;requestAnimationFrame(function(){top.classList.toggle('sc',window.pageYOffset>40);tk=false})}
  addEventListener('scroll',sc,{passive:true});sc();

  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]:not(.btn)'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var t=document.querySelector(l.getAttribute('href'));if(t)io.observe(t)});
    var st=document.getElementById('start');if(st)io.observe(st);
    var mob=document.getElementById('mob');
    var hb=document.querySelector('.hero .btn, .ph .btn, h1');if(mob&&hb)new IntersectionObserver(function(es){mob.classList.toggle('widac',!es[0].isIntersecting&&es[0].boundingClientRect.top<0)},{threshold:0}).observe(hb);
    var m=document.getElementById('mapa');
    if(m){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){var f=document.createElement('iframe');f.src=m.dataset.src;f.title=m.dataset.t||'Mapa';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f);mo.disconnect()}},{rootMargin:'300px'});mo.observe(m)}
  }

  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var down=false,sx=0,sl=0,moved=false;
    function step(){var k=tor.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0):300}
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||tor.scrollWidth<=tor.clientWidth+2)return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;tor.classList.add('drag')}tor.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;tor.classList.remove('drag');if(moved){var w=step();tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'})}setTimeout(function(){moved=false},0)});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    var nav=document.querySelector('[data-nav="'+tor.id+'"]');
    if(nav){var bs=nav.querySelectorAll('button');
      bs.forEach(function(b){b.addEventListener('click',function(){tor.scrollBy({left:step()*(+b.dataset.k),behavior:'smooth'})})});
      function upd(){bs[0].disabled=tor.scrollLeft<4;bs[1].disabled=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4;nav.hidden=tor.scrollWidth<=tor.clientWidth+2}
      tor.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);requestAnimationFrame(upd);
    }
  });

  /* zdjecia w pasach: ladowane dopiero, gdy pas jest blisko ekranu i zdjecie blisko widoku */
  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var imgs=[].slice.call(tor.querySelectorAll('img[data-src]'));if(!imgs.length)return;
    function load(im){if(im.dataset.srcset)im.srcset=im.dataset.srcset;im.src=im.dataset.src;im.removeAttribute('data-src')}
    if(!('IntersectionObserver' in window)){imgs.forEach(load);return}
    var inner=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){load(e.target);inner.unobserve(e.target)}})},{root:tor,rootMargin:'0px 70% 0px 70%'});
    var outer=new IntersectionObserver(function(es){if(es[0].isIntersecting){imgs.forEach(function(i){inner.observe(i)});outer.disconnect()}},{rootMargin:'300px 0px'});
    outer.observe(tor);
  });

  var lb=document.getElementById('lb'),li=lb.querySelector('img'),lp=lb.querySelector('p'),cur=0,last=null,grp=[];
  function opis(b){var f=b.closest('figure'),c=f&&f.querySelector('figcaption');var img=b.querySelector('img');return c?c.innerText.replace(/\n+/g,' - '):(img?img.alt:'')}
  function pokaz(i){cur=(i+grp.length)%grp.length;var b=grp[cur];li.src=b.dataset.lb;var im=b.querySelector('img');li.alt=im?im.alt:'';lp.textContent=opis(b)+'  ('+(cur+1)+'/'+grp.length+')'}
  document.querySelectorAll('[data-lb]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();last=b;var g=b.closest('[data-grupa]');grp=[].slice.call((g||document).querySelectorAll('[data-lb]'));pokaz(grp.indexOf(b));lb.classList.add('otw');document.body.style.overflow='hidden';lb.querySelector('.x').focus()})});
  function zam(){lb.classList.remove('otw');document.body.style.overflow='';li.removeAttribute('src');if(last)last.focus()}
  lb.querySelector('.x').addEventListener('click',zam);
  lb.querySelector('.p').addEventListener('click',function(){pokaz(cur-1)});
  lb.querySelector('.n').addEventListener('click',function(){pokaz(cur+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)zam()});
  var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)pokaz(cur+(d<0?1:-1))});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){if(lb.classList.contains('otw'))zam();else zamknij()}
    if(!lb.classList.contains('otw'))return;
    if(e.key==='ArrowRight')pokaz(cur+1);if(e.key==='ArrowLeft')pokaz(cur-1);
  });

  var f=document.getElementById('form'),msg=document.getElementById('msg');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var ok=true;[].forEach.call(f.querySelectorAll('[required]'),function(i){var v=i.type==='checkbox'?(i.checked?'1':''):i.value.trim();var bad=!v||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));i.setAttribute('aria-invalid',bad);if(bad&&ok){ok=false;i.focus()}});if(!ok)return;msg.hidden=false;f.reset()});

  /* menu: grupy rozwijane (klik w strzalke, na telefonie akordeon), Escape i klik obok zamykaja */
  var subs=[].slice.call(document.querySelectorAll('.menu .sub'));
  function zwin(x){x.classList.remove('otw');var b=x.querySelector('.rozw');if(b)b.setAttribute('aria-expanded','false')}
  subs.forEach(function(x){var b=x.querySelector('.rozw');
    b.addEventListener('click',function(e){e.stopPropagation();var o=!x.classList.contains('otw');subs.forEach(zwin);if(o){x.classList.add('otw');b.setAttribute('aria-expanded','true')}});
  });
  document.addEventListener('click',function(e){subs.forEach(function(x){if(!x.contains(e.target)&&innerWidth>1240)zwin(x)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')subs.forEach(zwin)});

  /* planer zapytania: bilet obok uzupelnia sie na zywo */
  var pf=document.getElementById('form'),bt=document.getElementById('b-tyt');
  if(pf&&bt){
    function v(n){var x=pf.querySelector('input[name="'+n+'"]:checked');return x?x.value:''}
    function os(n){n=+n||0;return n+' '+(n===1?'osoba':(n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'osoby':'osób'))}
    function dn(n){n=+n||0;return n+' '+(n===1?'dzień':'dni')}
    function upd(){var k=v('kto'),d=v('dokad'),o=pf.querySelector('#p-os').value,dd=pf.querySelector('#p-dni').value,m=pf.querySelector('#p-kiedy').value;
      var ml=m==='Termin elastyczny'?'termin elastyczny':m.toLowerCase();
      bt.textContent=k+', '+os(o)+' - '+dn(dd)+', '+d+', '+ml;
      document.getElementById('b-kto').textContent=k;document.getElementById('b-dokad').textContent=d;
      document.getElementById('b-os').textContent=os(o);document.getElementById('b-kiedy').textContent=m+' · '+dn(dd)}
    pf.addEventListener('input',upd);pf.addEventListener('change',upd);upd();
  }

  /* filtry listy ofert */
  var fl=document.querySelector('[data-filtry]');
  if(fl){
    var its=[].slice.call(document.querySelectorAll('.lista .of')),chs=[].slice.call(fl.querySelectorAll('.chip')),sel=fl.querySelector('select'),ile=fl.querySelector('.ile'),pu=document.querySelector('.pusto'),A=fl.dataset.a,Bb=fl.dataset.b;
    function pl(n){return n===1?'oferta':(n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'oferty':'ofert')}
    function run(){var c=(chs.filter(function(x){return x.getAttribute('aria-pressed')==='true'})[0]||chs[0]).dataset.v,v=sel.value,n=0;
      its.forEach(function(it){var ok=(c==='*'||it.dataset[A].split('|').indexOf(c)>-1)&&(v==='*'||it.dataset[Bb].split('|').indexOf(v)>-1);it.hidden=!ok;if(ok)n++});
      ile.textContent=n+' '+pl(n);pu.hidden=n>0}
    function wybierz(v){var t=chs.filter(function(x){return x.dataset.v===v})[0]||chs[0];chs.forEach(function(x){x.setAttribute('aria-pressed',x===t)});return t}
    chs.forEach(function(x){x.addEventListener('click',function(){wybierz(x.dataset.v);run()})});
    sel.addEventListener('change',run);
    var q=new URLSearchParams(location.search);
    if(q.get(A)){var t=wybierz(q.get(A));if(t.scrollIntoView&&t.parentNode.scrollWidth>t.parentNode.clientWidth)t.parentNode.scrollLeft=t.offsetLeft-16}
    if(q.get(Bb)&&sel.querySelector('option[value="'+q.get(Bb)+'"]'))sel.value=q.get(Bb);
    run();
  }
  var r=document.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
})();
