/* ═══════════════════════════════════════════════════════════════
   PAWSE — went.js
   concept, design & code by ghostly.grl ♥
   a counter that only goes up · a ticker of who went home · the wall
   by the door (prints pinned with tape, tap one → the letter) · the
   empty chair · numbers · write a postcard and pin it under a print
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM } = PW;
  const G = window.gsap;

  /* the cats who already went home (photos: img/WENT/<id>.jpg) */
  const HOME = [
    { id: 'taro', cn: '芋头', went: '2026-10-29', visits: 3, waited: 64, where: 'xinyi', yr: 2026, line: 'sleeps in the laundry basket now', letter: 'he slept on my coat during visit three and i missed my bus on purpose. now he sleeps in the laundry basket, on top of the clean towels, and i do the laundry less. we are both very happy with this.', who: 'a nurse who came every tuesday', bake: 'butter croissant' },
    { id: 'mochi', cn: '麻糬', went: '2026-09-14', visits: 4, waited: 120, where: 'zhongshan', yr: 2026, line: 'sleeps next to the paints', letter: 'mochi needed four visits. on the fourth she sat on my sketchbook and would not move. i think that was the paperwork. now she sleeps on my desk, next to the paints. there is a small blue paw print on my thesis.', who: 'an illustration student who stayed too long at the window', bake: 'cinnamon roll' },
    { id: 'bao', cn: '包子', went: '2026-07-02', visits: 1, waited: 9, where: 'da’an', yr: 2026, line: 'chose in forty seconds', letter: 'we came for coffee. bao walked over, climbed into my lap, rolled on his back and looked at us like we were late. forty seconds. the staff said that never happens. it happened. he still sleeps like that, paws up.', who: 'two people who only wanted coffee', bake: 'soda bread' },
    { id: 'oolong', cn: '乌龙', went: '2026-05-20', visits: 3, waited: 211, where: 'beitou', yr: 2026, line: 'waited the longest, worth it', letter: 'oolong waited 211 days at the bakery. he is old and slow and very sure of himself. he waited for me, apparently. now he has a balcony that looks at the mountains, and he lies on the railing all afternoon like a warm towel.', who: 'a retired teacher', bake: 'dark chocolate (not for him)' },
    { id: 'yuzu', cn: '柚子', went: '2026-03-08', visits: 2, waited: 174, where: 'songshan', yr: 2026, line: 'has wheels, goes everywhere', letter: 'yuzu’s back legs don’t work, so she has wheels. people walked past her for 174 days because of the wheels. their loss. she is faster than me in the hallway and she brakes for nobody.', who: 'a night-shift baker', bake: 'cranberry roll' },
    { id: 'sesame', cn: '芝麻', went: '2025-12-24', visits: 3, waited: 88, where: 'wanhua', yr: 2025, line: 'christmas eve, under the tree', letter: 'we took her home on christmas eve, in a carrier with a croissant box on top. she walked straight under the tree and stayed there. it is november. the tree is still up. she runs the apartment now.', who: 'a family of three (now four)', bake: 'butter croissant' },
    { id: 'latte', cn: '拿铁', went: '2025-10-11', visits: 2, waited: 31, where: 'tamsui', yr: 2025, line: 'watches the boats', letter: 'latte sits in the window and watches the boats for hours. sometimes i sit with her. we don’t talk. it’s the best part of my day.', who: 'a man who reads on the ferry', bake: 'nap nap éclair (just the smell)' },
    { id: 'lychee', cn: '荔枝', went: '2025-08-03', visits: 3, waited: 150, where: 'shilin', yr: 2025, line: 'still checks from the curtain', letter: 'she hid under the bed for the first month. then behind the curtain, one eye out. now she sleeps on my face, but every new guest still gets the curtain first. the bakery said: no rush. they were right.', who: 'a translator who works from home', bake: 'kumo fog' },
    { id: 'peanut', cn: '花生', went: '2025-05-17', visits: 3, waited: 22, where: 'zhongzheng', yr: 2025, line: 'opens doors, all of them', letter: 'peanut can open every door in the house. he stands up, grabs the handle, and leans. we have no secrets anymore. we have a cat.', who: 'a couple who argued about names', bake: 'cinnamon roll' },
    { id: 'mango', cn: '芒果', went: '2024-11-30', visits: 5, waited: 98, where: 'neihu', yr: 2024, line: 'has a raincoat now', letter: 'five visits. on the fifth i almost didn’t go because it was raining. mango was waiting by the door. i bought him a yellow raincoat the same week. i don’t think i will ever not go somewhere because of rain again.', who: 'an engineer with an umbrella', bake: 'soda bread' },
    { id: 'dumpling', cn: '饺子', went: '2024-08-09', visits: 3, waited: 56, where: 'banqiao', yr: 2024, line: 'snores, loudly', letter: 'nobody told us cats snore. dumpling sleeps on his back with his mouth open and snores like a small motorbike. we sleep better than before.', who: 'grandma lin and her grandson', bake: 'butter croissant' },
    { id: 'bubu', cn: '布布', went: '2024-04-02', visits: 3, waited: 140, where: 'da’an', yr: 2024, line: 'the first one who went home', letter: 'bubu was the first. the bakery cried, we cried, bubu ate. she still lies on my papers every morning and knocks one pen off the desk, like a signature.', who: 'the bakery’s first regular', bake: 'the very first croissant tray' }
  ];
  const fmt = (d) => new Date(d + 'T10:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase();
  const daysAgo = (d) => Math.max(1, Math.round((Date.now() - new Date(d + 'T10:00:00').getTime()) / 864e5));
  const TOTAL = 47;
  const cards = PW.get('postcards', []);

  /* ═══════════════ 01 · ticker ═══════════════ */
  const track = $('[data-ticker]');
  const row = HOME.map((c) => `<span>${c.id} <em>went home to ${c.where}</em></span>`).join('');
  track.innerHTML = row + row;

  /* ═══════════════ 02 · the wall ═══════════════ */
  const wall = $('[data-wall]');
  const ARS = [0.85, 1.05, 0.78, 0.92, 1.2, 0.82];
  const drawWall = () => {
    wall.innerHTML = '';
    HOME.forEach((c, i) => {
      const n = cards.filter((p) => p.to === c.id).length;
      const b = document.createElement('button');
      b.className = 'pr';
      b.dataset.id = c.id;
      b.dataset.yr = c.yr;
      b.dataset.cursor = 'read';
      b.style.setProperty('--r', ((i * 37) % 9 - 4) + 'deg');
      b.style.setProperty('--tr', ((i * 23) % 11 - 5) + 'deg');
      b.style.setProperty('--ar', ARS[i % ARS.length]);
      b.innerHTML = `<div class="slot" data-img="WENT/${c.id}.jpg" data-desc="a real photo of ${c.id} at their new home"></div>
        <b class="pr__name">${c.id}</b>
        <span class="pr__meta"><span>${fmt(c.went)}</span><span>${c.visits} visits</span></span>
        <span class="pr__line">${c.line}</span>${n ? `<span class="pr__pc">${n} postcard${n > 1 ? 's' : ''}</span>` : ''}`;
      b.addEventListener('click', () => openLetter(c));
      wall.appendChild(b);
      PW.fillSlot($('.slot', b));
    });
  };
  drawWall();
  /* filters by year */
  const filters = $('[data-filters]');
  ['all', 2026, 2025, 2024].forEach((y, i) => filters.insertAdjacentHTML('beforeend', `<button class="${i ? '' : 'is-on'}" data-y="${y}">${y}${y === 'all' ? '' : ' · ' + HOME.filter((c) => c.yr === y).length}</button>`));
  $$('button', filters).forEach((b) => b.addEventListener('click', () => {
    $$('button', filters).forEach((x) => x.classList.toggle('is-on', x === b));
    const y = b.dataset.y;
    const show = $$('.pr', wall).filter((p) => y === 'all' || p.dataset.yr === y);
    const hide = $$('.pr', wall).filter((p) => !show.includes(p));
    hide.forEach((p) => (p.style.display = 'none'));
    show.forEach((p) => (p.style.display = ''));
    if (G && !RM) G.fromTo(show, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'expo.out' });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  /* ═══════════════ the letter ═══════════════ */
  const L = $('[data-letter]');
  let lastFocus = null;
  const openLetter = (c) => {
    lastFocus = document.activeElement;
    const pic = $('[data-l-pic]');
    pic.innerHTML = '';
    const s = document.createElement('div');
    s.className = 'slot';
    s.dataset.img = 'WENT/' + c.id + '.jpg';
    s.dataset.desc = c.id + ' at home';
    pic.appendChild(s);
    PW.fillSlot(s);
    $('[data-l-date]').textContent = 'went home · ' + fmt(c.went) + ' · ' + daysAgo(c.went) + ' days ago';
    $('[data-l-name]').textContent = c.id;
    $('[data-l-cn]').textContent = c.cn;
    $('[data-l-body]').textContent = '“' + c.letter + '”';
    $('[data-l-dl]').innerHTML = `<div><dt>chosen</dt><dd>${c.who}</dd></div><div><dt>visits</dt><dd>${c.visits}</dd></div><div><dt>waited</dt><dd>${c.waited} days at the bakery</dd></div><div><dt>lives in</dt><dd>${c.where}, taipei</dd></div><div><dt>first breakfast</dt><dd>${c.bake}</dd></div>`;
    const mine = cards.filter((p) => p.to === c.id);
    $('[data-l-cards]').innerHTML = mine.map((p) => `<p>${p.msg}<small>your postcard · ${p.date}</small></p>`).join('');
    L.classList.add('is-open');
    L.setAttribute('aria-hidden', 'false');
    PW.lenis && PW.lenis.stop();
    if (G && !RM) {
      G.fromTo('.lt2__bg', { opacity: 0 }, { opacity: 1, duration: 0.4 });
      G.fromTo('.lt2__card', { y: 80, rotate: 3, opacity: 0, scale: 0.94 }, { y: 0, rotate: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'expo.out' });
      G.from('.lt2__txt > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.05, delay: 0.15, ease: 'expo.out' });
    } else $('.lt2__bg').style.opacity = 1;
    $('.lt2__x').focus();
  };
  const closeLetter = () => {
    if (!L.classList.contains('is-open')) return;
    const done = () => { L.classList.remove('is-open'); L.setAttribute('aria-hidden', 'true'); PW.lenis && PW.lenis.start(); lastFocus && lastFocus.focus(); };
    if (G && !RM) {
      G.to('.lt2__card', { y: 60, opacity: 0, duration: 0.35, ease: 'power3.in' });
      G.to('.lt2__bg', { opacity: 0, duration: 0.35, onComplete: done });
    } else done();
  };
  $$('[data-letter-close]').forEach((x) => x.addEventListener('click', closeLetter));
  addEventListener('keydown', (e) => e.key === 'Escape' && closeLetter());

  /* ═══════════════ 03 · the empty chair ═══════════════ */
  const newest = HOME[0];
  $('[data-last]').innerHTML = `last empty chair: <b>${newest.id}</b>’s, <em>${daysAgo(newest.went)} days ago</em>. we ate a ${newest.bake} at seven.`;

  /* ═══════════════ 05 · postcards ═══════════════ */
  let to = HOME[0].id;
  const toBox = $('[data-pc-to]'), txt = $('[data-pc-text]'), len = $('[data-pc-len]');
  const pcPic = $('[data-pc-pic]');
  HOME.forEach((c, i) => toBox.insertAdjacentHTML('beforeend', `<button class="${i ? '' : 'is-on'}" data-k="${c.id}">${c.id}</button>`));
  const pcSlots = Object.fromEntries(HOME.map((c) => { const s = document.createElement('div'); s.className = 'slot'; s.dataset.img = 'WENT/' + c.id + '.jpg'; s.dataset.desc = c.id; s.style.opacity = 0; pcPic.appendChild(s); PW.fillSlot(s); return [c.id, s]; }));
  const drawCard = () => {
    $('[data-pc-name]').textContent = to;
    $('[data-pc-msg]').textContent = txt.value.trim() || `hi ${to}. the window chair misses you.`;
    len.textContent = txt.value.length + ' / 120';
    Object.entries(pcSlots).forEach(([id, s]) => (s.style.opacity = id === to ? 1 : 0));
  };
  $$('button', toBox).forEach((b) => b.addEventListener('click', () => { to = b.dataset.k; $$('button', toBox).forEach((x) => x.classList.toggle('is-on', x === b)); txt.placeholder = `hi ${to}. the window chair misses you.`; drawCard(); }));
  txt.addEventListener('input', drawCard);
  $('[data-pc-go]').addEventListener('click', () => {
    const msg = txt.value.trim() || `hi ${to}. the window chair misses you.`;
    cards.push({ to, msg, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toLowerCase() });
    PW.set('postcards', cards);
    const card = $('[data-pc-card]');
    const finish = () => {
      drawWall();
      const pr = $(`.pr[data-id="${to}"]`, wall);
      pr.classList.add('is-new');
      PW.toast('‖ pinned under <b>' + to + '</b>’s print. tap it to read.');
      txt.value = '';
      drawCard();
      if (PW.lenis) PW.lenis.scrollTo(pr, { offset: -140, duration: 1.6 }); else pr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => pr.classList.remove('is-new'), 4000);
      if (G && !RM) G.set(card, { clearProps: 'all' });
    };
    if (G && !RM) G.timeline({ onComplete: finish }).to(card, { rotate: -10, y: -40, duration: 0.25, ease: 'power2.out' }).to(card, { y: -innerHeight, rotate: 25, opacity: 0, duration: 0.6, ease: 'power3.in' });
    else finish();
  });
  drawCard();

  /* ═══════════════ motion ═══════════════ */
  const tEl = $('[data-total]');
  if (!G || RM) {
    tEl.textContent = TOTAL;
    $$('[data-count]').forEach((b) => (b.textContent = b.dataset.count));
    return;
  }
  G.registerPlugin(ScrollTrigger);
  const ready = (fn) => (PW.isReady ? fn() : addEventListener('pw:ready', fn, { once: true }));
  G.set('.wh__l', { yPercent: 110, skewY: 6 });
  ready(() => {
    const o = { v: 0 };
    G.timeline({ defaults: { ease: 'expo.out' } })
      .from('.wh__top', { y: -20, opacity: 0, duration: 0.8 }, 0)
      .to('.wh__l', { yPercent: 0, skewY: 0, duration: 1.2, stagger: 0.12 }, 0.05)
      .from('.wh__n', { scale: 0.4, rotate: -10, opacity: 0, duration: 1, ease: 'back.out(1.8)' }, 0.4)
      .to(o, { v: TOTAL, duration: 2, ease: 'power2.out', onUpdate: () => (tEl.textContent = Math.round(o.v)) }, 0.45)
      .from('.wh__count p', { x: 30, opacity: 0, duration: 0.8 }, 0.6)
      .from('.wh__ticker', { yPercent: 100, opacity: 0, duration: 0.8 }, 0.8);
  });
  /* the ticker drifts, faster when you scroll */
  const tick = G.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
  ScrollTrigger.create({ onUpdate: (s) => { tick.timeScale(1 + Math.min(6, Math.abs(s.getVelocity()) / 300)); G.to(tick, { timeScale: 1, duration: 1.2, overwrite: true }); } });

  /* wall: prints get pinned one by one */
  G.from('.wl__title > *', { yPercent: 100, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.wl', start: 'top 75%' } });
  ScrollTrigger.batch('.pr', { start: 'top 92%', once: true, onEnter: (els) => G.from(els, { y: -60, rotate: () => G.utils.random(-20, 20), opacity: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.6)' }) });

  /* empty chair */
  G.from('.ec__pic', { x: -80, rotate: -12, opacity: 0, duration: 1.2, ease: 'back.out(1.3)', scrollTrigger: { trigger: '.ec', start: 'top 75%' } });
  G.from('.ec__txt > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.ec', start: 'top 70%' } });

  /* numbers count up */
  $$('[data-count]').forEach((b) => {
    const o = { v: 0 }, to = +b.dataset.count, dec = +(b.dataset.dec || 0);
    G.to(o, { v: to, duration: 1.8, ease: 'power2.out', onUpdate: () => (b.textContent = o.v.toFixed(dec)), scrollTrigger: { trigger: '.nm', start: 'top 80%' } });
  });

  G.from('.pc__in', { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.pc', start: 'top 80%' } });
  G.from('.pcard', { rotate: 20, y: 80, opacity: 0, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.pc', start: 'top 70%' } });
  G.from('.ft__word', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 70%' } });
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
