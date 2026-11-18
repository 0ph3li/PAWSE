/* ═══════════════════════════════════════════════════════════════
   PAWSE — bakes.js
   concept, design & code by ghostly.grl ♥
   live taipei time → what just came out of the oven · the oven
   clock 7→19 with a needle · the menu board · slow teas · build a
   stay set and print a receipt that says who will sit with you
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM, FINE } = PW;
  const G = window.gsap;
  const CATS = PW.CATS, LOOK = PW.LOOK, BAKES = PW.BAKES;
  const byId = Object.fromEntries(CATS.map((c) => [c.id, c]));

  /* when each bake comes out (decimal hours, taipei) */
  const OUT = { miso: [7, 10, 14], kumo: [7.5, 12], tofu: [8, 13], panna: [9, 15], nori: [11, 16], biscotti: [12.5, 17] };
  const TEAS = [
    { id: 'miso', n: 'miso latte', cn: '味噌拿铁', nt: 120, img: 'HOME/drink-miso.png', d: 'butter · cinnamon · espresso', s: 'miso’s idea' },
    { id: 'kumo', n: 'kumo fog', cn: '云雾伯爵', nt: 110, img: 'HOME/drink-kumo.png', d: 'earl grey · oat cloud · honey', s: 'for the slow ones' },
    { id: 'nori', n: 'nori matcha', cn: '海苔抹茶', nt: 130, img: 'HOME/drink-nori.png', d: 'matcha · black sesame · milk', s: 'nori won’t share' }
  ];
  /* what's inside each bake, and whether the cat may have some */
  const INSIDE = {
    miso:     { ing: ['french butter, 84%', 'flour', 'milk', 'egg wash', 'sea salt'], alg: ['gluten', 'milk', 'egg'], safe: 'no.', why: 'too much butter. miso has tried anyway.' },
    tofu:     { ing: ['milk dough', 'cinnamon sugar', 'cream cheese icing', 'butter'], alg: ['gluten', 'milk', 'egg'], safe: 'no.', why: 'cinnamon and sugar. tofu just sniffs it.' },
    nori:     { ing: ['choux pastry', 'dark chocolate cream', 'chocolate glaze', 'eggs'], alg: ['gluten', 'milk', 'egg'], safe: 'never.', why: 'chocolate is poison for cats. nori is not sorry, but we are careful.' },
    panna:    { ing: ['brioche dough', 'cranberries', 'orange zest', 'cream glaze'], alg: ['gluten', 'milk', 'egg'], safe: 'no.', why: 'panna only kneads it. that’s allowed.' },
    kumo:     { ing: ['wholemeal flour', 'buttermilk', 'oats', 'baking soda', 'salt'], alg: ['gluten', 'milk'], safe: 'no.', why: 'but kumo sleeps next to the warm loaf. that’s allowed too.' },
    biscotti: { ing: ['70% dark chocolate', 'cream', 'cocoa biscuit base', 'sugar'], alg: ['milk', 'gluten', 'soy'], safe: 'never.', why: 'chocolate. biscotti gets a sardine instead.' }
  };
  const hm = (h) => Math.floor(h) + ':' + String(Math.round((h % 1) * 60)).padStart(2, '0');
  const taipei = () => {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const h = +p.find((x) => x.type === 'hour').value, m = +p.find((x) => x.type === 'minute').value;
    return { h: h + m / 60, txt: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') };
  };
  const date = () => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Taipei', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).toLowerCase();
  const mins = (x) => { const m = Math.round(x * 60); return m < 60 ? m + ' min' : Math.floor(m / 60) + 'h ' + String(m % 60).padStart(2, '0'); };
  const fill = (el) => { PW.fillSlot(el); return el; };
  const slot = (img, desc, cut = true) => { const d = document.createElement('div'); d.className = 'slot' + (cut ? ' slot--cut' : ''); d.dataset.img = img; d.dataset.desc = desc; return d; };

  /* every pin on the clock, in time order */
  const PINS = Object.entries(OUT).flatMap(([id, ts]) => ts.map((t) => ({ id, t }))).sort((a, b) => a.t - b.t);

  /* ═══════════════ 01 · head: what just came out ═══════════════ */
  const nowEl = $('[data-now]'), clockEl = $('[data-clock]');
  const tellNow = () => {
    const { h, txt } = taipei();
    clockEl.textContent = txt;
    if (h < 7 || h >= 19) {
      nowEl.innerHTML = `<span class="script">it’s</span> <b>${txt}</b> <span class="script">in taipei. the oven is off and the cats are asleep on the counter. first croissants at</span> <b>7:00</b>.`;
      return;
    }
    const last = [...PINS].reverse().find((p) => p.t <= h), next = PINS.find((p) => p.t > h);
    let s = `<span class="script">it’s</span> <b>${txt}</b> <span class="script">in taipei.</span> `;
    if (last) s += `the <b>${BAKES[last.id].n}</b> came out <em>${mins(h - last.t)} ago</em> (${last.id} noticed). `;
    s += next ? `next: <b>${BAKES[next.id].n}</b> in <em>${mins(next.t - h)}</em>.` : `that was the last tray. <em>stay a little.</em>`;
    nowEl.innerHTML = s;
  };

  /* ═══════════════ 02 · the oven clock ═══════════════ */
  const rail = $('[data-rail]'), hours = $('[data-hours]'), pins = $('[data-pins]');
  const needle = $('[data-needle]'), needleT = $('[data-needle-t]'), fillBar = $('[data-fill]');
  const X = (t) => ((t - 7) / 12) * 100;
  for (let h = 7; h <= 19; h++) {
    const s = document.createElement('span');
    s.style.left = X(h) + '%';
    s.textContent = h + ':00';
    hours.appendChild(s);
  }
  let prevT = -9;
  const pinEls = PINS.map((p) => {
    const b = document.createElement('button');
    b.className = 'op' + (p.t - prevT < 1 ? ' op--up' : '');
    prevT = p.t - prevT < 1 ? -9 : p.t;
    b.style.left = X(p.t) + '%';
    b.dataset.cursor = hm(p.t);
    b.setAttribute('aria-label', BAKES[p.id].n + ' at ' + hm(p.t));
    b.appendChild(fill(slot(BAKES[p.id].img, BAKES[p.id].n)));
    pins.appendChild(b);
    return b;
  });
  /* the big peek under the clock: one stacked slot per bake */
  const peekImg = $('[data-peek-img]');
  const peekSlots = Object.fromEntries(CATS.map((c) => { const s = fill(slot(BAKES[c.id].img, BAKES[c.id].n)); s.style.opacity = 0; peekImg.appendChild(s); return [c.id, s]; }));
  let peekId = null;
  const peek = (i) => {
    const p = PINS[i];
    pinEls.forEach((e, j) => e.classList.toggle('is-hi', j === i));
    $('[data-peek-t]').textContent = 'out at ' + hm(p.t);
    $('[data-peek-n]').textContent = BAKES[p.id].n;
    $('[data-peek-c]').textContent = p.id + ' is waiting for it';
    if (peekId === p.id) return;
    const was = peekSlots[peekId];
    peekId = p.id;
    if (G && !RM) {
      if (was) G.to(was, { opacity: 0, scale: 0.7, rotate: 25, duration: 0.35, ease: 'power3.in', overwrite: true });
      G.fromTo(peekSlots[p.id], { opacity: 0, scale: 0.6, rotate: -30 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)', overwrite: true });
      G.from(['[data-peek-n]', '[data-peek-c]'], { y: 16, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'expo.out' });
    } else {
      Object.values(peekSlots).forEach((s) => (s.style.opacity = 0));
      peekSlots[p.id].style.opacity = 1;
    }
  };
  pinEls.forEach((b, i) => {
    if (FINE) b.addEventListener('mouseenter', () => peek(i));
    b.addEventListener('click', () => peek(i));
    b.addEventListener('focus', () => peek(i));
  });
  const placeNeedle = () => {
    const { h, txt } = taipei();
    const closed = h < 7 || h >= 19;
    const x = Math.max(0, Math.min(100, X(h)));
    needle.style.left = x + '%';
    fillBar.style.width = x + '%';
    needle.classList.toggle('is-closed', closed);
    needleT.textContent = closed ? txt + ' · closed' : txt + ' · now';
    pinEls.forEach((e, i) => e.classList.toggle('is-out', !closed && PINS[i].t <= h));
    return h;
  };
  const h0 = placeNeedle();
  const nextI = PINS.findIndex((p) => p.t > h0);
  peek(nextI > -1 && h0 >= 7 ? nextI : 0);

  /* ═══════════════ 03 · the menu board ═══════════════ */
  const menu = $('[data-menu]');
  CATS.forEach((c) => {
    const B = BAKES[c.id], L = LOOK[c.id];
    const a = document.createElement('article');
    a.className = 'bk';
    a.style.setProperty('--bg', L.bg);
    a.style.setProperty('--ac', L.ac);
    a.dataset.cursor = c.id + '’s pick';
    const I = INSIDE[c.id];
    a.tabIndex = 0;
    a.setAttribute('role', 'button');
    a.setAttribute('aria-label', B.n + ', tap to see what is inside');
    a.innerHTML = `<div class="bk__flip">
      <div class="bk__face bk__face--f">
        <div class="bk__top"><div><b class="bk__n">${B.n}</b><span class="bk__cn">${B.cn}</span></div><span class="bk__price">${B.nt}<small>nt</small></span></div>
        <div class="bk__img"></div>
        <span class="bk__warm" hidden>warm now</span>
        <div class="bk__bot"><span class="bk__pick">${c.id}’s pick</span><span class="bk__out">out at<br>${OUT[c.id].map(hm).join(' · ')}</span></div>
      </div>
      <div class="bk__face bk__face--b">
        <div class="bk__bh"><b>inside</b><span>${B.cn}</span></div>
        <ul class="bk__ing">${I.ing.map((x) => `<li>${x}</li>`).join('')}</ul>
        <div class="bk__alg">${I.alg.map((x) => `<span>${x}</span>`).join('')}</div>
        <div class="bk__safe"><small>safe for ${c.id}?</small><b>${I.safe}</b><span>${I.why}</span></div>
        <span class="bk__turn">tap to turn back ↺</span>
      </div></div>`;
    const flip = () => { a.classList.toggle('is-flipped'); a.dataset.cursor = a.classList.contains('is-flipped') ? 'turn back' : c.id + '’s pick'; };
    a.addEventListener('click', flip);
    a.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), flip()));
    $('.bk__img', a).appendChild(fill(slot(B.img, B.n + ', cut out, glossy')));
    a.dataset.id = c.id;
    menu.appendChild(a);
  });
  const warm = () => {
    const { h } = taipei();
    $$('.bk', menu).forEach((a) => { $('.bk__warm', a).hidden = !OUT[a.dataset.id].some((t) => h >= t && h - t < 1); });
  };
  warm();

  /* ═══════════════ 04 · slow teas ═══════════════ */
  const teaRow = $('[data-teas]');
  TEAS.forEach((t) => {
    const d = document.createElement('article');
    d.className = 'td';
    d.dataset.cursor = 'sip';
    d.innerHTML = `<div class="td__img"></div><div><b>${t.n}</b><span class="cn">${t.cn}</span><p>${t.d}<br>${t.nt} nt</p><span class="script">${t.s}</span></div>`;
    $('.td__img', d).appendChild(fill(slot(t.img, t.n + ', cut out')));
    teaRow.appendChild(d);
  });

  /* ═══════════════ 05 · stay set → receipt ═══════════════ */
  const saved = PW.get('set', { bake: 'miso', tea: 'kumo' });
  let pickB = BAKES[saved.bake] ? saved.bake : 'miso', pickT = TEAS.some((t) => t.id === saved.tea) ? saved.tea : 'kumo';
  const chipsB = $('[data-pick-bake]'), chipsT = $('[data-pick-tea]');
  const chip = (box, key, label, img, on) => {
    const b = document.createElement('button');
    b.className = 'sc' + (on ? ' is-on' : '');
    b.dataset.k = key;
    b.appendChild(fill(slot(img, label)));
    b.appendChild(Object.assign(document.createElement('span'), { textContent: label }));
    box.appendChild(b);
    return b;
  };
  CATS.forEach((c) => chip(chipsB, c.id, BAKES[c.id].n, BAKES[c.id].img, c.id === pickB));
  TEAS.forEach((t) => chip(chipsT, t.id, t.n, t.img, t.id === pickT));
  const rcPic = $('[data-rc-pic]');
  const rcCats = Object.fromEntries(CATS.map((c) => { const s = fill(slot('HOME/cat-' + c.id + '.png', c.id)); s.style.opacity = 0; rcPic.appendChild(s); return [c.id, s]; }));
  let no = PW.get('receipts', 0);
  const drawReceipt = () => {
    const B = BAKES[pickB], T = TEAS.find((t) => t.id === pickT);
    const { txt } = taipei();
    $('[data-rc-date]').textContent = date();
    $('[data-rc-time]').textContent = txt;
    $('[data-rc-items]').innerHTML = `
      <p class="rc__item"><span>1 × ${B.n}<small>${B.cn} · ${pickB}’s pick</small></span><span>${B.nt}</span></p>
      <p class="rc__item"><span>1 × ${T.n}<small>${T.cn} · slow tea</small></span><span>${T.nt}</span></p>
      <p class="rc__item"><span>1 × chair by the window<small>窗边的椅子</small></span><span>0</span></p>`;
    $('[data-rc-total]').textContent = B.nt + T.nt + ' nt';
    $('[data-rc-cat]').textContent = pickB;
    Object.entries(rcCats).forEach(([id, s]) => (s.style.opacity = id === pickB ? 1 : 0));
    $('[data-rc-bars]').style.backgroundPosition = Math.round(Math.random() * 40) + 'px 0';
    $('[data-rc-no]').textContent = 'no. ' + PW.pad(no, 4) + ' · the cat decides';
    PW.set('set', { bake: pickB, tea: pickT });
  };
  const rc = $('[data-receipt]'), rcIn = $('.rc__in', rc);
  const print = () => {
    no++;
    PW.set('receipts', no);
    drawReceipt();
    if (!G || RM) return;
    /* the receipt feeds out of the slot in little jerks, like a real printer */
    G.timeline()
      .fromTo(rcIn, { yPercent: -100 }, { yPercent: 0, duration: 1.8, ease: 'steps(14)' })
      .fromTo(rc, { rotate: 0 }, { rotate: G.utils.random(-3, 3), duration: 0.6, ease: 'back.out(3)' }, '-=0.1');
  };
  $$('.sc', chipsB).forEach((b) => b.addEventListener('click', () => { pickB = b.dataset.k; $$('.sc', chipsB).forEach((x) => x.classList.toggle('is-on', x === b)); drawReceipt(); }));
  $$('.sc', chipsT).forEach((b) => b.addEventListener('click', () => { pickT = b.dataset.k; $$('.sc', chipsT).forEach((x) => x.classList.toggle('is-on', x === b)); drawReceipt(); }));
  $('[data-print]').addEventListener('click', () => { print(); PW.toast('‖ printed. <b>' + pickB + '</b> will probably sit with you.'); });
  drawReceipt();

  /* ═══════════════ special of the week: 40 a day, sold through the day ═══════════════ */
  const leftEl = $('[data-left]');
  const pawLeft = () => {
    const { h } = taipei();
    const n = h < 7 ? 40 : h >= 19 ? 0 : Math.max(0, 40 - Math.floor(((h - 7) / 12) * 40 * 1.15));
    leftEl.textContent = n;
    return n;
  };
  pawLeft();
  fill($('.sp__bun'));

  /* ═══════════════ the last tray: pawse hour 18–19 ═══════════════ */
  const ltCount = $('[data-lt-count]'), ltList = $('[data-lt-list]');
  CATS.forEach((c) => {
    const B = BAKES[c.id];
    const li = document.createElement('li');
    li.innerHTML = `<span class="lt__th"></span><b>${B.n}</b><span><s>${B.nt}</s><em>${Math.round(B.nt / 2)}</em></span>`;
    $('.lt__th', li).appendChild(fill(slot(B.img, B.n)));
    ltList.appendChild(li);
  });
  const lastTray = () => {
    const { h } = taipei();
    const live = h >= 18 && h < 19;
    ltList.classList.toggle('is-live', live);
    let t, lab;
    if (live) { t = 19 - h; lab = 'it’s pawse hour. lights down in'; }
    else { t = (h < 18 ? 18 - h : 24 - h + 18); lab = 'pawse hour starts in'; }
    const m = Math.floor(t * 60);
    ltCount.innerHTML = `<span class="script">${lab}</span> <b>${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}</b>`;
  };
  lastTray();

  /* ═══════════════ the takeaway box ═══════════════ */
  const shelf = $('[data-shelf]'), cells = $('[data-cells]'), box = $('[data-box]'), lid = $('[data-lid]');
  const say = $('[data-box-say]'), tot = $('[data-box-tot]');
  const inBox = PW.get('box', []).filter((id) => BAKES[id]).slice(0, 6);
  for (let i = 0; i < 6; i++) {
    const c = document.createElement('button');
    c.className = 'bc';
    c.setAttribute('aria-label', 'empty spot ' + (i + 1));
    c.dataset.cursor = 'take out';
    cells.appendChild(c);
  }
  const cellEls = $$('.bc', cells);
  const drawBox = (popI) => {
    cellEls.forEach((c, i) => {
      const id = inBox[i];
      if (c.dataset.id === id) return;
      c.innerHTML = '';
      c.dataset.id = id || '';
      if (id) {
        const s = fill(slot(BAKES[id].img, BAKES[id].n));
        c.appendChild(s);
        if (G && !RM && i === popI) G.from(s, { scale: 0.3, rotate: -40, duration: 0.6, ease: 'back.out(2.2)' });
      }
    });
    const sum = inBox.reduce((a, id) => a + BAKES[id].nt, 0);
    tot.textContent = inBox.length + ' / 6 · ' + sum + ' nt';
    PW.set('box', inBox);
    if (!inBox.length) say.innerHTML = '<span class="script">an empty box. it’s a start.</span>';
    else if (inBox.length < 6) say.innerHTML = `<span class="script">${6 - inBox.length} more. the cats are watching the box.</span>`;
    else {
      const count = {};
      inBox.forEach((id) => (count[id] = (count[id] || 0) + 1));
      const top = Object.keys(count).sort((a, b) => count[b] - count[a])[0];
      say.innerHTML = `<span class="script">box closed. most likely to follow you home:</span> <b>${top}</b>`;
    }
    closeLid(inBox.length === 6);
  };
  let lidShut = false;
  const closeLid = (shut) => {
    if (shut === lidShut) return;
    lidShut = shut;
    lid.style.pointerEvents = shut ? 'auto' : 'none';
    if (!G || RM) { lid.style.opacity = shut ? 1 : 0; lid.style.transform = shut ? 'none' : ''; return; }
    if (shut) {
      G.timeline()
        .fromTo(lid, { rotateX: -110, opacity: 1 }, { rotateX: 0, duration: 0.8, ease: 'bounce.out' })
        .from('.bx__sticker', { scale: 2.4, rotate: 40, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, 0.55)
        .fromTo(box, { rotate: 0 }, { rotate: -2, duration: 0.12, yoyo: true, repeat: 3 }, 0.5);
      PW.toast('‖ box of six, closed. <b>take it home</b>, or stay and eat it here.');
    } else G.to(lid, { rotateX: -110, opacity: 0, duration: 0.6, ease: 'power3.inOut' });
  };
  const add = (id, from) => {
    if (inBox.length >= 6) { PW.toast('the box is full. <b>empty it</b> or tap one out.'); return; }
    inBox.push(id);
    const i = inBox.length - 1;
    /* a little flight from the shelf to its spot */
    if (G && !RM && from) {
      const a = from.getBoundingClientRect(), b = cellEls[i].getBoundingClientRect();
      const im = $('img', from);
      if (im) {
        const g = document.createElement('div');
        g.className = 'bx__ghost';
        g.appendChild(im.cloneNode());
        document.body.appendChild(g);
        G.fromTo(g, { left: a.left + a.width / 2, top: a.top + a.height / 2, scale: 0.9 }, { left: b.left + b.width / 2, top: b.top + b.height / 2, scale: 0.6, rotate: 20, duration: 0.55, ease: 'power3.inOut', onComplete: () => { g.remove(); drawBox(i); } });
        return;
      }
    }
    drawBox(i);
  };
  cellEls.forEach((c, i) => c.addEventListener('click', () => { if (lidShut || !inBox[i]) return; inBox.splice(i, 1); drawBox(); }));
  lid.addEventListener('click', () => { PW.toast('opening the box. <b>one</b> is missing already. (it was miso.)'); inBox.pop(); drawBox(); });
  $('[data-box-reset]').addEventListener('click', () => { inBox.length = 0; drawBox(); });

  /* the shelf: tap to add, or drag into the box */
  CATS.forEach((c) => {
    const B = BAKES[c.id];
    const b = document.createElement('button');
    b.className = 'bs';
    b.dataset.cursor = 'drag me';
    b.setAttribute('aria-label', 'add ' + B.n + ' to the box');
    b.appendChild(fill(slot(B.img, B.n)));
    b.insertAdjacentHTML('beforeend', `<b>${B.n} · ${B.nt}</b>`);
    shelf.appendChild(b);
    let ghost = null, sx = 0, sy = 0, moved = false;
    const over = (x, y) => { const r = box.getBoundingClientRect(); return x > r.left && x < r.right && y > r.top && y < r.bottom; };
    b.addEventListener('pointerdown', (e) => {
      sx = e.clientX; sy = e.clientY; moved = false;
      b.setPointerCapture(e.pointerId);
    });
    b.addEventListener('pointermove', (e) => {
      if (!b.hasPointerCapture(e.pointerId)) return;
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 8) return;
      if (!moved) {
        moved = true;
        const im = $('img', b);
        ghost = document.createElement('div');
        ghost.className = 'bx__ghost';
        if (im) ghost.appendChild(im.cloneNode());
        document.body.appendChild(ghost);
      }
      ghost.style.left = e.clientX + 'px';
      ghost.style.top = e.clientY + 'px';
      box.classList.toggle('is-over', over(e.clientX, e.clientY));
    });
    const end = (e) => {
      box.classList.remove('is-over');
      if (!moved) { add(c.id, b); return; }
      const hit = over(e.clientX, e.clientY);
      ghost && ghost.remove();
      ghost = null;
      if (hit) add(c.id, null);
    };
    b.addEventListener('pointerup', end);
    b.addEventListener('pointercancel', () => { ghost && ghost.remove(); ghost = null; box.classList.remove('is-over'); });
  });
  drawBox();

  /* the clock keeps time */
  setInterval(() => { tellNow(); placeNeedle(); warm(); pawLeft(); lastTray(); }, 30000);
  tellNow();

  /* ═══════════════ motion ═══════════════ */
  if (!G || RM) return;
  G.registerPlugin(ScrollTrigger);
  const ready = (fn) => (PW.isReady ? fn() : addEventListener('pw:ready', fn, { once: true }));

  G.set('.bh__l', { yPercent: 110, skewY: 6 });
  ready(() => {
    G.timeline({ defaults: { ease: 'expo.out' } })
      .from('.bh__top', { y: -20, opacity: 0, duration: 0.8 }, 0)
      .to('.bh__l', { yPercent: 0, skewY: 0, duration: 1.2, stagger: 0.12 }, 0.05)
      .from('.bh__now', { y: 20, opacity: 0, duration: 0.8 }, 0.4)
      .from('.bh__photo > .slot:first-child', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.inOut' }, 0.3)
      .from('.bh__bread', { yPercent: -60, rotate: -40, opacity: 0, duration: 1.4, ease: 'back.out(1.3)' }, 0.9)
      .from('.bh__stamp', { scale: 0, rotate: -120, duration: 1, ease: 'back.out(2)' }, 1.1);
  });
  G.to('.bh__bread', { y: -120, rotate: 30, ease: 'none', scrollTrigger: { trigger: '.bh', start: 'top top', end: 'bottom top', scrub: true } });
  G.to('.bh__stamp', { rotate: 200, ease: 'none', scrollTrigger: { trigger: '.bh', start: 'top top', end: 'bottom top', scrub: true } });

  /* oven clock: the rail draws, the needle sweeps to now, pins pop out in order */
  const nowX = parseFloat(needle.style.left);
  G.timeline({ scrollTrigger: { trigger: '.ov', start: 'top 70%' } })
    .from('.ov__title > *', { yPercent: 100, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' })
    .from('.ov__line', { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: 'expo.inOut' }, 0.1)
    .from('.ov__hours span', { y: 12, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'expo.out' }, 0.3)
    .from(pinEls, { y: 40, scale: 0.4, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'back.out(2)' }, 0.5)
    .fromTo(needle, { left: '0%' }, { left: nowX + '%', duration: 1.6, ease: 'power3.inOut' }, 0.6)
    .fromTo(fillBar, { width: '0%' }, { width: nowX + '%', duration: 1.6, ease: 'power3.inOut' }, 0.6)
    .from('.ov__peek', { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.9);

  /* special: the two words slide apart, the paw bun turns a full circle as you scroll */
  G.fromTo('.sp__word span:first-child', { xPercent: -30 }, { xPercent: 12, ease: 'none', scrollTrigger: { trigger: '.sp', start: 'top bottom', end: 'bottom top', scrub: true } });
  G.fromTo('.sp__word span:last-child', { xPercent: 30 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.sp', start: 'top bottom', end: 'bottom top', scrub: true } });
  G.fromTo('.sp__bun', { rotate: -120, scale: 0.6 }, { rotate: 240, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.sp', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  G.timeline({ scrollTrigger: { trigger: '.sp__stage', start: 'top 65%' } })
    .from('.sp__note', { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out' })
    .from('.sp__price', { scale: 0, rotate: -90, duration: 0.9, ease: 'back.out(2)' }, 0.2)
    .from('.sp__cn', { scaleY: 0, transformOrigin: '50% 0', duration: 0.8, ease: 'expo.out' }, 0.3);

  /* last tray: the card warms up, the prints drop on, prices halve one by one */
  G.timeline({ scrollTrigger: { trigger: '.lt', start: 'top 70%' } })
    .from('.lt__in', { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out' })
    .from('.lt__txt > *', { y: 26, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.2)
    .from('.lt__pic--1', { y: -120, rotate: -25, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, 0.35)
    .from('.lt__pic--2', { y: -120, rotate: 25, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, 0.5)
    .from('.lt__list em', { scale: 2, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, 0.7);

  /* box: shelf pops, the box slides in */
  G.timeline({ scrollTrigger: { trigger: '.bx', start: 'top 70%' } })
    .from('.bx__title', { y: 60, opacity: 0, duration: 1, ease: 'expo.out' })
    .from('.bs', { scale: 0, rotate: -60, duration: 0.7, stagger: 0.06, ease: 'back.out(2)' }, 0.2)
    .from('.bx__box', { x: 80, rotate: 6, opacity: 0, duration: 1, ease: 'expo.out' }, 0.3);

  /* menu board: cards drop in like trays, slight tilt, then settle */
  G.from('.mb__title', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.mb', start: 'top 75%' } });
  $$('.bk', menu).forEach((a, i) => {
    G.from(a, { y: 120, rotate: (i % 3 - 1) * 5, opacity: 0, duration: 1.1, delay: (i % 3) * 0.1, ease: 'expo.out', scrollTrigger: { trigger: a, start: 'top 90%' } });
    G.fromTo($('.bk__img', a), { yPercent: 10 }, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: a, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* teas rise at different speeds */
  G.from('.tt__card', { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.tt', start: 'top 80%' } });
  $$('.td .slot').forEach((s, i) => G.fromTo(s, { y: 40 + i * 30 }, { y: -20 - i * 10, ease: 'none', scrollTrigger: { trigger: '.tt', start: 'top bottom', end: 'bottom top', scrub: true } }));

  /* stay set: the receipt prints itself the first time you get there */
  G.from('.ss__left > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.ss', start: 'top 70%' } });
  G.set(rcIn, { yPercent: -100 });
  ScrollTrigger.create({ trigger: '.ss__right', start: 'top 70%', once: true, onEnter: () => G.timeline().to(rcIn, { yPercent: 0, duration: 1.8, ease: 'steps(14)' }).to(rc, { rotate: -1.5, duration: 0.6, ease: 'back.out(3)' }) });

  G.from('.ft__word', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 70%' } });
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
