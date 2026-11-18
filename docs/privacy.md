# Privacy

English · [简体中文](privacy.zh-CN.md)

What Lastout records, where it keeps it, what can leave your machine and
how to delete it. Each statement names the command or setting behind it;
if one doesn't hold, tell us.

Lastout is made by Rocha Tech LLC, a company registered in New Jersey,
United States ("we"). What you record never reaches us. What does is
only what buying a license and checking the trial and the license need,
described under *License checks* and *Buying a license*; for that data
we are responsible (the data controller). Questions and requests: support@lastout.dev.

Last updated: 2026-11-18.

## What is recorded

In a terminal set up with `lo setup` (or by the app), for each command:

- the command line as the shell saw it, the working directory and its git
  branch at the time, start and end time, exit status;
- what the command printed to the terminal: the first 1 MB and the last
  4 MB of raw output, compressed. That includes anything the terminal
  echoed while the command ran, such as text you typed at a prompt. Text
  typed at a no-echo prompt (a password) is not echoed, so it is not
  recorded;
- per terminal session: the terminal program's name, the tty and the
  recorder's process id, so `lo` can tell which terminal is which.

Nothing else: no keystrokes outside a command, no screenshots, no file
contents the command did not print, no information about other apps.

## What is not recorded

- **A command starting with a space**: not even its text (the row says
  `(private)`). This is the shell's own convention for "keep out of history".
- **While paused**: `lo pause` (every terminal) or `lo pause --here` (this
  one), optionally `--for 30m`. `lo resume` ends a pause of every
  terminal, `lo resume --here` a pause of this one. Nothing is stored,
  not even the command.
- **Commands that print secrets**: for the built-in list (`op`, `pass`,
  `gopass`, `bw`, `lpass`, `aws configure`, `aws sts`,
  `aws ecr get-login-password`, `gcloud auth`, `az login`,
  `az account get-access-token`, `ssh-keygen`,
  `gpg --export-secret-keys`, `security find-generic-password`,
  `security find-internet-password`, `vault read|kv get|login|token`,
  `kubectl get secret`, `kubectl describe secret`,
  `kubectl config view`, `gh auth token`, `heroku auth:token`,
  `npm token`, `doppler secrets`, `openssl genrsa`, `openssl genpkey`,
  `age-keygen`, `wg genkey`) the command line and exit status are kept,
  not the output, wherever on the line the command sits: in a chain
  (`cd x && op read …`), a pipe or a `$(…)` substitution too. Quoted text
  is not a command. Only recognized formats
  are redacted in the command line too, so a secret typed as a plain
  argument with nothing naming it (`htpasswd -b file user PASSWORD`)
  stays readable, also to an agent: start such a command with a space. Add
  your own with `record.ignore` in the config file, or lift a built-in
  entry with `record.allow`.
- **Terminals you did not set up**: recording only happens where the two
  marked blocks from `lo setup` are in the shell's rc file. `lo setup
  --uninstall` removes them everywhere.

## Where it is kept

| What | Where |
|---|---|
| Recordings (SQLite index + compressed output files) | `~/Library/Application Support/lastout/`, or `$LASTOUT_HOME` |
| Configuration | `~/.config/lastout/config.toml` (`$XDG_CONFIG_HOME` honoured), or `$LASTOUT_CONFIG` |
| App settings (shortcuts, notification threshold) | `~/Library/Preferences/dev.lastout.app.plist` |

The data directory is created with mode 700 (only your user can read
it); `lo doctor` checks that it still is. Retention is automatic: 200
commands per terminal, 30 days, 500 MB in total, after which the oldest
go first.

Saved commands (`lo save`) are a separate, plain-text file you wrote:
`~/.config/lastout/saved.toml` (mode 0600), with how often each one was
used in `saved-usage.tsv` in the data directory. Retention never deletes
them and `lo forget` leaves them; the MCP server doesn't read them, and
the app's diagnostics export only says how many there are. A secret you
save in a command stays in that file as you typed it, and `lo saved`
copies and prints a command as saved, without redaction.

`usage.tsv` in the data directory holds two numbers: how many times output
was copied and how many times an agent read it. `lo stats` prints them;
they never leave your Mac.

## What leaves your machine

Nothing you recorded, ever, on its own. The command-line tools have no
network code. The menu bar app makes two kinds of connection: the update
check, and the license checks (below). Once a day (and when you choose
*Check for Updates…*) it fetches the release list
at `github.com/Xiang-Suc/lastout-releases/releases/latest/download/appcast.xml`
to see whether a newer version exists. That request carries no data
about you or your machine beyond what any download does (Sparkle's
system profiling is off), and an update is installed only after you
agree, and only if its signature matches the key built into the app.
No telemetry, no crash reports, no account. Output leaves the machine
only when you, or a tool you run, ask for it:

- **Copying** (`lo`, the menu bar shortcut, a notification's Copy button)
  puts the rendered output on the clipboard, after redaction. Over
  `lssh`, the clipboard is still the local one.
- **Printing** (`lo --print`, `lo --json`) writes it to the terminal, after
  redaction.
- **Agents** (`lo mcp`, the MCP server for Claude Code, Codex and
  others): read-only tools that return rendered output with redaction
  of recognized secrets always on. There is no argument an agent can pass
  to turn it off. The server can't change or delete anything you
  recorded; it only adds one to the read count in `usage.tsv`.
- **Notifications** show the command line and its exit status on your
  screen, through macOS's notification center, nowhere else.
- **License checks**: the app asks Lastout's license server (the
  address is in the app's Info.plist as `LastoutLicenseServer`; it is a
  Cloudflare Worker run by Lastout, its source is private) what this Mac
  may do. At the first launch it starts the 14-day trial there, so that
  the trial runs on the server's clock and each Mac gets one; once you
  enter a license key it activates the key; and while the app runs it
  checks again about every 15 minutes, when the Mac wakes and when the
  network comes back, so that a refunded license stops. Each request
  carries a SHA-256 hash of this Mac's hardware UUID (the UUID itself
  never leaves the Mac), the app's version, and, once you activated one,
  the license key; a 0.3 install's first trial request also carries the
  day it was first launched. *Deactivate on this Mac* sends the key and
  the hash to free the seat. The server answers with a lease it signed:
  what this Mac may do (the trial and when it ends, or the license and
  its seats), valid for a day. For a license, the answer also carries the
  name and email the license was bought with; the app keeps them in your
  keychain and shows them in Settings. The app keeps the lease in your keychain and in
  `lease.json` (readable only by you) in the data directory, where `lo`
  reads it: `lo search`, `lo save`, `lo mcp` and `lssh` need a valid one,
  and `lo` itself still sends nothing. Without the network the app keeps
  working for a day after the last check, then copying waits until a
  check succeeds. Nothing about your recordings goes with any of these
  requests. Like any web request, each check shows your IP address to
  Cloudflare; the license server's code doesn't read or store it. A build
  with no server configured refuses every key and sends nothing.
- **Diagnostics** (Settings → About → *Export…*) writes a zip
  where you choose, for you to attach to a bug report; the app sends it
  nowhere. In it: versions, Lastout's settings, the screens' sizes, the
  `lo doctor` checks, how many terminals are recorded, Lastout's own log
  from the last day and its crash reports from the last 30 days. Your
  home folder shows as `~`, your user name and computer name are
  replaced, and no command line, output or license key is in it.

### Redaction

Redaction masks recognized secrets: it follows the rules below, which
catch known formats, not every secret. It is applied to every copy, print
and agent read, never to what is stored (so `lo forget` exists for a
secret that was printed). Each match becomes a
labelled marker such as `[REDACTED:github-token]`, so an LLM still knows
what was there. Rules: known token formats (GitHub, GitLab, AWS access
keys, Google API keys and OAuth tokens, Stripe keys and webhook secrets,
Slack tokens and webhooks, SendGrid, Twilio, Shopify, npm, PyPI,
DigitalOcean, Hugging Face, Resend, Supabase, Groq, xAI, age secret
keys, JWTs, generic API keys), private key blocks, passwords and tokens
in URLs (`postgres://user:pw@`, `redis://:pw@`, `https://token@`),
authenticator setup keys (`otpauth://` links, a labelled `Setup key:`,
and base32 keys printed in groups of four), `Authorization` headers and
bearer tokens, the values in `Cookie` and `Set-Cookie` headers,
`--password`-style flags (`--token`, `--db-password`, `--passphrase`,
…), the password arguments of `curl -u user:pass` and `curl -b`,
`mysql -p<password>`, `sshpass -p`, `docker login -p`, `redis-cli -a`,
`openssl … pass:`, `aws configure set` and `gh secret set --body`, and
`SECRET=value` assignments (`…_TOKEN`, `…_PASSWORD`, `DB_PASS`,
`MYSQL_PWD`, `SECRET_KEY_BASE`, `AccountKey`, an ALL_CAPS `…_KEY` such
as `APP_KEY`, `API Key:` and `Secret Key:` labels). Your own formats go
in `redact.patterns` (regexes) in the config file.

Not caught today, among others: a secret given as a plain argument with
no flag or label in front (`htpasswd -b file user PASSWORD`), the `sig=`
of a signed Azure URL, the `auth` in Docker's `config.json`,
`client-key-data` in a kubeconfig, a `.netrc` password, `SecretString`
in the output of `aws secretsmanager get-secret-value`, a password
inside escaped JSON, and a lower-case `…_key` in code (`app_key = …`;
`api_key` and `secret_key` are caught). A token written right after
letters, digits or an underscore may not match either. Check before you
paste.

`lo --no-redact` skips redaction for a copy you make yourself; no MCP tool
or setting can. An agent that also has a shell runs as you: it could run
`lo --no-redact` or read the recordings on disk, like any file you own.

## Remote hosts

`lo remote-install host` puts three small shell scripts and one marked
block per rc file on the remote host, no binaries. With `lssh host`, each
remote command's output travels through your own ssh connection to the
recorder on your machine and is stored only there. The remote host keeps
none of the output.

## Deleting

- `lo forget` removes the previous command; `lo forget --id 42` a specific
  one; `lo forget --all` everything. Each deletes the rows and the output
  files and zeroes the deleted rows' bytes in the database. An older copy
  of a command line can stay in unused parts of the database file until
  it is overwritten, so if a password was typed on the command line,
  change the password. `lo forget` does not touch your shell history or
  your backups. What `lo` itself prints (`lo --print`, `--json`) is not
  recorded, so no copy of a forgotten command's output stays behind.
- `lo setup --uninstall` removes Lastout's blocks from every shell's rc
  files (and a login file it created). Open terminals keep running as they
  are; new ones are plain. Before it changes a file, `lo setup` (and
  `--uninstall`) keeps a copy next to it, named `.lastout-backup-*`;
  only `lo uninstall` removes those copies.
- To remove Lastout from this Mac: `lo uninstall` lists what it will
  remove and asks once: Lastout's blocks in your rc files,
  `~/Library/Application Support/lastout/` (the recordings, deleted, not
  moved to the Trash), `~/.config/lastout/` (the config and your saved
  commands), `~/Library/Preferences/dev.lastout.app.plist`,
  `~/Library/Caches/dev.lastout.app`,
  `~/Library/HTTPStorages/dev.lastout.app` and
  `dev.lastout.app.binarycookies` beside it, the license record in your
  keychain, `lo` and `lastout-shell` from `~/.local/bin`, the older
  `.lastout-backup-*` copies next to your rc files (it keeps the one it
  makes), and the app, which goes to the Trash with Open at Login turned
  off first (installed with Homebrew, `brew uninstall --zap --cask
  lastout` removes it). On a Mac that holds one of your license's seats,
  or may hold one, it first asks you to choose *Deactivate on this Mac*
  in the app. Lastout does not encrypt recordings and does not
  exclude them from Time Machine, so backups you already made keep their
  copies. The license server keeps this Mac's trial record (the hash
  described under *License checks*), so installing again doesn't start a
  new trial.
- Saved commands: `lo saved --rm ID`, or delete the file (`lo saved --path`).

## The menu bar app

It asks for one permission, notifications, when it starts; it works
without them (the menu and shortcuts don't need them). If you turn on
*Copy from the exact window in front* in Settings, Lastout asks Terminal
or iTerm2 which window is in front (macOS may ask you to allow that); it
reads only that window's terminal device name. "Open at login" is on unless you
untick it during Set Up; you can change it in Settings any time. It needs
no accessibility, screen recording
or input monitoring permission. Its only network connections are the
update check and the license checks, both described above.

Its overlays (the island, the bubble, the side dock, the copy
confirmations, the picker) are marked to stay out of screenshots, screen
recordings and screen sharing, so you see them and the people watching
your screen usually don't. That is a request to macOS, and whether a
given screenshot, recording or sharing app honors it depends on the app
and the macOS version; we haven't tested them all. Before you share your
screen, check that they don't show. The island, the bubble and the side
dock also step aside while a video app, Keynote, PowerPoint or a game
fills the screen. To tell, Lastout looks at which apps have windows on
screen and where (macOS lists that without any permission; window titles
and contents are not read, and nothing is kept), and at the category an
app gives itself. Full-screen browsers, editors and terminals keep the
overlays, a video full screen in a browser too. Staying out of captures
and stepping aside are both on by default and can be turned off in
Settings → Appearance (to record a demo of Lastout, say).

## Buying a license

Paddle.com Market Ltd ("Paddle") sells Lastout licenses as merchant of
record: it runs the checkout, takes the payment, charges sales tax or
VAT, sends the receipt and handles refunds. What you enter at checkout
(your email, country and payment details) goes to Paddle, under
[Paddle's privacy policy](https://www.paddle.com/legal/privacy). We
never see your card or bank details.

When a purchase completes, Paddle notifies Lastout's license server
(`license.lastout.dev`), which keeps, for each license:

- your name and email, Paddle's customer and transaction IDs, the
  license key and the date it was issued;
- for each Mac it is activated on: the hash described under *License
  checks* above, the app version, when it was activated and the last
  day it checked in (noted at most once a day). When the seat is freed,
  only the hash stays with the key, so that a refund still ends that
  Mac's trial;
- whether the key was revoked, and why (a refund or a chargeback).

For each Mac that starts the trial, it keeps the same hash, when the
trial started and ends, the first and latest app versions and the last
day it checked in, whether or not you buy.

That is used to email you the key, to show it once more on the page you
land on after checkout (for 24 hours), to count the Macs a key is used
on, to give each Mac one trial, and to stop a refunded key on the Macs
it was activated on: once the refund is issued, the app there stops
copying and `lo` stops its paid commands, within about 15 minutes on a
Mac that is online with Lastout running and at most a day later on any
other. A refund also ends the trial of those Macs. Apart from replies when
you write to us, the email with your key is the only one we send: there
is no newsletter or marketing list. If you enter your email at checkout
and don't finish the purchase, Paddle may send you one reminder; that
email is Paddle's, under Paddle's privacy policy, not ours. As the seller on Paddle we can also
see your order in Paddle's dashboard: what was bought, when, for how
much, your country and email.

You can also buy directly from us, for example after contacting us
through a marketplace or a messaging app. Then no checkout is involved:
you pay us with the method we agreed on, under that payment provider's
own privacy policy, and we enter the license ourselves. For it the
license server keeps your name, the email or other contact you gave us
(a messaging-app ID, say), where you found us, the amount, currency and
date of the payment, any refund we made, and notes we write about the
order, along with the key and the Mac hashes as above. That is used to
send you the key, answer you and handle a refund; the key email above
is never sent for it.

We read and change license records in an admin dashboard
(`admin.lastout.dev`) that only we can sign in to, with a password and
a one-time code; it runs on Cloudflare next to the license server and
keeps a log of what was changed in it.

The license record is kept as long as the license exists, since a key
can't be checked without it; a trial record as long as Lastout sells
licenses, since a Mac gets one trial. It is stored with Cloudflare, and your
name, email and key pass through Resend to deliver the key; both, like
Paddle, may process it outside your country, including in the United
States. Only we hold a login to the database; Cloudflare hosts it. The
app and the website reach the server over HTTPS.

## The website

lastout.dev is a set of static pages served by GitHub Pages. It sets no
cookies of its own and has no tracking pixels or ads. It counts visits
with Cloudflare Web Analytics: the product page, the known-issues page
and the legal pages (this one included) load a script from Cloudflare
(`static.cloudflareinsights.com`), which reports which page was opened,
the site you came from and how fast the page loaded. From the request
Cloudflare also derives the browser, operating system, device type and
country; like any request, it shows Cloudflare your IP address.
Cloudflare states that the script uses no cookies or other storage in
your browser, and that it doesn't fingerprint visitors or record query
strings. We see totals only (pages, referring sites, countries,
browsers), not individual visitors. The script isn't loaded, so the
visit isn't counted, when your browser sends Global Privacy Control or
Do Not Track, when you arrive through a payment link from Paddle, or on
the pages that handle your order or key (`thanks.html`,
`activate.html`). The same pages also count visits for us, on our
license server (`license.lastout.dev`, at Cloudflare): when a page
opens, when you press *Download* or *Buy*, and when you play the film,
the page sends which of these it was, the page, the campaign tag in
the link (or else the site you came from), the page's language and
whether you're on a Mac. From the request the server takes your
country and, to count each visitor once a day, an irreversible digest
of your IP address, browser and the date, made with a secret key only our
server holds; the digests are deleted the next day and your IP address
isn't stored. What we keep are daily totals. This count isn't sent in
the cases above where Cloudflare's script isn't loaded. To credit a
download to the link you arrived by, the page keeps where the tab came
from in your browser's session storage, which is cleared when you
close the tab. Its fonts load from Google Fonts. The film on the product page is a file
on lastout.dev itself, fetched only when you press play. The product page loads Paddle's
checkout script (Paddle.js) when you point at *Buy*, focus it or press
it (a touch on it counts), when you arrive through a payment link from
Paddle, or when you come back to the page within two hours of starting a
payment there; not when the page simply opens, so that *Buy* can open Paddle's checkout over the page. Once
loaded, Paddle.js also loads ProfitWell, Paddle's analytics product, and may set Paddle's
cookies. Paddle.js, ProfitWell and the checkout are Paddle's, and
Paddle's privacy and cookie policies apply to them. Each time it opens, the product page also asks GitHub's API
(`api.github.com`) for the latest release, so that *Download* points at
the current file; like any request, that shows GitHub your IP address.
The file itself comes from GitHub, or from the download mirror
(`dl.lastout.dev`, a storage bucket at Cloudflare) when you use the
mirror link or when GitHub's API didn't answer and *Download* points
there instead; whichever serves the file sees your IP address.
Once the checkout has named your order, the page asks the license server
about that transaction ID every 5 seconds, for at most 30 minutes, to
take you to your key as soon as the payment is confirmed. After you pay, the
thanks page asks the license server for your key, with the transaction ID
from its address.

## Third parties

- **Paddle** sells the license and processes the payment (above). Its
  script on the product page also loads ProfitWell, its analytics product
  (see *The website*).
- **Cloudflare** runs the license server, its database and the admin
  dashboard, serves the download mirror (`dl.lastout.dev`), forwards
  the mail sent to support@lastout.dev, provides the website's visit
  counts, and keeps our own visit totals in the license server's
  database (see *The website*).
- **Google** (Google Workspace) hosts the mailbox that mail lands in, so
  what you write to us and your address are kept there.
- **Resend** delivers the email with your key.
- **GitHub** hosts the releases the update check reads, and the
  lastout.dev website.
- **Google Fonts** serves the website's fonts.

Each sees what passes through it, under its own privacy policy. Nothing
else: the app embeds no analytics, crash reporting or advertising SDKs
(the Sparkle update framework is open source and reports nothing). We
don't sell your data or share it with anyone else, unless the law
requires us to.

## Your rights

What Lastout records isn't uploaded, and we can't see it: it is under
your control with the commands above. For the license record we keep, write
to support@lastout.dev to get a copy, correct it or delete it. Once it
is deleted the key stops working on every Mac within a day, because the
app checks it again; deleting a Mac's trial record gives it a new trial. Paddle keeps its own
record of the order, as tax law requires: ask Paddle, or ask us and
we'll pass the request on. Depending on where you live (in the EU, the
UK or California, for example) you may have further rights, such as to
object or to complain to a data protection authority.

We use the license and trial records because we need them to deliver
what you bought or are trying (for EU and UK law, the legal basis is
performing our contract with you: the EULA's trial and license terms).

## Changes

When what Lastout does with data changes, this page changes before the
release that does it ships, and the date at the top changes with it.
