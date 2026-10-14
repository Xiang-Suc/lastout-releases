# Changelog

User-facing changes. Compatibility with other tools, and how each part
of it is tested, is in [docs/compatibility.md](docs/compatibility.md).

## 0.2.0 - 2026-10-13

### Action needed

- Terminals opened before the update keep the old recorder until you open
  a new tab or window: commands run in them show no git branch. Open a
  new tab after updating.
- Screenshots and screen recordings no longer show Lastout's overlays (see
  Added). To record Lastout itself, turn off *Hide from screen recordings
  and shares* in Settings → Appearance first.

### Changed

- Settings is a sidebar of pages (General, Dynamic Island, Shortcuts,
  Recording, Agents, Pass, About) in a resizable window, instead of one
  form that grew with every setting. Every row has an icon and its
  explanation; General opens with live numbers (terminals recorded,
  commands today, data stored) and whether setup checks pass;
  Recording can pause and resume recording, show the data in Finder
  and erase it; Agents says what an agent can read.
- The license is a pass: a terminal window as a card, `lo --pass`
  printing the holder, status (as an exit code), validity, seats and
  serial, the Mac's fingerprint drawn as ssh-keygen draws a key
  (randomart), a Powerline status line; the output types itself in.
  Copy it as an image, save it as PNG, change its color.
- Settings has a toolbar-backed window with room under the window
  buttons, an identity block (recording status) at the top of the
  sidebar and the version at its foot, large sidebar rows, a header
  with each page's purpose, and one readable column of content.
- The git branch shown next to a command is recorded when the command
  starts, by the recorder in the terminal, instead of being read from
  the directory each time it is displayed. It is now the branch the
  command ran on, and the app no longer touches your project folders
  (macOS asked for access to Documents on every build).

### Added

- *Export Diagnostics…* (Settings → About): a zip to attach to a bug
  report, saved where you choose and sent nowhere. It has the versions,
  Lastout's settings, the screens, the `lo doctor` checks, how many
  terminals are recorded, Lastout's log from the last day and its crash
  reports from the last 30 days, with the home folder shown as `~` and
  the user and computer names replaced; no command line, output or
  license key. `Lastout --export-diagnostics PATH.zip` writes the same
  without the dialog. Launch, the presentation chosen, failed copies and
  shortcuts taken by another app are now logged at a level macOS keeps,
  so the log has something to say.
- Recording and full screen (Settings → Appearance), both on: the
  overlays (island, bubble, side dock, copy confirmations, picker) are
  left out of screenshots, screen recordings and screen shares while you
  still see them, and stay off other apps' full-screen spaces. Turn the
  first off to record a demo of Lastout.
- A side dock, the fourth way to show Lastout (Settings → Appearance):
  a slim tab grown out of the left or right edge of the screen, with the
  notch's inverse curve where it meets the edge. Its prompt's cursor is
  the status (cyan and blinking while something runs, green or red after),
  with a dot for each open terminal. Resting on it shows the latest three
  commands; a click or the pick shortcut opens the terminal cards; a copy
  is confirmed in it. Its grip, at the foot, is for moving it: the mouse
  there lights the grip and opens nothing. Dragged, it lifts off the edge
  and follows the mouse, then settles on the nearer side and remembers
  where. *Thin line when idle* shrinks it to a line of light in the
  status color. Every phase is one shape growing and shrinking, not
  layers fading into each other.
- A floating bubble, the third way to show Lastout (Settings →
  Appearance, the default on Macs without a notch): a small pill above
  every app, dragged anywhere, snapping to the screen's edges and
  remembering where it was. Hover or click it and the terminal cards
  open from it toward the side with room; copies are confirmed beside
  it. Like the island, it replaces the menu bar icon (its menu is in
  the bubble). Choosing it before showed nothing new: the old "floating
  panel" only opened the centered panel from the shortcut, as the menu
  bar mode does.
- Notch style (Settings → Appearance): Clean, the default, keeps
  both wings beside the notch narrow and fixed (icon and count on the
  left, a status dot on the right), so they don't cover other apps'
  menu bar icons; Detailed names the running command and covers the
  icons next to the notch. macOS doesn't let an app see where those
  icons are, so the island can't size itself around them.
- "Copy from the exact window in front" (Settings, off by default): with
  several Terminal.app or iTerm2 windows open, the copy shortcut asks
  the terminal over Apple Events which window is in front (macOS asks
  once to allow it) and copies from that one, instead of the most
  recently active. Other terminals have no such interface and keep the
  heuristic.
- "Also record these apps" in Settings: a terminal Lastout doesn't know
  is picked from the running apps and recorded from its next new tab
  (macOS launches every process with the app's bundle identifier in its
  environment, which the recorder now matches against
  `record.terminals` in the config). `lo config --add-terminal`,
  `--remove-terminal` and `--terminals` edit that list from the command
  line; `lo doctor` in such a terminal names the identifier to add.
- Simplified Chinese: the menu bar app follows the system language (its
  translations are checked against the source by
  `app/macos/scripts/l10n.py`); README and the privacy document have
  Chinese versions. The `lo` command line itself still speaks English.
- A notch island: a black strip hugging the notch (a pill at the top of
  a screen without one) shows how many commands run and how the last one
  went; after a copy it shows what was copied for a moment; hovering or
  ⌃⌥⌘L expands it into the terminal cards with a short preview. Default
  on Macs with a notch. *Show Lastout as* in Settings chooses between
  the island, the floating panel and the menu bar alone.
- The picker (⌃⌥⌘L) shows one card per terminal window: the terminal,
  its directory and branch, the command running there and its last few
  commands. 1–9 copies a terminal's latest output (the running one's so
  far), ↑↓ and ↵ pick a command, typing searches every terminal as
  before. Closed terminals come last, marked.
- The copy shortcut (⌃⌥⌘C) copies from the terminal in front: with
  Ghostty, iTerm2, Terminal, WezTerm, kitty, VS Code, Cursor, Alacritty
  or Zed frontmost, its most recently active window's running command
  (output so far) or latest command, and the HUD names the terminal when
  several are open. Any other app in front: the newest command anywhere,
  as before.
- `install.sh --app` (macOS) installs the menu bar app into
  `/Applications`, quits a running copy first, strips any quarantine
  flag, and links `lo` and `lastout-shell` in `~/.local/bin` to the
  copies inside the app, like the Homebrew cask. A curl download is not
  quarantined, so beta builds open without a trip to System Settings.
- The app updates itself (Sparkle): a daily check of the release list,
  *Check for Updates…* in the menu, and each update verified against the
  key built into the app before it is installed. The check is the app's
  only network connection; the command-line tools make none.
- Trial and activation in the app: 14 days from first launch, then
  copying from the menu bar asks for a license (the terminal's `lo`
  stays free, recordings are untouched). *Activate Lastout…* in the menu
  and a License row in Settings; the key is checked by a license server,
  not configured yet, so every key is refused until a store is chosen.
  Beta builds made with `LASTOUT_BETA_EXPIRES=YYYY-MM-DD` work in full
  until that day instead, then point at *Check for Updates…*.
- `docs/privacy.md`: what is recorded, where it is kept, what can leave
  the machine (and that redaction cannot be turned off for agents), how
  to delete it.

### Fixed

- The floating bubble could not be dragged once it had opened: opening
  moved its icon and status to the middle of the strip, away from the
  mouse, and only that middle part could be dragged. They now stay at
  the corner the bubble opens from, and the whole strip drags it.

## 0.1.0 - 2026-10-11

### Action needed

- **Run `lo setup` again** (or click Update when the app asks). Several
  of the fixes below are in the two blocks `lo setup` writes to your rc
  file, and an install keeps its old blocks until then. `lo doctor` now
  says when yours are from an older version. Hosts set up with
  `lo remote-install` need it run again as well.

### Fixed

- Terminals' own shell integration works again while Lastout records.
  It used to be lost, along with command marks, current-directory
  reporting (new tabs opening in the same directory) and exit codes, in:
  - VS Code, Cursor and other VS Code-based editors
  - iTerm2 with "Load shell integration automatically"
  - Ghostty (it was never loaded)
  - kitty
- Login shells (what macOS terminals start) keep the rest of their login
  files. A `.bash_profile` line after sourcing `.bashrc`, where Homebrew
  puts `eval "$(brew shellenv)"`, used to be skipped, so Homebrew's
  tools were missing in bash. zsh's `.zlogin` and fish's
  `status is-login` blocks were skipped too.
- `exec $SHELL` (or `exec zsh`) after editing your rc file kept the
  shell running but stopped recording, and the `exec` showed as running
  forever. Recording now carries on.
- bash: commands were recorded wrongly, or not at all, next to:
  - starship added after Lastout (its internals were recorded instead of
    your commands, and `false` as exit 0)
  - zoxide loaded before Lastout (nothing was recorded)
  - Ghostty's bash integration, and GNOME Terminal on bash 5.1+ (their
    prompt hooks were recorded as commands)
  - plugins appending to `PROMPT_COMMAND` as an array (oh-my-bash on top
    of a distro's PROMPT_COMMAND, for example)
- bash with bash-preexec (oh-my-bash, iTerm2, WezTerm): a command left
  out of history (oh-my-bash's `HISTIGNORE` has `ls`, `clear`, ...) was
  recorded under the previous command's text, with its own output. It is
  now treated like a command typed with a leading space (see below).
- Uninstalling removes a `~/.bash_profile` only when `lo setup` (or
  `lo remote-install`) created it; a file you had, even an empty one, is
  only stripped. A login file `lo setup` can't write is reported before
  `~/.bashrc` is touched.
- bash on macOS: new terminals start login shells, which read
  `~/.bash_profile` and never `~/.bashrc`, where `lo setup` put its
  blocks. Unless your `.bash_profile` loaded `.bashrc` itself, nothing
  was recorded while `lo doctor` said all was well. `lo setup` now adds
  a small block to the login file that loads `~/.bashrc` (interactive
  bash only) when it doesn't already, and `lo doctor` checks it.
  `lo setup --uninstall` removes it, and deletes a login file it had
  created (an empty `~/.bash_profile` would stop bash reading
  `~/.profile`).
- Remote hosts: `lssh` starts a login shell too. A `~/.bash_profile`
  that doesn't load `~/.bashrc` (conda and others create one; it hides
  Debian's and Ubuntu's `~/.profile`), or no login file at all, meant
  nothing was recorded. `lo remote-install` now adds the same block
  there (run it again on hosts set up before).
- zsh with `ZDOTDIR` set in `~/.zshenv` (e.g. `~/.config/zsh`), and fish
  with `XDG_CONFIG_HOME`: `lo setup` wrote to a file the shell never
  reads, so nothing was recorded, while `lo doctor` said all was well.
  It now edits (and checks) the file the shell actually reads, and
  removes the blocks it left in the file the shell doesn't read.
- An rc file with Windows line endings (WSL, dotfiles synced from
  Windows) had every line rewritten with Unix ones by `lo setup`, and
  `lo setup --uninstall` couldn't undo it. Your lines now keep their
  endings; Lastout's own lines use Unix ones (a `\r` there would break
  the shell), and uninstalling restores the file byte for byte.
- An rc file that is a symlink (dotfiles managed with stow, chezmoi or a
  repo) was replaced by a regular file: the link broke and your dotfiles
  never got the change. `lo setup` now edits the file the link points
  to and keeps the link; the backup stays next to the link, out of your
  dotfiles repo.
- An rc file `lo setup` can't write (Nix home-manager's live in the
  read-only store) failed with a bare error after leaving a backup.
  It now fails before touching anything and says where to put the two
  blocks instead (for home-manager: which option, for zsh, bash, fish,
  and how to escape `${` in Nix strings).
- With a shell Lastout doesn't support (nushell, tcsh, ...), `lo doctor`
  and `lo setup` said "cannot tell your shell" and the app said nothing.
  They now name the shell and list the supported ones; the app shows it
  in its setup window.
- With `set -u` in `.bashrc` or `setopt nounset` in `.zshrc`, every prompt
  printed "unbound variable" / "parameter not set", bash recorded nothing
  and zsh lost every exit code. Lastout's code now runs without it and
  restores it, so your own commands keep the option.
- zsh with `ksh_arrays`, `glob_subst` or `err_return` set: errors at the
  prompt, or commands not recorded. Lastout's zsh code now runs with
  zsh's own options (`emulate -L zsh`); yours apply to your commands.
- When another process held the database for more than 2 seconds (a
  big `lo forget`, a backup tool), the commands run meanwhile could lose
  their exit code or not be recorded at all. Their writes are now kept
  and retried; the terminal itself never waited and still doesn't. If
  more commands finish meanwhile than the outputs kept in memory (4),
  the oldest give up only their output: they still show their exit code
  instead of "did not finish".
- A large output written when the disk filled up left a half-written
  file behind that kept the disk full: nothing more was recorded, even
  after space was freed elsewhere, across restarts. The file is removed
  when the write fails, and leftovers are cleaned up.
- A damaged recording database (disk errors, an overwritten file)
  stopped recording silently, and `lo` said only "file is not a
  database". The next new tab now moves it aside, with its outputs, into
  `damaged-<time>/` in the data directory and starts a new one; `lo` and
  `lo doctor` say so in the meantime.
- One damaged output file (cut short, overwritten) made `lo search` fail
  for everything and `lo --id` print a decompressor error. Now only that
  command is affected, and `lo`, the copy summary and the app's preview
  say its output file is missing or damaged (not that it was never
  recorded).
- One mistake in `config.toml` (a misspelt setting, a bad value, a
  setting from a newer version) made Lastout ignore the whole file,
  including your `record.ignore` list and `redact.patterns`: those
  commands' output was stored and your own token formats were copied
  unredacted, with only a warning. Now only the bad setting is ignored
  (and reported by `lo` and `lo doctor`). A syntax error on one line
  (an unclosed quote, a missing bracket) no longer loses the rest
  either: the other lines are read one by one. Only a file with no
  readable line falls back to the defaults.
- Linux releases are static builds: they run on any distribution. The
  previous ones needed glibc 2.35 or newer and failed on Debian 11,
  Ubuntu 20.04, RHEL 8 or Amazon Linux 2 with a "GLIBC_2.xx not found"
  error right after installing.
- `install.sh` into a directory that isn't on PATH printed "run
  `lo setup`", which then wasn't found; it now prints the full path and
  says to add the directory to PATH. `lo doctor` says the same when
  `lastout-shell` sits next to `lo` but isn't on PATH, instead of
  suggesting `cargo install`.
- More commands that print a token or a private key keep only their
  command line, never their output: `gh auth token`, `aws sts`,
  `aws ecr get-login-password`, `az account get-access-token`,
  `kubectl config view`, `vault login`/`vault token`, `bw`, `lpass`,
  `doppler secrets`, `heroku auth:token`, `npm token`, `openssl genrsa`/
  `genpkey`, `age-keygen`, `wg genkey`.
- More secrets are redacted before copying: Slack webhook URLs, PyPI,
  DigitalOcean, SendGrid, Twilio and Shopify tokens; and GitLab tokens
  that happen to contain no digit (about 1 in 30) are no longer missed.
- A command typed with a leading space (the shell convention for "don't
  keep this", often used for ` export API_KEY=...`) kept its text in the
  database; only its output was dropped. Now neither is stored: just a
  `(private)` placeholder. Text stored by earlier versions is erased the
  first time a terminal opens after the update.
- Re-sourcing your rc file no longer ends with exit status 1 (also on
  remote hosts).
- `lo sessions` (and the app's and MCP's session lists) slowed down with
  the number of recorded commands: 3.4 seconds with 50,000 of them, a
  heavy month's worth. It now takes about 40 ms.
- Before `lo setup`, `lo` said to open a new terminal tab and `lo doctor`
  said a new tab would fix an unrecorded terminal; neither helps until
  `lo setup` has run. Both now say to run it first.
- With fish, copying a command that printed nothing said "0 lines"
  instead of "no output".
- The app's copy shortcut, before any setup, showed `lo`'s hint to run
  `lo setup` (which app-only users may not even have on PATH); it now
  opens the setup window. With nothing recorded yet it says to open a
  new tab and run a command. Its confirmation says "output not
  recorded" or "output file damaged" instead of a plain "no output",
  and no longer "0 lines".
- The app's command picker was blank when its list was empty (nothing
  recorded, not set up, no match for the search); it now says which,
  and points at "Set Up Terminal…" when that is what's missing.
- `lo wait` and the agents' `wait_for_command` waited on the newest
  running command. An editor, pager, ssh session or dev server opened
  after the build is running too, so they waited on that until the
  timeout (10 minutes for agents). They now return the first of the
  running commands to finish, and ignore a command left "running" by a
  terminal that was killed (it would never finish).
- `lo --running`, the agents' `get_running_output` and the app's copy
  shortcut took the newest running command. With an editor, pager or
  htop open in another tab, that was its screen instead of your dev
  server's or build's output (the shortcut even skipped the build that
  had just failed). Full-screen programs are now passed over when
  something else runs, pagers that stay on the main screen included
  (git's pager, `less -X`, busybox less), and so is a command whose
  terminal was killed (it can still say "running" until the next
  terminal opens): the shortcut then copies the latest finished command
  instead of showing "cannot reach".
- `lo search` with no match now says that outputs of the last 200
  commands are searched (older ones by command line only), instead of a
  bare "no matches" that read as "never recorded".
- `lo sessions` lined up its columns by characters: a directory in
  Chinese or Japanese (two columns per character) pushed the columns
  after it out of line, and long ones were cut too wide. It now counts
  terminal columns.
- A `clear` or `cd ..` typed after a failing build made `lo` copy that
  instead of the build. `lo`, `lo -2`, `--last` and the app now skip a
  bare `clear`, `reset`, `cd`, `pushd` or `popd` that worked (a failed
  `cd` still counts, its error may be what you want; `cd dir && make`
  is a command in its own right and is copied as before).
- `lo mcp`: an `id` sent as a string (`"41"`, as models often do) was
  ignored and the latest command returned instead, without an error.
  Numbers as strings are now read; anything else is an error.
- With an older `lo` on PATH than the app's (installed separately, not
  updated), `lo` and `lo doctor` reported only "database schema v3 is
  newer than this build". They now say an older copy is running and how
  to find it (`which -a lo`). The database is left alone.
- A terminal killed hard (or crashed) stayed listed as recorded and
  running in `lo sessions`, the agents' `list_sessions` and the app's
  menu bar count until another terminal opened, and its last command
  in the menu's Running list. Sessions whose recorder process is gone
  now read as closed, and their commands aren't offered as running.
- Over ssh (copied through the terminal, OSC 52), `lo --mode full` of a
  big output said "Copied" though many terminals silently drop more
  than about 100 KB. It now says so and suggests `--print`.
- With a data directory whose path is too long for a socket (a deep
  `LASTOUT_HOME`, a very long user name on macOS), `lo --running`
  wrongly blamed a terminal opened before the update. It now names the
  real cause and `lo doctor` warns about it.
- `lo sessions` showed `lo sessions` itself as the current terminal's
  last command; it now shows the command before it.
- The app's "finished" notification was never shown for a long command
  that ended after a quicker one started later in another tab (a build
  in one tab, a few commands in another: the usual case). It now goes
  by when commands end, not when they started.
- The app no longer shows "finished" notifications while you are in VS
  Code Insiders, VSCodium, Windsurf or Zed Preview.

### Changed

- The app's default shortcuts are now **⌃⌥⌘C** (copy) and **⌃⌥⌘L**
  (picker). ⌥⌘C and ⌥⌘L are Chrome's element inspector, Safari's
  JavaScript console and Finder's Copy as Pathname and Downloads, and a
  global shortcut took them away from those apps. Shortcuts you set
  yourself are kept. The menu and the setup window now show the
  shortcuts actually in effect.

### Added

- The app's picker (⌃⌥⌘L) searches older commands too: with no match
  among the recent ones it asks `lo search` (every command line, and
  the output of the last 200).
- `lo --json` and `lo --list --json` carry `skip` (a `lo` call, a bare
  `exit`/`clear`/`cd` that worked: not "the previous command") and
  `screen` (a pager, editor or monitor), so launchers and the app don't
  keep their own copy of those rules; the app uses them.
- `lo search QUERY --json`: the matches as JSON (the list fields plus the
  matching output lines). `--json` used to be silently ignored there.

- `record.allow` in `config.toml`: built-in "never store the output"
  entries to lift one by one (`allow = ["kubectl config view"]`),
  instead of turning the whole list off with `default_ignore = false`.

- bash 5.3 and newer: the hook no longer forks per command (it reads the
  history in the shell itself with `${ cmd; }`), saving about 2 ms per
  command. Older bash is unchanged.

- `lo setup --print`: the two blocks, to add by hand where another tool
  writes your rc file (Nix home-manager, a dotfiles generator).

- `lo doctor` starts with the versions a bug report needs (`lo`, OS,
  shell, terminal), so its whole output can be pasted as one.
- `lo doctor` check `rc_version`, and an "Update" prompt in the app,
  for rc blocks from an older version.
- Tested next to: zellij, Terminal.app's session restore, WezTerm,
  GNOME Terminal and other VTE terminals, oh-my-zsh with Powerlevel10k
  instant prompt, oh-my-bash, starship, direnv, zoxide, bash-preexec and
  Atuin.

### Known limits

- In bash, a command that history leaves out (`HISTIGNORE`) is recorded
  without its output: it can't be told apart from one you typed with a
  leading space to keep it private.
