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
Waves get bigger and tougher: wave *n* has 4 + 2*n* enemies, their HP grows about 11% per wave, and their damage grows 10% every 5 waves (a Tank hits for 3 at first, 4.5 at wave 25, 6 at wave 50). Bosses have their own fixed numbers.

| Enemy | From wave | Speed | HP | Damage to tower | Pixels dropped |
|---|---|---|---|---|---|
| Grunt | 1 | normal | normal | 1 (grows) | 3 |
| Runner | 3 | fast | half | 1 (grows) | 2 |
| Tank | 5 | slow | 4× | 3 (grows) | 8 |

The legend at the top right of the game shows each enemy's current HP and the damage it will do after your armor.

### Bosses
Two bytes make a word: a boss arrives every 16 waves (16, 32, 48, 64...), together with that wave's normal enemies. The screen glitches as it is compiled, and beating it finishes a byte, so a glitch pick follows.
Bosses never give up: one that reaches the tower stays there and hits it every second until either the boss or the tower is destroyed. Destroy it to earn **1 boss core** and bonus chips (5 + 1 per 10 waves). The first boss is a real wall: in simulations it takes about Foundry level 4 in every upgrade to beat it reliably.

| Boss | Trait |
|---|---|
| Brute | Very tough and slow |
| Swarm Queen | Spawns a Runner every 3 seconds while alive |
| Warden | A shield blocks 75% of bullet damage. Blast breaks it for 8 seconds |

Boss cores pay for Bit Theory research.

## Bit Theory
Study the pixels to find their deeper meaning. Bit Theory opens on the home menu after your first run. The first Critical bits study is free (10% crit chance, then +5% per level); level 1 of other research costs 10 chips and no cores; higher levels need boss cores.
Each research level costs boss cores and chips and takes **real time**: about 10 to 30 minutes for the first level, 1.4x longer for each level after (24 hours at most). The timer keeps running while the game is closed. You can study one thing at a time.

| Research | Each level | Max level | Available when |
|---|---|---|---|
| Critical bits | chance of a x3 critical hit: 10% at Lv 1 (free study), +5% per level | 10 | right away |
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
When your chips can buy a Foundry upgrade, the Foundry button on the game over screen and the home menu lights up with "Upgrade ready!".

## Progression
- **Chips per cleared wave:** 1, plus 1 more for every 5 waves reached.
- **Certificates:** completing wave 10, 20, 30... for the first time earns a certificate. Collect its one-time chips on the Certificates screen (the menu shows "Reward ready!"): Pixel Apprentice (10, +8), Bit Cadet (20, +20), Byte Guard (30, +38), Sprite Sentinel (40, +60), Raster Knight (50, +88), Vector Captain (60, +120), Palette Master (70, +158), Shader Sage (80, +200), Render Lord (90, +248), Pixel Legend (100, +300), then "Wave N Master". Boss waves count once the boss is beaten. See them from the menu under Progress.
- **Boss attempts:** if a run ends while a boss is alive, you get chips for the share of its HP you took (up to its full chip reward, no core), and game over shows how much HP it had left.
- **Idle income** (after your first run): while the game is closed the tower keeps earning, up to 4 hours. 4 hours pays the chips of one run to your best wave, plus a head start of 10 px per best wave for your next run (it waits until you press Play and never holds more than one 4-hour batch). Under 5 minutes away pays nothing. The menu shows the rate and a "While you were away" card.
- **So close:** game over points out the nearest goal: a few waves short of your best, a certificate within 5 waves, or a Foundry upgrade you are just a few chips short of.
- **Best wave** is shown on the menu, the game over screen and in History. During a run the HUD shows a gold "New best!" once you pass it; beating it shows "New record!" at game over.
- **History** keeps your last 50 runs: date, wave, killer, chips earned, time and Blasts used.
- **Skins:** the certificates for waves 30, 50 and 70 each unlock a set of skins (Bug Hunt, Neon, Crystal) for the enemies, the tower and the background. Collect the certificate to get the skins. Every skin you own gives a bonus, whichever look you wear: enemy skins +5/10/15% pixels per kill, tower skins +3/6/9% damage, background skins +5/10/15% pixels and chips per wave clear. Skinned towers grow as you buy upgrades during a run. Pick the look on the Skins screen from the menu.
- **Unlocks:** the Bosses tracker opens at best wave 16 and shows bosses beaten and cores. Skins open with the wave 30 certificate. The Daily run and Drivers open at best wave 25. The next-unlock card on the menu tracks your progress.
- **Bytes and glitches:** every wave is a bit; 8 cleared bit waves compile into a byte (wave 8, 16, 24...; the bits next to the wave number fill up). The pixels glitch and you keep one of three random boosts for the rest of the run (Sharp Pixels, Turbo Bit, Widescreen, Anti-Aliasing, Scanlines, Pixel Rain, Compression, Refresh Rate, Dither Shot, Stray Bit, Save State). Picking one again stacks it.
- **Daily run:** one challenge a day, the same for everyone (the twist and the enemy spawns come from the date). You start with a fresh tower: Foundry, Bit Theory and skin bonuses don't count, so a run takes 5-10 minutes. Seven twists (Glass cannon, Swarm, Rush hour, Spray day, Blast party, Bargain bin, Lucky bits); each appears once every 7 days, never twice in a row. Retry as often as you like: you earn chips for today's best wave, paid as it improves, up to half a run to your best wave for beating the wave 16 boss, plus 10% per day in a row (max +50%). Daily runs never change your best wave and give no normal chips, cores or certificates. They also pay packets (10 for beating the boss, +1 per 4 waves after it, with the streak bonus); certificates from wave 30 pay packets too.
- **Drivers:** install them to empower your tower in normal runs (they fly as little robots) (not in Daily runs), opened at best wave 25. Build each one with packets, then upgrade its Size (field) and Power (effect) separately up to Lv 10. Cache Driver: kills in its field drop more pixels. Lag Driver: lag spikes freeze the enemies in its field every few seconds (bosses half as long). Debug Driver: enemies in its field take more damage from your shots. Each flies to its own target: the tower's next kill, the biggest crowd, the toughest enemy.
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
