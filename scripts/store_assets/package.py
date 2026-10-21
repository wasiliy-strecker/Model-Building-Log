"""Validate real captures and document the fifteen German Play upload images."""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image


PHONE = [
    ("01-uebersicht", "Modellbauprojekte mit aktuellem Bauschritt und einem Foto der Cockpitmontage."),
    ("02-projektdetails", "Propellerflugzeug mit Projektfoto, Modelltyp, Material und zuletzt gespeichertem Bauschritt."),
    ("03-bauschritt", "Manuelle Erfassung eines Bauschritts mit Schrittnummer, Titel, Zeitpunkt und Notiz."),
    ("04-bauverlauf", "Bauverlauf des Propellerflugzeugs mit drei gespeicherten Schritten, Datum, Notizen und Foto."),
    ("05-pdf-protokoll", "Echtes Bauverlaufsprotokoll in der integrierten PDF-Vorschau mit Drucken und Teilen."),
]
TABLET = [
    ("01-uebersicht", PHONE[0][0], PHONE[0][1]),
    ("02-bauverlauf", PHONE[3][0], PHONE[3][1]),
    ("03-bauschritt", PHONE[2][0], PHONE[2][1]),
    ("04-pdf-protokoll", PHONE[4][0], PHONE[4][1]),
]
PACKAGE = "com.appfactory.modellbaulog.dev"
PROFILES = {
    "phone": ((1080, 1920), 360),
    "tablet7": ((1080, 1920), 240),
    "tablet10": ((1440, 2560), 240),
}


def specifications():
    yield ("icon/modellbaulog-icon-512.png", "App-Symbol", (512, 512), "RGBA", 1_000_000,
           "ModellbauLog-Symbol mit weißem Modellflugzeug und gelbem Pinsel auf dunklem Hintergrund.")
    yield ("feature/modellbaulog-feature-1024x500.png", "Vorstellungsgrafik", (1024, 500), "RGB", 15_000_000,
           "ModellbauLog: Dein Modellbau. Schritt für Schritt. Bauschritte, Fotos und PDF-Protokolle mit echter App-Ansicht.")
    for folder, field, items in [
        ("phone", "Smartphone-Screenshots", PHONE),
        ("tablet7", "7-Zoll-Tablet-Screenshots", [(n, a) for n, _, a in TABLET]),
        ("tablet10", "10-Zoll-Tablet-Screenshots", [(n, a) for n, _, a in TABLET]),
    ]:
        for name, alt in items:
            yield (f"{folder}/{name}.png", field, PROFILES[folder][0], "RGB", 8_000_000, alt)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate_image(path, size, mode, limit):
    with Image.open(path) as im:
        im.load()
        if im.format != "PNG" or im.size != size or im.mode != mode:
            raise ValueError(f"Invalid image format, dimensions or color mode: {path}")
        if mode == "RGBA" and im.getextrema()[3] != (255, 255):
            raise ValueError(f"Store icon must have an opaque full-square background: {path}")
        if "transparency" in im.info:
            raise ValueError(f"Unexpected transparency: {path}")
    length = path.stat().st_size
    if not 0 < length <= limit:
        raise ValueError(f"Image exceeds size limit: {path}")
    return {"width": size[0], "height": size[1], "mode": mode, "bytes": length,
            "sha256": sha256(path)}


def validate_capture(geometry, profile):
    size, density = PROFILES[profile]
    if not geometry["avd"].startswith(f"ml_store_assets_{profile}_"):
        raise ValueError("Wrong source AVD profile")
    if geometry["package"] != PACKAGE:
        raise ValueError("Wrong source package")
    if geometry.get("locale") != "de-DE":
        raise ValueError("Wrong source locale")
    if geometry["size"] != f"Physical size: {size[0]}x{size[1]}" or geometry["density"] != f"Physical density: {density}":
        raise ValueError("Wrong actual capture geometry")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    out = args.output
    specs = list(specifications())
    expected = {s[0] for s in specs}
    actual = {str(p.relative_to(out)) for folder in ["icon", "feature", "phone", "tablet7", "tablet10"]
              for p in (out / folder).glob("*.png")}
    if actual != expected:
        raise ValueError(f"Unexpected upload file set: missing={expected-actual}, extra={actual-expected}")
    entries = []
    raw_root = Path("build/store-assets/raw")
    for filename, field, size, mode, limit, alt in specs:
        if len(alt) > 140:
            raise ValueError(f"Alt text too long: {filename}")
        entry = {"file": filename, "playConsoleField": field, "altText": alt,
                 **validate_image(out / filename, size, mode, limit)}
        folder, name = filename.split("/")
        if folder in PROFILES:
            raw_name = name if folder == "phone" else {
                f"{n}.png": f"{raw}.png" for n, raw, _ in TABLET
            }[name]
            raw = raw_root / folder / raw_name
            geometry = json.loads(raw.with_suffix(".json").read_text())
            validate_capture(geometry, folder)
            validate_image(raw, size, "RGB", 8_000_000)
            raw_hash = sha256(raw)
            if folder != "phone" and raw_hash != entry["sha256"]:
                raise ValueError(f"Tablet upload differs from actual capture: {filename}")
            entry["capture"] = {**geometry, "rawSha256": raw_hash}
        entries.append(entry)
    source = json.loads((raw_root / "source.json").read_text())
    apk = Path(source["apkPath"])
    if source["package"] != PACKAGE or source["apkSha256"] != sha256(apk):
        raise ValueError("Source APK changed after capture")
    validate_image(out / "VORSCHAU.png", (1680, 2360), "RGB", 15_000_000)
    manifest = {"locale": "de-DE", "source": source, "images": entries}
    (out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    lines = ["# ModellbauLog – Store-Grafiken", "", "15 Upload-Dateien für den deutschen Google-Play-Eintrag.", "",
             "Die Nummerierung bestimmt die Upload-Reihenfolge innerhalb des jeweiligen Feldes.", "",
             "| Datei | Play-Console-Feld | Maße | Dateigröße |", "| --- | --- | --- | --- |"]
    for e in entries:
        length = f'{e["bytes"]:,}'.replace(',', '.')
        lines.append(f'| `{e["file"]}` | {e["playConsoleField"]} | {e["width"]} × {e["height"]} | {length} Bytes |')
    lines += ["", "`VORSCHAU.png`, `README.md` und `manifest.json` dienen der Prüfung und werden nicht hochgeladen.",
              "", "## Herkunft", "",
              f'App: ModellbauLog {source["versionName"]} ({source["versionCode"]}), eigenständige Dev-Preview für x86_64.',
              f'Paket: `{PACKAGE}`. Quellstand: `{source["gitCommit"]}`.',
              f'APK-Prüfsumme: `{source["apkSha256"]}`.', "",
              "Echte Android-Aufnahmen aus drei eigenen API-35-Emulatoren mit deutscher Oberfläche und normaler Schriftgröße.",
              "Smartphone: 1080 × 1920 bei 360 dpi. Nexus-7-Profil: 1080 × 1920 bei 240 dpi. Nexus-10-Profil: 1440 × 2560 bei 240 dpi.",
              "Die vollständigen Smartphone-Aufnahmen sind proportional auf 1550 Pixel Höhe skaliert, darüber stehen kurze Nutzenüberschriften.",
              "Tablet-Bilder sind direkte Aufnahmen ohne zusätzlichen Text, Geräterahmen oder Layoutänderung.", "",
              "Alle Projekte und Bauschritte sind fiktiv und wurden über die echte Oberfläche erfasst.",
              "Das Bauverlaufsprotokoll wurde in der App erzeugt. Die Tablet-Daten stammen aus deren echtem verschlüsselten Demo-Backup.",
              "Das Foto stammt aus `assets/photo-examples/01_flugzeug_cockpit.jpg`. Es ist ein eigenes KI-generiertes Beispiel vom 21. Oktober 2026.",
              "Bildherkunft und vollständiger Prompt sind in `assets/photo-examples/README.md` und `prompts.json` dokumentiert.",
              "Das bestehende Icon stammt aus `assets/icon.png`. Nur der Store-Export wurde auf 512 Pixel skaliert und bis in die Ecken mit Anthrazit gefüllt.",
              "Roboto und die Schriftlizenz liegen unter `assets/ui/`.", "",
              "Reproduktionshinweise: `scripts/store_assets/README.md`. Rohbilder und Aufnahmeprofile: `build/store-assets/raw/`.",
              "", "## Prüfung", "",
              "PNG-Dekodierung, Anzahl, Maße, Farbmodus, Transparenz und Dateigrößen werden automatisch geprüft.",
              "Das Manifest enthält SHA-256-Prüfsummen und die Herkunft jeder Aufnahme. Tablet-Ausgaben entsprechen ihren Rohaufnahmen.",
              "Alle Grafiken wurden zusätzlich auf Lesbarkeit, deutsche Texte und echte Funktionen angesehen.",
              "", "[Google-Play-Vorgaben](https://support.google.com/googleplay/android-developer/answer/9866151?hl=de)",
              "", "## Alt-Texte", ""]
    for e in entries:
        lines += [f'### {e["file"]}', "", e["altText"], ""]
    (out / "README.md").write_text("\n".join(lines))
    print(f"Validated {len(entries)} upload PNGs. Largest: {max(e['bytes'] for e in entries):,} bytes.")


if __name__ == "__main__":
    main()
