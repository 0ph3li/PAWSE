<div align="center">

# PAWSE 暂停

**come for a croissant. come back for them.**

*a bakery in taipei where every cat on every chair is up for adoption. nobody adopts on the first visit, nobody picks a cat up, and the cat decides. open every day, 7:00 to 19:00.*

`HTML` · `CSS` · `vanilla JS` · `GSAP` · `ScrollTrigger` · `Lenis` · `localStorage`

</div>

---

**PAWSE 暂停** is a concept website for a bakery that doesn't exist. It's at **lane 12, yongkang st., da’an, taipei**, three minutes from Dongmen MRT. It sells croissants, cinnamon rolls, soda bread and slow teas, and six cats live on its chairs, its shelves and the shelf above the oven. All six are waiting for a home.

The name is the whole idea. **暂停** (*zàn tíng*) means *pause* in Mandarin: the button on every remote. **Pawse** is the same word with a paw in it. Adopting a cat here is slow on purpose: you come three times, you sit still, and one day a cat falls asleep on you. *That’s the paperwork.*

So the site's device is the **pause button ‖**. It's in the logo, in the loader, in the nav, in the favicon and at the end of the about page, and it actually works. Press it (or press **P** anywhere) and the whole site holds still: every animation stops, the scroll stops, and a pill says *paused · the cats didn’t notice.*

The look is the **fresh, glossy side of a bakery**: a warm beige table, cream, powder-pink and butter cards, and big glossy photos of bakes and cats breaking out of their frames. The heavy wide italic type is dark chocolate, not black, and a rose Bodoni script sits on top of it. There are no drawings and no mascots: just type, real photos and motion.

> Personal portfolio project · concept, design & code by **ghostly.grl** ♥

---

## ✦ Highlights

- **‖ A pause button that pauses the site.** `P` or the button freezes GSAP's global timeline and Lenis. On the about page a giant yolk ‖ is the last thing on the page.
- **A loader that bakes the logo.** *paw* and *se* slide in, the butter pill pops, and the two bars rise like dough while the oven preheats from **0 to 180°C**. Then the bars squash (‖ pressed) and the page lifts.
- **Everything runs on Taipei time.** These all use `Asia/Taipei`, wherever you are:
  - the oven clock, and what just came out
  - how many paw buns are left today
  - the pawse hour countdown
  - which of the staff are in right now
  - whether the apron is on the hook
- **Six cats, each with their own bake.** Each cat has a favourite bake, a colour, a line and a number of days waited, and they follow you across all the pages.
- **The site remembers you.** All of this stays in your browser (`localStorage`, prefix `pw-`), and nothing is sent anywhere:
  - the cats you paused for
  - your takeaway box
  - your stay sets and receipts
  - your booked visits
  - the postcards you pinned

---

## ✦ The palette

| colour | hex | where |
|---|---|---|
| table | `#fcefe2` | the warm beige background of every page (from the smiling-cat poster on the moodboard) |
| powder pink | `#f3d5d9` | the cats band, the brunch panel, the story, the last pause |
| butter | `#fbecb4` | the baked-fresh panel, the teas, the wall by the door, the morning shift |
| card | `#fffaf3` | every card, print and receipt |
| chocolate | `#3a2016` | all the type, the house rules screen |
| muted | `#7a5c48` | small print |
| rose | `#f0609a` | the script, the cursor dot, highlights |
| deep rose | `#c8336f` | script on light panels |
| yolk | `#ffd02e` | the ‖ pause pill, the logo, the counters |

There's no green and no black anywhere, on purpose. Shadows are warm brown (`rgb(74, 40, 18)`), never grey.

**Type:**
- **Fraunces** 900 with `SOFT 100` (the logo *paw‖se*, the big numbers)
- **Archivo** in two widths: 900 italic at `wdth 125` (the titles) and 400 at `wdth 62` (the tall condensed labels)
- **Bodoni Moda** italic (the rose script)
- **Noto Sans SC** (the Chinese lines)
- **DM Mono** (receipts, clocks, tags, dates)

**The logo** is lowercase *paw‖se* in soft Fraunces, with the ‖ sitting in a yolk pill between *paw* and *se*. The favicon is just the pill.

---

## ✦ The cats

Six cats are waiting today. Each one has a coat, an age, the day they arrived, a favourite bake and one line in their own voice.

| | cat | | coat · age | favourite bake | says |
|---|---|---|---|---|---|
| 1 | **miso** | 味噌 | ginger · 4 | butter croissant · 45 nt | *i sleep on the croissant shelf. i have opinions about your coat.* |
| 2 | **tofu** | 豆腐 | white · 2 | cinnamon roll · 55 nt | *i’m shy for three visits. then i’m yours forever.* |
| 3 | **nori** | 海苔 | black · 6 | nap nap éclair · 60 nt | *i will sit on your book. i will not be sorry.* |
| 4 | **panna** | 奶油 | cream tabby · 1 | cranberry roll · 65 nt | *i knead everything. i was born a baker.* |
| 5 | **kumo** | 云 | grey longhair · 9 | soda bread · 80 nt | *the oldest. the softest. i’ve waited the longest.* |
| 6 | **biscotti** | 饼干 | tortie · 3 | dark chocolate · 90 nt | *i choose people in under a minute. it might be you.* |

Twelve more have already **gone home**: taro, mochi, bao, oolong, yuzu, sesame, latte, lychee, peanut, mango, dumpling and bubu, the first one. They live on the wall by the door.

---

## ✦ The pages

Every page shares the same parts:
- the nav: *cats · bakes · stay · went home · about*
- the ‖ pause button
- a rose cursor dot
- the footer: *come for a croissant. come back for them.*, the address, the three rules and a giant *paw‖se · stay a little*

Only the home has a loader that bakes the logo; the other pages have none.

### 01 · Home: *Stay with me*

| # | screen | what happens |
|---|---|---|
| 00 | **loader** | the logo bakes while the oven goes 0 → 180°C, then the page lifts |
| 01 | **hero** | an apple-card style hero: *Stay / with me*, with a glossy cat and a stack of croissants breaking out of the card at an angle |
| 02 | **baked fresh** | *Baked Fresh all day 7–19 club*: a butter board with three bakes, each one a cat’s pick, and *we are serving croissants all day long* |
| 03 | **brunch** | *a cat & a croissant · Brunch*: non-stop brunch in a room full of cats, on a powder-pink panel |
| 04 | **the cats** | *waiting by the window · 6 cats*: six cat cards dealt from one stack as you scroll, each in its own colour, with *‖ stay with* on every card |
| 05 | **the slow teas** | *new menu for staying*: miso latte, kumo fog, nori matcha. *one refill per cat on your lap* |
| 06 | **stay** | a giant **ST·AY** that opens for a cat stretched in the middle, and the three visits: *1 croissant · 1 slow tea · 1 cat (maybe)* |

### 02 · Cats: *Six cats are waiting*
- **The hand**: six cards fan out of one hand as the page opens, and close again as you scroll. Above them, the total number of days the six have waited counts up.
- **The counter**: *Pick a bake, meet a cat.* Hover a bake on the counter and its cat comes over to check, with the price on a disc.
- **The file cards**: one big card per cat, alternating left and right. Each card has:
  - a giant name and the cut-out cat
  - a data table: coat, age, arrived, days waiting, bake
  - their quote and a *‖ stay with miso* button
  - a real photo print, sized to the photo's own shape, with a caption
- **You paused for**: a tray of the cats you pressed *stay with* on, on any page.

### 03 · Bakes: *Out of the oven*
- **The head** shows the oven photo and says, in Taipei time, what just came out, what's next and when the oven closes.
- **The oven clock**: a rail from 7:00 to 19:00 with a pin for every tray of the day and a needle at *now*. Hover a pin to peek at the bake. On phones it's swipeable.
- **Special of the week: the paw bun.** It turns a full circle as you scroll. There are only **40 a day**, and the counter sells them through the day by Taipei time.
- **The menu**: six bakes, six favourites. Each card flips to show what's **inside**, the allergens, and *safe for nori? never.* Chocolate is poison for cats, so nori gets none and biscotti gets a sardine instead.
- **The last tray**: the pawse hour, 18:00 to 19:00, with everything half price, a countdown and two sunset prints.
- **Slow teas** to stay longer.
- **Fill a box of six**: tap or drag bakes into the box. At six the lid closes and gets a sticker.
- **Build a stay set**: pick a bake and a tea, and you get a printed receipt that tells you which cat will sit with you.

| bake | | nt | inside | safe for the cat? |
|---|---|---|---|---|
| butter croissant | 牛角可颂 | 45 | french butter 84%, flour, milk, egg wash, sea salt | no. *miso has tried anyway.* |
| cinnamon roll | 肉桂卷 | 55 | milk dough, cinnamon sugar, cream cheese icing | no. *tofu just sniffs it.* |
| nap nap éclair | 巧克力闪电泡芙 | 60 | choux, dark chocolate cream, chocolate glaze | **never.** |
| cranberry roll | 蔓越莓面包卷 | 65 | brioche dough, cranberries, orange zest | no. *panna only kneads it.* |
| soda bread | 苏打面包 | 80 | wholemeal, buttermilk, oats, baking soda | no. *kumo sleeps next to the warm loaf.* |
| dark chocolate | 黑巧克力 | 90 | 70% dark chocolate, cream, cocoa biscuit base | **never.** |

| slow tea | | nt | what's in it |
|---|---|---|---|
| miso latte | 味噌拿铁 | 120 | butter · cinnamon · espresso |
| kumo fog | 云雾伯爵 | 110 | earl grey · oat cloud · honey |
| nori matcha | 海苔抹茶 | 130 | matcha · black sesame · milk |

### 04 · Stay: *Stay with one*
- **Three rules** sit under the title, with a cat stretching across the head.
- **The three visits**: three sticky cards that stack as you scroll, each with a real photo.
  1. *buy a croissant. sit down. that’s the whole job.*
  2. *same chair if you can. one of you will move a little closer.*
  3. *if a cat falls asleep on you, that’s the paperwork.*
- **Stay still**: practice for the real thing. Hold the ‖ button for about three seconds and a cat comes closer, out of the blur. Let go too early and it wanders off.
- **Book the next visit**: pick a cat, a day and a time (real Taipei dates) and you get a visit card with a stamp.
- **Small questions, honest answers**: *what if no cat chooses me? · can i pick the cat up? · is it free?*

### 05 · Went home: *the number only goes up*
- **47**: the cats who have gone home since march 2024, counting up in a yolk pill. Under it, a ticker of who went where runs faster when you scroll.
- **The wall by the door**: twelve photo prints taped up at an angle, which you can filter by year. Tap one to open the **letter** their people sent back:
  - who chose them
  - how many visits it took and how long they waited
  - the neighbourhood
  - their first breakfast at home
- **The empty chair**: the day a cat goes home, their chair stays empty, and at seven the staff eat that cat's favourite bake.
- **Numbers**:
  - 3.4 visits on average
  - 211 days, the longest wait
  - 1 visit, the fastest
  - 2140 croissants eaten while waiting
- **Send a postcard**: pick a cat, write a line, and it flies onto the wall under their print.

### 06 · About: *We pressed ‖ pause*
- **The door**: as you scroll, the ‖ pill grows to fill the screen and opens onto the front of the bakery. The two bars slide out to the sides.
- **How it started**: four moments, each with a print that drops onto a sticky stack. They run from june 2023, a kitten under an umbrella outside the door, to april 2024, when bubu goes home and the bakery calls the shelter.
- **The name**: a dictionary entry for *paw‖se* with four meanings, and a *say it slow* button that stretches the word.
- **The morning shift**: ah-hao, jun, xiao lin and dr. chen. Each has a punch card and a live *in now / gone home* tag, by Taipei time.
- **From the shelter to your sofa**: the six steps a cat takes, pinned and scrolling sideways, with a ‖ travelling along the rail. The steps are the shelter, the quiet room, the floor, three visits, a home visit and went home.
- **The house rules**: on chocolate, lighting up word by word.
  - *we don’t sell cats.*
  - *we don’t pick them up.*
  - *we don’t wake them.*
  - *nobody leaves with a cat on day one.*
  - *ten percent of every bake feeds the shelter.*
  - and last: *the cat decides.*
- **Come in**: the apron hangs on its hook and swings when you scroll or hover. *If you can see it, we’re closed.* The tag next to it is live.
- **Now, pause.** One last big ‖. Press it and the page answers *Good. stay a little.*

---

## ✦ Easter eggs

- Press **P** anywhere to pause the site. Press it again to play.
- Type **↑ ↑ ↓ ↓ ← → ← → B A** and it rains *stay*.
- Switch tabs and the title becomes *‖ paused · the cats are waiting*.
- Open the console for an ASCII sleeping cat, the signature, and `PW.help()`:
  - `PW.pause()` holds everything still
  - `PW.CATS` lists who is waiting today
  - `PW.rain()` makes it rain

---

## ✦ Images

Every image sits in a **slot** (`<div class="slot" data-img="…">`). If the file is missing, the slot shows its path and a description of what to shoot, so the layout never breaks. Each slot tries `.png`, `.jpg` and `.webp`.

| folder | for | what |
|---|---|---|
| `img/HOME` | index | cut-out cats, bakes and teas (transparent png) |
| `img/CATS` | cats | a real photo print of each of the six cats |
| `img/BAKES` | bakes | the oven, the paw bun (png, it turns), two sunset prints |
| `img/VISIT` | stay | the three visits |
| `img/WENT` | went home | the twelve cats at their new homes and the empty chair |
| `img/ABOUT` | about | the door, the four moments, the four staff, the apron |

---

## ✦ Stack

- **HTML / CSS / vanilla JS**: no framework, no build step.
- **[GSAP 3.12](https://gsap.com)** with **ScrollTrigger** for every reveal, pin and scrub, and for the pause itself (`gsap.globalTimeline.pause()`).
- **[Lenis](https://github.com/darkroomengineering/lenis)** for smooth scrolling.
- **`Intl.DateTimeFormat`** with `timeZone: 'Asia/Taipei'` for every clock on the site.
- **`localStorage`** (prefix `pw-`) for stays, the box, sets, receipts, bookings and postcards.
- **`prefers-reduced-motion`** is respected: with it on, everything shows up without moving.
- **Google Fonts**: Fraunces, Archivo, Bodoni Moda, Noto Sans SC, DM Mono.

---

## ✦ Structure

```
PAWSE/
├── index.html         home: stay with me
├── cats.html          six cats are waiting
├── bakes.html         out of the oven
├── stay.html          stay with one
├── went-home.html     the wall by the door
├── about.html         we pressed pause
├── favicon.svg        the ‖ pill
├── css/
│   ├── style.css      shared: tokens, type, logo, nav, loader, footer, pause
│   ├── home.css
│   ├── cats.css
│   ├── bakes.css
│   ├── stay.css
│   ├── went.css
│   └── about.css
├── js/
│   ├── main.js        shared: PW (cats, bakes, slots, lenis, cursor, pause, loader, easter eggs)
│   ├── home.js
│   ├── cats.js
│   ├── bakes.js
│   ├── stay.js
│   ├── went.js
│   └── about.js
└── img/               HOME · CATS · BAKES · VISIT · WENT · ABOUT
```

---

## ✦ Run it

It's a static site, but serve it over HTTP, because the image slots load files and won't work from `file://`:

```bash
cd PAWSE
python3 -m http.server 5810
```

Then open [http://localhost:5810](http://localhost:5810) and press **P**.

---

<div align="center">

```
      ‖ ‖        /\_/\
      ‖ ‖       ( -.- )   zzz
      ‖ ‖        > ^ <
               (")_(")   PAWSE 暂停 · stay a little
```

**PAWSE 暂停** is a concept. The bakery, the cats and the people are made up, and the photos are placeholders for a portfolio piece.

concept, design & code by **ghostly.grl** ♥

</div>
