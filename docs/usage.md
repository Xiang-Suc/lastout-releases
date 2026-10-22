# Using Lastout

English · [简体中文](usage.zh-CN.md)

Lastout keeps what your terminals printed and copies the last command's
output, cleaned up for an LLM, without selecting text. This guide covers
the macOS menu bar app and the `lo` command line; Settings → Guide in the
app has the same in short.

## How it works

1. **Use your terminals as usual.** After `lo setup` (the app offers to
   run it the first time it opens), every new terminal is recorded: each
   command, its output, where it ran and how it ended. A terminal that was
   already open is recorded after `exec zsh` (`exec bash`, `exec fish`,
   `exec nu`) in it.
2. **Copy.** Press ⌃⌥⌘C in any app, or type `lo` in the terminal. You get
   the latest output of the terminal in front (when another app is in
   front, the newest command anywhere), with the command line on top, in
   Markdown. Long output keeps its start, the context around errors and
   its end; secrets are redacted.
3. **Paste.** Lastout never takes the focus, so ⌘V goes where you were
   typing: a chat with an LLM, an issue, an agent.
4. **Older ones.** ⌃⌥⌘L shows every terminal as a card with its recent
   commands: a number key copies a terminal's latest output, the arrow
   keys pick a command, typing searches them all.

`lo` itself, and a `clear` or `cd` that worked, don't count as the latest
command. A full-screen program (`vim`, `less`, `htop`) gives the last
screen it showed.

## Keys

### Anywhere (the app)

| Key | |
|---|---|
| ⌃⌥⌘C | Copy latest output |
| ⌃⌥⌘L | Pick a command: opens the island, the bubble, the side dock or the panel with every terminal |

Settings → Shortcuts changes both. They are global shortcuts, so they
take the key from every other app: avoid ones your other apps use.

### With the terminals open

| Key | |
|---|---|
| 1–9 | Copy that terminal's latest output (while nothing is typed) |
| typing | Search every terminal; when nothing recent matches, older commands are searched too |
| ↑ ↓ ← → | Move between commands and terminals |
| click | Select a command |
| ↵, double-click | Copy the selected command |
| ⌘↵, ⌘-click | Mark several, to copy them together |
| ⇥ | Smart, full or errors-only output |
| esc | Close |

### At the shell prompt

| Key | |
|---|---|
| ⌃G | Find a saved command and put it on the command line; it doesn't run |
| type, ↑ ↓ (⌃P ⌃N), ↵ | In that list: filter, move, put it on the command line |
| ⌃U, esc | In that list: clear what you typed, cancel |
| ⇥ after `lo` | Complete its commands and options (zsh with `compinit`, bash, fish, nushell) |

⌃G is the key unless you chose another one when `lo setup` asked;
`lo setup --saved-key ctrl-o` (or `none`, or `default`) changes it.
macOS's own `/bin/bash` 3.2 can't change the command line: there ⌃G
copies the command instead.

### In Settings

⌘1–⌘8 go to a page; ↑ ↓ move between pages while the sidebar has the
focus.

## The `lo` command

| Command | |
|---|---|
| `lo` | Copy the previous command from this terminal, with its output |
| `lo -2` | The one before that |
| `lo --last 3` | The last three in one paste, oldest first |
| `lo --id 41 --id 42` | Specific commands (ids from `lo --list`) |
| `lo --global` | The newest command from any terminal |
| `lo --running` | The output so far of a command still running in another terminal: a dev server, a long build |
| `lo --mode full` / `errors` | Everything, or only the context around errors; `smart` is the default |
| `lo --print` / `--plain` | Print instead of copying / text only, no Markdown |
| `lo --no-redact` | Skip secret redaction |
| `lo --list` | Recent commands with their ids |
| `lo search QUERY` | Find a command by its text, or by its output among the last 200 |
| `lo wait` | Wait for a running command to finish, then print it |
| `lo pause --for 30m` / `lo resume` | Stop recording (every terminal, or `--here` only this one); nothing is stored, not even the command |
| `lo forget` | Delete the previous command for good (a secret got printed); `--id 42` or `--all` |
| `lo sessions` | Terminals being recorded |
| `lo doctor` | Check the setup, from the rc file to recorded output |

`lo --help` lists every option. Copies go through pbcopy, wl-copy or
xclip/xsel; over ssh or on a headless machine, through your terminal
(OSC 52), also inside tmux and GNU screen.

## Saved commands

The command that finally worked, kept for next time with what it is for:

```console
$ kubectl -n staging logs deploy/api --since=1h | grep -i timeout
$ lo save "staging api timeouts, last hour (VPN first)"
```

- **Find it:** at any prompt press ⌃G, type `stag time`, press Return.
  The command is on the command line with the cursor at its end; edit it
  or press Return yourself. Nothing runs by itself.
- **Copy it instead:** `lo saved staging`.
- **An older command:** `lo save "note" -2`, or `--id 42`.
- **One you haven't run:** `lo save "note" -- 'git log | head'`.
- **Manage them:** `lo saved --list`, `lo saved --edit ID`, `lo saved --rm ID`.

They live in `saved.toml` (`lo saved --path` shows where): plain TOML you
can edit and keep in your dotfiles. Expiring recordings and `lo forget`
never touch it. Saving the same command again updates its note, and
commands saved in the repository you are in are listed first.

## Recording and privacy

- A command starting with a space is not stored at all, not even its text.
- Secrets tools (`op`, `pass`, `aws configure`, `vault read`,
  `kubectl get secret`, …) keep only the command line, never the output.
- `lo pause` (or Settings → Recording → Pause) stops recording; nothing is
  stored while paused.
- Old recordings go by themselves: 200 commands per terminal, 30 days,
  500 MB at most. `lo forget --all` (or Settings → Recording → Erase)
  removes everything now.

Everything Lastout records, where it is kept and what can leave your
machine: [Privacy](privacy.md).

## Over ssh

Without setup, an ssh session is recorded as one command. To record each
remote command separately, and copy it locally with `lo` or ⌃⌥⌘C:

```bash
lo remote-install me@server      # once per host: copies 3 shell scripts, no binaries
lssh me@server                   # use instead of ssh (any ssh options work)
```

`lo remote-install --uninstall me@server` removes it. Only use `lssh` with
hosts you trust: processes there could forge entries in your recording.

## Configuration

`lo config --init` writes a commented `~/.config/lastout/config.toml`
(Settings → Recording → Edit Config… opens it). Every option is explained
in it: the default output mode and size, commands never to record or
whose output you do want, other terminal apps to record, and your own
secret patterns to redact.

## Coding agents

`lo mcp` is an MCP server, read-only and always redacted. Settings →
Agents → Copy Config gives the snippet for your client. An agent can list
your terminals and their recent commands, read an output, follow a
command that is still running, wait for one to finish and search; nothing
it does can change, delete or run anything in your terminals.

## When something is off

- **`lo doctor`** checks everything from the rc file to recorded output
  and says what to do.
- **A terminal isn't recorded:** it was open before setup. Open a new
  tab, or run `exec $SHELL` in it.
- **A shortcut does nothing:** another app uses it. Pick another one in
  Settings → Shortcuts.
- **Report a problem:** Settings → About → Export diagnostics makes a zip
  without any of your commands or their output. Attach it, with the output
  of `lo doctor`, to an issue at
  [github.com/Xiang-Suc/lastout-releases](https://github.com/Xiang-Suc/lastout-releases/issues).
