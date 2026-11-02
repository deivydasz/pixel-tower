# Stats server

`stats.py` collects anonymous gameplay events from the game and serves a password-protected dashboard.
Python 3.7+ standard library only, SQLite database, about 15 MB of RAM.

- The game (`track()` in index.html) sends `open` (page load), `run` (run ended), `research` (study started) and `foundry` (upgrade bought) events to `POST /api/e`, with a random anonymous player ID. No names, IPs or devices are stored.
- Dashboard: https://idlepixeltower.duckdns.org/stats (basic auth). Player pages at `/stats/p/<id>`. `?env=preview` shows preview-site data.
- Database: `/var/lib/pixel-tower-stats/stats.db`. Back it up with `cp`, read it with `sqlite3`.
- After a deploy changes `stats.py`, the process notices within ~20 s, exits, and systemd starts the new code. nginx snippets need `nginx -t && systemctl reload nginx` after they change.

## One-time setup on the Droplet (as root, one line at a time)

```
python3 --version
mkdir -p /var/lib/pixel-tower-stats && chown www-data:www-data /var/lib/pixel-tower-stats
cp /var/www/pixel-tower/server/pixel-stats.service /etc/systemd/system/ && systemctl daemon-reload && systemctl enable --now pixel-stats
printf 'admin:%s\n' "$(openssl passwd -apr1)" > /etc/nginx/pixel-stats.htpasswd && chown root:www-data /etc/nginx/pixel-stats.htpasswd && chmod 640 /etc/nginx/pixel-stats.htpasswd
cp /etc/nginx/sites-enabled/pixel-tower /root/pixel-tower.nginx.bak5
sed -i '\#access_log /var/log/nginx/pixel-tower.access.log#a\    include /var/www/pixel-tower/server/nginx-api.conf;\n    include /var/www/pixel-tower/server/nginx-stats.conf;' /etc/nginx/sites-enabled/pixel-tower
nginx -t && systemctl reload nginx
```

Check: `systemctl status pixel-stats --no-pager`, then open the dashboard. Service logs: `journalctl -u pixel-stats -n 50`.
