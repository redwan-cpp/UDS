# Running the Uthan Design Studio website

For whoever looks after the site day to day. Sections 1–9 assume no programming knowledge —
if you can fill in a web form, you can do all of it. Sections 10–12 are for when you are
willing to open a terminal, and cover the server the site runs on.

---

## 1. What you can change, and what you cannot

Everything the site **says** is yours: projects, news, team, photography, contact details,
statistics, most section headings. You edit it in a web panel and it appears on the live site
within seconds. No developer, no waiting, no deploy.

What you cannot change from the panel is how the site **looks and works** — the layout, the
typefaces, the colours, how a page is assembled. That lives in code and needs a developer.

---

## 2. Signing in

Go to **https://uthandesignstudio.com/admin** and sign in with your own account.

> **Do not lose this password.** The site cannot email you a reset link — no mail service was
> ever connected — so a forgotten password has to be repaired from the server. Keep it in a
> password manager, and make sure at least two people at the studio can reach it.

To give someone else access: **Studio → Users → Create new**. Give people their own account
rather than sharing one; the panel records who changed what, which is worth having.

---

## 3. How the panel is organised

Down the left are four groups:

| Group | What is in it |
|---|---|
| **Inbox** | Enquiries — every message sent through the contact form |
| **Work** | Projects, Portfolio, Products — the studio's output |
| **Studio** | News, Knowledge, Team, Expertise, Sustainability, Statistics, Collaborators, Careers, Users |
| **Library** | Media — every photograph and drawing used anywhere on the site |
| **Settings** | Categories — the filter labels used across Work |

Beneath them sit three **Globals** — single documents rather than lists:

- **Studio profile** — contact details, address, the footer
- **Navigation** — what appears in the menu
- **Site copy** — headings that recur across several pages

---

## 4. The one thing that catches everybody

**Uploading a photograph does not put it on the website.**

The Library is exactly that — a library. Adding a file makes it *available*. It does not place
it anywhere. To make a photograph appear, open the thing it belongs to — a project, a news
item — and attach it to one of that document's image fields.

The order is always:

1. **Library → Media → Create new.** Upload the file, write the description, save.
2. Open the **project** (or news item) it belongs to.
3. Click its image field — Hero, Gallery, and so on — and pick the file from the library.
4. **Publish.**

If you upload something and then wonder why the site looks unchanged, this is why. Nothing is
broken; the file is sitting in the library waiting to be used.

---

## 4a. Enquiries

Every message sent through the contact form is saved under **Inbox → Enquiries**, newest first,
and emailed to the studio. Replying to that email replies to the person who wrote.

**The panel is the record; the email is a notification.** The enquiry is saved before any
email is attempted, so if a message seems not to have arrived, look in the Inbox before
assuming it was lost. If the Inbox has it but the email never came, the sending account's
settings on the server need attention — see "Turning on email" in `deployment.md`.

The form refuses obvious automated spam and limits each connection to five enquiries every ten
minutes. A real person will never meet either limit.

---

## 5. Image descriptions are required, and that is deliberate

Every file in the Library asks what it shows. You cannot save without answering.

It is read aloud to people using the site with a screen reader, it is what appears if an image
fails to load, and search engines read it too. Describe what is in the picture — "Concrete
stair turning through a double-height void", not "image1".

If an image is purely decorative and the surrounding text already says everything, type a
single space. That is a legitimate answer, but make it a deliberate one.

---

## 6. Draft and Published

Your typing is saved continuously, so nothing is lost if the browser closes. But **the public
site shows only what you have Published.** A draft is private to the panel.

So you can write a project over a week, leave it half-finished, and nobody sees it until you
press Publish. To take something off the site without deleting it, set it back to draft.

---

## 7. Adding a project

The longest job in the panel, so it is worth doing in order.

1. Put the photographs in the Library first (section 4).
2. **Work → Projects → Create new.**
3. Fill in the required fields — the panel will refuse to publish without them:
   - **Title** and **Slug** — the slug is the address: `courtyard-house` becomes
     `/projects/courtyard-house`. Lowercase, hyphens for spaces, no accents.
   - **Location**, **Year**
   - **Category** — more than one is allowed
   - **Status** — completed, in progress, or concept
   - **Summary** — one line, used on cards and in the index
   - **Description** — at least one paragraph. Pressing Enter starts a new paragraph, and so
     does adding a new box; both look the same on the site. Press Enter once, not twice.
   - **Facts** — the information table. **Every row needs both a label and a value.** A row
     with only one half filled blocks publishing with *"Facts 1 > Value — this field is
     required"*. If a save fails and you cannot see why, check here first.
   - **Hero** — the main image
   - **Gallery** — at least one image
4. Optional but useful: Area, Client, Services, Uniqueness, Our concept, Rough work.
5. **Order** controls position — lower numbers first. **Featured** puts it on the homepage.
6. **SEO** (optional) — a different title, description or share picture for Google and for
   links shared on Facebook and LinkedIn. Leave it blank and the title, summary and hero
   are used.
7. **Publish**, then reload the public page a few seconds later.

### Formatting text

Project descriptions, Uniqueness, Our concept, news and Knowledge articles, and product
descriptions can be formatted like Word. **Select some words** and a small toolbar appears:
**bold**, *italic*, underline, strikethrough, subscript and superscript (for m² or CO₂), and a
link button. The keyboard shortcuts work too: Ctrl+B, Ctrl+I, Ctrl+U.

To add a link, select the words, click the link button, and paste the full address including
`https://`. Tick "open in new tab" for links to other websites.

There are no headings, bullet lists, colours or font sizes, on purpose: the site's typography
is fixed so that every page stays consistent. Headings above each section come from
**Settings → Site copy**, which is also where every page title and introduction is edited.

---

## 8. Things to be careful with

- **Deleting a photograph still in use** leaves a blank space wherever it appeared. Check what
  uses it first.
- **Changing a slug changes the address.** Any saved link to the old one stops working.
- **Changing a category's slug** in Settings affects filtering site-wide. Editing its *label*
  is safe; editing the slug is not, unless a developer is doing it with you.
- **Rough work** images are deliberately kept out of image search and do not enlarge. That is
  intentional — they are working drawings, not finished photography.

---

## 9. The projects on the site right now are placeholders

The six published projects are **demonstration content**: invented commissions and clients,
illustrated with licensed photography from Wikimedia Commons taken by other photographers.
They exist so the design could be reviewed before the studio's real work was available.

**They need replacing with real projects before the site honestly represents the studio.**
Until then, the demo notice should be switched back on so visitors are told plainly that these
are examples — it is a one-line change in the code (`IS_DEMO_BUILD` in `src/data/studio.ts`).

The same applies to Products, Team and Sustainability. The contact details and statistics are
real.

---

## 10. The server, in one page

The site runs on a VPS you own, at `160.25.226.194`, reachable as `uthandesignstudio.com`.
Four things run on it:

| What | Job |
|---|---|
| **Caddy** | Answers the internet on 80/443, handles HTTPS, passes requests inward |
| **The app** (`uthan.service`) | Next.js + the Payload CMS, on port 3000, localhost only |
| **PostgreSQL** | The database, localhost only |
| **cron** | Nightly backups, monthly cache clear |

Connect with `ssh uthan@160.25.226.194`. Your SSH key has to be on the server for this to
work — if you have not done that yet, do it before you need it in an emergency.

Most useful commands:

```bash
sudo systemctl status uthan        # is the site running?
sudo systemctl restart uthan       # turn it off and on again
sudo journalctl -u uthan -n 50     # what the app last said
df -h                              # disk space — the usual culprit
free -h                            # memory and swap
```

These things look after themselves and need nothing from you: the app restarts if it crashes
and after a reboot, the HTTPS certificate renews itself, and security updates install
themselves.

---

## 11. Backups — and proving they work

Every night at 3am the server dumps the database and archives every uploaded file, keeps two
weeks locally in `/srv/backups`, and copies both to your Backblaze B2 account, which keeps
them a month.

Check it ran:

```bash
ls -lh /srv/backups
tail -20 /srv/backups/backup.log
rclone ls b2backup:Uthan-bckp
```

> **A backup nobody has restored is not yet a backup.** Nothing here has been restore-tested.
> Worth doing once, deliberately, while nothing is wrong: take a copy of the database dump,
> load it into a scratch database, and confirm the projects are in it. Finding out it does not
> work on the day you need it is the bad version of this.

The credentials the server needs — the database password and the Payload secret — live in
`/srv/uthan/.env` and nowhere else. **If that file is lost and no one has a copy, sessions
break and the database becomes unreadable.** Put both values in the studio's password manager.

---

## 12. Deploying a code change

Content never needs this. Only code does.

```bash
ssh uthan@160.25.226.194
screen -S deploy
cd /srv/uthan
git pull
npm ci
npx payload run scripts/counts.ts
npm run build
sudo systemctl restart uthan
```

Three rules, each learned from something actually going wrong:

- **Run `counts.ts` before the build, every time.** If the update added a field, the database
  needs it before the build reads the CMS, or the build stops with `column … does not exist`.
  `counts.ts` only reads, but starting it is what brings the database structure up to date.
- **If it asks to delete tables or columns, stop.** Run `/srv/uthan/backup.sh`, and only answer
  `y` when you know why that data is going. Additions never ask.
- **If the build fails, do not restart.** The site keeps running the previous version until
  you do. Fix the build first.

Never run `seed.ts` as part of a deploy — it resets content to the original demo data and
undoes edits made in the panel.

The build takes several minutes and a lot of memory. `screen` keeps it running if your
connection drops; reattach with `screen -r deploy`.

Expect images to load slowly for the first few minutes afterwards: the build clears the
resized-image cache, and each photograph is re-optimised the first time someone asks for it.
It settles on its own.

The full technical runbook — how the server was built, every decision, and what to check when
something breaks — is `deployment.md` in the code repository.

---

## 13. When to call a developer

- The site is down and `systemctl restart uthan` did not fix it
- You have lost the admin password, or the `.env` file
- You want a change to layout, design, or a new kind of page
- Something refuses to save and section 7 has not explained it
- You are moving host or changing the domain

Write down somewhere the studio can find it: who that developer is, and where the server,
domain, and Backblaze logins are kept.
