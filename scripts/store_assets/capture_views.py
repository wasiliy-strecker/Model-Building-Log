"""Capture the real seeded app, with no UI replacement or database access."""
import argparse
from pathlib import Path
import time

from capture import Capture

PROJECT = "Propellerflugzeug 1:48"


def capture_views(c, profile):
    if not c.run("emu", "avd", "name").decode().startswith(f"ml_store_assets_{profile}_"):
        raise ValueError("Requested profile does not match the real capture AVD")
    folder = Path("build/store-assets/raw") / profile
    c.start()
    if profile == "phone":
        c.align(PROJECT, target=.46)
    c.capture(folder / "01-uebersicht.png")
    c.reveal(PROJECT)
    c.tap(PROJECT)
    if profile == "phone":
        c.capture(folder / "02-projektdetails.png")
    c.align("Bauverlauf", target=.15 if profile == "phone" else 200 / c.height)
    if profile == "phone":
        # Move the remaining edge of the preceding action above the app bar.
        x, y = str(c.width // 2), c.height * 3 // 4
        c.run("shell", "input", "swipe", x, str(y), x, str(y - 60), "650")
    c.capture(folder / "04-bauverlauf.png")
    c.tap("Bauschritt erfassen")
    c.tap("Ohne Foto erfassen")
    c.field("Aktueller Bauschritt *", "6")
    c.field("Titel (optional)", "Rumpf anpassen")
    c.set_date("21.10.2026", "19", "00")
    c.field("Notiz", "Passprobe vor dem Verkleben. Ausrichtung kontrollieren.")
    c.top()
    c.capture(folder / "03-bauschritt.png")
    c.back()
    c.tap("Bauschritt verwerfen")
    c.reveal("Gespeicherte Bauverlaufsprotokolle")
    c.tap("Gespeicherte Bauverlaufsprotokolle")
    c.reveal("Bauverlaufsprotokoll")
    c.tap("Bauverlaufsprotokoll")
    time.sleep(3)
    if not c.has("Drucken") or not c.has("Teilen"):
        raise ValueError("The real PDF preview did not open")
    c.capture(folder / "05-pdf-protokoll.png")
    print(f"Captured real views: {profile}", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("serial")
    parser.add_argument("profile", choices=["phone", "tablet7", "tablet10"])
    args = parser.parse_args()
    capture_views(Capture(args.serial), args.profile)


if __name__ == "__main__":
    main()
