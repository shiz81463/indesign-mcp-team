# InDesign MCP 团队部署包

本仓库完整交付本机正在使用的 indesign-nutria-mcp 1.4.1、本机修复、共享后台、UXP 插件、源码与编译产物、依赖锁文件、十个原版 AI skills 和中文操作指南。

## 快速部署（macOS）

前置条件：Adobe InDesign、Adobe UXP Developer Tools、Node.js >=18、npm、Python 3。本机历史宿主验证版本为 InDesign 2025 / 20.5.2.78。Adobe、字体和 Node 不随包分发，npm ci 需要网络。

~~~sh
git clone https://github.com/shiz81463/indesign-mcp-team.git
cd indesign-mcp-team
bash scripts/install-macos.sh
~~~

1. 在 UXP Developer Tools 中 Add Plugin，选择 plugin/manifest.json，点击 Load/Reload。
2. 插件连接 ws://127.0.0.1:8121，共享 MCP 地址为 http://127.0.0.1:8122/mcp。
3. 将生成的 _local/codex-mcp.toml 服务段合并进 ~/.codex/config.toml，保留其它服务。Claude/Cursor 使用 _local/claude-mcp.json。
4. 重载 AI 客户端 MCP 配置，然后运行 node _local/check-connection.mjs。

也可以直接下载 [完整 ZIP](https://github.com/shiz81463/indesign-mcp-team/archive/refs/tags/v1.4.1-team.1.zip)，解压后运行安装脚本。包内 MANIFEST.json 提供逐文件 SHA-256；需要自建单文件 ZIP 时可运行 python3 scripts/make-release.py。

## 文档与范围

- [中文部署、操作与故障排查](docs/TEAM_GUIDE.zh-CN.md)
- [出处、本机修复与验证记录](docs/LOCAL_CHANGES.md)
- [上游说明](docs/UPSTREAM_README.md)
- [Windows 上游说明](WINDOWS.md)：本团队共享服务安装流程尚未在 Windows 验证。
- [文件清单与哈希](MANIFEST.json)
- [MIT 许可证](LICENSE)

每名成员在各自电脑部署一份，服务仅监听本机回环地址。共享后台解决同一电脑多客户端端口冲突，编辑同一文档仍由一个逻辑写入者负责。Codex 默认开放 22 个常用工具。

历史记录报告 895 项自动测试与双真实客户端验证通过。本次发布做了 TypeScript 无输出检查和包内语法检查；全新电脑安装和全部宿主操作未重新执行。请按指南验收新机器。
