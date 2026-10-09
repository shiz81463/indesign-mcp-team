# InDesign MCP 中文部署与操作指南

## 前置条件

每台电脑需要 Adobe InDesign、Adobe UXP Developer Tools、Node >=18、npm、Python 3。插件声明最低 InDesign 18.5，历史真实宿主验收只有 2025 / 20.5.2.78；其它版本需独立验收。Adobe、字体、用户作品、凭据与 node_modules 不随包分发。

将仓库或解压目录放在固定位置，例如 ~/tools/indesign-mcp-team。安装脚本覆盖 macOS 登录用户 LaunchAgent。Windows 参考上游 WINDOWS.md，本团队共享服务流程未在 Windows 验证。

## 安装与配置

~~~sh
cd /你的固定路径/indesign-mcp-team
bash scripts/install-macos.sh
~~~

脚本执行 npm ci、npm run build，创建验证目录，生成当前机器路径的配置和 LaunchAgent，然后启动后台。不会直接修改 AI 客户端配置。

- _local/codex-mcp.toml：合并到 ~/.codex/config.toml。已有同名服务时替换该服务段，避免重复键。
- _local/claude-mcp.json：合并 mcpServers.indesign-nutria 到 Claude Desktop / Cursor 的 MCP 配置，保留其它服务。
- _local/launchd.plist：后台配置；安装副本在 ~/Library/LaunchAgents/local.indesign-mcp-team.plist。

Codex 默认启用 22 个常用工具，保留 script_run。注册工具数与客户端启用工具数不同。需要其它工具时调整 enabled_tools；全量宿主接口未经逐项验收。

旧后台可能占用 8121/8122。先识别旧 InDesign MCP 服务，再停止它；不要终止无关进程。

~~~sh
lsof -nP -iTCP:8121 -iTCP:8122 -sTCP:LISTEN
launchctl print "gui/$(id -u)/local.indesign-mcp-team"
~~~

## Adobe 插件加载

1. 打开 InDesign 和 UXP Developer Tools。
2. Add Plugin，选择本仓库 plugin/manifest.json。
3. Load / Reload InDesign MCP Bridge。
4. 检查 URL 为 ws://127.0.0.1:8121，面板显示已连接。
5. 若未连接，点击 Connect 或 Reload 插件。

客户端添加 MCP 配置不会自动安装或加载 Adobe 插件。Adobe 登录与插件加载授权由每名成员自行完成。

## 安装验收

~~~sh
node _local/check-connection.mjs
~~~

检查脚本等待插件连接，读取宿主版本、列出工具。成功输出含 connected: true，并生成 _local/verification/configured-connection.json。此检查只读，不创建文档。

双客户端检查先在 InDesign 打开含第一页文本框的测试文档，再运行：

~~~sh
node _local/verify-shared.mjs
~~~

同时读两个客户端状态，关闭其中一个后继续读取。文本框不存在的错误说明测试文档不符合条件，不代表服务连接失败。

## 日常操作

先读 mcp://bridge/status，确认 connected=true，再调用 document_listOpen / document_getInfo 确认目标文档。按需要新建文档、编辑文本与样式、置入图像、保存，明确要求导出时再导出。文件路径使用当前电脑的绝对路径。

单个工具调用被串行化，多名 agent 仍可能交错修改同一文档，一个母本由一个逻辑写入者负责。操作前保存母本，首次使用功能先在独立测试文档验收。

文件客户端示例：

~~~sh
printf '%s\n' '{"calls":[{"name":"document_getInfo","arguments":{}}]}' > request.json
node _local/call.mjs "$PWD/request.json"
~~~

回执写到 request.json.receipt.json。工具错误后停止该批后续调用；返回图像独立保存。不要启动第二个 Adobe 后端。

## 维护与排障

- 8122 拒绝连接：检查 LaunchAgent 状态和 _local/gateway.stderr.log。
- 插件断线：先确认后台正常，再 Reload 插件，自动重试次数有限。
- 工具清单仍旧：重载 AI 客户端 MCP 配置。
- 端口冲突：用 lsof 识别旧服务，不额外启动不传共享配置的原版后端。
- 移动目录或更换 Node：在新位置重跑安装脚本，再合并生成的新客户端配置。
- 图文异常：检查字体、素材路径、链接及溢出。原生枚举有时序列化为 {}，可通过 script_run 比较原生枚举确认。

~~~sh
launchctl kickstart -k "gui/$(id -u)/local.indesign-mcp-team"
tail -n 80 _local/gateway.stderr.log
~~~

关闭团队后台：

~~~sh
launchctl bootout "gui/$(id -u)" "$HOME/Library/LaunchAgents/local.indesign-mcp-team.plist"
~~~

取消登录自启：先关闭服务，再删除上述 plist。不要删除其它 MCP 服务配置。

## 许可与验证边界

基于 nutriandrea/adobe-indesign-mcp 1.4.1，上游 SHA 0788838a9f66ff61cdcb51af4aa9e02605a97efe。MIT 上游版权 Andrea Cacioppo，完整 LICENSE 保留。Adobe 与字体遵循各自授权。

2026-09-08 历史记录报告 52 个文件、895 项自动测试通过，并验证图文、保存、重开、普通 PDF 导出和双客户端读取。194 个注册工具不等于全量宿主验收；高级导出、跨调用撤销组、Windows 与新宿主版本需要独立测试。

本次发布未在全新电脑安装，未重新运行全部宿主操作。以成员电脑上的连接检查与测试文档验证为验收依据。原机器回执和用户作品不随包发布。仓库为私有，团队访问权由所有者在 GitHub Settings 中授予。
