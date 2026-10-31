# Changelog

User-facing changes. Compatibility with other tools, and how each part
of it is tested, is in [docs/compatibility.md](docs/compatibility.md).

## Unreleased

### On lastout.dev, in the key email and in install.sh

No app update needed: these take effect when the site is published and
the license server updated.

- Buying: checkout on lastout.dev is open again. It was paused on
  October 27, while 0.4 made licenses enforceable, and the Buy button
  said so; it reopens with 0.4.1, the first version with signed licenses.
- Buying: the price card lists coding agents first (Claude Code, Codex
  and Cursor reading your terminals through `lo mcp`) and says that
  nothing renews.
- Buying: the key email has a designed version: the key on its own in a
  large block that selects in one click, numbered activation steps, and
  what's included and how the charge reads on a statement in a quieter
  box below, then the same in Chinese, naming the buttons as the app
  shows them in Chinese. It follows the mail app's light or dark mode
  and loads nothing remote; the plain-text version, in both languages, is
  still sent with it.
- The Chinese privacy policy's license checks and diagnostics items call
  a license key 授权码, as the rest of lastout.dev does; they said
  许可证密钥.
- lastout.dev's home page said the app connects only to check for
  updates and once when you activate a license. Since 0.4.0 it also
  checks the trial or license with Lastout's license server about every
  15 minutes; the page now says so, as the privacy policy does.
- lastout.dev's link preview, the picture shown where the link is
  shared, said the `lo` command line is free. $29 once covers the app
  and `lo` together, and the 14-day trial is what's free; the picture
  now says so.
- The terms, refund policy, EULA and privacy pages on lastout.dev open
  in the language picked on another page of the site, else in the
  browser's, as the home and thanks pages do; they went by the address
  only. Their switch saves the choice and their links keep it.
- Buying: the page after checkout no longer sends buyers to the menu
  bar, where by default there is no Lastout icon (the island or the
  bubble takes its place): opening Lastout again from Applications or
  Spotlight brings up Settings, then Pass → Activate Lastout…. A key
  sent by hand comes with the same steps.
- Buying: the key email no longer sends buyers to the menu bar, where by
  default there is no Lastout icon (the island or the bubble takes its
  place): opening Lastout again from Applications or Spotlight brings up
  Settings, then Pass → Activate Lastout…. It also says where Deactivate
  on this Mac is on an activated Mac (Settings → Pass → Manage…), and
  that the page after checkout shows the key for a day, not once.
- `install.sh --app`: when the running Lastout doesn't quit as asked, it
  said to quit it from the menu bar. It now says to choose Quit Lastout
  from its menu, or to quit it in Activity Monitor.
- Buying: the key email has an Activate in Lastout button (a link in the
  plain-text version, and in the Chinese section) that opens
  lastout.dev/activate, a new page showing the key with a Copy button and
  an Open Lastout button. Open Lastout hands the key to Lastout on this
  Mac (0.4.2 or later), which opens Settings → Pass with the key filled
  into Activate Lastout…; you still click Activate there. The key travels
  only in the page's address: the page sends it nowhere and asks search
  engines not to index it. With no Lastout on the Mac, or an older one,
  the page says what to do instead.
- Buying: on the page after checkout, in a browser without the clipboard
  API or one that refused it, Copy said "Copied" even when the browser's
  older copy command had done nothing. It now says "Select and copy" then,
  with the key already selected; the activate page does the same.

### In the app and `lo`

With the next app update (0.4.2).

- `lastout://activate?key=…`: a new URL the app answers to, the one the
  key email's Activate in Lastout button opens through lastout.dev.
  Settings opens on the Pass page with the key filled into the Activate
  Lastout… window, nothing clicked for you. Without a key, or with text
  not shaped like one, only the Pass page opens.
- In Chinese the app calls a license key 授权码, as lastout.dev, its
  legal pages and the thanks page do; it said 许可证密钥.
- Activating a key already in use on all the Macs it allows: the message
  said to deactivate it with Activate Lastout… → Deactivate on this Mac,
  but an activated Mac has no Activate Lastout…. It now says Settings →
  Pass → Manage… → Deactivate on this Mac.
- Texts that pointed at a menu bar icon most Macs don't show: Lastout
  has one only in Settings → Appearance → Menu bar only, and the island,
  the bubble and the side dock carry its menu instead. The notice shown
  instead of copying, after the trial or a refund, said copying "from the
  menu bar" had stopped; it now says copying from the app. The setup
  window's last step asked "Can't see the menu bar icon?"; it now says to
  open Lastout again from Applications or Spotlight to change settings.
- After the trial ended, or a refund, `lo license`, `lo search`,
  `lo save`, `lo mcp` and `lssh` said to open the app "to start the trial
  or activate it". They now say which: the trial has ended (buy or
  activate Lastout), or the license was refunded or revoked (activate
  another key or buy). Likewise when the app couldn't verify the license
  for a day, when the Mac's date and time are off, and when the license
  server needs a newer app; `lo license --json` gives the reason as
  `trial_ended`, `revoked`, `offline`, `clock` or `update`. The app leaves
  the reason in `lease.json` in place of the lease: it grants nothing,
  and they still exit with status 4.
- `lo license` said "No license or trial" also when the license was only
  unverified for now (offline for a day, the clock off, after a restart).
  It now says the paid commands don't work now, and why.
- The notice shown instead of copying, when the trial has ended or the
  license was refunded or couldn't be verified, lost its middle under the
  notch ("This license was refunded or revoked, so c…or buy Lastout"):
  what stopped and what to do. It now wraps onto as many lines as it
  takes there, in the side dock (which cut it after three lines) and in
  the HUD at the bottom of the screen (which stretched it into one line,
  past the screen's edge for the longest). What was copied still shows on
  one line, and no longer stretches the HUD when it is long.
- Settings → Pass: after a refund, or a key revoked by hand, the card
  said "Expired", as if the license had run out, under the title
  "Refunded", though a key revoked by hand was never refunded (the
  license server doesn't say which happened). Both now say "Revoked",
  the status still in red.
- A terminal that closed while another process held the database (a
  backup tool, `lo forget` on a big file) kept its live socket until the
  database was free: `lo --running` in another terminal still found the
  closed one, and a proxy killed in the meantime left the socket and its
  nonce file behind until the next terminal swept them. They go the
  moment the shell exits now.
- With 3 days of trial left, and again with 1, a notification says what
  Lastout did on this Mac so far: how many commands it recorded, how
  often output was copied and how often coding agents read it, and that
  the purchase is one-time. Each comes once, whatever the long-command
  notification switch says; clicking it opens Settings → Pass, where the
  same three numbers now sit under the card while the trial runs or once
  it has ended. `lo stats` (`--json`) prints them; the counts live in
  `usage.tsv` in the data directory, next to the database.
- The notice shown instead of copying, after the trial or a refund, leads
  with what was there: "This output is 2,400 lines, recorded." (its size
  when the lines aren't known, how many outputs for a merged copy).
- `lo search`, refused after the trial or a refund, first says how many
  matches there are in your recordings (counted on redacted text, so it
  confirms no secret), then why it isn't showing them.
- `lo mcp`, refused after the trial, answers the agent with what is
  recorded and waiting and a sentence to pass on word for word: a
  one-time purchase, not a subscription, activated in Settings → Pass;
  the server's instructions ask the agent to relay such answers as they
  are.
- Settings → Pass says until when updates are included ("Updates until
  2027-10-30; Lastout keeps working after that") and, like the refusals
  in the app and in `lo`, that it is a one-time purchase, nothing renews.
  The price itself is only on lastout.dev.
- Two terminals opening at the same moment (tabs restored at login, a
  split pane): one could end up without a live view, so `lo --running`
  and the app's menu didn't see what it was running, and `exec $SHELL` in
  it stopped recording. One terminal's sweep of leftover sockets probed
  the other's while it was being created and took it for a crashed
  session's. A terminal's socket now appears only once it answers.

## 0.4.1 - 2026-10-28

### Action needed

- Coming from 0.3.x or 0.2.0: 0.4.0 was not published on its own, so its
  section below applies too, Action needed included: open Lastout once
  with the internet on after updating.

### Fixed

- Settings → Pass: when the license couldn't be verified (offline for a
  day, the Mac's date and time off, an update required), the card said
  "Expired" in red under a row saying "Not verified". It now says "Not
  verified", in amber.
- Settings → Pass: before the first license check, and after a refund,
  the card's number changed every second the page redrew. It now stays
  the same on a given Mac.

## 0.4.0 - 2026-10-27

### Action needed

- Open Lastout once with the internet on after updating. It now asks
  Lastout's license server what this Mac may do: a Mac activated on 0.3.x
  renews its key there, any other starts (or continues) its trial. Until
  that first answer, copying from the menu bar waits.
- Coming from 0.2.0: none of 0.3.0 to 0.3.4 was published on its own, so
  their sections below apply too, Action needed included: run `lo setup`
  (or let the app's prompt update) and open a new tab.

### Changed

- The license and the trial are checked with the license server, which
  answers with a lease it signed (Ed25519) for this Mac only, good for a
  day. While the app runs it renews it about every 15 minutes, when the
  Mac wakes and when the network comes back. Nothing else counts: no
  stored JSON, no date of the app's own.
- A refund, a chargeback or a key revoked by hand stops the app's copying
  and `lo`'s paid commands on every Mac the key was activated on within
  about 15 minutes, and ends the trial on those Macs. A seat released from
  another Mac or from the dashboard stops this one at its next check.
- The trial runs on the server's clock, one per Mac (a hash of its
  hardware UUID): deleting the app's settings or setting the clock back
  no longer restarts it, and the first launch needs the internet.
- Offline, the app keeps working for a day after the last check; then
  copying pauses, the menu says *Connect to verify the license* and it
  resumes at the next successful check. Within a day, setting the clock
  back changes nothing: the lease's age runs on a clock that counts sleep
  and can't be set. A Mac whose clock runs more than a day fast can't
  verify either: the app asks you to set the date and time automatically.
- `lo search`, `lo save`, `lo mcp` and `lssh` need the trial or a license:
  `lo` reads the lease the app keeps (`lease.json` in the data directory,
  readable only by you) and never connects itself. Without one they say
  why and exit with status 4; `lo mcp` answers each tool call with the
  reason, so a server left running stops serving within a check of a
  refund. Copying, `--list`, `lo saved`, `lo forget` and the rest work
  without a license. `lo license` shows where this Mac stands.
- The license server serves apps from 0.4.0 on; older ones get "update"
  instead of a lease. Deactivating still works from any version.
- The privacy policy, the EULA (sections 2 and 5) and the refund policy
  describe the checks (dated 2026-10-27).

### Fixed

- A license could be made up by writing JSON into the app's preferences,
  and the trial restarted by deleting a preference or setting the clock
  back. Neither works any more: the app believes only a lease the server
  signed for this Mac.

## 0.3.4 - 2026-10-27

### Action needed

- Coming from 0.2.0: none of 0.3.0, 0.3.1, 0.3.2 and 0.3.3 was published
  on its own, so their sections below apply too, Action needed included:
  run `lo setup` (or let the app's prompt update) and open a new tab.

### Changed

- Lastout is one product at one price: one license, $29 once, covers the
  app and the `lo` command line (`lssh`, `lo save` and `lo mcp`
  included), and the 14-day trial covers both. The EULA, the terms of
  sale and the refund policy say so (dated 2026-10-27); the Pass page,
  the activation window, the trial-ended notice and the key email no
  longer call `lo` free. `lo` itself checks nothing yet.
- Linux builds aren't published for now: `install.sh` on Linux says so
  instead of downloading.

### Fixed

- Copying, printing or an agent reading output that shows an
  authenticator setup key no longer passes the key on. Only the `secret=`
  inside an `otpauth://` link was masked; a `Setup key: XXXX XXXX …` line
  next to it, or a key printed in groups of four without a label, went
  through as is. Both, and the whole link, are now
  `[REDACTED:otp-secret]` / `[REDACTED:otpauth-uri]`.
- The side dock idling as a thin line opens in one motion when the mouse
  reaches it. It used to grow into the tab first and turn around into the
  latest commands mid-way, which looked like a stall; reached near its
  lower end, it stopped at the tab and didn't open at all.

## 0.3.3 - 2026-10-26

### Action needed

- Coming from 0.2.0: none of 0.3.0, 0.3.1 and 0.3.2 was published on its
  own, so their sections below apply too, Action needed included: run `lo
  setup` (or let the app's prompt update) and open a new tab.

### Fixed

- Opened from a terminal Lastout already records (`open -a Lastout`), the
  app took that terminal's session along and its checks spoke for that
  terminal: the setup window ended on "hooks run but this command was not
  recorded", and Settings said the shell's hooks predate the saved-commands
  key, while recording worked. The app no longer hands a terminal's own
  variables to `lo`.
- Settings → Pass → Buy Lastout and the links on Settings → About opened
  only from the small arrow at the right end of the row. The whole row
  opens them now.

## 0.3.2 - 2026-10-26

### Action needed

- Coming from 0.2.0: neither 0.3.0 nor 0.3.1 was published on its own,
  so both sections below apply, Action needed included: run `lo setup`
  (or let the app's prompt update) and open a new tab.

### Changed

- Buying: the key email, the page after checkout and the refund policy
  say what the charge looks like on a card statement: `PADDLE.NET* ROCHA
  TECH` (`PAYPAL *PADDLE.NET` with PayPal). The refund policy is dated
  2026-10-25.
- Buying: license keys from the store's test runs don't activate on the
  live store, and a live key isn't accepted by a test deploy.

### Fixed

- A pasted multi-line command showed nothing where its name belongs: every
  title in the app (picker rows, the Island, the edge dock, the menu bar
  menu, notifications) drew its first line only, blank when the paste
  started with a blank line, and `lo --list`, `lo sessions`, `lo search`,
  the line printed after copying and `lo --running`'s "is private" notice
  printed the whole script where one line belongs. They now show the first
  non-blank line and `+N lines`.
- Pausing recording while a command ran (`lo pause`, then `lo resume`
  before it finished) kept everything the command printed: only its start
  and its end were checked. A command that was paused at any moment keeps
  no output now, in the database, the live view and `lo --running`.
- Some commands that print secrets were recorded with their output,
  because the built-in private list matched only an exact prefix:
  `kubectl get secrets`, `kubectl --namespace prod get secret`, `kubectl
  get secret/db`, `aws --profile prod sts get-session-token`. Options and
  their values are skipped, plurals and `kind/name` match, and `kubectl
  describe secret` is private too.
- A quoted value with an escaped quote inside (`{"password":"ab\"rest"}`)
  was redacted only up to the escaped quote, leaving the rest in place.
- `LASTOUT_DEBUG_LOG`, which `lo doctor` suggests for bug reports, wrote
  every command and its whole output unredacted, private and paused ones
  included, into a file other users on the Mac could read. Private and
  paused commands are logged as `cmd=<private>` with their sizes only,
  the rest goes through the redaction that copies get, and the file is
  created readable by you alone.
- The diagnostics report kept the values `lo doctor`'s config check
  quotes (an allow entry, a setting), under a line saying it holds no
  command lines; they show as "…" now. A `[redact]` pattern that doesn't
  compile is named by its number in warnings instead of quoted: a
  pattern often spells out the token it hides.
- Settings kept showing the old recording state after `lo pause` or `lo
  resume` in a terminal, or after a timed pause ran out.
- A terminal whose only command is a long-running one (a build, a dev
  server) lost its card once sixty newer commands ran elsewhere.
- Copying from a terminal running a full-screen program (vim, less) gave
  nothing to paste. The copy shortcut, the picker and the menu bar's
  running entries now fall back to that terminal's last finished command,
  and the picker's number keys and Enter on a running command keep the
  Full/Errors choice.
- The copy shortcut's lookup of the window in front was meant to give up
  after 1.5 s but lasted as long as the AppleScript query; it answers in
  time now, and a press while the Automation prompt is up no longer
  starts a second stuck query.
- Output that moved the cursor down by a huge count (`ESC [ n B`) could
  turn a few hundred bytes into hundreds of thousands of lines. As in a
  terminal, the cursor now stops at the bottom of the screen.
- `lo mcp` answered one request at a time, so `wait_for_command` (up to
  30 minutes) held up every other tool call and the client's
  cancellation. Calls run side by side now, and a cancellation ends the
  wait.
- A crash between writing a command's output and linking it to the
  command left a file that retention and `lo forget --all` never deleted.
  Both remove such files once they are 10 minutes old.
- `lo config --add-terminal` replaced only the first line of a
  `terminals` list written over several lines, leaving the config invalid
  and the settings after it ignored. The list is replaced whole, and a
  change that would leave the file invalid is refused.
- `lo setup --uninstall` on an rc file whose Lastout block had lost its
  end marker removed everything to the end of the file. Such a block is
  left alone now, with a warning naming its line.
- Buying: refunds and chargebacks revoke the right key whatever order
  Paddle delivers them in, and a refund made in Paddle's dashboard that
  gives back the whole price revokes the key (it arrived labelled
  partial and didn't). A key revoked while a Mac was activating gets no
  seat. A key email that fails to send is sent again every 15 minutes
  until it goes out.
- Buying: the page after checkout no longer waits forever on a lookup
  that hangs, and says whether the key email went out, is on its way, or
  can't be sent (no address came with the order).

## 0.3.1 - 2026-10-24

### Action needed

- Coming from 0.2.0: 0.3.0 was never published on its own, so its
  section below applies too, Action needed included: run `lo setup` (or
  let the app's prompt update) and open a new tab.

### Added

- Settings → Appearance → Theme: follow the system, or keep Lastout light
  or dark whatever the system does. Settings, the terminals panel and the
  notices follow; the island beside the notch stays dark. The light
  palette's small labels, accent and warning colours are darker than
  before, so they read on the paper surfaces.

### Changed

- The EULA says what activating sends, as the privacy policy and the
  activation window already did: the key, a hash of the Mac's hardware
  identifier and the app's version, once; the earlier text said "a name
  for the Mac", which was never sent. The refund policy says that after
  a refund the App must be deleted from the Macs it was activated on,
  instead of describing that it isn't switched off remotely. The terms
  of sale say how to buy for a team. All three are dated 2026-10-23.
- Activating also stores, in the keychain with the key, the day the
  purchase's year of updates ends, as the license server now answers it
  (`updates_until`). Nothing is enforced yet: every update still installs.
  It is kept so that a later version can honour the EULA's update period
  without the app ever asking the server again.
- Settings → About links the License Agreement and the privacy policy on
  lastout.dev.

### Fixed

- The copy shortcut, with a terminal in front, picked the window where a
  command had been running longest, not the one you were working in: a
  `claude` or a dev server left running in another window for a day
  outranked every window that had just finished something, so a split
  opened later (or the pane you just typed in) could never be copied from
  without opening the picker. Windows are ordered by their latest activity
  now, a command's start or end; the long-running one keeps its own card.
  (Terminal.app and iTerm2 with "Copy from the exact window in front" on were not
  affected.)
- Settings → Shortcuts no longer takes a shortcut made of ⌘ alone (⌘C,
  ⌘⇧C, ⌘Q): recorded as a global shortcut it took that key from every
  app at once, Copy included, until the Shortcuts page was found again. A
  shortcut needs ⌃ or ⌥; one saved that way by an earlier version is
  dropped for the default.
- Set Up is disabled while macOS runs Lastout from a temporary copy (an
  app opened straight from the zip in Downloads): the setup would have
  written that copy's path into the shell's startup file, and new
  terminals would then have recorded nothing, with no error. The window
  says to move the app to Applications first, as before.
- The refund policy says what a refund does: the key is revoked and can't
  activate a Mac again; a Mac where it was already activated isn't
  switched off remotely (the app doesn't contact us again). The earlier
  text said the app "returns to its unlicensed state", which it doesn't.
- Closing a terminal no longer waits forever when recording is stuck:
  with another process holding the database lock (a backup tool, `lo
  forget` on a big database) and the shell printing heavily, the
  recorder's queue filled and the proxy waited for it without a bound, so
  the tab never closed. It now waits about a second to hand over and a
  few more for the recorder to finish, then leaves; the session is
  closed later.
- Buying: only a full refund or chargeback that took effect revokes a
  license key. A partial refund, a refund still waiting for approval and
  a chargeback warning left the key revoked for good (nothing but a hand
  edit undid it); a chargeback the bank reverses, or a refund rejected
  after approval, now gives the key back.
- The site no longer offers "another year of updates for $15": there is
  nothing to buy yet. A license still includes a year of updates, and
  the app keeps working after that.
- The release build bakes the license server and the purchase page into
  the app and the upload refuses a build without them; the first 0.3.0
  draft had neither, so every license key would have been refused and
  there was no Buy button. The upload scripts also stop at a release that
  is already published instead of replacing its files one by one.

## 0.3.0 - 2026-10-21

### Action needed

- Run `lo setup` (or let the app's prompt update) and open a new tab, or
  `exec zsh` in an open one: the rc blocks changed. Every terminal opened
  after that binds ctrl-G to saved commands (see Added) unless you chose
  otherwise when `lo setup` asked. ctrl-G replaces zsh's send-break at the
  prompt (in a ctrl-R search and in completion's menu selection ctrl-G
  still cancels), bash's abort, and a ctrl-G binding of your own made
  earlier in the rc file. To keep ctrl-G as it was, answer `none`, or run
  `lo setup --saved-key none` any time; `--saved-key ctrl-<letter>` picks
  another key.
- Every terminal is recorded now, not only the ones Lastout knows (see
  Changed). A terminal you want left out: `export LASTOUT_DISABLE=1` in
  that shell's rc file above Lastout's block (zsh: `~/.zshenv`).

### Added

- Lastout can be bought and activated. *Buy Lastout…* (in the menu and in
  Settings → Pass) opens lastout.dev: one license is $29, for one person
  on up to 2 Macs, with every update for a year; the 14-day trial is
  unchanged and the terminal's `lo` stays free. *Activate Lastout…* checks
  the key once with Lastout's license server (license.lastout.dev; what
  the request carries is in docs/privacy.md) and keeps it in your
  keychain, so a reset of the app's preferences doesn't ask for it again.
  *Deactivate on this Mac* frees that seat for another Mac. A refunded key
  is refused. This build is not a dated beta: it does not expire.
- The terminal built into Claude Desktop's Code tab (cmd-J) is recognized:
  it sets `TERM_PROGRAM=claude-desktop`, so `lo doctor` and `lo sessions`
  call it `claude-desktop` rather than `unknown`.
- `lo setup` asks once which key opens saved commands: Enter keeps ctrl-G,
  a letter picks ctrl-<letter> (the terminal's own letters are refused),
  `none` turns it off. `lo setup --saved-key ctrl-o|none|default` answers
  without asking (scripts, the app). The choice is the first line of the
  hooks block, kept by later runs of `lo setup`, removed with it; an rc
  file that already sets `LASTOUT_SAVED_KEY` is not asked. `lo setup
  --dry-run` and `--print` say how to choose.
- A terminal that was open before `lo setup` is recorded after `exec zsh`
  (`exec bash`, `exec fish`, `exec nu`) in it: `lo setup`, `lo doctor` and the app's
  setup window now say so, instead of only "open a new tab".
- Shell setup from an older version: `lo` itself says so on stderr, once
  a day, with what to run (the hooks block exports `LASTOUT_RC_VERSION`,
  so the check costs nothing); not with `--json` or from a program. `lo
  doctor` says so every time, as before.
- nushell (0.91 or newer) is recorded like zsh, bash and fish: `lo setup`
  (with `--shell nushell`, or from `$SHELL`) edits the file
  `$nu.config-path` names and `lo doctor` checks it; `lo completions
  nushell` prints tab completion, which the hooks load at the first
  prompt; ctrl-G puts a saved command on the command line, unless
  config.nu already binds the key. Tested on the latest release; see
  [docs/compatibility.md](docs/compatibility.md) for what differs.
- Saved commands. `lo save "what it is for"` keeps the command you just
  ran, with where it ran, in `~/.config/lastout/saved.toml`, a plain file
  you can edit and sync. At any prompt ctrl-G finds one by its note and
  puts it on the command line, never running it; `lo saved` copies one
  and lists, edits and removes them. The key can be changed or turned off
  with `LASTOUT_SAVED_KEY`; `lo doctor` shows it. Retention and `lo
  forget` don't touch saved commands.
- Settings → Guide: how Lastout is used, every key it answers to (the
  panel's keys and clicks, ⌃G at the prompt, the settings window), the
  `lo` commands worth knowing and saved commands, in the app's language.
  About links to the same guide on the web:
  [docs/usage.md](docs/usage.md) ([中文](docs/usage.zh-CN.md)).

### Changed

- Every terminal is recorded, not only the ones Lastout knows. A terminal
  it didn't recognize used to be skipped until you set `LASTOUT_FORCE=1`
  or chose the app under "Also record these apps"; it is now recorded like
  any other and shows as `unknown` in `lo sessions` and `lo doctor`. To
  leave a terminal out, `export LASTOUT_DISABLE=1` in that shell's rc file
  above Lastout's block (zsh: `~/.zshenv`). Still not wrapped: Warp (outside
  tmux), JetBrains IDE and Emacs terminals, a shell whose stdin is not a
  terminal, and `TERM=dumb`; `LASTOUT_FORCE=1` and "Also record these apps"
  now only override the last one. `lo doctor` in a recorded unknown
  terminal says so and how to opt out.
- Settings has a look of its own, in Lastout's colors: ink panels with a
  mint accent in dark mode, paper in light mode, page names in a serif
  and section names in small monospaced capitals. The sidebar shows each
  page's shortcut: ⌘1–⌘8 (or the arrow keys) move between pages.
- The pass (Settings → Pass) is a titanium card the size of a bank card:
  the serial pressed into brushed metal, a gold chip etched with your
  Mac's fingerprint, and a hologram whose colors turn as the card tilts
  toward the mouse. *Copy image* and *Save as PNG…* give the whole card;
  in 0.2.0 they left out everything but `lo --pass`.
- *Hide over full-screen apps* (Settings → Appearance) is now *Hide over
  full-screen videos, slides and games*, still on: the island, the bubble
  and the side dock step aside while a video app, Keynote, PowerPoint or
  a game (by the category the app gives itself) fills their display,
  and are back when it leaves. Full-screen browsers, editors and
  terminals keep them, a video full screen in a browser too. On macOS 27
  the setting did nothing: they showed over every full screen. Opened
  with the pick shortcut they show over a full screen too, until they
  close, and while they are out of the way a copy is confirmed at the
  bottom of the screen.

### Fixed

- Lastout kept a CPU core about 10% busy all day while any terminal ran a
  command (a dev server, an agent): the island's and the side dock's
  running dot, the dock's cursor and sliver, and Settings' status light
  pulsed by having SwiftUI redraw their whole window every frame, and
  Settings' light went on after its window was closed. They pulse on Core
  Animation now, which the system runs; the app does nothing between
  changes. With "Reduce motion" on, they no longer pulse at all.
- `lo save --cmd -2`, `lo saved --edit ID --note -2` and `--cmd -2` were
  rejected ("unexpected argument '2'"): `-2` was read as "two commands
  back" even as the value of an option. An option's value is kept now; a
  `-N` on its own still means `--back N`.
- Lastout.app moved or deleted while it was running (from Downloads to
  Applications, say): copying said "The lo command-line tool was not
  found.", and Settings → Export Diagnostics quietly ran another `lo`
  (`~/.cargo/bin`, Homebrew), which may be another version. It now says
  the app was moved or deleted and to open it again, and the app only
  ever runs the `lo` inside it.
- Set up from one place and then moved (from Downloads to Applications,
  say) or deleted, Lastout stopped recording new terminals without a
  word: the shell's startup file still ran it from the old place. The app
  now opens *Set Up Lastout* to point the shell at the copy that runs
  (*Not Now* waits for the next version).
- A coding agent given Lastout's MCP server (Claude Code, Codex, Cursor
  and the others in Settings → Agents) runs `lo` from where the app was
  when its config was copied: once the app was moved or deleted, the
  agent's Lastout tools quietly stopped working. `lo doctor` now reads
  those agents' config files (it only reads them) and says which one
  runs a `lo` that is gone, or a temporary copy macOS made, and how to
  fix it; Settings → Agents shows the same under *Copy Config*. `lo mcp
  --print-config` and *Copy Config* refuse to name a temporary copy (an
  app opened straight from Downloads), whose path changes at every
  launch.
- When `lo` couldn't be read (the app moved or deleted while running,
  say), the menu bar icon, the island and the side dock kept showing what
  they showed last, a running count or a green dot, as if it were
  current. They turn grey now, and the menu's first line and the icon's
  tooltip say "Not up to date" and why.
- A search in the picker that failed said no command matched, and
  *Check Again* in *Set Up Lastout* showed an empty list when `lo doctor`
  couldn't run: both say what went wrong now.
- Choosing another language in Settings quits Lastout to reopen it; with
  the app moved or deleted while it ran, it quit and nothing reopened. It
  stays open now and says the language applies when Lastout is opened
  again.
- Settings → General said "Recording, all checks pass" with its light
  pulsing, and the sidebar "Recording 3 terminals", while the numbers
  under it couldn't be read. The status line now says they aren't up to
  date and why, the light stops, and the sidebar says *Needs attention*.
- Settings → Pass: a license with no end date showed a speck of an ∞
  under *Valid*; it is now as large as the letters beside it. A trial or
  a beta that had ended showed ∞ there too: it now shows the day it
  ended, and a trial's day is the one where you are (it was the UTC day,
  which could be a day off). The trial's last day read "1 days left". The
  row under the card kept its green seal once the trial or the beta had
  ended: it shows an hourglass during the trial and a warning after it. A
  long name or email is cut short, so the date and the status always show
  in full. Once a key is activated the page no longer offers *Buy
  Lastout*, as *Activate Lastout* already didn't.
- The trial countdown in the menu, in Settings and in *Activate Lastout*
  was counted when the app started and again only when you copied from
  it, so it could be days old. Each counts again as it opens.
- In Chinese, the *Activate Lastout* and *Set Up Lastout* window titles,
  the tooltip of the picker's output mode button and the tooltip of a
  running command in the menu were still in English.
- ⌘V, ⌘C, ⌘X, ⌘A and ⌘Z did nothing in the app's text fields (the
  license key in *Activate Lastout…*, the fields in Settings), while they
  worked everywhere else: a menu bar app has no Edit menu, and those keys
  are its. The app now keeps one, unseen.
- Settings → Pass said "This Mac · 1 of 1 seats" whatever the key allows.
  It now shows the seats taken out of the seats the key allows, as the
  license server answered at activation (activate again to see it on a
  key activated by an earlier build), or no count at all.
- The side dock and the island could vanish from the current Space, and
  stay gone, after switching users with fast user switching or after
  another app's full screen came and went: the window server had dropped
  them from every Space but one. They now rejoin every Space when shown
  and, after each Space switch, whenever they are found missing from it.
- The app's setup check said "lastout-shell is not on PATH" when the
  rc file had been set up by a `lo` outside the app (Homebrew's,
  install.sh's, cargo's), whose blocks find `lastout-shell` on PATH:
  the app sees launchd's PATH, not the shell's, so recording could work
  while the check failed, and its fix (add the app's Helpers to PATH in
  the shell's startup file) could never clear it. Run by the app,
  `lo doctor` now says the rc file runs `lastout-shell` from the shell's
  PATH, not the app's (check `rc_bin`, a warning), and the app offers
  to update the blocks to name its own copy, which updates with it: Fix
  Setup… shows the change, Update writes it. In a terminal, where PATH
  is the shell's, a missing `lastout-shell` still fails, with the same
  fix (`lo setup --bin` the app's Helpers) when it is the app's `lo`.
- After installing the app from its zip (dragged to Applications) and
  its setup, typing `lo` said command not found: nothing put the app's
  Helpers, where `lo` is, on PATH. In recorded terminals the hooks now
  add them to the end of that shell's PATH when no other `lo` is on it
  (for the session only, nothing is written), so `lo save`, `lo doctor`
  and the rest work there, programs started from the shell find `lo`
  too, and its tab completion is registered. A `lo` already on PATH
  (Homebrew's, cargo's, install.sh's) is left alone. `lo setup` run by
  the app's `lo` without `--bin` (`lo setup --saved-key`, say) keeps
  naming the app's Helpers instead of relying on PATH. In a terminal
  that isn't recorded, run it by its full path:
  `/Applications/Lastout.app/Contents/Helpers/lo doctor` (or under
  `~/Applications` when the app is there).
- `su -`, `sudo -i` or `env -i zsh` in a recorded terminal, when that
  user had run `lo setup` too, started a second recording inside the
  first, on the same terminal: both recorded the same commands, each
  into its user's record. The proxy now claims the terminal it made (a
  file named after the tty and the proxy's pid in `/tmp/lastout-tty`,
  readable by every user and holding nothing else), and a shell started
  on a claimed terminal stays unwrapped while that proxy runs, whatever
  its environment says; what runs in it is, as before, the output of the
  command that started it. New tmux, screen and zellij panes are still
  recorded on their own. `lo doctor` in such a shell names the process
  that records the terminal and says it was started as another user.
  Someone else on the machine can put a claim there too: it keeps that
  one terminal unrecorded while the pid it names is a running
  `lastout-shell`, nothing more (see docs/compatibility.md).
- On Linux, a new terminal could hang before its first prompt, for good,
  once another terminal's recorder had stopped answering (a stopped or
  frozen process) and enough terminals had opened since. Each new terminal
  checks the other terminals' sockets to tidy up after crashed ones; that
  check now never waits, and the terminal's output starts before it.
- bash with functrace on (`set -T` in your `.bashrc`, or bash-preexec's
  subshell support) recorded Lastout's own prompt functions as private
  commands instead of what you typed. With bash-preexec and functrace, the
  command after the saved-commands key was lost too. Next to starship on
  bash 4.4 or newer it also recorded every command twice and broke
  starship's command timer.
- bash: a command that history leaves out for any reason other than a
  leading space was stored as private, without its output: one matching a
  `HISTIGNORE` pattern (oh-my-bash ignores `ls`, `clear`, `exit`, ... by
  default; `&` for the previous line), a repeat of the previous command
  with `ignoredups` or `erasedups`, and every command with history off
  (`set +o history`, `HISTSIZE=0`). They are recorded like any other
  command now, with their output and exit code, under what you typed (an
  alias is put back; bash only shows the hook its expansion). A leading
  space with `ignorespace` or `ignoreboth`, or a `HISTIGNORE` pattern like
  `[ ]*`, still keeps a command private. The limits that remain are in
  docs/compatibility.md.
- bash 5.3 (Homebrew's) with bash-preexec 0.6 or newer, which there hooks
  `PS0` instead of the DEBUG trap: the hook read the wrong command inside
  bash-preexec's functions, so a command left out of history was recorded
  as private under bash-preexec's own text. Lastout keeps its own trap
  next to bash-preexec there.
- bash 5.3 inside iTerm2 with its automatic shell integration (which
  appends its prompt function to `PROMPT_COMMAND` after Lastout's and
  then loads its own bash-preexec): every command was recorded as
  `__iterm2_prompt_command`. The hook folds what a tool appends after its
  own prompt code next to a bash-preexec that hooks `PS0` the same way it
  does without bash-preexec, and with functrace (`set -T`) it no longer
  takes the inside of such a function for the command on the first
  prompt. The same for any prompt hook appended that way; tested in
  `bash_matrix.py`.
- bash with starship loaded after Lastout's hook: pressing Enter on an
  empty line recorded `starship_precmd` as a command.
- bash: a command line that starts with a subshell, `(cd build && make)`,
  was not recorded at all (bash runs it without firing the DEBUG trap in
  the shell itself). It is recorded with its output on bash 4.4 or newer
  (from `PS0`: in the shell on 5.3+, from a command substitution before)
  and, with functrace (`set -T`), on any bash, from the trap inside the
  subshell; the shell's own start marker for the line then repeats the
  early one and the proxy keeps the first. On bash 3.2 without functrace
  it is recorded with its exit code but without its output, which has
  gone by when the shell notices. Next to a bash-preexec that drives the
  DEBUG trap (before bash 5.3) the same from bash 4.4; on 3.2 not at all,
  where bash-preexec itself misses the line.
- `lo doctor` run in a terminal that had only just opened could fail with
  "the recording database is still being created → upgrade lo", while
  that terminal was still creating the database on first run. It now
  waits for it as `lo` does, and if it is still not ready says so, with
  no upgrade to make.
- Clicks in the empty part of the island's or the side dock's window (as
  large as the opened panel: 600 by 670 points under the notch, or beside
  the dock) were swallowed, and took the keyboard with them: buttons,
  fields and the close, minimize and zoom buttons of a window under that
  area did nothing, and typing only beeped until a click landed outside
  it. Hiding over a full-screen video had set the window to take clicks
  in its transparent part too. Clicks there fall through again, and the
  island, the bubble and the side dock take the keyboard only when opened
  with the pick shortcut or a click into them: opening Lastout no longer
  moves the keyboard focus away from the app in front.

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
