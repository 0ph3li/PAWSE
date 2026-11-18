/* ═══════════════════════════════════════════════════════════════
   PAWSE — home.js
   concept, design & code by ghostly.grl ♥
   hero card (photos fly in and break the frame) · the brunch board
   · six cat cards dealt from a stack · slow teas · S T [cat] A Y
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, FINE } = PW;
  const G = window.gsap, ST = window.ScrollTrigger;

  /* ═══════════════ the cats → product cards ═══════════════ */
  const LOOK = PW.LOOK;
  const grid = $('.cats__grid');
  const stays = PW.get('stays', {});
  PW.CATS.forEach((c) => {
    const L = LOOK[c.id];
    const el = document.createElement('article');
    el.className = 'cc' + (L.c ? ' cc--c' : '');
    el.style.setProperty('--bg', L.bg);
    el.style.setProperty('--ac', L.ac);
    el.innerHTML = `
      <p class="cc__q">${L.q}</p>
      <h3 class="cc__name">${L.c ? c.id[0].toUpperCase() + c.id.slice(1) : c.id}</h3>
      <p class="cc__cn">${c.cn}<span class="cc__pill">${c.age} yrs</span></p>
      <div class="cc__shot" data-cursor="${c.id}"><div class="slot slot--cut" data-img="HOME/cat-${c.id}.png" data-desc="${c.coat} cat, cut out, glossy, full body"></div></div>
      <span class="cc__vert">${L.vert}!</span>
      <div class="cc__bot">
        <p class="cc__txt"><b>${c.sub.split('。')[0]}。</b><span>${c.line}<br>waiting <b data-days>${PW.days(c.since)}</b> days · loves the ${c.bake}</span></p>
        <div class="cc__right"><span class="br">${L.br}</span><button class="cc__stay${stays[c.id] ? ' is-on' : ''}" data-stay="${c.id}"><i></i><span>${stays[c.id] ? 'staying' : 'stay'}</span></button></div>
      </div>`;
    grid.appendChild(el);
    PW.fillSlot($('.slot', el));
  });
  $$('.cc__txt span b').forEach((b) => (b.style.cssText = 'display:inline;font:inherit;font-weight:800'));
  $$('[data-stay]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.stay;
    const on = PW.toggleStay(id);
    b.classList.toggle('is-on', on);
    $('span', b).textContent = on ? 'staying' : 'stay';
    PW.toast(on ? '‖ <b>' + id + '</b> noticed. visit one of three.' : id + ' pretends not to mind.');
    if (G) G.fromTo(b.closest('.cc'), { rotate: 0 }, { rotate: on ? 1.5 : -1.5, duration: 0.15, yoyo: true, repeat: 3, ease: 'sine.inOut', onComplete: () => G.set(b.closest('.cc'), { rotate: 0 }) });
  }));

  /* ═══════════════ visits (counted once per browser session) ═══════════════ */
  let visits = PW.get('visits', 0);
  try { if (!sessionStorage.getItem('pw-counted')) { visits++; PW.set('visits', visits); sessionStorage.setItem('pw-counted', 1); } } catch (e) {}
  const says = ['', 'first visit. a cat is pretending not to watch.', 'second visit. someone moved one chair closer.', 'third visit. a cat fell asleep on your scroll bar.'];
  const vSay = $('[data-visit-say]');
  if (vSay) vSay.textContent = says[Math.min(3, Math.max(1, visits))];
  const fillDots = () => $$('.st__dots i').forEach((d, i) => setTimeout(() => d.classList.toggle('is-on', i < visits), 250 + i * 320));

  if (!G || RM) { fillDots(); return; }

  /* ═══════════════ 01 · hero ═══════════════ */
  const cat = $('.hero__cat'), bread = $('.hero__bread');
  G.set('.hero__l', { yPercent: 110, skewX: -14, opacity: 0 });
  G.set(cat, { xPercent: -40, yPercent: -40, rotate: -28, scale: 0.7, opacity: 0 });
  G.set(bread, { xPercent: 40, yPercent: 40, rotate: 24, scale: 0.7, opacity: 0 });
  G.set('.hero__line', { clipPath: 'inset(0 100% 0 0)' });
  G.set('.hero__info > *, .hero__under', { y: 18, opacity: 0 });
  const intro = () => {
    G.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo('.hero__card', { scale: 1.06 }, { scale: 1, duration: 1.2 }, 0)
      .to('.hero__l', { yPercent: 0, skewX: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.1)
      .to(cat, { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'back.out(1.2)' }, 0.2)
      .to(bread, { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'back.out(1.2)' }, 0.35)
      .to('.hero__line', { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut' }, 0.7)
      .to('.hero__info > *, .hero__under', { y: 0, opacity: 1, duration: 0.9, stagger: 0.07 }, 0.8);
  };
  PW.isReady ? intro() : addEventListener('pw:ready', intro, { once: true });

  G.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__card', { scale: 0.9, rotate: -2, ease: 'none' }, 0)
    .to(cat, { y: -110, ease: 'none' }, 0)
    .to(bread, { y: 120, ease: 'none' }, 0);

  if (FINE) {
    const q = (el, p, d) => G.quickTo(el, p, { duration: d, ease: 'power3' });
    const cx = q(cat, 'x', 1), bx = q(bread, 'x', 1.2), tx = q('.hero__title', 'x', 1.4);
    $('.hero').addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      cx(nx * -44); bx(nx * 56); tx(nx * 14);
    });
  }
  const hi = ['hi.', 'prrr.', 'you came.', 'stay?', '喵'];
  let hk = 0;
  cat.addEventListener('click', () => { PW.toast(hi[hk++ % hi.length]); G.fromTo(cat, { rotate: -6 }, { rotate: 0, duration: 1, ease: 'elastic.out(1.2, .3)' }); });
  bread.addEventListener('click', () => { PW.toast('still warm. <b>45 nt</b>.'); G.fromTo(bread, { scale: 0.92 }, { scale: 1, duration: 1, ease: 'elastic.out(1.2, .3)' }); });

  /* ═══════════════ 02 · brunch board ═══════════════ */
  $$('.bb__panel').forEach((p, i) => {
    const tl = G.timeline({ scrollTrigger: { trigger: p, start: 'top 78%' }, defaults: { ease: 'expo.out' } });
    tl.from(p, { y: 120, rotate: i ? 3 : -3, opacity: 0, duration: 1.2 }, i * 0.12)
      .from($$('.cond', p), { scaleY: 0, transformOrigin: '50% 100%', duration: 1 }, 0.3 + i * 0.12)
      .from($$('.bb__h .script, .bb__h .oval', p), { y: 30, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.5)
      .from($$('.bb__item, .bb__plate', p), { scale: 0.5, rotate: -20, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'back.out(1.6)' }, 0.55)
      .from($$('.bb__arc', p), { clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'power3.inOut' }, 0.8)
      .from($$('.bb__stack span, .bb__caps, .bb__note, .bb__side, .bb__foot', p), { y: 20, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.9);
    $$('.bb__item, .bb__plate', p).forEach((it, k) => {
      G.to(it, { yPercent: (k % 2 ? -1 : 1) * 12, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });
  G.to('.bb__plate .slot', { rotate: 90, ease: 'none', scrollTrigger: { trigger: '.bb__panel--b', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ═══════════════ 03 · cats: dealt from one stack ═══════════════ */
  const cards = $$('.cc');
  const deal = () => {
    const gr = grid.getBoundingClientRect();
    const cx = gr.left + gr.width / 2, cy = gr.top + Math.min(gr.height, innerHeight) / 2;
    return cards.map((c) => { const r = c.getBoundingClientRect(); return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) }; });
  };
  const mm = G.matchMedia();
  mm.add('(min-width: 601px)', () => {
    let d = deal();
    G.timeline({ scrollTrigger: { trigger: grid, start: 'top 85%', end: 'top 15%', scrub: 0.8, invalidateOnRefresh: true, onRefreshInit: () => { G.set(cards, { x: 0, y: 0, rotate: 0 }); d = deal(); } } })
      .from(cards, { x: (i) => d[i].x, y: (i) => d[i].y, rotate: (i) => (i - 2.5) * 5, ease: 'power2.out', stagger: 0.04 }, 0);
  });
  mm.add('(max-width: 600px)', () => {
    cards.forEach((c, i) => G.from(c, { y: 100, rotate: i % 2 ? 4 : -4, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%' } }));
  });
  G.from('.cats__head i', { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.cats', start: 'top 75%' } });

  /* ═══════════════ 04 · slow teas ═══════════════ */
  G.from('.mk__h span', { xPercent: (i) => (i ? 40 : -40), opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.mk', start: 'top 70%' } });
  G.from('.mk__badge', { scale: 0, rotate: -180, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '.mk', start: 'top 60%' } });
  G.from('.mk__script, .mk__box', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.mk', start: 'top 55%' } });
  $$('.mk__cup').forEach((c, i) => {
    G.fromTo(c, { yPercent: [40, 60, 30][i], rotate: [-8, 0, 8][i] }, { yPercent: [-6, -12, -2][i], rotate: [-3, 0, 4][i], ease: 'none', scrollTrigger: { trigger: '.mk__stage', start: 'top bottom', end: 'bottom 30%', scrub: 1 } });
  });
  G.from('.mk__lab', { y: 20, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.mk__stage', start: 'top 50%' } });

  /* ═══════════════ 05 · S T [cat] A Y ═══════════════ */
  G.timeline({ scrollTrigger: { trigger: '.st__stage', start: 'top 90%', end: 'bottom 35%', scrub: 1 } })
    .fromTo('.st__a', { xPercent: 0 }, { xPercent: -10, ease: 'none' }, 0)
    .fromTo('.st__b', { xPercent: 0 }, { xPercent: 10, ease: 'none' }, 0)
    .fromTo('.st__cat', { scale: 0.45, rotate: -10, yPercent: 30 }, { scale: 1, rotate: 0, yPercent: 0, ease: 'none' }, 0);
  G.from('.st__top > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.st', start: 'top 70%' } });
  G.from('.st__it', { y: 60, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.st__list', start: 'top 85%' } });
  ST.create({ trigger: '.st__you', start: 'top 85%', once: true, onEnter: fillDots });

  /* ═══════════════ footer ═══════════════ */
  G.from('.ft__word > *', { yPercent: 60, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.ft__word', start: 'top 95%' } });

  document.fonts && document.fonts.ready.then(() => ST.refresh());
  addEventListener('load', () => ST.refresh());
})();
