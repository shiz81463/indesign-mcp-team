#!/usr/bin/env python3
import json
import os
import plistlib
import shutil
from pathlib import Path
root = Path(__file__).resolve().parents[1]
node = shutil.which("node")
if not node:
    raise SystemExit("Node executable not found")
node = str(Path(node).resolve())
local = root / "_local"
(local / "verification").mkdir(parents=True, exist_ok=True)
tools = ["document_create", "document_open", "document_save", "document_close",
    "document_getInfo", "document_listOpen", "text_addFrame", "text_setContent",
    "text_getContent", "text_getStories", "text_getTextFrames", "text_applyParagraphStyle",
    "style_listParagraph", "style_createParagraph", "style_createCharacter",
    "image_place", "image_info", "image_relink", "export_document", "script_run",
    "preview_document", "changes_getStatus"]
toml = "\n".join([
    "[mcp_servers.indesign-nutria]",
    "command = " + json.dumps(node, ensure_ascii=False),
    "args = " + json.dumps([str(root / "dist/index.js"), str(local / "server-config.json")], ensure_ascii=False),
    "startup_timeout_sec = 30",
    "tool_timeout_sec = 180",
    "enabled_tools = " + json.dumps(tools), ""])
(local / "codex-mcp.toml").write_text(toml, encoding="utf-8")
client = {"mcpServers": {"indesign-nutria": {"command": node,
    "args": [str(root / "dist/index.js"), str(local / "server-config.json")]}}}
(local / "claude-mcp.json").write_text(json.dumps(client, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
plist = {"Label": "local.indesign-mcp-team",
    "ProgramArguments": [node, str(root / "dist/local/daemon.js")],
    "WorkingDirectory": str(root), "RunAtLoad": True, "KeepAlive": True,
    "ThrottleInterval": 5, "StandardOutPath": str(local / "gateway.stdout.log"),
    "StandardErrorPath": str(local / "gateway.stderr.log"),
    "EnvironmentVariables": {"PATH": str(Path(node).parent) + ":" + os.environ.get("PATH", "/usr/bin:/bin:/usr/sbin:/sbin")}}
encoded = plistlib.dumps(plist)
(local / "launchd.plist").write_bytes(encoded)
agents = Path.home() / "Library/LaunchAgents"
agents.mkdir(parents=True, exist_ok=True)
(agents / "local.indesign-mcp-team.plist").write_bytes(encoded)
print("Generated portable client configurations and LaunchAgent for this machine.")
