#!/usr/bin/env python3
import hashlib
import json
import os
import zipfile
from pathlib import Path
root = Path(os.environ.get("GITHUB_WORKSPACE", str(Path(__file__).resolve().parents[1])))
manifest = json.loads((root / "MANIFEST.json").read_text())
tag = os.environ.get("RELEASE_TAG", manifest["release"])
if tag != manifest["release"]:
    raise SystemExit("Release tag does not match the package manifest")
output = Path(os.environ.get("RUNNER_TEMP", str(Path.cwd())))
name = "indesign-mcp-team-" + tag + ".zip"
paths = [row["path"] for row in manifest["files"]] + ["MANIFEST.json"]
for row in manifest["files"]:
    data = (root / row["path"]).read_bytes()
    if len(data) != row["bytes"] or hashlib.sha256(data).hexdigest() != row["sha256"]:
        raise SystemExit("Manifest mismatch: " + row["path"])
with zipfile.ZipFile(output / name, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for path in sorted(paths):
        info = zipfile.ZipInfo("indesign-mcp-team/" + path, (2026, 10, 9, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        executable = (path.startswith("scripts/") and path.endswith((".sh", ".py"))) or path == "dist/index.js"
        info.external_attr = (0o100755 if executable else 0o100644) << 16
        z.writestr(info, (root / path).read_bytes())
with zipfile.ZipFile(output / name) as z:
    assert z.testzip() is None and len(z.namelist()) == len(paths)
digest = hashlib.sha256((output / name).read_bytes()).hexdigest()
(output / "SHA256SUMS.txt").write_text(digest + "  " + name + "\n")
print(json.dumps({"file": name, "files": len(paths), "sha256": digest}))
