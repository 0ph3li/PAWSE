/* ═══════════════════════════════════════════════════════════════
   PAWSE — cats.js
   concept, design & code by ghostly.grl ♥
   a hand of six cards that fans open · the counter: pick a bake and
   the cat whose favourite it is comes to check · one file card per
   cat (‖ stay with them) · your stays, live
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, FINE } = PW;
  const G = window.gsap;
  const CATS = PW.CATS, LOOK = PW.LOOK, BAKES = PW.BAKES;
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const fmt = (d) => new Date(d + 'T10:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase();
  const say = (id, on) => PW.toast(on ? '‖ <b>' + id + '</b> noticed. visit one of three.' : id + ' pretends not to mind.');
  /* captions for her real photos on each file card */
  const PRINT = {
    miso: 'miso, asleep on the good chair',
    tofu: 'tofu, on the big table',
    nori: 'nori, sunbathing at 3pm',
    panna: 'panna, next to her croissant',
    kumo: 'kumo, on the scratching mat',
    biscotti: 'biscotti, on the rug'
  };
  const goTo = (sel) => (PW.lenis ? PW.lenis.scrollTo(sel, { offset: -40, duration: 1.4 }) : $(sel).scrollIntoView({ behavior: 'smooth' }));

  /* ═══════════════ 01 · head: total days + a hand of cards ═══════════════ */
  const total = CATS.reduce((a, c) => a + PW.days(c.since), 0);
  const tEl = $('[data-total]');
  const hand = $('[data-hand]');
  CATS.forEach((c) => {
    const L = LOOK[c.id];
    const el = document.createElement('button');
    el.className = 'hc';
    el.style.setProperty('--bg', L.bg);
    el.style.setProperty('--ac', L.ac);
    el.dataset.cursor = 'meet ' + c.id;
    el.setAttribute('aria-label', 'meet ' + c.id);
    el.innerHTML = `<span class="hc__name">${c.id}</span><span class="hc__cn">${c.cn}</span>
      <div class="slot slot--cut" data-img="HOME/cat-${c.id}.png" data-desc="${c.coat} cat, cut out"></div>
      <span class="hc__d">${PW.days(c.since)} days</span>`;
    el.addEventListener('click', () => goTo('#cat-' + c.id));
    hand.appendChild(el);
    PW.fillSlot($('.slot', el));
  });
  const cards = $$('.hc', hand);
  const fan = () => {
    const w = hand.clientWidth, n = cards.length;
    const spread = Math.min(w * 0.78, 1000) / (n - 1);
    return cards.map((c, i) => {
      const k = i - (n - 1) / 2;
      return { x: k * spread, y: Math.abs(k) * Math.abs(k) * 9, r: k * 6 };
    });
  };

  /* ═══════════════ 02 · the counter ═══════════════ */
  const list = $('[data-counter]');
  const stage = $('[data-stage]');
  const bakeBox = $('[data-stage-bake]'), catBox = $('[data-stage-cat]');
  const tag = $('[data-tag]'), price = $('[data-price]');
  CATS.forEach((c, i) => {
    const B = BAKES[c.id];
    const li = document.createElement('li');
    li.className = 'ctr__row';
    li.tabIndex = 0;
    li.dataset.cat = c.id;
    li.dataset.cursor = 'order';
    li.innerHTML = `<span class="num">${i + 1}</span><span><b>${B.n}</b><small><span class="cn">${B.cn}</span> · ${B.nt} nt</small></span><em class="script">${c.id}’s pick</em>`;
    list.appendChild(li);
    /* one bake slot + one cat slot per row, stacked in the stage */
    const b = document.createElement('div');
    b.className = 'slot slot--cut';
    b.dataset.img = B.img;
    b.dataset.desc = B.n + ', cut out';
    bakeBox.appendChild(b);
    const k = document.createElement('div');
    k.className = 'slot slot--cut';
    k.dataset.img = 'HOME/cat-' + c.id + '.png';
    k.dataset.desc = c.coat + ' cat, cut out';
    catBox.appendChild(k);
    PW.fillSlot(b);
    PW.fillSlot(k);
  });
  const bakes = $$('.slot', bakeBox), kitties = $$('.slot', catBox), rows = $$('.ctr__row', list);
  let cur = -1;
  const pick = (i, quiet) => {
    if (i === cur) return;
    const prev = cur;
    cur = i;
    const c = CATS[i], B = BAKES[c.id];
    rows.forEach((r, j) => r.classList.toggle('is-on', j === i));
    tag.textContent = c.id + '’s pick';
    price.innerHTML = B.nt + '<small>nt</small>';
    stage.dataset.cursor = 'hi ' + c.id;
    if (!G || RM) {
      bakes.forEach((b, j) => (b.style.opacity = j === i ? 1 : 0));
      kitties.forEach((b, j) => (b.style.opacity = j === i ? 1 : 0));
      return;
    }
    if (prev > -1) {
      G.to(bakes[prev], { scale: 0.6, rotate: 30, opacity: 0, duration: 0.4, ease: 'power3.in', overwrite: true });
      G.to(kitties[prev], { yPercent: 60, rotate: 14, opacity: 0, duration: 0.35, ease: 'power3.in', overwrite: true });
    }
    G.fromTo(bakes[i], { scale: 0.5, rotate: -40, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.9, delay: quiet ? 0 : 0.2, ease: 'back.out(1.6)', overwrite: true });
    /* the cat comes to check, a beat later */
    G.fromTo(kitties[i], { yPercent: 70, rotate: -12, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 1, delay: quiet ? 0.2 : 0.55, ease: 'expo.out', overwrite: true });
    G.fromTo([tag, price], { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2)', overwrite: true });
  };
  rows.forEach((r, i) => {
    r.addEventListener('click', () => pick(i));
    r.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(i)));
    if (FINE) r.addEventListener('mouseenter', () => pick(i));
  });
  if (G) G.set([...bakes, ...kitties], { opacity: 0 });
  pick(0, true);

  /* ═══════════════ 03 · one spread per cat ═══════════════ */
  const wrap = $('[data-spreads]');
  const stays = PW.get('stays', {});
  CATS.forEach((c, i) => {
    const L = LOOK[c.id], B = BAKES[c.id];
    const s = document.createElement('section');
    s.className = 'cs' + (i % 2 ? ' cs--r' : '');
    s.id = 'cat-' + c.id;
    s.style.setProperty('--bg', L.bg);
    s.style.setProperty('--ac', L.ac);
    const nm = (L.c ? cap(c.id) : c.id.toUpperCase()).split('').map((ch) => `<span>${ch}</span>`).join('');
    s.innerHTML = `
      <div class="cs__card">
        <span class="cs__no">${PW.pad(i + 1, 2)} / ${PW.pad(CATS.length, 2)}</span>
        <h2 class="cs__name wide" aria-label="${c.id}">${nm}</h2>
        <div class="cs__cat slot slot--cut" data-img="HOME/cat-${c.id}.png" data-desc="${c.coat} cat, cut out, glossy, full body" data-cursor="${c.id}"></div>
        <span class="cs__vert">${L.vert}!</span>
        <figure class="cs__print">
          <div class="slot" data-img="CATS/${c.id}.jpg" data-desc="a real photo of ${c.id} inside the bakery, warm natural light, not cut out"></div>
          <figcaption class="script">${PRINT[c.id]}</figcaption>
        </figure>
        <div class="cs__file">
          <p class="cs__cn cn">${c.cn}<span class="br">${L.br}</span></p>
          <dl class="cs__dl">
            <div><dt>age</dt><dd>${c.age} ${c.age === 1 ? 'year' : 'years'}</dd></div>
            <div><dt>coat</dt><dd>${c.coat}</dd></div>
            <div><dt>here since</dt><dd>${fmt(c.since)}</dd></div>
            <div><dt>waiting</dt><dd><b data-count="${PW.days(c.since)}">0</b> days</dd></div>
            <div><dt>favourite bake</dt><dd>${B.n} · ${B.nt} nt</dd></div>
            <div><dt>visits needed</dt><dd>three. then ${c.id} decides.</dd></div>
          </dl>
          <p class="cs__line script">“${c.line}”</p>
          <p class="cs__sub cn">${c.sub}</p>
          <div class="cs__acts">
            <button class="cs__stay${stays[c.id] ? ' is-on' : ''}" data-stay="${c.id}" data-magnetic=".25"><i></i><span>${stays[c.id] ? 'staying with ' + c.id : 'stay with ' + c.id}</span></button>
            <span class="tiny">no picking up.<br>no waking up.</span>
          </div>
        </div>
        <div class="cs__bake"><span class="script">${c.id}’s pick</span><div class="slot slot--cut" data-img="${B.img}" data-desc="${B.n}, cut out"></div></div>
      </div>`;
    wrap.appendChild(s);
    /* the print takes the shape of her photo (portrait or landscape) */
    const ps = $('.cs__print .slot', s);
    ps.addEventListener('slot:ready', (e) => {
      const im = e.detail, r = im.naturalWidth / im.naturalHeight;
      ps.style.aspectRatio = Math.min(1.4, Math.max(0.72, r)).toFixed(3);
      if (r > 1.1) s.classList.add('cs--wide');
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
    $$('.slot', s).forEach(PW.fillSlot);
  });

  /* stay buttons (spreads) */
  const syncStay = (id, on) => {
    $$(`[data-stay="${id}"]`).forEach((b) => {
      b.classList.toggle('is-on', on);
      $('span', b).textContent = (on ? 'staying with ' : 'stay with ') + id;
    });
  };
  $$('[data-stay]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.stay;
    const on = PW.toggleStay(id);
    say(id, on);
    const cat = $('#cat-' + id + ' .cs__cat');
    if (G && !RM) G.fromTo(cat, { rotate: 0 }, { rotate: on ? 4 : -4, duration: 0.12, yoyo: true, repeat: 5, ease: 'sine.inOut', onComplete: () => G.set(cat, { rotate: 0 }) });
  }));

  /* ═══════════════ 04 · your stays ═══════════════ */
  const tray = $('[data-tray]');
  const drawTray = () => {
    const s = PW.get('stays', {});
    const visits = Math.min(3, Math.max(1, PW.get('visits', 1)));
    tray.innerHTML = CATS.filter((c) => s[c.id]).map((c) => `
      <article class="tc" style="--bg:${LOOK[c.id].bg}">
        <div class="slot slot--cut" data-img="HOME/cat-${c.id}.png" data-desc="${c.id}"></div>
        <b>${c.id}</b><small>visit ${visits} of 3</small>
        <button data-unstay="${c.id}" aria-label="stop staying with ${c.id}" data-cursor="un-pause">×</button>
      </article>`).join('');
    $$('.slot', tray).forEach(PW.fillSlot);
    $$('[data-unstay]', tray).forEach((b) => b.addEventListener('click', () => { const id = b.dataset.unstay; PW.toggleStay(id); say(id, false); }));
    if (G && !RM) G.from($$('.tc', tray), { y: 30, opacity: 0, rotate: () => G.utils.random(-6, 6), duration: 0.6, stagger: 0.06, ease: 'back.out(1.6)' });
  };
  addEventListener('pw:stays', (e) => { syncStay(e.detail.id, e.detail.on); drawTray(); });
  drawTray();

  /* ═══════════════ motion ═══════════════ */
  const ready = (fn) => (PW.isReady ? fn() : addEventListener('pw:ready', fn, { once: true }));
  if (!G || RM) {
    tEl.textContent = total;
    $$('[data-count]').forEach((b) => (b.textContent = b.dataset.count));
    const pos = fan();
    cards.forEach((c, i) => (c.style.transform = `translate(${pos[i].x}px, ${pos[i].y}px) rotate(${pos[i].r}deg)`));
    return;
  }
  G.registerPlugin(ScrollTrigger);

  /* head: lines rise, the days count up, the hand fans open */
  G.set('.ch__l', { yPercent: 110, skewY: 6 });
  G.set(cards, { y: 260, rotate: 0, opacity: 0 });
  ready(() => {
    const o = { v: 0 };
    const pos = fan();
    G.timeline({ defaults: { ease: 'expo.out' } })
      .from('.ch__top', { y: -20, opacity: 0, duration: 0.8 }, 0)
      .to('.ch__l', { yPercent: 0, skewY: 0, duration: 1.2, stagger: 0.12 }, 0.05)
      .from('.ch__sum', { y: 20, opacity: 0, duration: 0.8 }, 0.4)
      .to(o, { v: total, duration: 1.8, ease: 'power2.out', onUpdate: () => (tEl.textContent = Math.round(o.v)) }, 0.45)
      .to(cards, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'back.out(1.4)' }, 0.5)
      .to(cards, { x: (i) => pos[i].x, y: (i) => pos[i].y, rotate: (i) => pos[i].r, duration: 1.3, ease: 'expo.inOut' }, 1.05)
      .from('.ch__hint', { opacity: 0, duration: 0.6 }, 1.9)
      .add(closeOnScroll);
  });
  /* scroll away: the hand closes back into a stack (built after it has fanned) */
  let closer;
  function closeOnScroll() {
    if (closer) { closer.scrollTrigger.kill(); closer.kill(); }
    const pos = fan();
    closer = G.fromTo(cards, { x: (i) => pos[i].x, y: (i) => pos[i].y, rotate: (i) => pos[i].r }, { x: 0, y: 40, rotate: (i) => (i - 2.5) * 1.5, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.ch__hand', start: 'top 35%', end: 'bottom top', scrub: true } });
  }
  addEventListener('resize', () => { const pos = fan(); cards.forEach((c, i) => G.set(c, { x: pos[i].x, y: pos[i].y, rotate: pos[i].r })); closer && closeOnScroll(); });
  if (FINE) cards.forEach((c, i) => {
    c.addEventListener('mouseenter', () => G.to(c, { y: fan()[i].y - 40, duration: 0.5, ease: 'back.out(2)', overwrite: 'auto' }));
    c.addEventListener('mouseleave', () => G.to(c, { y: fan()[i].y, duration: 0.6, ease: 'expo.out', overwrite: 'auto' }));
  });

  /* counter: the card rises, rows slide in */
  G.timeline({ scrollTrigger: { trigger: '.ctr', start: 'top 80%' } })
    .from('.ctr__card', { y: 80, rotate: -1.5, opacity: 0, duration: 1.1, ease: 'expo.out' })
    .from('.ctr__title > *', { yPercent: 100, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' }, 0.2)
    .from(rows, { x: -40, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.35)
    .from(stage, { scale: 0.7, rotate: -20, opacity: 0, duration: 1.2, ease: 'back.out(1.3)' }, 0.3);
  G.to(stage, { rotate: 12, ease: 'none', scrollTrigger: { trigger: '.ctr', start: 'top bottom', end: 'bottom top', scrub: true } });
  G.to('.ctr__stage > *', { rotate: -12, ease: 'none', scrollTrigger: { trigger: '.ctr', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* spreads: name letters slide in from the side, the cat leans in, the
     print drops on, days count up. on scroll the cat drifts against the name */
  $$('.cs').forEach((s, i) => {
    const dir = i % 2 ? 1 : -1;
    const letters = $$('.cs__name span', s);
    const cat = $('.cs__cat', s), print = $('.cs__print', s), bake = $('.cs__bake', s);
    const n = $('[data-count]', s), o = { v: 0 };
    G.timeline({ scrollTrigger: { trigger: s, start: 'top 72%' } })
      .from($('.cs__card', s), { y: 90, opacity: 0, duration: 1, ease: 'expo.out' }, 0)
      .from(letters, { xPercent: dir * 120, opacity: 0, duration: 1, stagger: 0.05, ease: 'expo.out' }, 0.1)
      .from(cat, { scale: 0.75, xPercent: dir * 20, rotate: dir * -12, opacity: 0, duration: 1.3, ease: 'back.out(1.3)' }, 0.25)
      .from($$('.cs__file > *', s), { y: 26, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out' }, 0.4)
      .from($('.cs__vert', s), { scaleY: 0, transformOrigin: '50% 0', duration: 0.6, ease: 'expo.out' }, 0.5)
      .from(print, { y: -120, rotate: dir * 30, opacity: 0, duration: 1, ease: 'back.out(1.6)' }, 0.65)
      .from(bake, { scale: 0, rotate: 60, duration: 0.9, ease: 'back.out(2)' }, 0.75)
      .to(o, { v: +n.dataset.count, duration: 1.4, ease: 'power2.out', onUpdate: () => (n.textContent = Math.round(o.v)) }, 0.5);
    G.fromTo($('.cs__name', s), { xPercent: 0 }, { xPercent: dir * -6, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
    G.fromTo(cat, { y: 40 }, { y: -50, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* tray rises */
  G.from('.tray__in', { y: 70, rotate: 1.5, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.tray', start: 'top 80%' } });
  G.from('.ft__word', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 70%' } });

  /* deep link: cats.html#cat-nori */
  if (location.hash && $(location.hash)) ready(() => setTimeout(() => goTo(location.hash), 400));
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
