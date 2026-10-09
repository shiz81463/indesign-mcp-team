# 来源、本机修改与打包调整

- 上游：nutriandrea/adobe-indesign-mcp
- 固定源提交：0788838a9f66ff61cdcb51af4aa9e02605a97efe
- package.json 版本：1.4.1
- 团队发布：v1.4.1-team.1
- 打包日期：2026-10-09
- MIT 上游版权：Andrea Cacioppo

保留本机未提交修改：插件自动连接；Image.itemLink/PPI/框体适配；Font 字体样式解析；src/index.ts 共享代理入口；src/local 共享后台与 HTTP 网关；src/standalone.ts 独立后端；对应测试。Codex 常用工具配置源于原机器的 22 个 enabled_tools。

打包调整：辅助客户端改用 process.execPath；连接检查自动创建验证目录；共享客户端配置中旧桥接端口统一标注为 8121；增加生成本机路径的 macOS 安装脚本和客户端配置；保留 dist，依赖通过锁文件与 npm ci 安装。

未发布 .git、旧配置备份、日志、原机器连接回执、用户作品、演示视频、作品集脚本或 node_modules。十个原版 .opencode/skills 保留，供按需采用；其中创作与导出偏好不是安装流程的强制规则。

本次通过 TypeScript tsc --noEmit、辅助脚本 Python/Bash/JavaScript 语法检查与 JSON 检查。文件清单与 ZIP 来自同一份上传内容。

历史记录报告 2026-09-08 的 895 项测试及双真实客户端成功；新安装脚本只有静态验证，尚未在全新电脑执行。团队应按指南在独立文档验收。
