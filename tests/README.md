# Tests

Plain JavaScript tests that run the real `index.html` in headless Chrome. No npm, no dependencies: only Chrome or Chromium and Python 3.

```bash
tests/run.sh                         # run all *.test.js, exit code 1 if anything fails
tests/run.sh tests/nova.test.js      # run one suite
VT=150000 tests/run.sh tests/balance.sim.js   # balance simulation (slow, prints INFO lines)
tests/shot.sh out.png 390 844 setup.js        # screenshot at phone size after an optional setup script
```

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
- `gameover.test.js`: game over screen stats, Play again, goal, suggestions, record
- `layout.test.js`: HUD keeps its layout as numbers grow, game name
- `history.test.js`: runs saved to history, list and summary, cap, old/corrupt saves, escaping
- `background-stop.test.js`: no auto-pause, background catch-up (quiet, capped), pause panel, stop-run confirmation
- `pause-foundry.test.js`: pause/resume inputs, foundry only reachable from game over
- `nova.test.js`: Nova damage, push, whole-screen range, cooldown, inputs
- `bit-theory.test.js`: research unlock, cost, one-at-a-time timers, completion while away, spray/pierce/crit/Nova/depth effects, saves
- `bosses.test.js`: boss schedule and rotation, rewards, escapes, Warden shield, Queen spawns, boss bar, saves
- `best-saves.test.js`: best wave record, loading v0/v1 saves
- `teststart.test.js`: preview-only ?wave= / ?px= shortcut is ignored on the live site
- `tips.test.js`: first-play tips, pausing, shown once
- `balance.sim.js`: bot runs to compare wave reached (results vary about ±2 waves between runs)
