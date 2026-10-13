# Lastout — downloads

Lastout copies the last command's output from any terminal, cleaned up
for pasting into an LLM, without selecting text. This repository holds
the install script, the release archives and the app's update feed; the
source code lives in a private repository.

Site and documentation: [lastout](https://xiang-suc.github.io/lastout-releases/) ·
[Privacy](docs/privacy.md) ([中文](docs/privacy.zh-CN.md)) · [Changelog](CHANGELOG.md)

## Install

Command line (macOS, Linux):

```bash
curl -fsSL https://raw.githubusercontent.com/Xiang-Suc/lastout-releases/main/install.sh | sh
lo setup
```

macOS menu bar app (sets up the shell itself when opened):

```bash
curl -fsSL https://raw.githubusercontent.com/Xiang-Suc/lastout-releases/main/install.sh | sh -s -- --app
```

Every archive is listed in each release's `SHA256SUMS`; the script
verifies what it downloads. The app updates itself from `appcast.xml`
of the latest release.

## Issues and feedback

Open an issue here. Please include the output of `lo doctor`.
