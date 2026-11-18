/* ═══════════════════════════════════════════════════════════════
   PAWSE — about.js
   concept, design & code by ghostly.grl ♥
   the ‖ pill opens into the bakery door · four moments (prints drop
   on a stack) · "say it slow" · the morning shift, clocked in by
   taipei time · from the shelter to your sofa (pinned, sideways) ·
   the house rules light up word by word · open now? · now, pause.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM } = PW;
  const G = window.gsap;

  /* ═══════════════ taipei time ═══════════════ */
  const tp = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', weekday: 'long', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { h: +p.hour, m: +p.minute, day: p.weekday.toLowerCase(), hm: p.hour + ':' + p.minute };
  };
  const mins = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const dur = (m) => (m >= 60 ? Math.floor(m / 60) + 'h ' : '') + (m % 60) + 'm';

  /* ═══════════════ 04 · the morning shift ═══════════════ */
  const CREW = [
    { id: 'ahhao', name: 'ah-hao', cn: '阿豪', role: 'founder, bakes everything', from: '04:30', to: '13:00', p: 'slides the first loaves in at 4:30 and talks to the oven while it heats up. found bubu. kept bubu. let bubu go.' },
    { id: 'jun', name: 'jun', cn: '俊', role: 'croissants & coffee', from: '06:00', to: '15:00', p: 'has two cats at home who smell the butter on him every evening. they have forgiven him.' },
    { id: 'xiaolin', name: 'xiao lin', cn: '小林', role: 'the floor, the visits', from: '10:00', to: '19:00', p: 'reads the house rules to every new guest. does the home visits. has never been scratched, not once.' },
    { id: 'chen', name: 'dr. chen', cn: '陈医生', role: 'the vet, on thursdays', from: '14:00', to: '17:00', days: ['thursday'], p: 'checks every cat once a week, ears to tail. accepts one cinnamon roll as payment.' }
  ];
  const crew = $('[data-crew]');
  crew.innerHTML = CREW.map((c) => `<article class="cw" data-id="${c.id}">
      <span class="cw__in" data-in></span>
      <div class="slot" data-img="ABOUT/crew-${c.id}.jpg" data-desc="a real photo: ${c.name} at work in the bakery (${c.role})"></div>
      <p class="cw__name"><b>${c.name}</b><span class="cn">${c.cn}</span></p>
      <p class="cw__role">${c.role}</p>
      <p class="cw__p">${c.p}</p>
      <p class="cw__punch"><span>in ${c.from}</span><span>out ${c.to}</span>${c.days ? '<span>thu only</span>' : '<span>every day</span>'}</p>
    </article>`).join('');
  $$('.slot', crew).forEach(PW.fillSlot);

  const nowEl = $('[data-now]'), openEl = $('[data-open]'), tagEl = $('[data-tag]');
  const clock = () => {
    const t = tp(), now = t.h * 60 + t.m;
    nowEl.textContent = `taipei · ${t.day} · ${t.hm}`;
    CREW.forEach((c) => {
      const el = $(`[data-id="${c.id}"] [data-in]`, crew);
      const today = !c.days || c.days.includes(t.day);
      const isIn = today && now >= mins(c.from) && now < mins(c.to);
      el.classList.toggle('is-in', isIn);
      el.textContent = isIn ? 'in now' : today && now < mins(c.from) ? 'in at ' + c.from : c.days && !today ? 'thursdays' : 'gone home';
    });
    /* open now? */
    const o = 7 * 60, cl = 19 * 60, open = now >= o && now < cl;
    openEl.classList.toggle('is-open', open);
    tagEl.classList.toggle('is-open', open);
    tagEl.textContent = open ? 'off the hook · open' : 'on the hook · closed';
    openEl.innerHTML = '<i></i>' + (open
      ? `open now · closes in ${dur(cl - now)}${now >= 18 * 60 ? ' · it’s pawse hour' : ''}`
      : `closed · opens at 7:00 · in ${dur((o - now + 1440) % 1440)}`);
  };
  clock();
  setInterval(clock, 30000);

  /* ═══════════════ 08 · now, pause ═══════════════ */
  const endT = $('[data-end-t]');
  addEventListener('pw:pause', (e) => {
    endT.innerHTML = e.detail ? 'Good. <span class="script">stay a little.</span>' : 'Now, <span class="script">pause.</span>';
  });

  /* ═══════════════ 02 · story on phones: each print sits in its beat ═══════════════ */
  const prints = $$('.sy__pr');
  prints.forEach((p, i) => p.style.setProperty('--r', [-4, 3, -2, 4][i] + 'deg'));
  if (matchMedia('(max-width: 900px)').matches) {
    $$('.sy__b').forEach((b, i) => b.prepend(prints[i]));
  }

  /* ═══════════════ 03 · say it slow ═══════════════ */
  const word = $('.dict__word .logo');
  const ws = $$('.logo__w', word), pill = $('.logo__p', word), bars = $$('.logo__p i', word);
  let slow;
  $('[data-slow]').addEventListener('click', () => {
    PW.toast('paaaw <b>‖</b> seee. <em>(take your time.)</em>');
    if (RM || !G) return;
    slow && slow.kill();
    slow = G.timeline()
      .to(ws[0], { x: '-0.18em', duration: 0.9, ease: 'expo.out' }, 0)
      .to(ws[1], { x: '0.18em', duration: 0.9, ease: 'expo.out' }, 0)
      .to(pill, { scaleX: 2.2, duration: 0.9, ease: 'expo.out' }, 0)
      .to(bars, { scaleX: 1 / 2.2, scaleY: 0.5, duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 3 }, 0.2)
      .to([ws[0], ws[1]], { x: 0, duration: 1, ease: 'elastic.out(1, .5)' }, 2.4)
      .to(pill, { scaleX: 1, duration: 1, ease: 'elastic.out(1, .5)' }, 2.4)
      .set(bars, { clearProps: 'transform' });
  });

  /* ═══════════════ motion ═══════════════ */
  if (RM || !G) {
    $$('.sy__b').forEach((b) => b.classList.add('is-on'));
    $('.wn__win').style.clipPath = 'none';
    $$('.wn__bar').forEach((b) => (b.style.display = 'none'));
    $('.wn__cap').style.opacity = 1;
    $$('.mf__l').forEach((l) => (l.style.color = ''));
    return;
  }
  G.registerPlugin(ScrollTrigger);
  const ready = (fn) => (PW.isReady ? fn() : addEventListener('pw:ready', fn, { once: true }));

  /* head */
  G.set('.ab__l > *', { yPercent: 110 });
  ready(() => {
    G.timeline({ defaults: { ease: 'expo.out' } })
      .from('.ab__top', { y: -20, opacity: 0, duration: 0.8 }, 0)
      .to('.ab__l > *', { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.05)
      .from('.ab__pill', { scale: 0, rotate: -40, duration: 0.8, ease: 'back.out(2.4)' }, 0.5)
      .to('.ab__pill i', { scaleY: 0.4, duration: 0.14, ease: 'power2.in', yoyo: true, repeat: 1, stagger: 0.06 }, 1.1)
      .from('.ab__lead', { y: 24, opacity: 0, duration: 0.9 }, 0.6);
  });

  /* the door: the pill opens into the bakery, the two bars slide out */
  const win = $('.wn__win');
  const from = getComputedStyle(win).clipPath;
  G.timeline({ scrollTrigger: { trigger: '.wn', start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
    .fromTo(win, { clipPath: from }, { clipPath: 'inset(0% 0% round 0px)', ease: 'power2.inOut', duration: 1 }, 0)
    .to('.wn__bar--l', { x: () => -innerWidth * 0.62, scaleY: 7, ease: 'power2.inOut', duration: 1 }, 0)
    .to('.wn__bar--r', { x: () => innerWidth * 0.62, scaleY: 7, ease: 'power2.inOut', duration: 1 }, 0)
    .fromTo('.wn__win .slot', { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1 }, 0)
    .to('.wn__cap', { opacity: 1, y: 0, duration: 0.25 }, 0.8)
    .from('.wn__cap', { y: 30, duration: 0.25 }, 0.8);

  /* story */
  G.from('.sy__title > *', { yPercent: 100, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.sy', start: 'top 75%' } });
  const mm = G.matchMedia();
  mm.add('(min-width: 901px)', () => {
    G.set(prints, { rotate: (i) => [-4, 3, -2, 4][i] });
    G.set(prints.slice(1), { autoAlpha: 0, y: -160 });
    $$('.sy__b').forEach((b, i) => {
      ScrollTrigger.create({
        trigger: b, start: 'top 60%', end: 'bottom 40%',
        onToggle: (s) => b.classList.toggle('is-on', s.isActive),
        onEnter: () => i && G.to(prints[i], { autoAlpha: 1, y: 0, rotate: [-4, 3, -2, 4][i], duration: 0.9, ease: 'back.out(1.5)', overwrite: true }),
        onLeaveBack: () => i && G.to(prints[i], { autoAlpha: 0, y: -160, rotate: [-4, 3, -2, 4][i] * 4, duration: 0.6, ease: 'power2.in', overwrite: true })
      });
    });
  });
  mm.add('(max-width: 900px)', () => {
    $$('.sy__b').forEach((b) => G.from(b.children, { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 80%' } }));
  });

  /* the name */
  G.from('.dict', { y: 80, rotate: -3, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.nmx', start: 'top 75%' } });
  G.from('.dict__defs li', { x: -30, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.dict__defs', start: 'top 85%' } });

  /* crew: they clock in one by one */
  G.from('.cr__title', { yPercent: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.cr', start: 'top 75%' } });
  G.from('.cw', { y: 90, rotate: (i) => [-6, 4, -3, 6][i], opacity: 0, duration: 1, stagger: 0.12, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.cr__grid', start: 'top 82%' } });

  /* path: pinned and sideways on desktop, the ‖ travels the rail */
  G.from('.pt__title', { yPercent: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.pt', start: 'top 75%' } });
  mm.add('(min-width: 901px)', () => {
    const track = $('[data-track]'), rail = $('.pt__rail'), dot = $('[data-dot]');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    G.timeline({ scrollTrigger: { trigger: '.pt', start: 'top top', end: () => '+=' + dist(), pin: '.pt__pin', scrub: 0.6, invalidateOnRefresh: true } })
      .to(track, { x: () => -dist(), ease: 'none' }, 0)
      .to('[data-line]', { scaleX: 1, ease: 'none' }, 0)
      .to(dot, { x: () => rail.offsetWidth - dot.offsetWidth, rotate: 360, ease: 'none' }, 0);
  });
  mm.add('(max-width: 900px)', () => {
    G.utils.toArray('.pt__s').forEach((s) => G.from(s, { y: 50, opacity: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%' } }));
  });

  /* house rules: each line lights up word by word as it reaches you */
  $$('.mf__l:not(.mf__l--end)').forEach((l) => {
    l.innerHTML = l.textContent.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
    G.to($$('.w', l), { color: '#fffaf3', stagger: 0.12, ease: 'none', scrollTrigger: { trigger: l, start: 'top 82%', end: 'top 50%', scrub: true } });
  });
  G.from('.mf__l--end', { scale: 0.6, rotate: -6, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.mf__l--end', start: 'top 85%' } });

  /* come in */
  /* the apron swings on its hook: dropped in, then nudged by your cursor and your scroll */
  const apron = $('[data-apron]');
  const swing = (deg, d = 2.6) => {
    G.fromTo(apron, { rotate: deg }, { rotate: 0, duration: d, ease: 'elastic.out(1, 0.22)', overwrite: true });
    G.fromTo('.fd__tag', { rotate: 6 - deg * 1.6 }, { rotate: 6, duration: d * 0.9, ease: 'elastic.out(1, 0.2)', overwrite: true });
  };
  G.set(apron, { rotate: 0 });
  ScrollTrigger.create({ trigger: '.fd', start: 'top 70%', once: true, onEnter: () => { G.from('.fd__hang', { y: -120, opacity: 0, duration: 0.7, ease: 'power3.out' }); swing(18, 3.2); } });
  apron.addEventListener('pointerenter', (e) => { const r = apron.getBoundingClientRect(); swing(e.clientX < r.left + r.width / 2 ? -7 : 7, 2.2); });
  let lastSw = 0;
  ScrollTrigger.create({ trigger: '.fd', start: 'top bottom', end: 'bottom top', onUpdate: (s) => { const v = s.getVelocity(); if (Math.abs(v) > 900 && performance.now() - lastSw > 900) { lastSw = performance.now(); swing(G.utils.clamp(-10, 10, v / 300), 2); } } });
  G.from('.fd__txt > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.fd', start: 'top 70%' } });

  /* the last pause button breathes until you press it */
  G.from('.end__btn', { scale: 0.3, rotate: -20, opacity: 0, duration: 1.1, ease: 'back.out(2)', scrollTrigger: { trigger: '.end', start: 'top 80%' } });
  G.to('.end__btn i', { scaleY: 0.82, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.25 });
  G.from('.end__t, .end__s', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.end', start: 'top 70%' } });

  G.from('.ft__word', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 70%' } });
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
