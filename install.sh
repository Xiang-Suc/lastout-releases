#!/bin/sh
# Installs the Lastout CLI (lo, lastout-shell) from a GitHub release.
#
#   curl -fsSL https://raw.githubusercontent.com/Xiang-Suc/lastout-releases/main/install.sh | sh
#
# Verifies the archive against the release's SHA256SUMS, installs into
# ~/.local/bin (or $LASTOUT_BIN_DIR) without sudo, and changes nothing
# else: run `lo setup` afterwards to hook up your shell.
#
#   curl -fsSL https://raw.githubusercontent.com/Xiang-Suc/lastout-releases/main/install.sh | sh -s -- --app
#
# --app (macOS): installs the menu bar app instead, into /Applications
# (or $LASTOUT_APP_DIR; ~/Applications when /Applications isn't
# writable), and links lo and lastout-shell in the bin directory to the
# copies inside the app, as the Homebrew cask does. A download by curl
# carries no quarantine flag, so Gatekeeper lets the app open even
# before it is notarized; any flag is removed anyway. A running Lastout
# is asked to quit first.
#
# Environment:
#   LASTOUT_VERSION   release tag, default: latest
#   LASTOUT_BIN_DIR   install directory, default: ~/.local/bin
#   LASTOUT_APP_DIR   --app: where Lastout.app goes
#   LASTOUT_REPO      GitHub owner/name, default below
#   LASTOUT_TARBALL, LASTOUT_APP_ZIP, LASTOUT_SHA256SUMS
#                     local files instead of downloading (testing, offline)
set -eu

REPO=${LASTOUT_REPO:-Xiang-Suc/lastout-releases}
BIN_DIR=${LASTOUT_BIN_DIR:-$HOME/.local/bin}
VERSION=${LASTOUT_VERSION:-latest}
APP_BUNDLE_ID=dev.lastout.app

say() { printf 'lastout: %s\n' "$*"; }
die() { printf 'lastout: %s\n' "$*" >&2; exit 1; }

app=
for arg in "$@"; do
  case "$arg" in
    --app) app=1 ;;
    -h | --help) sed -n '2,/^set -eu/{/^set -eu/d;s/^# \{0,1\}//p;}' "$0"; exit 0 ;;
    *) die "unknown option $arg (only --app)" ;;
  esac
done

case "$(uname -s)" in
  Darwin) target=universal-apple-darwin ;;
  Linux)
    [ -z "$app" ] || die "--app installs the macOS app; on Linux run without it for the command line"
    case "$(uname -m)" in
      # Static (musl): runs on any distro, whatever its glibc.
      x86_64 | amd64) target=x86_64-unknown-linux-musl ;;
      aarch64 | arm64) target=aarch64-unknown-linux-musl ;;
      *) die "no build for $(uname -m) yet; build from source: cargo install --path crates/lo --path crates/lastout-shell" ;;
    esac
    ;;
  *) die "$(uname -s) is not supported" ;;
esac

sha256() {
  if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1
  else shasum -a 256 "$1" | cut -d' ' -f1
  fi
}

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT INT TERM

if [ -n "$app" ]; then
  local_file=${LASTOUT_APP_ZIP:-}
  pattern='Lastout-[^ ]*\.zip$'
  what="the app"
else
  local_file=${LASTOUT_TARBALL:-}
  pattern="lastout-[^ ]*-$target\.tar\.gz\$"
  what="the $target build"
fi

if [ -n "$local_file" ]; then
  archive=$local_file
  sums=${LASTOUT_SHA256SUMS:?LASTOUT_SHA256SUMS is required with a local archive}
else
  if [ "$VERSION" = latest ]; then
    base="https://github.com/$REPO/releases/latest/download"
  else
    base="https://github.com/$REPO/releases/download/$VERSION"
  fi
  command -v curl >/dev/null 2>&1 || die "curl is required"
  say "downloading $what from github.com/$REPO"
  curl -fsSL "$base/SHA256SUMS" -o "$work/SHA256SUMS" || die "could not download SHA256SUMS from $base"
  name=$(grep -E "$pattern" "$work/SHA256SUMS" | awk '{print $2}' | head -n 1)
  [ -n "$name" ] || die "this release has no $what"
  curl -fsSL "$base/$name" -o "$work/$name" || die "could not download $name"
  archive=$work/$name
  sums=$work/SHA256SUMS
fi

name=$(basename "$archive")
expected=$(awk -v n="$name" '$2 == n || $2 == "*"n {print $1}' "$sums" | head -n 1)
[ -n "$expected" ] || die "$name is not listed in SHA256SUMS"
actual=$(sha256 "$archive")
[ "$expected" = "$actual" ] || die "checksum mismatch for $name (expected $expected, got $actual); not installing"

# Replaces $2 with $1 atomically: a running terminal may be executing the
# old file. $1 is a file to move in or, with link, a path to point at.
replace() {
  tmp=$(dirname "$2")/.$(basename "$2").new
  if [ "${3:-}" = link ]; then ln -sfn "$1" "$tmp"; else cp "$1" "$tmp" && chmod 755 "$tmp"; fi
  mv -f "$tmp" "$2"
}

mkdir -p "$BIN_DIR"
if [ -n "$app" ]; then
  ditto -x -k "$archive" "$work/app" || die "could not unpack $name"
  bundle=$work/app/Lastout.app
  helpers=$bundle/Contents/Helpers
  [ -x "$helpers/lo" ] && [ -x "$helpers/lastout-shell" ] || die "$name does not contain Lastout.app with lo and lastout-shell"
  # Not quarantined when curl downloaded it; a browser download is.
  xattr -dr com.apple.quarantine "$bundle" 2>/dev/null || true

  if [ -n "${LASTOUT_APP_DIR:-}" ]; then app_dir=$LASTOUT_APP_DIR
  elif [ -w /Applications ]; then app_dir=/Applications
  else app_dir=$HOME/Applications
  fi
  mkdir -p "$app_dir"
  dest=$app_dir/Lastout.app
  if [ -d "$dest" ] && pgrep -qf "$dest/Contents/MacOS/" 2>/dev/null; then
    say "asking the running Lastout to quit"
    osascript -e "tell application id \"$APP_BUNDLE_ID\" to quit" >/dev/null 2>&1 || true
    i=0
    while pgrep -qf "$dest/Contents/MacOS/" 2>/dev/null; do
      i=$((i + 1)); [ "$i" -lt 50 ] || die "Lastout is still running; quit it from the menu bar, then run this again"
      sleep 0.2
    done
  fi
  rm -rf "$app_dir/.Lastout.app.new"
  mv "$bundle" "$app_dir/.Lastout.app.new"
  rm -rf "$dest"
  mv "$app_dir/.Lastout.app.new" "$dest"
  for bin in lo lastout-shell; do
    replace "$dest/Contents/Helpers/$bin" "$BIN_DIR/$bin" link
  done
  say "installed $dest ($("$BIN_DIR/lo" --version)); lo and lastout-shell in $BIN_DIR point into it"
else
  tar -xzf "$archive" -C "$work"
  dir=$work/${name%.tar.gz}
  [ -x "$dir/lo" ] && [ -x "$dir/lastout-shell" ] || die "$name does not contain lo and lastout-shell"
  for bin in lo lastout-shell; do
    replace "$dir/$bin" "$BIN_DIR/$bin"
  done
  say "installed $("$BIN_DIR/lo" --version) to $BIN_DIR"
fi

case ":$PATH:" in
  *":$BIN_DIR:"*) lo=lo ;;
  *)
    # Not found by name yet: give the full path, so the next step works now.
    lo="\"$BIN_DIR/lo\""
    say "$BIN_DIR is not on your PATH: add it in your shell's startup file (new terminals need it to find lastout-shell)"
    ;;
esac
if [ -n "$app" ]; then
  say "next: open $dest (it sets up your shell and explains each step), then \`lo doctor\` in a new tab"
else
  say "next: run \`$lo setup\` to record your terminals, then \`lo doctor\` in a new tab"
fi
