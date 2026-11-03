# 隐私

[English](privacy.md) · 简体中文

Lastout 记录什么、存在哪、什么会离开你的电脑、怎么删除。每一条都写明是哪个命令或设置在管；哪条不成立，请告诉我们。

Lastout 由 Rocha Tech LLC（在美国新泽西州注册的公司，下称「我们」）开发。你记录的内容不会到我们这里；到我们这里的，只有购买授权以及校验试用和授权需要的那些，见下面「授权校验」和「购买授权」两节，这部分数据由我们负责（即数据控制者）。问题和请求请写信到 support@lastout.dev。

最后更新：2026-11-01。

## 记录什么

在用 `lo setup`（或 App）接入的终端里，对每条命令：

- shell 看到的命令行、工作目录和当时的 git 分支、开始和结束时间、退出状态；
- 命令打印到终端的内容：原始输出的前 1 MB 和后 4 MB，压缩存储。这包括命令运行期间终端回显的内容，比如你在提示符处输入的文字。不回显的提示（密码）不会被回显，所以不会被记录；
- 每个终端会话：终端程序的名字、tty 和录制进程的 pid，让 `lo` 分得清哪个终端是哪个。

除此之外没有：命令之外的按键、截图、命令没打印出来的文件内容、其他 App 的信息，都不记录。

## 不记录什么

- **以空格开头的命令**：连命令文本都不存（那一行只显示 `(private)`）。这是 shell 自己「不进历史」的约定。
- **暂停期间**：`lo pause`（所有终端）或 `lo pause --here`（只这一个），可加 `--for 30m`。`lo resume` 结束全局暂停，`lo resume --here` 结束这个终端的暂停。什么都不存，连命令都不存。
- **会打印密钥的命令**：内置列表（`op`、`pass`、`gopass`、`bw`、`lpass`、`aws configure`、`aws sts`、`aws ecr get-login-password`、`gcloud auth`、`az login`、`az account get-access-token`、`ssh-keygen`、`gpg --export-secret-keys`、`security find-generic-password`、`security find-internet-password`、`vault read|kv get|login|token`、`kubectl get secret`、`kubectl describe secret`、`kubectl config view`、`gh auth token`、`heroku auth:token`、`npm token`、`doppler secrets`、`openssl genrsa`、`openssl genpkey`、`age-keygen`、`wg genkey`）只保留命令行和退出状态，不保存输出。这个判断只看命令的开头：写在连写命令里的（`cd x && op read …`），输出会被录下。配置文件里 `record.ignore` 可以加自己的，`record.allow` 可以把内置条目放开。
- **你没有接入的终端**：只有 rc 文件里有 `lo setup` 写入的两段标记代码的 shell 才会被录制。`lo setup --uninstall` 从所有地方移除它们。

## 存在哪

| 内容 | 位置 |
|---|---|
| 记录（SQLite 索引 + 压缩的输出文件） | macOS：`~/Library/Application Support/lastout/`；Linux：`$XDG_DATA_HOME/lastout/`（默认 `~/.local/share/lastout/`）；或 `$LASTOUT_HOME` |
| 配置 | `~/.config/lastout/config.toml`（遵守 `$XDG_CONFIG_HOME`），或 `$LASTOUT_CONFIG` |
| App 设置（快捷键、通知阈值） | `~/Library/Preferences/dev.lastout.app.plist` |

数据目录以 700 权限创建（只有你的用户能读）；`lo doctor` 会检查它还是不是。自动清理：每个终端 200 条、30 天、总共 500 MB，超出先删最旧的。

已存命令（`lo save`）是你自己写的另一份明文文件：`~/.config/lastout/saved.toml`（权限 0600）。每条用过几次，记在数据目录的 `saved-usage.tsv` 里。
- 自动清理不会删它们，`lo forget` 也不动它们。
- MCP 不读取它们；App 的诊断导出只记录条数。
- 命令里存进去的密钥，会按你输入的原样留在文件里；`lo saved` 复制和打印时也按保存的原样给出，不做遮盖。

## 什么会离开你的电脑

你记录的内容，永远不会自己离开。命令行工具没有任何网络代码。菜单栏 App 只有两种连接：更新检查，以及授权校验（见下文）。每天一次（以及你点「检查更新…」时），它从 `github.com/Xiang-Suc/lastout-releases/releases/latest/download/appcast.xml` 取发布列表，看有没有新版本。这个请求只带任何下载都会带的信息（比如 IP 地址），没有关于你或你机器的其他信息（Sparkle 的系统信息上报是关闭的），更新只在你同意后安装，且签名必须与 App 内置的公钥匹配。没有遥测、没有崩溃报告、没有账号。输出只在你或你运行的工具要求时才离开：

- **复制**（`lo`、菜单栏快捷键、通知上的「复制」按钮）把整理后的输出放到剪贴板，先遮盖识别到的密钥。通过 `lssh` 时，剪贴板仍是本地的。
- **打印**（`lo --print`、`lo --json`）把它写到终端，先遮盖识别到的密钥。
- **Agent**（`lo mcp`，给 Claude Code、Codex 等用的 MCP 服务器）：只读的工具，返回整理后的输出，始终遮盖识别到的密钥。Agent 没有任何参数能关掉它，服务器也不能写或删任何东西。
- **通知**在你的屏幕上显示命令行和退出状态，通过 macOS 通知中心，仅此而已。
- **授权校验**：App 向 Lastout 的许可证服务器（地址写在 App 的 Info.plist 里的 `LastoutLicenseServer`；由 Lastout 运营的 Cloudflare Worker，源码不公开）询问这台 Mac 能做什么。第一次启动时在服务器上开始 14 天试用，让试用按服务器的时钟计时、每台 Mac 只有一次；你输入授权码后激活它；App 运行期间大约每 15 分钟、Mac 唤醒时和网络恢复时再校验一次，让退款的授权停下来。每个请求都带着这台 Mac 硬件 UUID 的 SHA-256 哈希（UUID 本身不会离开这台 Mac）、App 版本号，以及激活之后的授权码；从 0.3 升级上来的安装，第一次试用请求还带着它首次启动的日期。「在这台 Mac 上停用」发送授权码和同一个哈希以释放座位。服务器返回一份它签名的租约：这台 Mac 能做什么（试用和结束时间，或授权和座位数），有效期一天。App 把它存进你的钥匙串，并写到数据目录里只有你能读的 `lease.json`，`lo` 从那里读取：`lo search`、`lo save`、`lo mcp` 和 `lssh` 需要一份有效的租约，`lo` 本身仍然不发送任何东西。断网时，App 在上次校验后照常工作一天，之后复制会暂停，直到校验成功。这些请求都不包含任何关于你记录的内容。和任何网页请求一样，每次校验时 Cloudflare 都能看到你的 IP 地址；授权服务器的代码不读取也不保存它。没有配置服务器的构建拒绝一切授权码，也不发送任何东西。
- **诊断信息**（设置 → 关于 →「导出…」）把一个 zip 存到你选的位置，供你报告问题时附上；App 不会把它发到任何地方。里面有：版本、Lastout 的设置、屏幕尺寸、`lo doctor` 的检查结果、正在记录的终端数量、Lastout 自己最近一天的日志，以及最近 30 天的崩溃报告。主目录显示为 `~`，用户名和电脑名会被替换，不含任何命令行、输出或授权码。

### 遮盖

遮盖的是识别到的密钥：它按下面的规则工作，认的是已知格式，不保证遮住所有密钥。它对每次复制、打印和 Agent 读取生效，从不改动存储的内容（所以才有 `lo forget` 处理打印过的密码）。每处匹配变成带标签的标记，例如 `[REDACTED:github-token]`，LLM 仍能知道那里原来是什么。规则：已知的 token 格式（GitHub、GitLab、AWS access key、Google、Stripe、Slack token 和 webhook、SendGrid、Twilio、Shopify、npm、PyPI、DigitalOcean、Hugging Face、JWT、通用 API key）、私钥块、URL 里的密码、两步验证的设置密钥（`otpauth://` 链接、带 `Setup key:` 这类标签的密钥、四个一组打印的 base32 密钥）、`Authorization` 头和 bearer token、`--password` 这类参数、`SECRET=value` 赋值。你自己的格式写在配置的 `redact.patterns`（正则）。

目前认不出：`curl -u user:pass`、`mysql -p<密码>`、`sshpass -p`、`Cookie` 头、`DB_PASS=`。贴出去之前请看一眼。

`lo --no-redact` 对你自己做的复制跳过遮盖；任何 MCP 工具和设置都做不到这一点。如果 Agent 还能跑 shell，它就和你是同一身份：可以运行 `lo --no-redact`，也能读磁盘上的录制，和读你的其他文件一样。

## 远程主机

`lo remote-install host` 在远程主机上放三个很小的 shell 脚本和每个 rc 文件一段标记代码，不装二进制。用 `lssh host` 时，远程每条命令的输出经由你自己的 ssh 连接传到你机器上的录制进程，只存在你这里。远程主机不保留任何输出。

## 删除

- `lo forget` 删上一条命令；`lo forget --id 42` 删指定的；`lo forget --all` 全删。每种都会删掉行和输出文件，并把被删行在数据库里占的字节清零。命令行文字的旧副本可能还留在数据库文件的空闲部分，直到被覆盖；所以如果密码写在了命令行里，请把密码换掉。`lo forget` 不会动你的 shell 历史和备份。用 `lo --print` 或 `--json` 打印过的副本是另一条命令，普通 `lo forget` 会跳过，要用 `lo forget --id N` 删。
- `lo setup --uninstall` 从所有 shell 的 rc 文件（以及它创建的登录文件）里移除 Lastout 的代码块。开着的终端照旧，新开的恢复原样。改动一个文件之前，`lo setup`（包括 `--uninstall`）会在它旁边留一份副本，名叫 `.lastout-backup-*`；没有任何东西会删掉这些副本。
- 要把 Lastout 从这台 Mac 上清掉：先运行 `lo setup --uninstall`，再删掉 `~/Library/Application Support/lastout/`、`~/.config/lastout/`、`~/Library/Preferences/dev.lastout.app.plist`、`~/Library/Caches/dev.lastout.app`、`~/Library/HTTPStorages/dev.lastout.app` 和它旁边的 `dev.lastout.app.binarycookies`、`/Applications` 里的 App、`~/.local/bin` 里的 `lo` 和 `lastout-shell`，以及 rc 文件旁边的 `.lastout-backup-*` 备份。钥匙串里的授权码用 `security delete-generic-password -s dev.lastout.app -a license` 删除。Homebrew cask 的 `zap` 只删录制内容和 App 设置，不包括这份清单的其余部分。Lastout 不加密录制内容，也不把它排除在 Time Machine 之外，已经做过的备份里还会留着。
- 已存命令：用 `lo saved --rm ID` 删单条，或者直接删掉文件（路径见 `lo saved --path`）。

## 菜单栏 App

它启动时申请一个权限：通知；不给也能用（菜单和快捷键不需要）。如果你在设置里打开「精确复制前台那个窗口」，macOS 还会询问一次，允许 Lastout 向 Terminal 或 iTerm2 询问哪个窗口在最前面；它只读取那个窗口的终端设备名。「登录时启动」默认关闭，要在设置里自己打开。它不需要辅助功能、屏幕录制或输入监控权限。它的网络连接只有上面说的更新检查和授权校验。

它的浮层（灵动岛、全局浮窗、侧边停靠、复制提示、选择面板）被标记为不进截图、录屏和屏幕共享：你自己照常能看到，看你屏幕的人通常看不到。这是对 macOS 提出的请求，具体某个截图、录屏或共享软件是否遵守，取决于那个软件和 macOS 版本；我们没有逐个测过。共享屏幕之前，请先确认它们没有出现。视频 App、Keynote、PowerPoint 或游戏占满屏幕时，灵动岛、全局浮窗和侧边停靠也会让开。为了判断这一点，Lastout 会看哪些 App 在屏幕上有窗口、窗口在哪（macOS 不需要任何权限就能列出这些；不读窗口标题和内容，什么也不保存），以及 App 自己声明的类别。全屏的浏览器、编辑器和终端照常显示浮层，浏览器里全屏播放视频也一样。「不进截图」和「让开」这两项默认打开，可以在「设置 → 外观」里关掉，比如要录 Lastout 的演示时。

## 购买授权

Lastout 的授权由 Paddle.com Market Ltd（下称「Paddle」）作为代收商户（merchant of record）销售：结账、收款、代收销售税或增值税、开收据、处理退款，都由 Paddle 完成。你在结账时填的内容（邮箱、国家和付款信息）交给 Paddle，适用 [Paddle 的隐私政策](https://www.paddle.com/legal/privacy)。我们看不到你的银行卡或账户信息。

购买完成后，Paddle 通知 Lastout 的授权服务器（`license.lastout.dev`），它为每份授权保存：

- 你的姓名和邮箱、Paddle 的客户号和交易号、授权码和签发日期；
- 每台激活过的 Mac：上面「授权校验」一条说的哈希、App 版本号、激活时间，以及最近一次校验的日期（每天最多记一次）。释放座位后，只有这个哈希还留在授权码名下，让退款仍然能结束那台 Mac 的试用；
- 授权码是否被作废，以及原因（退款或拒付）。

对每台开始试用的 Mac，不论你买不买，它都保存同样的哈希、试用的开始和结束时间、最早和最新的 App 版本号，以及最近一次校验的日期。

这些用来：把授权码发到你的邮箱；在结账后跳转的页面上再显示一次（24 小时内）；统计一个授权码用在几台 Mac 上；让每台 Mac 只有一次试用；让退款后的授权码在激活过的 Mac 上停下来：退款完成后，那里的 App 停止复制，`lo` 停止付费命令；联网且 Lastout 正在运行的 Mac 上约 15 分钟内，其他 Mac 最迟一天。退款也会结束这些 Mac 的试用。除了回复你的来信，带授权码的那封邮件是我们唯一会发的邮件：没有订阅通讯，也没有营销名单。如果你在结账时填了邮箱却没有完成购买，Paddle 可能发给你一封提醒；那封邮件来自 Paddle，适用 Paddle 的隐私政策，不是我们发的。作为 Paddle 上的卖家，我们还能在 Paddle 后台看到你的订单：买了什么、什么时候、多少钱、你的国家和邮箱。

你也可以直接向我们购买，比如通过交易平台或聊天软件联系我们之后。这时不经过结账页：你用双方确认的方式付款给我们（适用那家支付服务自己的隐私政策），授权由我们自己录入。授权服务器为它保存：你的姓名、你给我们的邮箱或其他联系方式（比如聊天软件的 ID）、你从哪里找到我们、付款的金额、币种和日期、我们做过的退款、我们为这笔订单写的备注，以及和上面一样的授权码和 Mac 哈希。这些用来把授权码发给你、回复你、处理退款；上面说的那封授权码邮件不会为它发送。

我们在一个只有我们能登录的管理后台（`admin.lastout.dev`，登录要密码和一次性验证码）里查看和修改授权记录。它和授权服务器一样运行在 Cloudflare 上，并记录在后台做过的每次改动。

授权记录在授权存续期间一直保留，因为没有它就无法校验授权码；试用记录在 Lastout 销售授权期间一直保留，因为每台 Mac 只有一次试用。它存放在 Cloudflare；发授权码邮件时，你的姓名、邮箱和授权码会经过 Resend。它们和 Paddle 一样，可能在你所在国家以外（包括美国）处理这些数据。数据库只有我们有登录权限，托管在 Cloudflare。App 和网站通过 HTTPS 连接授权服务器。

## 网站

lastout.dev 是一组由 GitHub Pages 托管的静态页面。网站自己不设 cookie，自己也没有统计、追踪像素或广告。字体从 Google Fonts 加载。产品页一打开就会加载 Paddle 的结账脚本（Paddle.js），这样「Buy」才能在页面上打开 Paddle 的结账窗口。页面会加载 Paddle.js，它还会加载 Paddle 自家的分析产品 ProfitWell，并可能设置 Paddle 的 cookie。Paddle.js、ProfitWell 和结账窗口都属于 Paddle，适用 Paddle 的隐私政策和 cookie 政策。付款后，感谢页用地址里的交易号向授权服务器取你的授权码。

## 第三方

- **Paddle**：销售授权、处理付款（见上）。产品页加载的它的脚本还会加载它的分析产品 ProfitWell（见「网站」）。
- **Cloudflare**：运行授权服务器、它的数据库和管理后台，并转发发到 support@lastout.dev 的邮件。
- **Google**（Google Workspace）：托管收到这些邮件的邮箱，所以你的来信和邮箱地址会保存在那里。
- **Resend**：发送带授权码的邮件。
- **GitHub**：托管更新检查读取的发布，以及 lastout.dev 网站。
- **Google Fonts**：提供网站的字体。

它们各自只接触经过自己的那部分，适用各自的隐私政策。此外没有：Lastout 不内嵌统计、崩溃上报或广告 SDK（Sparkle 更新框架是开源的，什么都不上报）。我们不出售你的数据，也不与其他任何人分享，法律要求的除外。

## 你的权利

Lastout 记录的内容留在你的 Mac 上，用上面的命令由你自己管理，我们看不到。对于我们保存的授权记录，写信到 support@lastout.dev 可以要一份副本、更正或删除。删除后，这个授权码会在一天内在所有 Mac 上停止工作，因为 App 会再次校验它；删除一台 Mac 的试用记录，它就有一次新的试用。Paddle 按税法要求保留自己的订单记录：可以直接找 Paddle，也可以找我们转达。视你所在地区（比如欧盟、英国或加州），法律可能还给你更多权利，比如提出反对，或向数据保护机构投诉。

我们使用授权和试用记录，是因为交付你买的或正在试用的东西需要它们（按欧盟和英国法律，法律依据是履行与你的合同：EULA 里的试用和授权条款）。

## 变更

Lastout 处理数据的方式有变化时，这一页会在带来变化的版本发布之前更新，顶部的日期随之更新。
