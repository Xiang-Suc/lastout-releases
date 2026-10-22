# Privacy

English · [简体中文](privacy.zh-CN.md)

What Lastout records, where it keeps it, what can leave your machine and
how to delete it. Every statement here is checked against the code, and
names the command or setting that enforces it.

Lastout is made by Rocha Tech LLC, a company registered in New Jersey,
United States ("we"). What you record never reaches us. What does is
only what buying and activating a license needs, described under
*Buying a license*; for that data we are responsible (the data
controller). Questions and requests: support@lastout.dev.

Last updated: 2026-10-21.

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
  one), optionally `--for 30m`; `lo resume` ends it early. Nothing is
  stored, not even the command.
- **Commands that print secrets**: for the built-in list (`op`, `pass`,
  `gopass`, `bw`, `lpass`, `aws configure`, `aws sts`, `gcloud auth`,
  `az login`, `ssh-keygen`, `gpg --export-secret-keys`,
  `security find-*-password`, `vault read|kv get|login|token`,
  `kubectl get secret`, `kubectl config view`, `gh auth token`,
  `heroku auth:token`, `npm token`, `doppler secrets`, `openssl genrsa`,
  `openssl genpkey`, `age-keygen`, `wg genkey`, and more in
  `crates/lastout-core/src/config.rs`) only the command line and exit
  status are kept, never the output. Add your own with `record.ignore` in
  the config file, or lift a built-in entry with `record.allow`.
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
check, and activating a license (below). Once a day (and when you choose
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
  always on. There is no argument an agent can pass to turn it off, and
  nothing the server can write or delete.
- **Notifications** show the command line and its exit status on your
  screen, through macOS's notification center, nowhere else.
- **Activation** (a paid version): when you enter a license key, the app
  sends one request to Lastout's license server (the address is in the
  app's Info.plist as `LastoutLicenseServer`; it is a Cloudflare Worker
  run by Lastout, source in `service/`): the key, a SHA-256 hash of this
  Mac's hardware UUID (so a key can count the Macs it is used on; the
  UUID itself never leaves the Mac), and the app's version. The server
  answers with the name and email from the purchase, which the app keeps
  in your keychain. That is the only time it connects, except *Deactivate
  on this Mac*, which sends the key and the same hash once more to free
  the seat. Nothing about your recordings goes with either request, and
  the app never phones home afterwards. A build with no server configured
  refuses every key and sends nothing.
- **Diagnostics** (Settings → About → *Export Diagnostics…*) writes a zip
  where you choose, for you to attach to a bug report; the app sends it
  nowhere. In it: versions, Lastout's settings, the screens' sizes, the
  `lo doctor` checks, how many terminals are recorded, Lastout's own log
  from the last day and its crash reports from the last 30 days. Your
  home folder shows as `~`, your user name and computer name are
  replaced, and no command line, output or license key is in it.

### Redaction

Applied to every copy, print and agent read, never to what is stored (so
`lo forget` exists for a secret that was printed). Each match becomes a
labelled marker such as `[REDACTED:github-token]`, so an LLM still knows
what was there. Rules: known token formats (GitHub, GitLab, AWS access
keys, Google, Stripe, Slack tokens and webhooks, SendGrid, Twilio,
Shopify, npm, PyPI, DigitalOcean, Hugging Face, JWTs, generic API keys),
private key blocks, passwords in URLs, `Authorization` headers and bearer
tokens, `--password`-style flags, `SECRET=value` assignments. Your own
formats go in `redact.patterns` (regexes) in the config file. `lo
--no-redact` skips it for a copy you make yourself; nothing else can.

## Remote hosts

`lo remote-install host` puts three small shell scripts and one marked
block per rc file on the remote host, no binaries. With `lssh host`, each
remote command's output travels through your own ssh connection to the
recorder on your machine and is stored only there. The remote host keeps
nothing.

## Deleting

- `lo forget` removes the previous command; `lo forget --id 42` a specific
  one; `lo forget --all` everything. Each removes the rows, the output
  files and the bytes they occupied in the database file (which is
  vacuumed), so nothing is recoverable from free space.
- `lo setup --uninstall` removes Lastout's blocks from every shell's rc
  files (and a login file it created). Open terminals keep running as they
  are; new ones are plain.
- To remove every trace: the two directories in the table above, the app
  from `/Applications`, and `lo` and `lastout-shell` from `~/.local/bin`.
  The Homebrew cask's `zap` does the same.
- Saved commands: `lo saved --rm ID`, or delete the file (`lo saved --path`).

## The menu bar app

It asks for one permission, notifications, when it starts; it works
without them (the menu and shortcuts don't need them). "Open at login" is off until
you turn it on in Settings. It needs no accessibility, screen recording
or input monitoring permission. Its only network connections are the
update check and license activation, both described above.

While you record or share your screen, its overlays (the island, the
bubble, the side dock, the copy confirmations, the picker) are left out
of what is captured: you still see them, screenshots, recordings and the
people watching your screen don't. The island, the bubble and the side
dock also step aside while a video app, Keynote, PowerPoint or a game
fills the screen. To tell, Lastout looks at which apps have windows on
screen and where (macOS lists that without any permission; window titles
and contents are not read, and nothing is kept), and at the category an
app gives itself. Full-screen browsers, editors and terminals keep the
overlays, a video full screen in a browser too. Both are on by default
and can be turned off in Settings → Appearance (to record a demo of
Lastout, say).

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
- for each Mac it is activated on: the hash described under
  *Activation* above, the app version, and when it was activated;
- whether the key was revoked, and why (a refund or a chargeback).

That is used to email you the key, to show it once more on the page you
land on after checkout (for 24 hours), to count the Macs a key is used
on, and to stop a refunded key from activating. Apart from replies when
you write to us, the email with your key is the only one we send: there
is no newsletter or marketing list. As the seller on Paddle we can also
see your order in Paddle's dashboard: what was bought, when, for how
much, your country and email.

The license record is kept as long as the license exists, since a key
can't be checked without it. It is stored with Cloudflare, and your
email passes through Resend to deliver the key; both, like Paddle, may
process it outside your country, including in the United States. Only
we can read the database; the app and the website reach the server over
HTTPS.

## The website

lastout.dev is a set of static pages served by GitHub Pages. It sets no
cookies of its own and has no analytics, tracking pixels or ads. Its
fonts load from Google Fonts. The product page loads Paddle's checkout
script (Paddle.js) so that *Buy* can open Paddle's checkout over the
page; that checkout is Paddle's, and Paddle's privacy and cookie
policies apply to it. After you pay, the thanks page asks the license
server for your key, with the transaction ID from its address.

## Third parties

- **Paddle** sells the license and processes the payment (above).
- **Cloudflare** runs the license server and its database.
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
is deleted the key can no longer activate a Mac; Macs already activated
keep working, because the app doesn't check again. Paddle keeps its own
record of the order, as tax law requires: ask Paddle, or ask us and
we'll pass the request on. Depending on where you live (in the EU, the
UK or California, for example) you may have further rights, such as to
object or to complain to a data protection authority.

We use the license record because we need it to deliver what you bought
(for EU and UK law, the legal basis is performing our contract with
you).

## Changes

When what Lastout does with data changes, this page changes before the
release that does it ships, and the date at the top changes with it.
