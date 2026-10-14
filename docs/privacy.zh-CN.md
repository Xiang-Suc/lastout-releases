# 隐私

[English](privacy.md) · 简体中文

Lastout 记录什么、存在哪、什么会离开你的电脑、怎么删除。每一条都对照过代码，并写明是哪个命令或设置在管。

## 记录什么

在用 `lo setup`（或 App）接入的终端里，对每条命令：

- shell 看到的命令行、工作目录和当时的 git 分支、开始和结束时间、退出状态；
- 命令打印到终端的内容：原始输出的前 1 MB 和后 4 MB，压缩存储。这包括命令运行期间终端回显的内容，比如你在提示符处输入的文字。不回显的提示（密码）不会被回显，所以不会被记录；
- 每个终端会话：终端程序的名字、tty 和录制进程的 pid，让 `lo` 分得清哪个终端是哪个。

除此之外没有：命令之外的按键、截图、命令没打印出来的文件内容、其他 App 的信息，都不记录。

## 不记录什么

- **以空格开头的命令**：连命令文本都不存（那一行只显示 `(private)`）。这是 shell 自己「不进历史」的约定。
- **暂停期间**：`lo pause`（所有终端）或 `lo pause --here`（只这一个），可加 `--for 30m`；`lo resume` 提前结束。什么都不存，连命令都不存。
- **会打印密钥的命令**：内置列表（`op`、`pass`、`gopass`、`bw`、`lpass`、`aws configure`、`aws sts`、`gcloud auth`、`az login`、`ssh-keygen`、`gpg --export-secret-keys`、`security find-*-password`、`vault read|kv get|login|token`、`kubectl get secret`、`kubectl config view`、`gh auth token`、`heroku auth:token`、`npm token`、`doppler secrets`、`openssl genrsa`、`openssl genpkey`、`age-keygen`、`wg genkey` 等，完整列表在 `crates/lastout-core/src/config.rs`）只保留命令行和退出状态，从不保存输出。配置文件里 `record.ignore` 可以加自己的，`record.allow` 可以把内置条目放开。
- **你没有接入的终端**：只有 rc 文件里有 `lo setup` 写入的两段标记代码的 shell 才会被录制。`lo setup --uninstall` 从所有地方移除它们。

## 存在哪

| 内容 | 位置 |
|---|---|
| 记录（SQLite 索引 + 压缩的输出文件） | macOS：`~/Library/Application Support/lastout/`；Linux：`$XDG_DATA_HOME/lastout/`（默认 `~/.local/share/lastout/`）；或 `$LASTOUT_HOME` |
| 配置 | `~/.config/lastout/config.toml`（遵守 `$XDG_CONFIG_HOME`），或 `$LASTOUT_CONFIG` |
| App 设置（快捷键、通知阈值） | `~/Library/Preferences/dev.lastout.app.plist` |

数据目录以 700 权限创建（只有你的用户能读）；`lo doctor` 会检查它还是不是。自动清理：每个终端 200 条、30 天、总共 500 MB，超出先删最旧的。

## 什么会离开你的电脑

你记录的内容，永远不会自己离开。命令行工具没有任何网络代码。菜单栏 App 只有一种连接：每天一次（以及你点「检查更新…」时）从 `github.com/Xiang-Suc/lastout-releases/releases/latest/download/appcast.xml` 取发布列表，看有没有新版本。这个请求不携带你或你机器的任何信息（Sparkle 的系统信息上报是关闭的），更新只在你同意后安装，且签名必须与 App 内置的公钥匹配。没有遥测、没有崩溃报告、没有账号。输出只在你或你运行的工具要求时才离开：

- **复制**（`lo`、菜单栏快捷键、通知上的「复制」按钮）把整理后的输出放到剪贴板，先遮盖密钥。通过 `lssh` 时，剪贴板仍是本地的。
- **打印**（`lo --print`、`lo --json`）把它写到终端，先遮盖密钥。
- **Agent**（`lo mcp`，给 Claude Code、Codex 等用的 MCP 服务器）：只读的工具，返回整理后的输出，遮盖始终开启。Agent 没有任何参数能关掉它，服务器也不能写或删任何东西。
- **通知**在你的屏幕上显示命令行和退出状态，通过 macOS 通知中心，仅此而已。
- **激活**（付费版）：你输入的许可证密钥会发给许可证服务器校验一次；你的记录不会随之发送。用哪个服务器及其隐私政策，配置好后会写在这里；在此之前 App 拒绝一切密钥。
- **诊断信息**（设置 → 关于 →「导出…」）把一个 zip 存到你选的位置，供你报告问题时附上；App 不会把它发到任何地方。里面有：版本、Lastout 的设置、屏幕尺寸、`lo doctor` 的检查结果、正在记录的终端数量、Lastout 自己最近一天的日志，以及最近 30 天的崩溃报告。主目录显示为 `~`，用户名和电脑名会被替换，不含任何命令行、输出或许可证密钥。

### 遮盖

对每次复制、打印和 Agent 读取生效，从不改动存储的内容（所以才有 `lo forget` 处理打印过的密码）。每处匹配变成带标签的标记，例如 `[REDACTED:github-token]`，LLM 仍能知道那里原来是什么。规则：已知的 token 格式（GitHub、GitLab、AWS access key、Google、Stripe、Slack token 和 webhook、SendGrid、Twilio、Shopify、npm、PyPI、DigitalOcean、Hugging Face、JWT、通用 API key）、私钥块、URL 里的密码、`Authorization` 头和 bearer token、`--password` 这类参数、`SECRET=value` 赋值。你自己的格式写在配置的 `redact.patterns`（正则）。`lo --no-redact` 只对你自己做的复制跳过遮盖，别的途径都不行。

## 远程主机

`lo remote-install host` 在远程主机上放三个很小的 shell 脚本和每个 rc 文件一段标记代码，不装二进制。用 `lssh host` 时，远程每条命令的输出经由你自己的 ssh 连接传到你机器上的录制进程，只存在你这里。远程主机什么都不保留。

## 删除

- `lo forget` 删上一条命令；`lo forget --id 42` 删指定的；`lo forget --all` 全删。每种都会删掉行、输出文件以及它们在数据库文件里占过的字节（会 vacuum），空闲空间里恢复不出来。
- `lo setup --uninstall` 从所有 shell 的 rc 文件（以及它创建的登录文件）里移除 Lastout 的代码块。开着的终端照旧，新开的恢复原样。
- 要清得一干二净：上表里的两个目录、`/Applications` 里的 App、`~/.local/bin` 里的 `lo` 和 `lastout-shell`。Homebrew cask 的 `zap` 做的是同样的事。

## 菜单栏 App

它启动时申请一个权限：通知；不给也能用（菜单和快捷键不需要）。「登录时启动」默认关闭，要在设置里自己打开。它不需要辅助功能、屏幕录制或输入监控权限。唯一的网络连接就是上面说的更新检查。

你录屏或共享屏幕时，它的浮层（灵动岛、全局浮窗、侧边停靠、复制提示、选择面板）不会被截进去：你自己照常能看到，截图、录屏和看你屏幕的人看不到。它们也不会出现在其他 App 的全屏空间里。这两项默认打开，可以在「设置 → 外观」里关掉，比如要录 Lastout 的演示时。

## 第三方

GitHub：托管更新检查读取的发布（那次请求适用他们的隐私政策，和从他们那里下载任何东西一样）。此外没有：Lastout 不内嵌统计、崩溃上报或广告 SDK（Sparkle 更新框架是开源的，什么都不上报）。如果将来的付费版需要一次性的许可证校验，发送什么、发给谁，会在上线前写在这里。
