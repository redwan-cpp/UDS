# DEPLOYMENT — BDIX VPS

**Status:** Written 2026-09-06, not yet executed.
**Target:** BDIX VPS, 2 vCPU / 4 GB RAM / 20 GB NVMe, Ubuntu 24.04 LTS.
**Written for:** a first deployment, from a Windows machine, using Git Bash.

Follow this top to bottom. Do not skip ahead — several steps only work because an earlier
one has been done.

Every step has the same shape:

> **What this does** — why the step exists, in plain terms.
> The command.
> **You should see** — how to know it worked.
> **If it goes wrong** — the likely cause and the fix.

If a step's "you should see" does not match what you get, **stop and fix it before
continuing.** Carrying a broken step forward is how a two-hour job becomes a two-day one.

---

## 1. What you are building

Right now the site runs on your laptop. `npm run dev` starts it, and it disappears when you
close the terminal. Deployment means putting the same thing on a computer that never turns
off, with a domain name pointing at it.

Six pieces have to end up on that computer:

| Piece | What it is | Why |
|---|---|---|
| **Ubuntu** | The operating system on the server | What everything else runs on |
| **Node.js** | Runs JavaScript outside a browser | Your Next.js site is a Node program |
| **PostgreSQL** | The database | Where the CMS keeps projects, news, media records |
| **Your app** | This repository, built | The actual site and admin panel |
| **systemd** | Ubuntu's service manager | Restarts the app if it crashes or the server reboots |
| **Caddy** | A web server in front of your app | Handles `https://`, gets the certificate, renews it |

The request path once it is all running:

```
visitor → Caddy (port 443, https) → your app (port 3000) → PostgreSQL
```

Caddy is the only thing exposed to the internet. Your app and the database only listen on
the server's own internal address, which is why nobody can reach the database directly.

---

## 2. Every placeholder, and what to put in it

Anything in `CAPITAL_LETTERS_LIKE_THIS` is a placeholder. Do not paste it literally.

| Placeholder | What it is | Where you get it | Example |
|---|---|---|---|
| `YOUR_SERVER_IP` | The server's address on the internet | The email or dashboard from the VPS host, after ordering | `103.108.140.22` |
| `yourdomain.com` | Your domain | Whatever you buy from a registrar | `uthandesignstudio.com` |
| `YOUR_DB_PASSWORD` | Password for the database user | **You invent it.** Generate one — see below | `k9Lm2xQ7vRn4PbTz8Ws3` |
| `YOUR_SERVER_PASSWORD` | The root password | The VPS host emails it to you | — |

**Generate the database password rather than inventing one.** Run this on your own machine
and keep the output somewhere safe:

```bash
node -e "console.log(require('crypto').randomBytes(15).toString('base64url'))"
```

You will need it in exactly two places — Part 6 and Part 7 — and they must match.

Two more values are generated on the server and you never choose them:

- **`PAYLOAD_SECRET`** — signs admin login sessions. A command generates it in Part 7.
- **The TLS certificate** — Caddy obtains it automatically in Part 9.

---

## 3. Before you start

- [ ] VPS ordered: **2 vCPU / 4 GB**, not the 1 vCPU tier. The build needs the headroom.
- [ ] You have `YOUR_SERVER_IP` and the root password from the host.
- [ ] You own a domain and can edit its DNS records.
- [ ] You have about two hours, uninterrupted. Most of it is waiting.

**A domain is the one hard prerequisite.** Certificates are issued to domain names, never to
IP addresses. Without one the site can only be served over plain `http://`, which every
browser marks as "Not secure" — unusable for a studio's public site.

Open **Git Bash** on your machine for everything marked *on your machine*. Ubuntu commands
run inside the SSH session.

---

## 4. When to do this

As soon as you have the domain. You do **not** need to wait for real content — the site
deploys with the current demo content and the studio replaces it through the panel.

The reason not to leave it long: **your content currently exists only on your laptop.**
`uthan.db` is deliberately not in git. Today that costs nothing, because everything in it is
placeholder and `seed.ts` can rebuild it. The day a studio person types a real project into
that panel, your laptop becomes the company's database.

---

## PART 0 — Your own machine

### 0.1 Create an SSH key

> **What this does.** An SSH key is a pair of files: a private one that stays on your
> machine and a public one you give to the server. The server then recognises your computer
> without a password. This is both more convenient and far more secure — passwords can be
> guessed by machines trying thousands a minute; a key cannot.
>
> You do not have one yet — I checked.

*On your machine:*

```bash
ssh-keygen -t ed25519 -C "uthan-deploy"
```

Press **Enter** three times to accept the default location and skip the passphrase.

> **You should see** a "randomart image" box and two new files. Confirm:
>
> ```bash
> ls ~/.ssh/id_ed25519*
> ```
>
> Two files: `id_ed25519` (private — **never share this**) and `id_ed25519.pub` (public —
> safe to share).
>
> **If it goes wrong:** if it asks to overwrite an existing key, say **no** and use the key
> you already have.

---

## PART 1 — First login, and locking the server down

Do this the moment the server exists. A fresh VPS with a root password gets found and
attacked by automated scanners within minutes of coming online. The first job is to stop it
accepting passwords at all.

### 1.1 Log in

*On your machine:*

```bash
ssh root@YOUR_SERVER_IP
```

It asks `Are you sure you want to continue connecting?` — type `yes`. Then paste the root
password from your host. **Nothing appears as you type a password in Linux** — no dots, no
stars. That is normal. Paste and press Enter.

> **You should see** a welcome message ending in a prompt like `root@server:~#`.
>
> **If it goes wrong:**
> - `Connection refused` or timeout → the server is still starting. Wait five minutes.
> - `Permission denied` → wrong password. Copy it again, carefully, with no trailing space.

### 1.2 Change the root password

> **What this does.** The password your host emailed you has travelled through email and may
> be in their support system. Replace it with one only you know.

```bash
passwd
```

Type a new long password twice. Save it.

### 1.3 Create your own user

> **What this does.** Working as `root` means every typo runs with unlimited power. You make
> a normal user, and use `sudo` when you genuinely need admin rights — which makes
> destructive mistakes require a deliberate extra word.

```bash
adduser uthan
```

It asks for a password (set one, save it), then name, room number, phone. Press **Enter**
through all of those — they do not matter.

```bash
usermod -aG sudo uthan
```

> **You should see** no output from the second command. In Linux, silence means success.

### 1.4 Give that user your SSH key

**Open a second Git Bash window on your machine.** Leave the root session open in the first
— that is your way back in if something goes wrong.

*In the new window, on your machine:*

```bash
ssh-copy-id uthan@YOUR_SERVER_IP
```

Enter the password you just set for `uthan`.

> **You should see** `Number of key(s) added: 1`.

### 1.5 Prove key login works — before you disable passwords

**This is the step people skip and regret.**

*In the second window:*

```bash
ssh uthan@YOUR_SERVER_IP
```

> **You should see** a prompt like `uthan@server:~$` **with no password asked for.**
>
> **If it asks for a password**, the key did not install. Do not continue to 1.6 — you would
> lock yourself out permanently. Go back to 1.4.

### 1.6 Turn passwords off

Only now, and **only if 1.5 worked**. Do this in the `uthan` session:

```bash
sudo nano /etc/ssh/sshd_config
```

`nano` is a text editor in the terminal. Move with arrow keys — the mouse does nothing.

Press `Ctrl+W`, type `PermitRootLogin`, press Enter to jump to it. Edit these three settings,
removing any leading `#`:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Save and exit: **`Ctrl+O`**, **Enter**, **`Ctrl+X`**.

```bash
sudo systemctl restart ssh
```

> **Test it:** in your third window try `ssh root@YOUR_SERVER_IP`. It should now be refused.
> That is the point. Your `uthan` session keeps working.

### 1.7 Firewall

> **What this does.** Closes every port except the three that must be open: SSH so you can
> log in, and 80/443 for web traffic. Everything else becomes unreachable from the internet.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

> **You should see** a table listing `OpenSSH`, `80/tcp` and `443/tcp` as `ALLOW`.
>
> **`ufw allow OpenSSH` comes first on purpose.** Enabling the firewall without it would cut
> your own connection.

### 1.8 Updates and basic hardening

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y unattended-upgrades fail2ban
sudo systemctl enable --now fail2ban
sudo timedatectl set-timezone Asia/Dhaka
```

> **What these do.** `unattended-upgrades` installs security patches automatically, so the
> server does not rot between your visits. `fail2ban` bans IP addresses that fail login
> repeatedly. The timezone makes log timestamps readable to you.
>
> **You should see** a lot of scrolling text. If it asks about restarting services or keeping
> a config file, accept the defaults.

---

## PART 2 — Swap

> **What this does.** Swap is disk space used as overflow when memory runs out. Building the
> site is the most memory-hungry thing this server ever does. 4 GB is enough, but a swapfile
> costs nothing and turns a possible crash into a slower build.

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

> **You should see** a `Swap:` row showing `4.0Gi` total. The `/etc/fstab` line makes it
> survive a reboot.

---

## PART 3 — Point the domain at the server

> **What this does.** DNS is the phone book of the internet. Right now your domain points
> nowhere. These records make `yourdomain.com` resolve to your server's IP.

At your domain registrar, find **DNS settings** or **DNS records** and add:

| Type | Name / Host | Value | 
|---|---|---|
| `A` | `@` | `YOUR_SERVER_IP` |
| `CNAME` | `www` | `yourdomain.com` |

`@` means the domain itself. Delete any existing `A` record for `@` first — two conflicting
records send visitors to random places.

**Then wait.** DNS changes take anywhere from two minutes to a few hours.

*On your machine:*

```bash
nslookup yourdomain.com
```

> **You should see** an `Address:` line showing `YOUR_SERVER_IP`.
>
> **If it shows something else or nothing**, wait longer and try again. **Do not continue to
> Part 9 until this is right** — Caddy cannot get a certificate until DNS resolves, and
> Let's Encrypt rate-limits repeated failures for an hour.

---

## PART 4 — Install the software

All of this runs in your SSH session as `uthan`.

### 4.1 Node.js

> **What this does.** Installs Node 22. Your site needs Node 20.9 or newer; 22 is the current
> long-term-support release. Ubuntu's own package is too old, so this adds the official
> NodeSource repository first.

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

> **You should see** `v22.something`.

### 4.2 Git and PostgreSQL

```bash
sudo apt install -y git postgresql postgresql-contrib
sudo systemctl status postgresql --no-pager
```

> **You should see** `active` in the status output. Press `q` if it does not return you to
> the prompt.

### 4.3 Caddy

> **What this does.** Caddy is the web server that will sit in front of your app. It gets
> and renews the HTTPS certificate by itself, with no cron job and no reminder in your
> calendar — which is why it is worth preferring over nginx here.

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
caddy version
```

> **You should see** a version like `v2.x.x`.

---

## PART 5 — Create the database

> **What this does.** PostgreSQL is installed but empty. This creates the database your site
> will use, and a user account for it with its own password — so the app can only touch its
> own data.

```bash
sudo -u postgres psql
```

You are now inside the PostgreSQL prompt — it looks like `postgres=#`. These are SQL
commands, and **each must end with a semicolon**.

Replace `YOUR_DB_PASSWORD` with the password you generated in section 2. Keep the quotes.

```sql
CREATE DATABASE uthan;
CREATE USER uthan WITH ENCRYPTED PASSWORD 'YOUR_DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE uthan TO uthan;
\c uthan
GRANT ALL ON SCHEMA public TO uthan;
\q
```

> **You should see** `CREATE DATABASE`, `CREATE ROLE`, `GRANT`, then a line about connecting
> to `uthan`, another `GRANT`, and `\q` returns you to the normal prompt.
>
> **If you get `ERROR: syntax error`** you missed a semicolon. You are still in the prompt —
> retype the line.

Confirm the database is not exposed to the internet:

```bash
sudo ss -tlnp | grep 5432
```

> **You should see** `127.0.0.1:5432`. That means "localhost only".
>
> **If you see `0.0.0.0:5432`** the database is listening to the world. Tell me before
> continuing.

---

## PART 6 — Get the code onto the server

```bash
sudo mkdir -p /srv/uthan
sudo chown uthan:uthan /srv/uthan
cd /srv
git clone https://github.com/redwan-cpp/UDS.git uthan
cd /srv/uthan
ls
```

> **What this does.** `/srv` is the conventional place for served applications. `chown` makes
> your user the owner so you do not need `sudo` for everyday work in it.
>
> **You should see** the project files — `package.json`, `src`, `scripts`, and so on.

---

## PART 7 — Configuration and first build

### 7.1 The environment file

> **What this does.** `.env` holds the three settings that differ between your laptop and
> this server. It is deliberately not in git — it is the one file here you cannot recreate
> from the repository, and it contains secrets.

Generate the session secret and write the file. Run these **one line at a time**, replacing
the two placeholders:

```bash
node -e "console.log('PAYLOAD_SECRET=' + require('crypto').randomBytes(32).toString('hex'))" > .env
```

```bash
echo "DATABASE_URI=postgres://uthan:YOUR_DB_PASSWORD@localhost:5432/uthan" >> .env
```

```bash
echo "NEXT_PUBLIC_SERVER_URL=https://yourdomain.com" >> .env
```

```bash
echo "MEDIA_DIR=/srv/uthan/media" >> .env
```

```bash
chmod 600 .env
cat .env
```

> **What each does.** `PAYLOAD_SECRET` signs admin login sessions — if someone learns it they
> can forge a login, which is why it is generated rather than chosen. `DATABASE_URI` tells
> the app where the database is and how to authenticate. `NEXT_PUBLIC_SERVER_URL` is your
> public address, used for absolute links and for the security settings that reject requests
> from other origins. `MEDIA_DIR` is where uploaded photographs are written — see the note in
> Part 8 for why it has to be spelled out in full. `chmod 600` makes the file readable only
> by you.
>
> **You should see** four lines. Check that line 2 has your real database password and no
> `YOUR_DB_PASSWORD` text left, and line 3 your real domain with `https://` and no trailing
> slash.
>
> **The first `>` writes the file; the later `>>` append to it.** Using `>` twice would
> overwrite. If you get this wrong, delete with `rm .env` and start 7.1 again.

### 7.2 Install and build

```bash
npm ci
```

> **What this does.** Installs the exact dependency versions recorded in
> `package-lock.json`. Takes a few minutes.

```bash
npm run build
```

> **What this does.** Compiles the site and the admin panel into an optimised production
> build. **This is the slow step — five to fifteen minutes.** It is normal for it to sit
> apparently doing nothing.
>
> **You should see** a route table listing `/`, `/about`, `/projects` and so on, and no red
> error text.
>
> **If it is killed** you ran out of memory. Check swap is on with `free -h`.
>
> Worth knowing: **this is the last time build speed matters much.** Editing content in the
> panel never requires a rebuild — saving revalidates the affected pages directly. Only code
> changes need this.

### 7.3 Load the content

```bash
npx payload run scripts/seed.ts
```

> **What this does.** Creates the database tables and loads the current demo content — 6
> projects, 12 portfolio entries, the studio profile, the media library.
>
> **You should see** a table ending in `media files 35`.

```bash
npx payload run scripts/counts.ts
```

> **You should see** `total 98` or similar, and `no duplicates`.

---

## PART 8 — Run it as a service

> **What this does.** systemd is Ubuntu's service manager. Registering the app means it
> starts on boot and restarts automatically if it crashes — so a reboot at 3am does not take
> the site down until you notice.

```bash
sudo nano /etc/systemd/system/uthan.service
```

Paste this **exactly** — no placeholders to replace:

```ini
[Unit]
Description=Uthan Design Studio
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=uthan
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

Save with `Ctrl+O`, Enter, `Ctrl+X`.

> **Why `MEDIA_DIR` had to be an absolute path.** Next's standalone server changes its own
> working directory to `.next/standalone` when it starts — it does this regardless of what
> `WorkingDirectory` above says. So a relative uploads path would resolve *inside the build
> output*, and every deploy would delete the studio's photographs. Found by running the
> standalone build rather than by reading it: an earlier version of this runbook would have
> lost your uploads on the second deploy.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now uthan
sudo systemctl status uthan --no-pager
```

> **You should see** `active (running)` in green.

```bash
curl -I http://localhost:3000
```

> **You should see** `HTTP/1.1 200 OK`.
>
> **If it goes wrong**, read the log before changing anything:
>
> ```bash
> sudo journalctl -u uthan -n 50 --no-pager
> ```

---

## PART 9 — HTTPS

**Only do this once `nslookup` in Part 3 returns your server's IP.**

```bash
sudo nano /etc/caddy/Caddyfile
```

Delete everything in the file (`Ctrl+K` repeatedly holds down the delete-line key), then
paste this, replacing both domains:

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

> **What this does.** `reverse_proxy` passes requests to your app. `encode` compresses
> responses. The `header` block sets three security headers — forcing HTTPS on return
> visits, stopping browsers guessing file types, and limiting what referrer information
> leaks to other sites.

```bash
sudo systemctl reload caddy
sudo systemctl status caddy --no-pager
```

Now open **`https://yourdomain.com`** in a browser.

> **You should see** your site, with a padlock in the address bar. **The first load can take
> ten seconds** — that is Caddy fetching the certificate. Reloads are instant.
>
> **If the browser warns about the certificate**, DNS is not fully propagated. Wait, then
> `sudo systemctl reload caddy`.
>
> **If you see a Caddy error page**, the app is not answering. `sudo systemctl status uthan`.

---

## PART 10 — After it is live

### 10.1 Create the admin account

Go to `https://yourdomain.com/admin`.

Because this is a brand new database, Payload shows a **create first user** screen.

> **Use a strong password.** This account can change everything the site says about the
> studio. Not the one from local development, and not `12345678`.

### 10.2 Test the one thing that could not be tested locally

On-demand revalidation — content edits appearing without a rebuild — was built but never
proven end to end, because proving it needs a real production build and a real save. **This
is that test.**

1. Open `https://yourdomain.com/projects/courtyard-house` and note the title.
2. In `/admin`, open that project, change the title, and save.
3. Reload the public page. **Do not rebuild anything.**

> **You should see** the new title within a second or two.
>
> **If the old title persists**, tell me. The hooks are registered on all collections but the
> production cache path is unverified, and this is where it either works or does not.

### 10.3 Backups — do not skip this

A 20 GB server with no backup is one disk failure from losing everything the studio writes.

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
find /srv/backups -type f -mtime +14 -delete
```

> **The last line matters.** It deletes copies older than two weeks. Without it, backups
> eventually fill the disk and take the site down — a backup that causes an outage is not a
> backup.

```bash
chmod +x /srv/uthan/backup.sh
/srv/uthan/backup.sh
ls -lh /srv/backups
```

> It will ask for the database password. To let cron run it unattended, store it:
>
> ```bash
> echo "localhost:5432:uthan:uthan:YOUR_DB_PASSWORD" > ~/.pgpass
> chmod 600 ~/.pgpass
> ```
>
> **You should see** two files, a `.sql.gz` and a `.tar.gz`.

Schedule it nightly:

```bash
crontab -e
```

Choose `1` for nano if asked, then add at the bottom:

```
0 3 * * * /srv/uthan/backup.sh >> /srv/backups/backup.log 2>&1
0 4 1 * * rm -rf /srv/uthan/.next/cache/images/* && sudo systemctl restart uthan
```

> The second line clears the optimised-image cache monthly. Next generates a file per image
> per size — 18 photos already produce 304 files locally — and it grows without limit.

### 10.4 Copy backups off the server

**A backup on the same disk as the thing it protects is not a backup.** You do not have
`rsync` on Windows, so use `scp`. Weekly is enough to start.

*On your machine:*

```bash
mkdir -p ~/uthan-backups
scp uthan@YOUR_SERVER_IP:/srv/backups/*.gz ~/uthan-backups/
```

---

## 11. Deploying a code change, from now on

```bash
ssh uthan@YOUR_SERVER_IP
cd /srv/uthan
git pull
npm ci
npm run build
sudo systemctl restart uthan
```

**This is for code only.** Content is edited in the panel and appears without any of this.

---

## 12. Known gaps at handover

| Gap | What it means | When it starts to matter |
|---|---|---|
| No email adapter | "Forgot password" writes to the server log instead of sending an email | The day a studio person has their own account |
| No staging site | Code changes go from your laptop straight to the live site | When a broken deploy would embarrass someone |
| Backups are on the server until you copy them | A disk failure loses everything since your last `scp` | Immediately — do 10.4 |
| BDIX is local-first | Overseas visitors get slower international routing than the old Vercel site | If the studio courts foreign clients |

---

## 13. If something breaks

Read the logs first. Almost every problem names itself.

```bash
sudo journalctl -u uthan -n 100 --no-pager    # the app
sudo journalctl -u caddy -n 50 --no-pager     # https and proxying
sudo systemctl status postgresql --no-pager   # database
df -h                                         # disk space — the usual culprit
free -h                                       # memory and swap
```

| Symptom | Likely cause | Fix |
|---|---|---|
| `502 Bad Gateway` | The app is not running | `sudo systemctl restart uthan`, then read its log |
| Certificate warning | DNS not resolving yet | `nslookup yourdomain.com`, wait, `sudo systemctl reload caddy` |
| Build killed | Out of memory | `free -h` — confirm swap is active (Part 2) |
| Panel loads, no content | Seed did not run, or ran against a different database | `cat .env`, then `npx payload run scripts/counts.ts` |
| `permission denied` | Command needs admin | Put `sudo` in front |
| Site slow on first visit | Pages regenerating after a restart | Normal. Persists after several reloads? Tell me. |

**When you are stuck:** copy the last 30 lines of the relevant log and send them to me.
Guessing at a fix without the log is how a small problem becomes a rebuild.

---

## 14. Command glossary

| Command | What it means |
|---|---|
| `sudo` | Run this as administrator |
| `nano FILE` | Open a text editor. `Ctrl+O` Enter saves, `Ctrl+X` exits |
| `systemctl status X` | Is service X running? |
| `systemctl restart X` | Stop and start service X |
| `journalctl -u X` | Show the logs for service X |
| `ls` / `cd` | List files / change directory |
| `cat FILE` | Print a file to the screen |
| `chmod 600 FILE` | Make a file readable only by its owner |
| `q` | Leave a paged output that will not return to the prompt |
| `Ctrl+C` | Stop whatever is currently running |
