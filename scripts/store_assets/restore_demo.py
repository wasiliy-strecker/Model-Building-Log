"""Restore only the fictional demo backup through Android's real file picker."""
import argparse
from pathlib import Path
import time

from capture import Capture


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("serial")
    args = parser.parse_args()
    c = Capture(args.serial)
    name = c.run("emu", "avd", "name").decode().splitlines()[0]
    if not name.startswith(("ml_store_assets_tablet7_", "ml_store_assets_tablet10_")):
        raise ValueError("Restore only on a dedicated tablet capture AVD")
    backup = Path("build/store-assets/raw/demo/Demo.mlbackup")
    if not backup.is_file():
        raise ValueError("Create the real fictional demo backup on the phone first")
    c.start()
    if not c.has("Erstes Projekt anlegen"):
        raise ValueError("Expected a fresh empty tablet app")
    c.run("push", str(backup), "/sdcard/Download/ModellbauLog-Demo.mlbackup")
    c.tap("Einstellungen")
    c.tap("Backup wiederherstellen")
    c.tap("Root-Verzeichnis anzeigen")
    c.tap("Downloads")
    c.tap("ModellbauLog-Demo.mlbackup")
    c.field("Passwort", "Demo2026")
    c.tap("Weiter")
    time.sleep(2)
    if not any("3 Projekte und 5 Bauschritte" in n.get("text", "") for n in c.nodes()):
        raise ValueError("The selected backup does not contain the expected fictional data")
    c.tap("Wiederherstellen")
    time.sleep(4)
    c.start()
    if not c.has("3 Projekte"):
        raise ValueError("Demo restore did not produce three projects")
    print(f"Restored three fictional projects and five steps: {args.serial}", flush=True)


if __name__ == "__main__":
    main()
