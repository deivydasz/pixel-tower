# Pixel Tower

Player-facing name: **Idle Pixel Tower** (matches the live URL; used for the page title and home screen). The repo stays `pixel-tower`.

A very simple single-tower defence game in pixel style, for web and mobile browsers.
The whole game is one file: `index.html` (HTML + CSS + vanilla JavaScript, Canvas 2D). No build step, no dependencies.

## Game design (decided)
- One tower in the middle of the screen. Enemies attack from all sides.
- Enemies: Grunt (basic), Runner (fast, from wave 3), Tank (slow, tough, from wave 5).
- Killed enemies burst into pixels that fly to the tower. Pixels are the in-run currency.
- Blast fires only from the BLAST button (or Space on a keyboard), never from tapping the play area; tapping the play area only resumes from pause.
- Player-facing names: the screen-wide ability is **Blast** (code still calls it `nova`), the armor upgrade is **Dmg sponge** (code key `armor`).
- In-run upgrades (cost pixels): six stats. Damage and Tower HP from the start; Fire rate (wave 5), Range (8), Dmg sponge (12, flat armor per hit), Pixel magnet (16, more pixels per kill) unlock by best wave, mid-run too. Healing upgrades were tried and made the tower immortal in simulations, so avoid them.
- Each cleared wave gives pixels and pixel chips. Chips are the between-runs currency.
- Pixel foundry: spend chips on permanent upgrades to the same six skills (same unlocks). Saved in localStorage.
- Game over menu: header and reason, an "Unlocked this run" card (new upgrades, bosses, cores, Bit Theory, research now available or finished; hidden if nothing new), run stats, Play again, next-unlock goal, two suggested upgrades (cheapest, and one matched to the killer), then Foundry · Bit Theory · Main menu. Bit Theory is highlighted with "New!" when the run unlocked something for it.
- Waves keep getting stronger (count and HP scale per wave).
- Home screen before the first run and between runs: Play, a next-unlock goal card, Progress (Foundry, History), Unlocks (Bosses tracker from wave 20; locked Daily run wave 50 and Tower skins wave 75, "Soon" until built), How to play.
- Bosses: waves 20/40/60/80, then every 10 from 100. Brute, Swarm Queen (spawns Runners), Warden (shield, Blast breaks it). No escapes: a boss at the tower keeps hitting every second until it or the tower dies. Kill = 1 boss core + chips. Cores pay for Bit Theory.
- Bit Theory (research, "finding the deeper meaning in pixels"): one timed study at a time in real time (keeps running while closed), paid with cores + chips. Spray and Pray, Piercing bits, Critical bits, Blast tech, Bit depth (x1.2 damage per level, the long-term multiplier). Unlocks after the first boss. Researches have requirements (bosses beaten, best wave, other research levels): Critical and Piercing first, then Spray and Pray, Blast tech, Bit depth. Data in `BITS` in index.html. Game over has Restart, Foundry and Main menu.
- The run keeps going when the tab is hidden (no auto-pause; missed time is simulated on return, up to 30 min, silently). Pausing is manual: Pause opens a panel with Resume and Stop run; Stop run asks for confirmation, then ends the run like a death (saved to History as "Stopped").
- The cat (requested by my daughter): grey pixel cat drawn inside the game screen during runs, every 15-30s: peeks from the left/right edge (blinks twice) or walks along the bottom (sometimes sits). Hanging from the top was tried and removed (looked awkward). Tap = Meow + hearts, 30% chance to heal 1 HP. Purely decorative, never pauses. Sprites in `CAT_SPR`; she may draw her own in Piskel later.
- History: every finished run is saved (last 50: date, wave, killer, chips, duration, Blasts used, record) and shown from the home menu.

## Technical rules
- Keep it a single `index.html` unless I explicitly ask to split it up.
- Pixel look: low-res internal canvas scaled up, `image-rendering: pixelated`.
- Must work on desktop and phones: touch-friendly buttons, no horizontal scroll, page padding, safe-area insets.
- Support light and dark mode for page chrome.
- Saved data lives in localStorage under `pixelTowerMeta`. Do not break existing saves when changing the data shape; add new fields with defaults. The save has a version `v` (`SAVE_V` in code); bump it and add a migration step in `loadMeta` when the shape changes.
- Test by opening `index.html` in a browser (`open index.html` on macOS).
- Before handing work to me, test it: run `tests/run.sh` (headless Chrome, see `tests/README.md`) and add or update tests for the change. Check the layout at phone widths with `tests/shot.sh` (390px and 320px). For balance changes, run `tests/balance.sim.js` and report the numbers.

## Git and deploy
- Repo: github.com/deivydasz/pixel-tower (private), branch `main`.
- Pushing to `main` auto-deploys to my server via a GitHub Action (`.github/workflows/deploy.yml`), so a push to `main` is a live release.
- Live site: https://idlepixeltower.duckdns.org (DigitalOcean Droplet, nginx, Let's Encrypt). The Droplet also runs a Rails app outside nginx; only touch the `pixel-tower` nginx config.
- Preview: pushing any `feature/*` branch deploys it to https://preview.idlepixeltower.duckdns.org (`.github/workflows/preview.yml`, separate saves from live, one slot = last pushed branch). After pushing a branch, check the Preview run and tell me to try it there before I say "push".
- NEVER push to `main` without asking me first. Work on a branch named like `feature/short-name` and commit there.
- Commit messages: short, imperative, one line (e.g. "Add boss wave every 10 waves").
- Release flow: push the branch, open a PR, then merge it into `main` with a merge commit (`gh pr merge --merge`, no squash or fast-forward) so every feature stays traceable in history. Then check the deploy run with `gh run watch`.
- Before asking to push, summarise what changed and how I can test it.
- When I say "push", that approves the whole release: push the branch, open a PR that explains the changes, merge it with a merge commit, then confirm the deploy run succeeded and the change is on the live site.
- `deploy.yml` looks like it only runs `ssh ... true`, but the server does the deploy on that login. A green Deploy run means the release is live; don't "fix" the workflow.
- When I need to run commands on the server, give each as a single line I can paste (multi-line heredocs break when pasted from the terminal). I'm logged in as root there.

## How I work
- I give direction and confirm; you propose and implement. Keep changes small and focused, one feature per commit.
- Ask me when a design choice is genuinely open (numbers and balance can be proposed with reasoning, I will tune them).
- Do not add libraries, build tools or a backend without asking first.
