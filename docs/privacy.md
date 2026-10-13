# Privacy

English · [简体中文](privacy.zh-CN.md)

What Lastout records, where it keeps it, what can leave your machine and
how to delete it. Every statement here is checked against the code, and
names the command or setting that enforces it.

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

## What leaves your machine

Nothing you recorded, ever, on its own. The command-line tools have no
network code. The menu bar app makes one kind of connection: once a day
(and when you choose *Check for Updates…*) it fetches the release list
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
- **Activation** (a paid version): the license key you enter is sent to
  the license server to be checked, once; nothing about your recordings
  goes with it. Which server, and its privacy policy, will be named here
  when one is configured; until then the app refuses every key.

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

## The menu bar app

It asks for one permission, notifications, when it starts; it works
without them (the menu and shortcuts don't need them). "Open at login" is off until
you turn it on in Settings. It needs no accessibility, screen recording
or input monitoring permission. Its only network connection is the
update check described above.

## Third parties

GitHub, which hosts the releases the update check reads (their privacy
policy applies to that request, as to any download from them). Nothing
else: Lastout embeds no analytics, crash reporting or advertising SDKs
(the Sparkle update framework is open source and reports nothing). If a
future paid version
needs a one-time license check, what it sends and to whom will be
documented here before it ships.
