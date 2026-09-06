# DEPLOYMENT — BDIX VPS

**Status:** Written 2026-09-06, not yet executed.
**Target:** BDIX VPS, 2 vCPU / 4 GB RAM / 20 GB NVMe, Ubuntu 24.04 LTS.

This is a runbook, not a reference. Follow it top to bottom the first time. Every command
is meant to be pasted as written unless it is marked `← replace this`.

---

## Why this host

BDIX peering keeps traffic between the server and Bangladeshi ISPs inside the local
exchange. For a Dhaka studio whose clients are local that is worth more than a global CDN:
roughly 10 ms instead of a round trip to Singapore, and on many local ISPs BDIX traffic does
not count against the visitor's data cap.

The trade, stated plainly so nobody is surprised later: **overseas visitors get ordinary
international routing and will be slower than the old Vercel deployment.** If the studio
starts courting foreign clients, revisit this.

A VPS also removes two problems serverless hosting had forced:

| On Vercel | Here |
|---|---|
| No persistent disk, so uploads needed blob storage | `media/` is a real directory. No blob storage. |
| Filesystem wiped per invocation, so Postgres was mandatory | Postgres by choice, for backups and concurrent editors. |
| Cache lived per invocation | Long-running Node, so `revalidatePath` genuinely works |

---

## When to do this

**Do it once you own a domain name.** That is the only hard prerequisite — TLS certificates
are issued against a domain, and a site served over plain HTTP or a self-signed certificate
on an IP address will be flagged as unsafe by every browser.

Everything else can follow. In particular you do **not** need to wait for:

- Real content. The site seeds with the current demo content and the studio replaces it
  through the panel afterwards.
- The email adapter. Password reset writes to the server log until it is wired, which is
  survivable while you are the only editor. It stops being survivable the day a studio
  person gets an account — see *Known gaps* at the end.

There is a reason not to leave it much longer: **your content currently exists only on one
laptop.** `uthan.db` is gitignored, so the day the studio types a real project into the
panel, a laptop becomes the database. Better to have a real one before that day.

---

## Before you start

Have these to hand:

- [ ] The VPS: **2 vCPU / 4 GB**, not the 1 vCPU tier. The build needs the headroom.
- [ ] Root password and IPv4 address from the host.
- [ ] A domain name, with access to its DNS records.
- [ ] An SSH key pair on your machine. If you do not have one:
      `ssh-keygen -t ed25519 -C "uthan-deploy"`

**I do the code changes first.** Before Part 5 will work, the repository needs the Postgres
adapter, `output: "standalone"`, a systemd unit and a deploy script. Ask me for those and
they will be on `main` before you reach that step. Parts 1–4 can be done now regardless.

---

## Part 1 — First contact, and locking the box down

Do this immediately. A fresh VPS with a root password is scanned within minutes of coming
online, and the first thing to fix is that it accepts passwords at all.

```bash
ssh root@YOUR_SERVER_IP          # ← replace this
```

Change the root password to something long, then create the account you will actually use:

```bash
passwd
adduser uthan
usermod -aG sudo uthan
```

Now install your SSH key for that user. **From your own machine**, in a second terminal:

```bash
ssh-copy-id uthan@YOUR_SERVER_IP     # ← replace this
```

Confirm it works — open a third terminal and `ssh uthan@YOUR_SERVER_IP`. **Do not close
your root session until that succeeds.** Locking yourself out of a box you cannot get back
into is the classic first-day mistake, and the open root session is your way back.

With key login proven, turn passwords off:

```bash
sudo nano /etc/ssh/sshd_config
```

Set these three lines (they exist already, usually commented out):

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

```bash
sudo systemctl restart ssh
```

Firewall — only SSH and web should be reachable:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

Automatic security updates, so the box does not rot between deploys:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y unattended-upgrades fail2ban
sudo systemctl enable --now fail2ban
sudo timedatectl set-timezone Asia/Dhaka
```

---

## Part 2 — Swap

4 GB of RAM is enough to build, but a swapfile costs nothing and turns a possible
out-of-memory failure into a slow build. NVMe makes it tolerable.

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

---

## Part 3 — DNS

At your domain registrar, point the domain at the box:

| Type | Name | Value |
|---|---|---|
| A | `@` | your IPv4 |
| AAAA | `@` | your IPv6 |
| CNAME | `www` | your domain |

Then wait, and **verify before continuing** — Caddy cannot issue a certificate until DNS
resolves, and a failed issuance has a rate limit:

```bash
dig +short yourdomain.com          # ← replace this
```

It must print your server's IP. If it prints nothing, wait longer.

---

## Part 4 — Software

Node 22, because Next 16 requires Node ≥ 20.9 and 22 is the current LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git postgresql postgresql-contrib
node -v          # expect v22.x
```

Caddy, for TLS. It obtains and renews Let's Encrypt certificates by itself, which is the
whole reason to prefer it over nginx plus certbot here:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

---

## Part 5 — Database

```bash
sudo -u postgres psql
```

Inside the `psql` prompt — **use a real password, not the placeholder**:

```sql
CREATE DATABASE uthan;
CREATE USER uthan WITH ENCRYPTED PASSWORD 'PUT_A_LONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE uthan TO uthan;
\c uthan
GRANT ALL ON SCHEMA public TO uthan;
\q
```

Postgres listens only on localhost by default on Ubuntu, which is what you want — the
database should never be reachable from the internet. Confirm:

```bash
sudo ss -tlnp | grep 5432        # expect 127.0.0.1:5432, not 0.0.0.0:5432
```

---

## Part 6 — The application

```bash
sudo mkdir -p /srv/uthan
sudo chown uthan:uthan /srv/uthan
cd /srv
git clone https://github.com/redwan-cpp/UDS.git uthan
cd /srv/uthan
```

Create the environment file. **Generate the secret, do not invent one** — it signs admin
sessions, and a guessable value is a way into the panel:

```bash
node -e "console.log('PAYLOAD_SECRET=' + require('crypto').randomBytes(32).toString('hex'))" > .env
echo "DATABASE_URI=postgres://uthan:PUT_A_LONG_PASSWORD_HERE@localhost:5432/uthan" >> .env
echo "NEXT_PUBLIC_SERVER_URL=https://yourdomain.com" >> .env
chmod 600 .env
cat .env
```

Check that line two carries the password you actually set and line three your real domain.
`.env` is gitignored and must stay that way — it never gets committed, and it is the one
file on this box you cannot recreate from the repository.

Install, build, and load the content:

```bash
npm ci
npm run build
npx payload run scripts/seed.ts
```

The build takes several minutes on 2 vCPU. That is expected, and it is also the last time
build speed matters much: **content edits do not require a rebuild**, because saving in the
panel revalidates the affected pages directly. Only code changes need one.

---

## Part 7 — Run it as a service

```bash
sudo nano /etc/systemd/system/uthan.service
```

```ini
[Unit]
Description=Uthan Design Studio
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=uthan
# The project root, NOT the standalone directory. Payload resolves the uploads
# directory relative to the working directory, so running from anywhere else
# puts media/ in the wrong place.
WorkingDirectory=/srv/uthan
EnvironmentFile=/srv/uthan/.env
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node .next/standalone/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now uthan
sudo systemctl status uthan
curl -I http://localhost:3000
```

Expect `200 OK`. If not, read the log before changing anything:

```bash
sudo journalctl -u uthan -n 50 --no-pager
```

---

## Part 8 — TLS

```bash
sudo nano /etc/caddy/Caddyfile
```

Replace the whole file with this, substituting your domain:

```
yourdomain.com, www.yourdomain.com {
    reverse_proxy localhost:3000

    encode gzip zstd

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

```bash
sudo systemctl reload caddy
sudo systemctl status caddy
```

Open `https://yourdomain.com`. The certificate is issued on first request, so the very first
load may take a few seconds.

---

## Part 9 — After it is live

### Create the admin account

Go to `https://yourdomain.com/admin`. Because this is a fresh database, Payload shows a
create-first-user screen. **Set a real password** — this account can edit everything the
site says about the studio. Not the one from local development.

### Verify the thing that could not be tested locally

On-demand revalidation was wired but never proven end to end, because proving it needs a
production build and a real save. This is that test:

1. Open a project page and note the title.
2. In `/admin`, change that project's title and save.
3. Reload the page **without rebuilding.**

The new title should appear within a second or two. If it does not, tell me — the hook is
registered on all ten collections but the cache path is unproven, and this is the moment it
either works or does not.

### Backups — do not skip this

A 20 GB VPS with no snapshot is one disk failure away from losing everything the studio has
written. The database is small; the uploads are not.

```bash
mkdir -p /srv/backups
nano /srv/uthan/backup.sh
```

```bash
#!/bin/bash
set -e
STAMP=$(date +%Y%m%d)
pg_dump -U uthan -h localhost uthan | gzip > /srv/backups/db-$STAMP.sql.gz
tar czf /srv/backups/media-$STAMP.tar.gz -C /srv/uthan media
# Two weeks of history. Older copies are deleted so backups cannot fill the disk
# and take the site down — a backup that causes an outage is not a backup.
find /srv/backups -type f -mtime +14 -delete
```

```bash
chmod +x /srv/uthan/backup.sh
crontab -e
```

Add:

```
0 3 * * * /srv/uthan/backup.sh >> /srv/backups/backup.log 2>&1
```

**Then copy them off the box.** A backup on the same disk as the thing it protects is not a
backup. Once a week is enough to start:

```bash
# from your own machine
rsync -avz uthan@YOUR_SERVER_IP:/srv/backups/ ~/uthan-backups/
```

### Keep the image cache from eating the disk

Next caches every optimised image variant. 18 source photos already produce 304 files
locally, so this grows faster than it looks. Monthly:

```
0 4 1 * * rm -rf /srv/uthan/.next/cache/images/* && systemctl restart uthan
```

---

## Deploying a change, from now on

```bash
cd /srv/uthan
git pull
npm ci
npm run build
sudo systemctl restart uthan
```

That is for **code** changes only. Content is edited in the panel and appears without any of
this.

---

## Known gaps at handover

| Gap | Impact | When it matters |
|---|---|---|
| No email adapter | Password reset writes to the server log instead of sending | The day a studio person gets their own account |
| No staging environment | Code changes are tested locally, then go straight to production | When a broken deploy would embarrass someone |
| Backups are local until you rsync | A disk failure loses everything since the last copy | Immediately — do the weekly copy |

---

## If something breaks

```bash
sudo journalctl -u uthan -n 100 --no-pager   # app log
sudo journalctl -u caddy -n 50 --no-pager    # TLS and proxy
sudo systemctl status postgresql             # database
df -h                                        # disk — the usual culprit
free -h                                      # memory
```

**Site returns 502** — the app is not running. `sudo systemctl restart uthan`, then read the
app log.

**Certificate will not issue** — DNS is not resolving to this box yet. Check with
`dig +short yourdomain.com` and wait.

**Build is killed** — out of memory. Confirm the swapfile is active with `free -h`.

**Panel loads but has no content** — the seed has not run, or it ran against a different
database. Check `.env` and run `npx payload run scripts/counts.ts`.
