#!/usr/bin/env python3
"""Idle Pixel Tower stats: a tiny event collector and dashboard. Python 3.7+, standard library only.

  POST /api/e        one game event (JSON: id, env, type, data), sent by the game with sendBeacon
  GET  /stats        dashboard (nginx puts basic auth in front of it)
  GET  /stats/p/ID   one player's runs and purchases

Players are anonymous: a random 16-hex ID made by the game. No IPs, names or devices are stored.
Runs on 127.0.0.1 behind nginx (see server/README.md). Data: SQLite at STATS_DB.
When this file changes on disk (a deploy), the process exits and systemd restarts it with the new code.
"""
import html, json, os, sqlite3, sys, threading, time
from collections import defaultdict
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
from urllib.parse import urlparse, parse_qs

DB = os.environ.get('STATS_DB', '/var/lib/pixel-tower-stats/stats.db')
PORT = int(os.environ.get('STATS_PORT', '8787'))
TYPES = ('open', 'run', 'research', 'foundry')
ENVS = ('live', 'preview')
MAX_BODY = 8192
RATE = 240  # events per player ID per hour (a run ends every few minutes; this only stops floods)

lock = threading.Lock()
seen = defaultdict(list)


def db():
    c = sqlite3.connect(DB, timeout=10)
    c.row_factory = sqlite3.Row
    return c


def init():
    d = os.path.dirname(DB)
    if d:
        os.makedirs(d, exist_ok=True)
    with db() as c:
        c.execute('CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY, ts INTEGER, env TEXT, pid TEXT, type TEXT, data TEXT)')
        c.execute('CREATE INDEX IF NOT EXISTS ev_pid ON events(env, pid, ts)')
        c.execute('CREATE INDEX IF NOT EXISTS ev_type ON events(env, type, ts)')


def valid(ev):
    if not isinstance(ev, dict):
        return False
    pid, env, typ, data = ev.get('id'), ev.get('env'), ev.get('type'), ev.get('data')
    return (isinstance(pid, str) and len(pid) == 16 and all(ch in '0123456789abcdef' for ch in pid)
            and env in ENVS and typ in TYPES and isinstance(data, dict))


def limited(pid):
    now = time.time()
    with lock:
        q = [t for t in seen[pid] if now - t < 3600]
        if len(q) >= RATE:
            seen[pid] = q
            return True
        q.append(now)
        seen[pid] = q
        if len(seen) > 20000:  # forget idle players so memory stays small
            for k in [k for k, v in seen.items() if not v or now - v[-1] > 3600]:
                del seen[k]
    return False


def record(ev, now=None):
    with db() as c:
        c.execute('INSERT INTO events(ts, env, pid, type, data) VALUES(?,?,?,?,?)',
                  (int(now or time.time()), ev['env'], ev['id'], ev['type'], json.dumps(ev['data'], separators=(',', ':'))))


# ---------- dashboard ----------
e = html.escape
CSS = '''*{box-sizing:border-box}body{font:13px/1.45 ui-monospace,Menlo,monospace;background:#0d1019;color:#e8ecf5;margin:0;padding:12px;max-width:1100px}
h1{font-size:20px;margin:0 0 4px}h2{font-size:15px;margin:24px 0 8px;color:#8fa3d6}a{color:#5ec8ff}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px}
.tile{background:#1b2033;border:2px solid #3a4160;padding:8px}.tile b{display:block;font-size:18px;white-space:nowrap}.tile small{opacity:.7}
table{border-collapse:collapse;width:100%;font-size:13px}td,th{padding:4px 6px;border-bottom:1px solid #2a3150;text-align:left;white-space:nowrap}
th{color:#8fa3d6;font-weight:normal}td.n,th.n{text-align:right}.wrap{overflow-x:auto}
.bar{background:#5ec8ff;height:10px;display:block;min-width:1px}td.b{width:40%}.muted{opacity:.6}
nav{margin:6px 0 4px}nav a{margin-right:12px}'''
RES = [('crit', 'Critical bits'), ('pierce', 'Piercing bits'), ('spray', 'Spray and Pray'), ('nova', 'Blast tech'), ('depth', 'Bit depth'), ('speed', 'Overclock')]
UPS = [('dmg', 'Damage'), ('hp', 'Tower HP'), ('rate', 'Fire rate'), ('range', 'Range'), ('armor', 'Dmg sponge'), ('magnet', 'Pixel magnet'), ('bank', 'Pixel bank')]


def ago(ts, now):
    s = max(0, int(now - ts))
    for n, u in ((86400, 'd'), (3600, 'h'), (60, 'm')):
        if s >= n:
            return '%d%s ago' % (s // n, u)
    return 'just now'


def dur(s):
    s = int(s or 0)
    h, m = s // 3600, s % 3600 // 60
    return '%dh %02dm' % (h, m) if h else '%dm %02ds' % (m, s % 60)


def page(title, body, env):
    other = 'preview' if env == 'live' else 'live'
    return ('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>%s</title><style>%s</style></head><body><h1>%s</h1><nav><a href="/stats?env=%s">Overview</a>'
            '<span class="muted">%s data</span> · <a href="/stats?env=%s">show %s</a></nav>%s</body></html>'
            % (e(title), CSS, e(title), env, env, other, other, body))


def bars(rows, label='', top=None):
    """rows: [(name, count)] -> table with bars."""
    if not rows:
        return '<p class="muted">No data yet.</p>'
    m = max(n for _, n in rows) or 1
    return ('<table>' + (('<tr><th>%s</th><th class="n">count</th><th></th></tr>' % e(label)) if label else '') +
            ''.join('<tr><td>%s</td><td class="n">%d</td><td class="b"><span class="bar" style="width:%d%%"></span></td></tr>'
                    % (e(str(k)), n, 100 * n // m) for k, n in rows) + '</table>')


def overview(env, now=None):
    now = now or time.time()
    with db() as c:
        evs = c.execute('SELECT ts, pid, type, data FROM events WHERE env=? ORDER BY ts', (env,)).fetchall()
    players = {}
    runs, research, foundry = [], [], []
    for r in evs:
        d = json.loads(r['data'])
        p = players.setdefault(r['pid'], {'pid': r['pid'], 'first': r['ts'], 'last': r['ts'], 'runs': 0, 'time': 0, 'opens': 0, 'm': {}})
        p['last'] = r['ts']
        if isinstance(d.get('m'), dict):
            p['m'] = d['m']
        if r['type'] == 'open':
            p['opens'] += 1
        elif r['type'] == 'run':
            p['runs'] += 1
            p['time'] += int(d.get('d') or 0)
            runs.append((r['ts'], r['pid'], d))
        elif r['type'] == 'research':
            research.append(d)
        elif r['type'] == 'foundry':
            foundry.append(d)
    day = 86400
    act = lambda s: sum(1 for p in players.values() if now - p['last'] < s)
    new7 = sum(1 for p in players.values() if now - p['first'] < 7 * day)
    waves = [int(d.get('w') or 0) for _, _, d in runs]
    tiles = [('Players', len(players), 'all time'), ('Active 24h', act(day), 'players'), ('Active 7d', act(7 * day), 'players'),
             ('New 7d', new7, 'players'), ('Runs', len(runs), 'all time'), ('Runs 24h', sum(1 for t, _, _ in runs if now - t < day), ''),
             ('Avg wave', round(sum(waves) / len(waves), 1) if waves else 0, 'per run'), ('Top wave', max(waves) if waves else 0, ''),
             ('Play time', dur(sum(int(d.get('d') or 0) for _, _, d in runs)), 'total')]
    out = '<div class="tiles">' + ''.join('<div class="tile"><small>%s</small><b>%s</b><small>%s</small></div>' % (e(a), e(str(b)), e(c)) for a, b, c in tiles) + '</div>'
    # runs per day, last 14 days
    days = []
    for i in range(14):  # newest day first
        t0 = (int(now) // day - i) * day
        ds = time.strftime('%a %d', time.gmtime(t0))
        rs = [x for x in runs if t0 <= x[0] < t0 + day]
        days.append((ds + ' · %dp' % len({x[1] for x in rs}), len(rs)))
    out += '<h2>Runs per day (UTC, newest first)</h2>' + bars(days, 'day · players')
    # how far players get: best wave buckets
    buckets = [(1, 9), (10, 19), (20, 29), (30, 39), (40, 49), (50, 74), (75, 99), (100, 10 ** 6)]
    bests = [int(p['m'].get('best') or 0) for p in players.values()]
    out += '<h2>How far players get (best wave)</h2>' + bars(
        [('%d+' % a if b > 10 ** 5 else '%d-%d' % (a, b), sum(1 for x in bests if a <= x <= b)) for a, b in buckets], 'best wave')
    # what kills runs
    kills = defaultdict(int)
    for _, _, d in runs:
        kills[d.get('k') or '?'] += 1
    out += '<h2>How runs end</h2>' + bars(sorted(kills.items(), key=lambda x: -x[1]), 'killer')
    # research
    rc = defaultdict(lambda: defaultdict(int))
    for d in research:
        rc[d.get('k')][int(d.get('lv') or 0)] += 1
    own = defaultdict(int)
    for p in players.values():
        for k, _ in RES:
            if int((p['m'].get('res') or {}).get(k) or 0) > 0:
                own[k] += 1
    out += ('<h2>Bit Theory research</h2><div class="wrap"><table><tr><th>research</th><th class="n">studies started</th>'
            '<th class="n">players with Lv 1+</th><th>started per level</th></tr>' +
            ''.join('<tr><td>%s</td><td class="n">%d</td><td class="n">%d</td><td>%s</td></tr>' % (
                e(n), sum(rc[k].values()), own[k], e(' '.join('L%d:%d' % (lv, c) for lv, c in sorted(rc[k].items()))) or '-')
                for k, n in RES) + '</table></div>')
    fc = defaultdict(int)
    for d in foundry:
        fc[d.get('k')] += 1
    out += '<h2>Foundry upgrades bought</h2>' + bars([(n, fc[k]) for k, n in UPS], 'upgrade')
    # players table
    rows = sorted(players.values(), key=lambda p: -p['last'])[:300]
    out += ('<h2>Players (latest 300)</h2><div class="wrap"><table><tr><th>player</th><th>last seen</th><th>first seen</th>'
            '<th class="n">best</th><th class="n">runs</th><th class="n">visits</th><th class="n">play time</th><th class="n">bosses</th>'
            '<th>research</th></tr>' + ''.join(
                '<tr><td><a href="/stats/p/%s?env=%s">%s</a></td><td>%s</td><td>%s</td><td class="n">%d</td><td class="n">%d</td><td class="n">%d</td>'
                '<td class="n">%s</td><td class="n">%d</td><td>%s</td></tr>' % (
                    p['pid'], env, p['pid'][:6], ago(p['last'], now), ago(p['first'], now), int(p['m'].get('best') or 0), p['runs'],
                    p['opens'], dur(p['time']), int(p['m'].get('bk') or 0),
                    e(' '.join('%s%d' % (k, int((p['m'].get('res') or {}).get(k) or 0)) for k, _ in RES if int((p['m'].get('res') or {}).get(k) or 0))) or '-')
                for p in rows) + '</table></div>')
    return page('Idle Pixel Tower stats', out, env)


def player(env, pid, now=None):
    now = now or time.time()
    with db() as c:
        evs = c.execute('SELECT ts, type, data FROM events WHERE env=? AND pid=? ORDER BY ts DESC LIMIT 500', (env, pid)).fetchall()
    if not evs:
        return None
    rows = []
    m = {}
    for r in evs:
        d = json.loads(r['data'])
        if not m and isinstance(d.get('m'), dict):
            m = d['m']
        t = time.strftime('%Y-%m-%d %H:%M', time.gmtime(r['ts']))
        if r['type'] == 'run':
            what = 'Run: wave %s, %s, %s, +%s chips, %s bosses%s%s' % (
                d.get('w'), d.get('k') or '?', dur(d.get('d')), d.get('c'), d.get('b'),
                ', %sx speed' % d.get('spd') if d.get('spd') and d.get('spd') != 1 else '', ', NEW BEST' if d.get('r') else '')
        elif r['type'] == 'research':
            what = 'Research started: %s Lv %s' % (dict(RES).get(d.get('k'), d.get('k')), d.get('lv'))
        elif r['type'] == 'foundry':
            what = 'Foundry: %s Lv %s (%s chips)' % (dict(UPS).get(d.get('k'), d.get('k')), d.get('lv'), d.get('c'))
        else:
            what = 'Opened the game'
        rows.append('<tr><td>%s</td><td>%s</td></tr>' % (t, e(what)))
    res = m.get('res') or {}
    lv = m.get('lv') or {}
    info = ('<div class="tiles">' + ''.join('<div class="tile"><small>%s</small><b>%s</b></div>' % (a, e(str(b))) for a, b in (
        ('Best wave', m.get('best', 0)), ('Bosses', m.get('bk', 0)), ('Chips', m.get('chips', 0)), ('Cores', m.get('cores', 0)),
        ('Runs', m.get('runs', 0)))) + '</div>'
        '<h2>Research</h2><p>%s</p><h2>Foundry</h2><p>%s</p>' % (
            e(', '.join('%s Lv %s' % (n, res.get(k, 0)) for k, n in RES)), e(', '.join('%s Lv %s' % (n, lv.get(k, 0)) for k, n in UPS))))
    return page('Player %s' % pid[:6], info + '<h2>Activity (newest first, UTC)</h2><div class="wrap"><table>' + ''.join(rows) + '</table></div>', env)


class H(BaseHTTPRequestHandler):
    server_version = 'stats'

    def log_message(self, *a):  # no access log (nginx has one; we don't keep IPs here)
        pass

    def send(self, code, body=b'', ctype='text/plain; charset=utf-8'):
        if isinstance(body, str):
            body = body.encode()
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if urlparse(self.path).path != '/api/e':
            return self.send(404, 'not found')
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0 or n > MAX_BODY:
            return self.send(413, 'too big')
        try:
            ev = json.loads(self.rfile.read(n).decode())
        except Exception:
            return self.send(400, 'bad json')
        if not valid(ev):
            return self.send(400, 'bad event')
        if limited(ev['id']):
            return self.send(429, 'slow down')
        record(ev)
        self.send(204)

    def do_GET(self):
        u = urlparse(self.path)
        env = parse_qs(u.query).get('env', ['live'])[0]
        env = env if env in ENVS else 'live'
        if u.path in ('/stats', '/stats/'):
            return self.send(200, overview(env), 'text/html; charset=utf-8')
        if u.path.startswith('/stats/p/'):
            pid = u.path[len('/stats/p/'):]
            body = player(env, pid) if len(pid) == 16 else None
            return self.send(200, body, 'text/html; charset=utf-8') if body else self.send(404, 'no such player')
        self.send(404, 'not found')


class Server(ThreadingMixIn, HTTPServer):
    daemon_threads = True


def watch_self():
    """Exit when this file changes (after a deploy); systemd (Restart=always) starts the new version."""
    f = os.path.abspath(__file__)
    m0 = os.path.getmtime(f)
    while True:
        time.sleep(20)
        try:
            if os.path.getmtime(f) != m0:
                os._exit(0)
        except OSError:
            pass


if __name__ == '__main__':
    init()
    if '--no-watch' not in sys.argv:
        threading.Thread(target=watch_self, daemon=True).start()
    Server(('127.0.0.1', PORT), H).serve_forever()
