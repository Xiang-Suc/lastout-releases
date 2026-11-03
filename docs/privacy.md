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

Last updated: 2026-11-01.

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
  not the output. This looks only at the start of the command: in a chain
  (`cd x && op read …`) the output is recorded. Add your own with
  `record.ignore` in the config file, or lift a built-in entry with
  `record.allow`.
- **Terminals you did not set up**: recording only happens where the two
  marked blocks from `lo setup` are in the shell's rc file. `lo setup
  --uninstall` removes them everywhere.

## Where it is kept

| What | Where |
|---|---|
| Recordings (SQLite index + compressed output files) | macOS: `~/Library/Application Support/lastout/`; Linux: `$XDG_DATA_HOME/lastout/` (default `~/.local/share/lastout/`); or `$LASTOUT_HOME` |
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
  to turn it off, and
  nothing the server can write or delete.
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
  its seats), valid for a day. The app keeps it in your keychain and in
  `lease.json` (readable only by you) in the data directory, where `lo`
  reads it: `lo search`, `lo save`, `lo mcp` and `lssh` need a valid one,
  and `lo` itself still sends nothing. Without the network the app keeps
  working for a day after the last check, then copying waits until a
  check succeeds. Nothing about your recordings goes with any of these
  requests. Like any web request, each check shows your IP address to
  Cloudflare; the license server's code doesn't read or store it. A build
  with no server configured refuses every key and sends nothing.
- **Diagnostics** (Settings → About → *Export Diagnostics…*) writes a zip
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
keys, Google, Stripe, Slack tokens and webhooks, SendGrid, Twilio,
Shopify, npm, PyPI, DigitalOcean, Hugging Face, JWTs, generic API keys),
private key blocks, passwords in URLs, authenticator setup keys
(`otpauth://` links, a labelled `Setup key:`, and base32 keys printed in
groups of four), `Authorization` headers and bearer tokens,
`--password`-style flags, `SECRET=value` assignments. Your own
formats go in `redact.patterns` (regexes) in the config file.

Not caught today: `curl -u user:pass`, `mysql -p<password>`, `sshpass -p`,
`Cookie` headers, `DB_PASS=`. Check before you paste.

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
  your backups. A copy you printed with `lo --print` or `--json` is its
  own command, and plain `lo forget` skips it: remove it with
  `lo forget --id N`.
- `lo setup --uninstall` removes Lastout's blocks from every shell's rc
  files (and a login file it created). Open terminals keep running as they
  are; new ones are plain. Before it changes a file, `lo setup` (and
  `--uninstall`) keeps a copy next to it, named `.lastout-backup-*`;
  nothing removes those copies.
- To remove Lastout from this Mac: run `lo setup --uninstall` first, then
  delete `~/Library/Application Support/lastout/`, `~/.config/lastout/`,
  `~/Library/Preferences/dev.lastout.app.plist`,
  `~/Library/Caches/dev.lastout.app`,
  `~/Library/HTTPStorages/dev.lastout.app` and
  `dev.lastout.app.binarycookies` beside it, the app from
  `/Applications`, `lo` and `lastout-shell` from `~/.local/bin`, and the
  `.lastout-backup-*` copies next to your rc files. Remove the license
  from your keychain with
  `security delete-generic-password -s dev.lastout.app -a license`. The
  Homebrew cask's `zap` removes only your recordings and the app's
  settings, not the rest of this list. Lastout does not encrypt
  recordings and does not exclude them from Time Machine, so backups you
  already made keep their copies.
- Saved commands: `lo saved --rm ID`, or delete the file (`lo saved --path`).

## The menu bar app

It asks for one permission, notifications, when it starts; it works
without them (the menu and shortcuts don't need them). If you turn on
*Copy from the exact window in front* in Settings, macOS also asks once
to let Lastout ask Terminal or iTerm2 which window is in front; it reads
only that window's terminal device name. "Open at login" is off until
you turn it on in Settings. It needs no accessibility, screen recording
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
cookies of its own and has no analytics, tracking pixels or ads of its
own. Its fonts load from Google Fonts. The product page loads Paddle's
checkout script (Paddle.js) as soon as it opens, so that *Buy* can open
Paddle's checkout over the page. The page loads Paddle.js, which also
loads ProfitWell, Paddle's analytics product, and may set Paddle's
cookies. Paddle.js, ProfitWell and the checkout are Paddle's, and
Paddle's privacy and cookie policies apply to them. After you pay, the
thanks page asks the license server for your key, with the transaction ID
from its address.

## Third parties

- **Paddle** sells the license and processes the payment (above). Its
  script on the product page also loads ProfitWell, its analytics product
  (see *The website*).
- **Cloudflare** runs the license server, its database and the admin
  dashboard, and forwards the mail sent to support@lastout.dev.
- **Google** (Google Workspace) hosts the mailbox that mail lands in, so
  what you write to us and your address are kept there.
- **Resend** delivers the email with your key.
- **GitHub** hosts the releases the update check reads, and the
  lastout.dev website.
- **Google Fonts** serves the website's fonts.

Each sees what passes through it, under its own privacy policy. Nothing
else: Lastout embeds no analytics, crash reporting or advertising SDKs
(the Sparkle update framework is open source and reports nothing). We
don't sell your data or share it with anyone else, unless the law
requires us to.

## Your rights

What Lastout records stays on your Mac, under your control with the
commands above; we can't see it. For the license record we keep, write
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
