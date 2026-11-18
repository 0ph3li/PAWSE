/* ═══════════════════════════════════════════════════════════════
   PAWSE — main.js (shared)
   concept, design & code by ghostly.grl ♥

   window.PW  ·  localStorage prefix "pw-"
   - PW.CATS: the cats waiting today (+ days waiting)
   - PW.pause(): the ‖ button. everything holds still, like a cat
     that heard the fridge
   - loader (the logo bakes: oven preheats 0→180°C, ‖ pressed), cursor, nav, lenis,
     scramble, magnetic, slots, toast, konami (it rains "stay")
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const PW = (window.PW = {});
  const RM = (PW.RM = matchMedia('(prefers-reduced-motion: reduce)').matches);
  const FINE = (PW.FINE = matchMedia('(hover: hover) and (pointer: fine)').matches);
  const $ = (PW.$ = (s, r = document) => r.querySelector(s));
  const $$ = (PW.$$ = (s, r = document) => [...r.querySelectorAll(s)]);
  const hasG = () => !!window.gsap;

  PW.get = (k, d) => { try { const v = localStorage.getItem('pw-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  PW.set = (k, v) => { try { localStorage.setItem('pw-' + k, JSON.stringify(v)); } catch (e) {} };

  /* ═══════════════ the cats ═══════════════ */
  PW.CATS = [
    { id: 'miso', cn: '味噌', age: 4, coat: 'ginger', since: '2026-09-30', bake: 'croissant',
      line: 'i sleep on the croissant shelf. i have opinions about your coat.', sub: '我睡在可颂架上。你的外套，我有意见。' },
    { id: 'tofu', cn: '豆腐', age: 2, coat: 'white', since: '2026-10-21', bake: 'cinnamon roll',
      line: 'i’m shy for three visits. then i’m yours forever.', sub: '前三次我会害羞。之后，我永远是你的。' },
    { id: 'nori', cn: '海苔', age: 6, coat: 'black', since: '2026-08-14', bake: 'chocolate éclair',
      line: 'i will sit on your book. i will not be sorry.', sub: '我会坐在你的书上。我不会道歉。' },
    { id: 'panna', cn: '奶油', age: 1, coat: 'cream tabby', since: '2026-11-02', bake: 'cranberry roll',
      line: 'i knead everything. i was born a baker.', sub: '什么我都要揉一揉。天生的面包师。' },
    { id: 'kumo', cn: '云', age: 9, coat: 'grey longhair', since: '2026-03-11', bake: 'soda bread',
      line: 'the oldest. the softest. i’ve waited the longest.', sub: '最老，最软，等得最久。' },
    { id: 'biscotti', cn: '饼干', age: 3, coat: 'tortie', since: '2026-10-05', bake: 'dark chocolate',
      line: 'i choose people in under a minute. it might be you.', sub: '我一分钟就能选好人。也许是你。' }
  ];
  PW.days = (since) => Math.max(1, Math.round((Date.now() - new Date(since + 'T10:00:00').getTime()) / 864e5));
  PW.pad = (n, l = 3) => String(n).padStart(l, '0');

  /* each cat's card colours (bg, accent) + little lines, shared by home & cats */
  PW.LOOK = {
    miso:     { bg: '#f6f5ec', ac: '#e8742a', q: 'Very<br>sleepy...',   vert: '等你回家',   br: '橘猫·四岁' },
    tofu:     { bg: '#f9e4e9', ac: '#e7738a', q: 'Very<br>shy...',      vert: '害羞三次',   br: '白猫·两岁', c: 1 },
    nori:     { bg: '#fff1b0', ac: '#3a2016', q: 'Very<br>sorry?',      vert: '不会道歉',   br: '黑猫·六岁' },
    panna:    { bg: '#fffaf3', ac: '#3a2016', q: 'Very<br>soft...',     vert: '揉揉面团',   br: '奶油猫·一岁' },
    kumo:     { bg: '#e6ecf2', ac: '#5d86b3', q: 'Very<br>patient...',  vert: '等得最久',   br: '长毛灰猫·九岁', c: 1 },
    biscotti: { bg: '#f6ead6', ac: '#b25d22', q: 'Very<br>quick...',    vert: '一分钟选你', br: '玳瑁猫·三岁' }
  };
  /* each cat's favourite bake on the counter */
  PW.BAKES = {
    miso:     { n: 'butter croissant', cn: '牛角可颂', nt: 45, img: 'HOME/bake-croissant.png' },
    tofu:     { n: 'cinnamon roll',    cn: '肉桂卷',   nt: 55, img: 'HOME/bake-plate.png' },
    nori:     { n: 'nap nap éclair',   cn: '巧克力闪电泡芙', nt: 60, img: 'HOME/bake-eclair.png' },
    panna:    { n: 'cranberry roll',   cn: '蔓越莓面包卷', nt: 65, img: 'HOME/bake-cranberry.png' },
    kumo:     { n: 'soda bread',       cn: '苏打面包', nt: 80, img: 'HOME/bake-soda.png' },
    biscotti: { n: 'dark chocolate',   cn: '黑巧克力', nt: 90, img: 'HOME/bake-chocolate.png' }
  };
  PW.toggleStay = (id) => {
    const s = PW.get('stays', {});
    s[id] = !s[id];
    PW.set('stays', s);
    window.dispatchEvent(new CustomEvent('pw:stays', { detail: { id, on: s[id] } }));
    return s[id];
  };

  /* ═══════════════ lenis ═══════════════ */
  let lenis = null;
  if (window.Lenis && !RM) {
    lenis = PW.lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasG()) {
      lenis.on('scroll', () => window.ScrollTrigger && ScrollTrigger.update());
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  if (hasG() && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  PW.to = (target) => (lenis ? lenis.scrollTo(target, { duration: 1.4 }) : (typeof target === 'string' ? $(target) : target)?.scrollIntoView({ behavior: 'smooth' }));
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => { const h = a.getAttribute('href'); if (h.length > 1 && $(h)) { e.preventDefault(); PW.to(h); } }));

  /* ═══════════════ toast ═══════════════ */
  const toast = document.createElement('div');
  toast.className = 'toast';
  document.body.appendChild(toast);
  let tt;
  PW.toast = (msg) => {
    toast.innerHTML = msg;
    toast.classList.add('is-on');
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove('is-on'), 2800);
  };
  $$('[data-soon]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); PW.toast('‖ paused · <b>' + (a.dataset.soon || a.textContent.trim()) + '</b> opens soon'); }));

  /* ═══════════════ image slots ═══════════════ */
  PW.fillSlot = (el) => {
    if (el.dataset.filled) return;
    el.dataset.filled = 1;
    const src = el.dataset.img;
    const base = src.replace(/\.(jpe?g|png|webp)$/i, '');
    const tries = [src, ...['png', 'jpg', 'webp'].map((x) => base + '.' + x).filter((s) => s !== src)];
    const lab = document.createElement('span');
    lab.dataset.file = 'img/' + src;
    lab.textContent = el.dataset.desc || '';
    el.appendChild(lab);
    const next = (i) => {
      if (i >= tries.length) return el.dispatchEvent(new CustomEvent('slot:empty'));
      const im = new Image();
      im.onload = () => {
        im.alt = el.dataset.desc || '';
        im.draggable = false;
        el.appendChild(im);
        el.classList.add('has-img');
        el.dispatchEvent(new CustomEvent('slot:ready', { detail: im }));
      };
      im.onerror = () => next(i + 1);
      im.src = 'img/' + tries[i];
    };
    next(0);
  };
  $$('.slot[data-img]').forEach(PW.fillSlot);

  /* ═══════════════ scramble ═══════════════ */
  const GLY = '‖*~()[]{}stay喵';
  PW.scramble = (el, dur = 0.9) => {
    const txt = el.dataset.text || el.textContent;
    el.dataset.text = txt;
    if (RM) { el.textContent = txt; return; }
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / (dur * 1000));
      const n = Math.floor(p * txt.length);
      el.textContent = txt.slice(0, n) + [...txt.slice(n)].map((c) => (c === ' ' ? ' ' : GLY[(Math.random() * GLY.length) | 0])).join('');
      if (p < 1) requestAnimationFrame(tick); else el.textContent = txt;
    };
    requestAnimationFrame(tick);
  };
  const scrIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { PW.scramble(e.target); scrIO.unobserve(e.target); } }), { threshold: 0.6 });
  $$('[data-scramble]').forEach((el) => scrIO.observe(el));

  /* ═══════════════ cursor ═══════════════ */
  if (FINE) {
    document.documentElement.classList.add('has-cursor');
    const cur = document.createElement('div');
    cur.className = 'cur';
    cur.innerHTML = '<span class="cur__dot"></span><b class="cur__lab"></b>';
    document.body.appendChild(cur);
    const lab = $('.cur__lab', cur);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    const loop = () => {
      cx += (x - cx) * 0.24; cy += (y - cy) * 0.24;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], a, button, [role="button"], input, label');
      cur.classList.toggle('is-hover', !!t);
      const l = t && t.closest('[data-cursor]') ? t.closest('[data-cursor]').dataset.cursor : '';
      lab.textContent = l;
      cur.classList.toggle('has-lab', !!l);
    });
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('mouseleave', () => cur.classList.add('is-out'));
    document.addEventListener('mouseenter', () => cur.classList.remove('is-out'));
  }

  /* ═══════════════ magnetic ═══════════════ */
  if (FINE && hasG()) {
    $$('[data-magnetic]').forEach((el) => {
      const s = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, .4)' }));
    });
  }

  /* ═══════════════ nav ═══════════════ */
  const nav = $('.nav');
  if (nav) {
    let last = 0;
    const onScroll = () => {
      const y = scrollY;
      nav.classList.toggle('is-hidden', y > last && y > innerHeight * 0.6 && !document.documentElement.classList.contains('is-paused'));
      last = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const burger = $('.nav__burger');
    burger && burger.addEventListener('click', () => nav.classList.toggle('is-open'));
  }
  $$('[data-waiting]').forEach((el) => (el.textContent = PW.CATS.length));

  /* ═══════════════ ‖ the pause button ═══════════════ */
  const hold = document.createElement('div');
  hold.className = 'hold';
  hold.setAttribute('aria-hidden', 'true');
  hold.innerHTML = '<b>‖</b><span>paused<br><em>the cats didn’t notice.</em></span>';
  document.body.appendChild(hold);
  let paused = false;
  PW.pause = (force) => {
    paused = typeof force === 'boolean' ? force : !paused;
    document.documentElement.classList.toggle('is-paused', paused);
    $$('[data-pause]').forEach((b) => { b.setAttribute('aria-pressed', paused); b.classList.toggle('is-on', paused); });
    if (hasG()) paused ? gsap.globalTimeline.pause() : gsap.globalTimeline.resume();
    paused ? lenis && lenis.stop() : lenis && lenis.start();
    window.dispatchEvent(new CustomEvent('pw:pause', { detail: paused }));
  };
  $$('[data-pause]').forEach((b) => b.addEventListener('click', () => PW.pause()));
  addEventListener('keydown', (e) => {
    if ((e.key === 'p' || e.key === 'P') && !e.target.closest('input, textarea')) PW.pause();
  });

  /* ═══════════════ tab title ═══════════════ */
  const title = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '‖ paused · the cats are waiting' : title;
  });

  /* ═══════════════ konami: it rains "stay" ═══════════════ */
  const K = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  addEventListener('keydown', (e) => {
    ki = e.key === K[ki] ? ki + 1 : e.key === K[0] ? 1 : 0;
    if (ki === K.length) { ki = 0; PW.rain(); }
  });
  PW.rain = () => {
    PW.toast('it’s raining <b>stay</b>. obviously.');
    const cols = ['#f0609a', '#c8336f', '#3a2016', '#f2b8c6', '#e0a800'];
    const words = ['stay', 'stay', 'pawse', '喵', 'miso', 'tofu', 'nori', 'kumo'];
    for (let i = 0; i < 34; i++) {
      const l = document.createElement('i');
      l.className = 'rain';
      l.textContent = words[(Math.random() * words.length) | 0];
      l.style.left = Math.random() * 100 + 'vw';
      l.style.fontSize = 34 + Math.random() * 90 + 'px';
      l.style.color = cols[(Math.random() * cols.length) | 0];
      l.style.animationDelay = Math.random() * 1.6 + 's';
      l.style.animationDuration = 2 + Math.random() * 1.8 + 's';
      l.style.setProperty('--r', (Math.random() * 240 - 120) + 'deg');
      document.body.appendChild(l);
      setTimeout(() => l.remove(), 5400);
    }
  };

  /* ═══════════════ loader: the logo bakes ═══════════════ */
  const ld = $('.ld');
  const ready = () => {
    document.documentElement.classList.add('is-ready');
    window.dispatchEvent(new Event('pw:ready'));
    PW.isReady = true;
  };
  if (!ld || RM || !hasG()) {
    ld && ld.remove();
    requestAnimationFrame(ready);
  } else {
    /* the logo bakes: paw / se slide in, the butter pill pops, the two
       pause bars rise like dough while the oven preheats 0 → 180°C,
       then the bars squash (‖ pressed) and the whole page lifts. */
    const n = $('.ld__n', ld), w = $$('.logo__w', ld), pill = $('.logo__p', ld), bars = $$('.logo__p i', ld);
    const o = { v: 0 };
    gsap.timeline({ onComplete: () => ld.remove() })
      .from(w[0], { xPercent: -40, opacity: 0, duration: 0.7, ease: 'expo.out' }, 0.05)
      .from(w[1], { xPercent: 40, opacity: 0, duration: 0.7, ease: 'expo.out' }, 0.05)
      .from(pill, { scale: 0, rotate: -30, duration: 0.6, ease: 'back.out(2.4)' }, 0.25)
      .from('.ld__t, .ld__c', { y: 14, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, 0.35)
      .to(o, { v: 180, duration: 1.45, ease: 'power2.inOut', onUpdate: () => (n.textContent = Math.round(o.v)) }, 0.35)
      .to(bars, { scaleY: 1, duration: 1.45, ease: 'power2.inOut', stagger: 0.12 }, 0.35)
      .to(bars, { scaleY: 0.55, duration: 0.14, ease: 'power2.in', yoyo: true, repeat: 1 }, 1.95)
      .to(pill, { scale: 0.9, duration: 0.14, ease: 'power2.in', yoyo: true, repeat: 1 }, 1.95)
      .to('.ld__in', { y: -40, opacity: 0, duration: 0.5, ease: 'power3.in' }, 2.25)
      .fromTo(ld, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, 2.4)
      .add(ready, 2.55);
  }

  /* ═══════════════ signature ═══════════════ */
  console.log('%c\n      ‖ ‖        /\\_/\\\n      ‖ ‖       ( -.- )  zzz   <3\n      ‖ ‖        > ^ <\n               (")_(")   PAWSE 暂停 · stay a little\n\n   ┌─┐┬ ┬┌─┐┌─┐┌┬┐┬ ┬ ┬  ┌─┐┬─┐┬\n   │ ┬├─┤│ │└─┐ │ │ └┬┘  │ ┬├┬┘│\n   └─┘┴ ┴└─┘└─┘ ┴ ┴─┘┴ o └─┘┴└─┴─┘ ♥\n\n   concept, design & code by ghostly.grl ♥\n   try PW.help()\n', 'color:#f0609a;font-family:monospace;font-size:12px');
  PW.help = () => console.log('PW.pause()      → ‖ everything holds still (or press P)\nPW.CATS         → who is waiting today\nPW.rain()       → it rains stay (or ↑↑↓↓←→←→ b a)');
})();
