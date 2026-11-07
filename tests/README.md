# Tests

Plain JavaScript tests that run the real `index.html` in headless Chrome. No npm, no dependencies: only Chrome or Chromium and Python 3.

```bash
tests/run.sh                         # run all *.test.js, exit code 1 if anything fails
tests/run.sh tests/nova.test.js      # run one suite
VT=150000 tests/run.sh tests/balance.sim.js   # balance simulation (slow, prints INFO lines)
tests/shot.sh out.png 390 844 setup.js        # screenshot at phone size after an optional setup script
```

`VT=90000000 tests/run.sh tests/campaign.sim.js` plays 40 runs in a row with a smart bot (Foundry, research, certificates) and prints hook metrics; define `const CFG={...}` before it to try other numbers (see the top of the file).

`python3 tests/stats_server.py` tests the stats server (`server/stats.py`): starts it on a spare port with a temp database.

Set `CHROME=/path/to/chrome` if Chrome isn't found automatically.

## How it works
`run.sh` copies `index.html`, clears localStorage, appends `lib.js` plus the test file, and loads it with `--dump-dom`. Tests call game functions directly (`update`, `nova`, `S`, `M`, ...) and use `step(sec)` to advance time deterministically, so they don't depend on real frame timing.

## Writing a test
```js
skipTips();                 // unless you're testing the tips
play();                     // the game opens on the home menu
step(2);                    // play 2 seconds
ok(S.wave===1,'wave 1 started');
done();                     // always last: records JS errors and reports
```
Helpers in `lib.js`: `ok`, `step`, `click`, `key`, `$`, `shown`, `skipTips`, `enemy`, `die`, `done`.
Read tunable numbers from the game (e.g. `NOVA.cd`) rather than hard-coding them, so balance changes don't break tests.

## Suites
- `home.test.js`: home menu, How to play, menu/foundry/game over navigation
- `menu.test.js`: home menu groups, locked modes, next-unlock hook, Foundry "Upgrade ready!"
- `polish.test.js`: icons embedded, banner position, no stray canvas text, no DOM writes on idle frames
- `run-unlocks.test.js`: game over lists what the run unlocked (upgrades, bosses, cores, Bit Theory, research) with a Bit Theory shortcut
- `cat.test.js`: the grey cat peeks, walks over the upgrades, hangs from the top, meows when tapped, never pauses the game
- `feedback.test.js`: purchase flash and floating labels (in-run and Foundry)
- `gameover.test.js`: game over screen stats, Play again, goal, suggestions, record
- `layout.test.js`: HUD keeps its layout as numbers grow, game name
- `history.test.js`: runs saved to history, list and summary, cap, old/corrupt saves, escaping
- `background-stop.test.js`: no auto-pause, background catch-up (quiet, capped), pause panel, stop-run confirmation
- `numbers.test.js`: number rounding rules, Foundry and suggestions show current > next stat
- `pause-foundry.test.js`: pause/resume inputs, foundry only reachable from game over
- `music.test.js`: music toggles and save, chord loop, scheduler (stand-in audio device), mute/off stop it
- `nova.test.js`: Nova damage, push, whole-screen range, cooldown, inputs
- `bit-theory.test.js`: research unlock, cost, one-at-a-time timers, completion while away, spray/pierce/crit/Nova/depth effects, saves
- `bosses.test.js`: boss schedule and rotation, rewards, escapes, Warden shield, Queen spawns, boss bar, saves
- `bank.test.js`: Pixel bank interest at wave clear, cap, label, Foundry version, unlock
- `best-saves.test.js`: best wave record, loading v0/v1 saves
- `teststart.test.js`: preview-only ?wave= / ?px= shortcut is ignored on the live site
- `late-upgrades.test.js`: run-only Heavy rounds (wave 30) and Crit power (wave 35, needs Critical bits)
- `zoom.test.js`: zoom out to keep the range ring on screen, smooth, minimum, off-screen spawns, cat unscaled
- `tabs.test.js`: Attack/Survival/Economy tabs, fixed grid height, affordable dots
- `upgrades.test.js`: six upgrades, wave unlocks (mid-run and Foundry), Pixel magnet drops, suggestions
- `tips.test.js`: first-play tips, pausing, shown once
- `glitches.test.js`: byte meter, Glitch offers every 8 waves, panel, waiting for the pick, effects, stacking, Save State, hidden auto-pick, seeded in daily runs
- `bots.test.js`: Bitbots unlock, nibbles from Daily runs, building/upgrading, Cache/Lag/Debug effects in runs, none in Daily runs, saves
- `daily.test.js`: Daily run unlock, screen, fresh tower and twists, seeded spawns, rewards as today's best improves, streak, day change, saves, History
- `balance.sim.js`: bot runs to compare wave reached (results vary about ±2 waves between runs)
