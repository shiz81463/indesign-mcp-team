#!/usr/bin/env bash
set -euo pipefail
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This installer supports macOS only. See WINDOWS.md for upstream Windows notes." >&2
  exit 1
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
command -v node >/dev/null || { echo "Install Node.js first." >&2; exit 1; }
command -v npm >/dev/null || { echo "Install npm first." >&2; exit 1; }
command -v python3 >/dev/null || { echo "Install Python 3 first." >&2; exit 1; }
node -e 'if(Number(process.versions.node.split(".")[0])<18)process.exit(1)' || { echo "Node >=18 required." >&2; exit 1; }
cd "$ROOT"
npm ci
npm run build
python3 scripts/configure-macos.py
PLIST="$HOME/Library/LaunchAgents/local.indesign-mcp-team.plist"
DOMAIN="gui/$(id -u)"
launchctl bootout "$DOMAIN" "$PLIST" 2>/dev/null || true
launchctl bootstrap "$DOMAIN" "$PLIST"
launchctl kickstart -k "$DOMAIN/local.indesign-mcp-team"
printf '%s\n' "Shared service started. Merge _local/codex-mcp.toml or _local/claude-mcp.json into your client configuration."
printf '%s\n' "Load plugin/manifest.json in Adobe UXP Developer Tools, then run: node _local/check-connection.mjs"
