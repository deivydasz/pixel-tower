# Idle Pixel Tower

A small single-tower defence game in pixel style for desktop and mobile browsers.
One tower stands in the middle of the screen and enemies come from every side, wave after wave.

**Play:** https://idlepixeltower.duckdns.org

## How to play
- Your tower aims and shoots by itself at the nearest enemy in range.
- Destroyed enemies burst into **pixels** that fly to the tower. Spend pixels on upgrades during the run.
- Clearing a wave gives bonus pixels and **pixel chips**. Chips stay between runs and buy permanent boosts in the **Foundry**.
- When enemies close in, fire **Nova**. It hits everything on screen but takes 2 minutes to recharge.
- The run ends when the tower's HP reaches zero, or when you stop it yourself.

### Controls
| Action | Touch / mouse | Keyboard |
|---|---|---|
| Fire Nova | Tap the play area or the NOVA button | Space |
| Pause | Pause button | P or Esc |
| Resume | Resume, or tap the play area | P or Esc |
| Stop the run | Pause, then Stop run, then confirm | |
| Sound on/off | Sound button | |

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
Destroy it before it reaches the tower to earn **1 boss core** and bonus chips (5 + 1 per 10 waves). If it reaches the tower it deals heavy damage and you get nothing.

| Boss | Trait |
|---|---|
| Brute | Very tough and slow |
| Swarm Queen | Spawns a Runner every 3 seconds while alive |
| Warden | A shield blocks 75% of bullet damage. Nova breaks it for 8 seconds |

Boss cores pay for Bit Theory research.

## Bit Theory
Study the pixels to find their deeper meaning. Bit Theory opens on the home menu once you have beaten a boss.
Each research level costs boss cores and chips and takes **real time**: about 10 to 30 minutes for the first level, 1.4x longer for each level after (24 hours at most). The timer keeps running while the game is closed. You can study one thing at a time.

| Research | Each level | Max level | Available when |
|---|---|---|---|
| Critical bits | +5% chance of a x3 critical hit | 10 | right away |
| Piercing bits | Bullets pass through +1 enemy | 5 | right away |
| Spray and Pray | +1 bullet per shot, fanned out | 4 | Piercing bits Lv 2 and 3 bosses beaten |
| Nova tech | Nova recharges 15s faster (down to 60s) | 4 | best wave 35 and 2 bosses beaten |
| Bit depth | All damage x1.2, stacking | 20 | Critical bits Lv 3 and 5 bosses beaten |

Bit depth multiplies rather than adds, which is what makes the deep waves reachable.

## Upgrades
You start with Damage and Tower HP. The others unlock when you first reach their wave, straight away even mid-run, and stay unlocked in runs and in the Foundry.

| Upgrade | Unlocks at | In run (pixels) | Foundry (chips, permanent) |
|---|---|---|---|
| Damage | start | +1 damage | +0.5 damage |
| Tower HP | start | +10 max HP (and heals 10) | +5 max HP |
| Fire rate | wave 5 | +0.4 shots/s | +0.2 shots/s |
| Range | wave 8 | +8 range | +4 range |
| Pixel absorber | wave 12 | +0.5 armor per hit | +0.25 armor per hit |
| Pixel magnet | wave 16 | +15% pixels per kill | +10% pixels per kill |

Each level costs more than the last. Every hit still does at least 0.2 damage, however much armor you have.
After a run, the game over screen suggests two Foundry upgrades: the cheapest one, and the one that best counters what killed you.

## Progression
- **Chips per cleared wave:** 1, plus 1 more for every 5 waves reached.
- **Best wave** is shown in the HUD and on the menu. Beating it shows "New record!".
- **History** keeps your last 50 runs: date, wave, killer, chips earned, time and Novas used.
- **Unlocks:** the Bosses tracker opens at best wave 20 and shows bosses beaten and cores. Daily run and Tower skins are coming, at best wave 50 and 75. The next-unlock card on the menu tracks your progress.
- New players get a few one-time tips: the basics, buying an upgrade, using Nova and the Foundry.

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
