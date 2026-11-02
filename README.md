# Idle Pixel Tower

A small single-tower defence game in pixel style for desktop and mobile browsers.
One tower stands in the middle of the screen and enemies come from every side, wave after wave.

**Play:** https://idlepixeltower.duckdns.org

## How to play
- Your tower aims and shoots by itself at the nearest enemy in range.
- Destroyed enemies burst into **pixels** that fly to the tower. Spend pixels on upgrades during the run.
- Clearing a wave gives bonus pixels and **pixel chips**. Chips stay between runs and buy permanent boosts in the **Foundry**.
- When enemies close in, fire a **Blast**. It hits everything on screen and knocks every enemy inside your range back out to its edge (more Range = bigger push), but takes 2 minutes to recharge.
- The run ends when the tower's HP reaches zero, or when you stop it yourself.

### Controls
| Action | Touch / mouse | Keyboard |
|---|---|---|
| Fire Blast | Tap the BLAST button | Space |
| Pause | Pause button | P or Esc |
| Resume | Resume, or tap the play area | P or Esc |
| Stop the run | Pause, then Stop run, then confirm | |
| Sound on/off (everything) | Sound button | |
| Music on/off | Music button on the home menu or in the pause panel | |

When your Range grows past the screen, the battlefield zooms out so you always see your whole range.

The game keeps running when you switch tabs or apps. When you come back, the missed time (up to 30 minutes) is played out instantly and silently.

## Enemies
Waves get bigger and tougher: wave *n* has 4 + 2*n* enemies, and their HP grows about 12% per wave.

| Enemy | From wave | Speed | HP | Damage to tower | Pixels dropped |
|---|---|---|---|---|---|
| Grunt | 1 | normal | normal | 1 | 3 |
| Runner | 3 | fast | half | 1 | 2 |
| Tank | 5 | slow | 4× | 3 | 8 |

The legend at the top right of the game shows each enemy's current HP and the damage it will do after your armor.

### Bosses
A boss arrives at waves 20, 40, 60 and 80, then every 10 waves from wave 100, together with that wave's normal enemies.
Bosses never give up: one that reaches the tower stays there and hits it every second until either the boss or the tower is destroyed. Destroy it to earn **1 boss core** and bonus chips (5 + 1 per 10 waves). The first boss is a real wall: in simulations it takes about Foundry level 4 in every upgrade to beat it reliably.

| Boss | Trait |
|---|---|
| Brute | Very tough and slow |
| Swarm Queen | Spawns a Runner every 3 seconds while alive |
| Warden | A shield blocks 75% of bullet damage. Blast breaks it for 8 seconds |

Boss cores pay for Bit Theory research.

## Bit Theory
Study the pixels to find their deeper meaning. Bit Theory opens on the home menu once you have beaten a boss.
Each research level costs boss cores and chips and takes **real time**: about 10 to 30 minutes for the first level, 1.4x longer for each level after (24 hours at most). The timer keeps running while the game is closed. You can study one thing at a time.

| Research | Each level | Max level | Available when |
|---|---|---|---|
| Critical bits | +5% chance of a x3 critical hit | 10 | right away |
| Piercing bits | Bullets pass through +1 enemy | 5 | right away |
| Spray and Pray | +1 bullet per shot, fanned out | 4 | Piercing bits Lv 2 and 3 bosses beaten |
| Blast tech | Blast recharges 15s faster (down to 60s) | 4 | best wave 35 and 2 bosses beaten |
| Bit depth | All damage x1.2, stacking | 20 | Critical bits Lv 3 and 5 bosses beaten |
| Overclock | Fights can run 0.5x faster (up to 3x) | 4 | 5 bosses beaten |

Bit depth multiplies rather than adds, which is what makes the deep waves reachable.

Overclock has its own price: 2 cores + 300 chips (30 min), 3 + 800 (1 h), 6 + 3,000 (4 h), 10 + 8,000 (8 h). Once studied, a speed button appears in the top-left of the game screen: tap it to switch between 1x and your highest speed. Only the fight speeds up; research timers, banners, music and the cat stay in real time.

Critical hits flash the enemy yellow and show the damage dealt.

## Upgrades
During a run the upgrades sit in three tabs: **Power** (Damage, Fire rate, Range, Crit power), **Survival** (Tower HP, Dmg sponge, Heavy rounds) and **Economy** (Pixel magnet, Pixel bank). A dot on a tab means something there is affordable.

You start with Damage and Tower HP. The others unlock when you first reach their wave, straight away even mid-run, and stay unlocked in runs and in the Foundry.

| Upgrade | Unlocks at | In run (pixels) | Foundry (chips, permanent) |
|---|---|---|---|
| Damage | start | +1 damage | +0.5 damage |
| Tower HP | start | +10 max HP (and heals 10) | +5 max HP |
| Fire rate | wave 5 | +0.4 shots/s | +0.2 shots/s |
| Range | wave 8 | +8 range | +4 range |
| Dmg sponge | wave 12 | +0.5 armor per hit | +0.25 armor per hit |
| Pixel magnet | wave 16 | +15% pixels per kill | +10% pixels per kill |
| Pixel bank | wave 20 | each cleared wave pays 3% interest on unspent pixels (max +25 per level) | 1.5% (max +12 per level) |
| Heavy rounds | wave 30 **in this run** | each hit knocks a Tank back 0.6px | (run only) |
| Crit power | wave 35 **in this run**, needs Critical bits | crit damage x3 → +0.5 per level | (run only) |

Heavy rounds and Crit power are late-run upgrades: every run starts without them, even if you reached those waves before.

Each level costs more than the last. Every hit still does at least 0.2 damage, however much armor you have.
After a run, the game over screen suggests two Foundry upgrades: the cheapest one, and the one that best counters what killed you.

## Progression
- **Chips per cleared wave:** 1, plus 1 more for every 5 waves reached.
- **Best wave** is shown on the menu, the game over screen and in History. During a run the HUD shows a gold "New best!" once you pass it; beating it shows "New record!" at game over.
- **History** keeps your last 50 runs: date, wave, killer, chips earned, time and Blasts used.
- **Unlocks:** the Bosses tracker opens at best wave 20 and shows bosses beaten and cores. Daily run and Tower skins are coming, at best wave 50 and 75. The next-unlock card on the menu tracks your progress.
- A grey cat sometimes visits the game screen: it peeks in from the side and blinks, or walks along the bottom (and sits down for a moment). Tap it and it answers (Meow!, Purrr, Mrrp?...). Sometimes it heals your tower: 10% chance of +5 HP, otherwise 30% chance of +1 HP. Now and then it yawns or chirps by itself.
- New players get a few one-time tips: the basics, buying an upgrade, using Blast and the Foundry.

Progress is saved in your browser (`localStorage`, key `pixelTowerMeta`). It is separate for each address, so the live site and the preview have their own saves. Clearing site data resets it.

## Development
The whole game is one file, `index.html` (HTML, CSS and plain JavaScript on a Canvas 2D). There is no build step and there are no dependencies.

```bash
open index.html        # play locally (macOS); any browser works
tests/run.sh           # run all tests in headless Chrome
```

- **Tests:** `tests/` drives the real game in headless Chrome. It needs only Chrome and Python 3. See [tests/README.md](tests/README.md).
- **Preview:** pushing a `feature/*` branch deploys it to https://preview.idlepixeltower.duckdns.org, which has its own saves.
- **Release:** a PR into `main`, merged with a merge commit, deploys to the live site.
- **Working rules** for contributors and Claude Code are in [CLAUDE.md](CLAUDE.md).
