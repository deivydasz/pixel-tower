# Pixel Tower

A very simple single-tower defence game in pixel style, for web and mobile browsers.
The whole game is one file: `index.html` (HTML + CSS + vanilla JavaScript, Canvas 2D). No build step, no dependencies.

## Game design (decided)
- One tower in the middle of the screen. Enemies attack from all sides.
- Enemies: Grunt (basic), Runner (fast, from wave 3), Tank (slow, tough, from wave 5).
- Killed enemies burst into pixels that fly to the tower. Pixels are the in-run currency.
- In-run upgrades (cost pixels): Damage, Fire rate, Range, Tower HP, Pixel absorber (flat armor per hit).
- Each cleared wave gives pixels and pixel chips. Chips are the between-runs currency.
- Pixel foundry: spend chips on permanent upgrades to the same five skills. Saved in localStorage.
- Game over menu: shows what killed the player, Restart and Go to foundry buttons, and two suggested upgrades (cheapest, and one matched to the killer).
- Waves keep getting stronger (count and HP scale per wave).

## Technical rules
- Keep it a single `index.html` unless I explicitly ask to split it up.
- Pixel look: low-res internal canvas scaled up, `image-rendering: pixelated`.
- Must work on desktop and phones: touch-friendly buttons, no horizontal scroll, page padding, safe-area insets.
- Support light and dark mode for page chrome.
- Saved data lives in localStorage under `pixelTowerMeta`. Do not break existing saves when changing the data shape; add new fields with defaults. The save has a version `v` (`SAVE_V` in code); bump it and add a migration step in `loadMeta` when the shape changes.
- Test by opening `index.html` in a browser (`open index.html` on macOS).
- Before handing work to me, test it: drive the game in headless Chrome where possible (check for JS errors, simulate key flows) and check the layout at phone widths (390px and 320px). For balance changes, simulate runs and report the numbers.

## Git and deploy
- Repo: github.com/deivydasz/pixel-tower (private), branch `main`.
- Pushing to `main` auto-deploys to my server via a GitHub Action (`.github/workflows/deploy.yml`), so a push to `main` is a live release.
- Live site: https://idlepixeltower.duckdns.org (DigitalOcean Droplet, nginx, Let's Encrypt). The Droplet also runs a Rails app outside nginx; only touch the `pixel-tower` nginx config.
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
