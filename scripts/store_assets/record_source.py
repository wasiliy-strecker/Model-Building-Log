"""Record and verify the existing emulator Dev APK without building anything."""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from zipfile import ZipFile

from capture import PACKAGE


def main():
    apk = Path("android/app/build/outputs/apk/dev/release/app-dev-release.apk")
    sdk = Path(os.environ.get("ML_ANDROID_SDK", str(Path.home() / ".local/android-sdk")))
    versions = sorted((sdk / "build-tools").iterdir(), key=lambda p: tuple(map(int, p.name.split('.'))))
    badging = subprocess.check_output([str(versions[-1] / "aapt"), "dump", "badging", str(apk)], text=True)
    match = re.search(r"^package: name='([^']+)' versionCode='([^']+)' versionName='([^']+)'", badging, re.M)
    if not match or match[1] != PACKAGE or "application-debuggable" in badging:
        raise ValueError("Expected the standalone ModellbauLog Dev preview")
    if "android.permission.INTERNET" in badging:
        raise ValueError("The standalone preview must not require network access")
    with ZipFile(apk) as archive:
        names = archive.namelist()
        architectures = sorted({n.split('/')[1] for n in names if n.startswith('lib/') and n.endswith('.so')})
        if architectures != ["x86_64"] or "assets/index.android.bundle" not in names:
            raise ValueError("Expected an embedded bundle and only x86_64 libraries")
    data = {
        "gitCommit": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
        "apkPath": str(apk),
        "apkSha256": hashlib.sha256(apk.read_bytes()).hexdigest(),
        "package": match[1], "versionName": match[3], "versionCode": int(match[2]),
        "variant": "devRelease", "architecture": "x86_64", "androidApi": 35,
    }
    path = Path("build/store-assets/raw/source.json")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n")
    print(json.dumps(data, indent=2))


if __name__ == "__main__":
    main()
