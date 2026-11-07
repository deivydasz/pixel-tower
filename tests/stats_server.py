#!/usr/bin/env python3
# Tests for server/stats.py: run with `python3 tests/stats_server.py`. Starts the server on a spare port with a temp DB.
import json, os, socket, subprocess, sys, tempfile, time, urllib.request, urllib.error
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = 0
def ok(c, m):
    global fails
    print(('PASS ' if c else 'FAIL ') + m); fails += 0 if c else 1
s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
tmp = tempfile.mkdtemp(); env = dict(os.environ, STATS_DB=os.path.join(tmp, 'db', 's.db'), STATS_PORT=str(port))
p = subprocess.Popen([sys.executable, os.path.join(ROOT, 'server', 'stats.py'), '--no-watch'], env=env)
base = 'http://127.0.0.1:%d' % port
def req(path, body=None):
    r = urllib.request.Request(base + path, data=body if body is None or isinstance(body, bytes) else json.dumps(body).encode(), headers={'Content-Type': 'text/plain'})
    try:
        with urllib.request.urlopen(r, timeout=5) as f: return f.status, f.read().decode()
    except urllib.error.HTTPError as e: return e.code, e.read().decode()
try:
    for _ in range(50):
        try: req('/stats'); break
        except Exception: time.sleep(.1)
    A, B = 'a1b2c3d4e5f60718', 'ffffffffffffffff'
    m = {'best': 42, 'bk': 3, 'cores': 1, 'chips': 50, 'res': {'crit': 2, 'speed': 1}, 'lv': {'dmg': 4}, 'runs': 2}
    ok(req('/api/e', {'id': A, 'env': 'live', 'type': 'open', 'data': {'m': m}})[0] == 204, 'open event stored')
    ok(req('/api/e', {'id': A, 'env': 'live', 'type': 'run', 'data': {'w': 42, 'k': 'Tank', 'd': 300, 'c': 20, 'n': 1, 'b': 2, 'r': 1, 'spd': 2, 'm': m}})[0] == 204, 'run event stored')
    req('/api/e', {'id': A, 'env': 'live', 'type': 'research', 'data': {'k': 'crit', 'lv': 3, 'm': m}})
    req('/api/e', {'id': A, 'env': 'live', 'type': 'foundry', 'data': {'k': 'dmg', 'lv': 5, 'c': 30}})
    ok(req('/api/e', {'id': A, 'env': 'live', 'type': 'idle', 'data': {'min': 240, 'c': 28, 'px': 140}})[0] == 204, 'idle event stored')
    ok(req('/api/e', {'id': A, 'env': 'live', 'type': 'bot', 'data': {'k': 'lag', 'lv': 2, 'c': 15}})[0] == 204, 'bot event stored')
    ok(req('/api/e', {'id': A, 'env': 'live', 'type': 'daily', 'data': {'w': 14, 'k': 'Runner', 'd': 400, 'c': 60, 'n': 2, 'x': 'Swarm', 's': 3, 'r': 1, 'm': m}})[0] == 204, 'daily event stored')
    ok(req('/api/e', {'id': B, 'env': 'preview', 'type': 'run', 'data': {'w': 7, 'k': 'Grunt', 'd': 60, 'm': {'best': 7}}})[0] == 400, 'preview runs rejected')
    ok(req('/api/e', {'id': 'nothex!', 'env': 'live', 'type': 'run', 'data': {}})[0] == 400, 'bad player ID rejected')
    ok(req('/api/e', {'id': A, 'env': 'live', 'type': 'hack', 'data': {}})[0] == 400, 'unknown event type rejected')
    ok(req('/api/e', b'{nope')[0] == 400, 'bad JSON rejected')
    ok(req('/api/e', b'x' * 9000)[0] == 413, 'oversized body rejected')
    st, h = req('/stats')
    ok(st == 200 and 'Idle Pixel Tower stats' in h, 'dashboard loads')
    ok('a1b2c3' in h and 'ffffff' not in h and 'preview' not in h, 'only live players, no preview switch')
    ok('Tank' in h and 'Critical bits' in h and 'L3:1' in h, 'dashboard shows killers and research started per level')
    ok('<b>42</b>' in h, 'top wave shown')
    import re; days = re.findall(r'<tr><td>(\w{3} \d\d) ·', h)
    ok(days and days[0] == time.strftime('%a %d', time.gmtime()), 'runs per day: today at the top (' + ' '.join(days[:3]) + ')')
    st, h = req('/stats/p/' + A)
    ok(st == 200 and 'wave 42' in h and 'NEW BEST' in h and '2x speed' in h and 'Critical bits Lv 3' in h and 'Damage Lv 5' in h and 'Came back after 240 min' in h and 'Daily run (Swarm): wave 14' in h, 'player page lists runs, research, purchases, idle returns and daily runs')
    ok('Daily runs' in req('/stats')[1], 'dashboard has a daily runs tile')
    ok('Bitbots built or upgraded' in req('/stats')[1] and 'Bitbots: Lag Bot Lv 2 (15 nibbles)' in h, 'Bitbots on the dashboard and the player page')
    ok(req('/stats/p/0000000000000000')[0] == 404, 'unknown player 404')
    req('/api/e', {'id': A, 'env': 'live', 'type': 'run', 'data': {'w': 1, 'k': '<script>alert(1)</script>', 'm': m}})
    ok('<script>alert' not in req('/stats')[1], 'HTML in event data is escaped')
finally:
    p.terminate()
print('ALL PASSED' if not fails else 'SOME TESTS FAILED'); sys.exit(1 if fails else 0)
