/* ═══════════════════════════════════════════════════════════════
   PAWSE — stay.js
   concept, design & code by ghostly.grl ♥
   three visit cards that stack · stay still: hold ‖ and the cat
   comes closer (let go and it wanders off) · book the next visit →
   a visit card with a stamp · small questions
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM } = PW;
  const G = window.gsap;
  const CATS = PW.CATS, LOOK = PW.LOOK;
  const fill = (el) => { PW.fillSlot(el); return el; };
  const slot = (img, desc) => { const d = document.createElement('div'); d.className = 'slot slot--cut'; d.dataset.img = img; d.dataset.desc = desc; return d; };

  /* ═══════════════ 03 · stay still ═══════════════ */
  const hold = $('[data-hold]'), ring = $('[data-ring]'), lab = $('[data-hold-lab]');
  const cat = $('[data-sv-cat]'), say = $('[data-sv-say]');
  const C = 339.3;
  const LINES = [[0, 'someone is on the far shelf.'], [0.25, 'she noticed you. don’t look straight at her.'], [0.5, 'one chair closer…'], [0.75, 'almost. stay very still.'], [1, 'she sat down next to you. that’s visit two.']];
  let p = 0, holding = false, done = false, last = 0, lastLine = -1;
  const render = () => {
    ring.style.strokeDashoffset = C * (1 - p);
    const k = 0.32 + 0.68 * p;
    cat.style.transform = `scale(${k}) translateY(${(1 - p) * -18}%) rotate(${(1 - p) * 8}deg)`;
    cat.style.filter = `blur(${(1 - p) * 5}px)`;
    cat.style.opacity = 0.45 + 0.55 * p;
    const li = LINES.reduce((a, l, i) => (p >= l[0] ? i : a), 0);
    if (li !== lastLine && !(lastLine > li && !holding && !done)) {
      lastLine = li;
      say.textContent = LINES[li][1];
      if (G && !RM) G.fromTo(say, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
    }
  };
  const tick = (t) => {
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    if (done) return;
    if (holding) p = Math.min(1, p + dt / 3.2);
    else p = Math.max(0, p - dt / 1.2);
    render();
    if (p >= 1 && !done) {
      done = true;
      holding = false;
      lab.textContent = 'again';
      PW.toast('‖ you stayed still. <b>she chose the chair next to you.</b>');
      if (G && !RM) G.fromTo(cat, { rotate: 0 }, { rotate: 3, duration: 0.18, yoyo: true, repeat: 5, ease: 'sine.inOut' });
      return;
    }
    if (holding || p > 0) requestAnimationFrame(tick);
    else last = 0;
  };
  const start = (e) => {
    if (e) e.preventDefault();
    if (done) { done = false; p = 0; lastLine = -1; lab.textContent = 'hold'; render(); return; }
    if (holding) return;
    holding = true;
    lab.textContent = 'stay…';
    last = 0;
    requestAnimationFrame(tick);
  };
  const stop = () => {
    if (!holding) return;
    holding = false;
    if (!done && p > 0.05) { say.textContent = 'too fast. she went back to the shelf.'; lastLine = -1; lab.textContent = 'hold'; }
    last = 0;
    requestAnimationFrame(tick);
  };
  hold.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => hold.addEventListener(ev, stop));
  hold.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start(e); });
  hold.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') stop(); });
  hold.addEventListener('contextmenu', (e) => e.preventDefault());
  render();

  /* ═══════════════ 04 · book the next visit ═══════════════ */
  const stays = PW.get('stays', {});
  const books = PW.get('bookings', []);
  const order = [...CATS].sort((a, b) => (stays[b.id] ? 1 : 0) - (stays[a.id] ? 1 : 0));
  let who = (order.find((c) => stays[c.id]) || CATS[0]).id, day = 1, time = '10:00';
  const catBox = $('[data-b-cats]'), dayBox = $('[data-b-days]'), timeBox = $('[data-b-times]');
  order.forEach((c) => {
    const b = document.createElement('button');
    b.className = 'bc2' + (c.id === who ? ' is-on' : '');
    b.dataset.k = c.id;
    b.style.setProperty('--bg', LOOK[c.id].bg);
    b.appendChild(fill(slot('HOME/cat-' + c.id + '.png', c.id)));
    b.insertAdjacentHTML('beforeend', `<span>${c.id}</span>${stays[c.id] ? '<small>staying</small>' : ''}`);
    catBox.appendChild(b);
  });
  const tz = { timeZone: 'Asia/Taipei' };
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(Date.now() + i * 864e5);
    return {
      i,
      top: i === 0 ? 'today' : i === 1 ? 'tomorrow' : d.toLocaleDateString('en-GB', { ...tz, weekday: 'short' }).toLowerCase(),
      sub: d.toLocaleDateString('en-GB', { ...tz, day: 'numeric', month: 'short' }).toLowerCase()
    };
  });
  days.forEach((d) => dayBox.insertAdjacentHTML('beforeend', `<button class="ch2${d.i === day ? ' is-on' : ''}" data-k="${d.i}">${d.top}<small>${d.sub}</small></button>`));
  ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00'].forEach((t) => timeBox.insertAdjacentHTML('beforeend', `<button class="ch2${t === time ? ' is-on' : ''}" data-k="${t}">${t}${t === '18:00' ? '<small>pawse hour</small>' : ''}</button>`));

  const ticket = $('[data-ticket]'), tPic = $('[data-t-pic]');
  const tPics = Object.fromEntries(CATS.map((c) => { const s = fill(slot('HOME/cat-' + c.id + '.png', c.id)); s.style.opacity = 0; tPic.appendChild(s); return [c.id, s]; }));
  const nextVisit = (id) => Math.min(3, 2 + books.filter((b) => b.cat === id).length);
  const WORD = ['', 'one', 'two', 'three'];
  const drawTicket = (anim) => {
    const v = nextVisit(who), full = books.filter((b) => b.cat === who).length >= 2;
    ticket.classList.remove('is-booked');
    ticket.style.setProperty('--bg', LOOK[who].bg);
    $('[data-t-cat]').textContent = who;
    $('[data-t-visit]').textContent = full ? 'both visits booked. ' + who + ' decides.' : 'visit ' + WORD[v] + ' of three';
    $$('[data-t-dots] i').forEach((d, i) => d.classList.toggle('is-on', i < (full ? 3 : v - 1)));
    $('[data-t-day]').textContent = days[day].top + ' · ' + days[day].sub;
    $('[data-t-time]').textContent = time;
    Object.entries(tPics).forEach(([id, s]) => (s.style.opacity = id === who ? 1 : 0));
    if (anim && G && !RM) G.fromTo(ticket, { rotate: -2, y: 0 }, { rotate: -4, y: -8, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
  };
  const drawList = () => {
    $('[data-b-list]').innerHTML = books.map((b, i) => `<p><b>${b.cat}</b><span>visit ${WORD[b.v]} · ${b.day} · ${b.time}</span><button data-cancel="${i}">cancel</button></p>`).join('');
    $$('[data-cancel]').forEach((x) => x.addEventListener('click', () => { books.splice(+x.dataset.cancel, 1); PW.set('bookings', books); drawList(); drawTicket(); PW.toast('cancelled. the chair is free again.'); }));
  };
  const pickIn = (box, set) => $$('button', box).forEach((b) => b.addEventListener('click', () => { $$('button', box).forEach((x) => x.classList.toggle('is-on', x === b)); set(b.dataset.k); drawTicket(true); }));
  pickIn(catBox, (k) => (who = k));
  pickIn(dayBox, (k) => (day = +k));
  pickIn(timeBox, (k) => (time = k));
  $('[data-b-go]').addEventListener('click', () => {
    if (books.filter((b) => b.cat === who).length >= 2) { PW.toast('both visits with <b>' + who + '</b> are booked. now ' + who + ' decides.'); return; }
    const v = nextVisit(who);
    books.push({ cat: who, v, day: days[day].top + ' ' + days[day].sub, time });
    PW.set('bookings', books);
    if (!PW.get('stays', {})[who]) PW.toggleStay(who);
    ticket.classList.add('is-booked');
    if (G && !RM) G.fromTo('[data-t-stamp]', { scale: 2.6, rotate: 20, opacity: 0 }, { scale: 1, rotate: -16, opacity: 1, duration: 0.45, ease: 'back.out(2.5)' });
    PW.toast('‖ chair saved. <b>' + who + '</b> has been told. (visit ' + WORD[v] + ')');
    drawList();
    setTimeout(() => { $$('[data-t-dots] i').forEach((d, i) => d.classList.toggle('is-on', i < v)); }, 300);
  });
  drawTicket();
  drawList();

  /* ═══════════════ motion ═══════════════ */
  if (!G || RM) return;
  G.registerPlugin(ScrollTrigger);
  const ready = (fn) => (PW.isReady ? fn() : addEventListener('pw:ready', fn, { once: true }));

  G.set('.sh__l', { yPercent: 110, skewY: 6 });
  ready(() => {
    G.timeline({ defaults: { ease: 'expo.out' } })
      .from('.sh__top', { y: -20, opacity: 0, duration: 0.8 }, 0)
      .to('.sh__l', { yPercent: 0, skewY: 0, duration: 1.2, stagger: 0.14 }, 0.05)
      .from('.sh__cat', { xPercent: -60, rotate: -30, opacity: 0, duration: 1.6, ease: 'back.out(1.1)' }, 0.5)
      .from('.sh__rules p', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.7);
  });
  G.to('.sh__cat', { xPercent: 30, rotate: 4, ease: 'none', scrollTrigger: { trigger: '.sh', start: 'top top', end: 'bottom top', scrub: true } });

  /* visit cards: each one sinks a little as the next slides over it */
  const vcs = $$('.vc');
  vcs.forEach((c, i) => {
    G.from($$('.vc__txt > *', c), { y: 30, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 75%' } });
    G.from($('.vc__pic', c), { y: 80, rotate: i % 2 ? -14 : 14, opacity: 0, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: c, start: 'top 75%' } });
    const next = vcs[i + 1];
    if (next && matchMedia('(min-width: 601px)').matches) G.fromTo(c, { scale: 1, filter: 'brightness(1)' }, { scale: 0.93, filter: 'brightness(0.94)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true } });
  });

  G.from('.sv__title', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.sv', start: 'top 75%' } });
  G.from('.sv__hold', { scale: 0, rotate: -90, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '.sv__hold', start: 'top 90%' } });

  G.from('.bk2__left > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.bk2', start: 'top 75%' } });
  G.from('.vt', { y: 100, rotate: 12, opacity: 0, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.bk2', start: 'top 70%' } });

  G.from('.fq__title', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.fq', start: 'top 80%' } });
  G.from('.fq details', { x: -40, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.fq__list', start: 'top 85%' } });
  $$('.fq details').forEach((d) => d.addEventListener('toggle', () => { if (d.open) G.from($('p', d), { y: -10, opacity: 0, duration: 0.5, ease: 'expo.out' }); }));

  G.from('.ft__word', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 70%' } });
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
