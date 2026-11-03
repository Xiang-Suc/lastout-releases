# Lastout — downloads

Lastout copies the last command's output from any terminal, cleaned up
for pasting into an LLM, without selecting text. This repository holds
the install script, the release archives and the app's update feed; the
source code lives in a private repository.

Site and documentation: [lastout.dev](https://lastout.dev/) ·
[Using Lastout](docs/usage.md) ([中文](docs/usage.zh-CN.md)) ·
[Privacy](docs/privacy.md) ([中文](docs/privacy.zh-CN.md)) · [Changelog](CHANGELOG.md)

## Install

Lastout runs on macOS 14 or later: the menu bar app, with the `lo`
command line inside it. Try it free for 14 days; one license, $29 once,
covers both ([lastout.dev](https://lastout.dev/#pricing)).

The app (sets up the shell itself when opened):

```bash
curl -fsSL https://raw.githubusercontent.com/Xiang-Suc/lastout-releases/main/install.sh | sh -s -- --app
```

The command line on its own, into `~/.local/bin`. It records and
copies; the trial, activation, `lo search`, `lo save`, `lo mcp` and
`lssh` need the app above, running:

```bash
curl -fsSL https://raw.githubusercontent.com/Xiang-Suc/lastout-releases/main/install.sh | sh
~/.local/bin/lo setup --bin ~/.local/bin
```

Recorded: Ghostty, iTerm2, Terminal, kitty, WezTerm, Alacritty and the
terminals of VS Code, Cursor and Zed. Not recorded: Warp, JetBrains IDE
terminals and Emacs terminals.

Every archive is listed in each release's `SHA256SUMS`; the script
verifies what it downloads. The app updates itself from `appcast.xml`
of the latest release.

## Issues and feedback

Open an issue here. Please include the output of `lo doctor`.
