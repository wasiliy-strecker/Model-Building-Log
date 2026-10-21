# ModellbauLog Store-Grafiken

App-lokale Werkzeuge für echte Android-Aufnahmen und die deutsche Play-Übergabe.
Die Gestaltung folgt SerienLog und den kurzen Nutzenüberschriften von
ZählerstandLog. Es gibt keine Laufzeitabhängigkeit zu diesen Apps.

## Voraussetzungen und APK

Alle Befehle im ModellbauLog-Verzeichnis ausführen. Benötigt werden Node 22+,
Python mit Pillow, ImageMagick, Google Chrome, JDK 21 und das vorhandene
Android-API-35-Image `google_apis/x86_64`.

Die zum Auftrag vorhandenen APKs enthielten ausschließlich ARM64. Deshalb wurde
einmal eine eigenständige Dev-Preview für die Emulatoren gebaut:

```bash
MODELLOG_ANDROID_ARCHITECTURES=x86_64 npm run build:preview
python3 scripts/store_assets/record_source.py
```

`record_source.py` prüft die tatsächliche APK auf Dev-Paketkennung, Version,
x86_64-Bibliotheken, eingebettetes JavaScript und fehlende Netzwerkberechtigung.
Die Quelle wird mit Git-Stand und SHA-256 in `build/store-assets/raw/source.json`
festgehalten. Bei späteren Aufnahmen eine passende aktuelle APK wiederverwenden.
Keine Store-Version und keine AAB erzeugen.

## Isolierte Aufnahmeprofile

Jeder Aufruf legt ein neues leeres AVD unter `/dev/shm` an. Die Prozesse bleiben
bis zum gezielten Beenden der eigenen Emulatoren geöffnet. Belegte Ports werden
abgewiesen. `ML_EMULATOR_PORT` und `ML_ANDROID_SDK` erlauben abweichende Pfade und
freie Ports. Bei einem anderen SDK auch `ML_ADB` für die Python-Helfer setzen.

```bash
bash scripts/store_assets/prepare_emulator.sh phone
ML_EMULATOR_PORT=5590 bash scripts/store_assets/prepare_emulator.sh tablet7
ML_EMULATOR_PORT=5592 bash scripts/store_assets/prepare_emulator.sh tablet10
```

| Profil         | AVD-Basis    | Pixel       | Dichte  | Logische Breite |
| -------------- | ------------ | ----------- | ------- | --------------- |
| Smartphone     | Pixel 6      | 1080 × 1920 | 360 dpi | 480 dp          |
| 7-Zoll-Tablet  | Nexus 7 2013 | 1080 × 1920 | 240 dpi | 720 dp          |
| 10-Zoll-Tablet | Nexus 10     | 1440 × 2560 | 240 dpi | 960 dp          |

Deutsch, Europe/Berlin, dunkles Theme, Hochformat und normale Schriftgröße.
Die Displaygeometrie wird beim Anlegen des jeweiligen AVD festgelegt. Tablets
werden separat aufgenommen, nicht aus Smartphone-Aufnahmen hochskaliert.

Vor jeder Installation den ausgegebenen Emulator prüfen. `device.py` akzeptiert
nur Emulator-Seriennummern, `ro.kernel.qemu=1` und den Präfix `ml_store_assets`.
Der vorhandene Installer prüft Paket, Version, Debug-Status, Installer und bei
Updates die Signatur. Ausschließlich die eigenen ausgegebenen Seriennummern
verwenden. Beispiel für das Smartphone:

```bash
python3 scripts/store_assets/device.py emulator-5588 status
npm run install:preview -- emulator-5588
```

Auf den beiden Tablet-Emulatoren entsprechend wiederholen. `status` stellt die
echte Android-Demostatusleiste auf 09:41. Die App-Oberfläche wird nicht retuschiert.

## Fiktive Projekte und echtes PDF

Auf einem frischen Smartphone-AVD nacheinander ausführen. Diese Schritte legen
neue Projekte an und dürfen nicht versehentlich auf demselben Datenbestand
wiederholt werden:

```bash
python3 scripts/store_assets/seed_demo.py emulator-5588 ship
python3 scripts/store_assets/seed_demo.py emulator-5588 car
python3 scripts/store_assets/seed_demo.py emulator-5588 aircraft
```

Segelboot 1:72 hat Schritt 4 „Rumpf beplanken“. Sportwagen 1:24 hat Schritt 8
„Karosserie lackieren“. Propellerflugzeug 1:48 enthält die Schritte 1 „Bauteile
vorbereiten“, 3 „Cockpit lackieren“ und 5 „Cockpit montieren“ vom 18. bis 20. Oktober 2026 um 19:00. Alle Projekte verwenden den fiktiven Hersteller
„Eigenbau“. Das Segelboot besteht aus Holz, die anderen Modelle aus Kunststoff.

Das vorhandene eigene synthetische Cockpitfoto
`assets/photo-examples/01_flugzeug_cockpit.jpg` auf den eigenen Smartphone-Emulator
nach `/sdcard/Pictures/Cockpit.jpg` kopieren und mit Androids Medienscanner
anmelden. Im Flugzeugprojekt Schritt 5 öffnen, bearbeiten und das Bild über
„Fotos aus Galerie hinzufügen“ auswählen. Änderungen speichern. Es gibt keinen
App-Demomodus und keinen direkten Datenbankzugriff.

Im Flugzeugprojekt zum PDF-Bereich scrollen und „PDF erstellen“ → „PDF mit Fotos
erstellen“ verwenden. Das Bauverlaufsprotokoll muss erfolgreich erzeugt sein und
in der echten integrierten Vorschau erscheinen. Keine Fehlermeldungen aus einem
Screenshot entfernen und keine PDF-Oberfläche nachbauen.

Über Einstellungen → „Verschlüsseltes Backup erstellen“ die fiktiven Projekte
mit dem öffentlichen Demopasswort `Demo2026` sichern. Nur diese Sicherung in
`build/store-assets/raw/demo/` ablegen, auf die eigenen Tablets kopieren und dort
über „Backup wiederherstellen“ und die normale Android-Dateiauswahl importieren.
Das Backup enthält die drei Projekte, fünf gespeicherte Bauschritte, das Foto
und das echte Bauverlaufsprotokoll. Keine echten Nutzerbackups verwenden.

Wenn der Demo-Export als `build/store-assets/raw/demo/Demo.mlbackup` vorliegt,
übernimmt der folgende Helfer die echte Dateiauswahl und Wiederherstellung auf
den noch leeren eigenen Tablet-Apps. Er prüft vor dem Import die erwarteten
Projekt- und Bauschrittzahlen.

```bash
python3 scripts/store_assets/restore_demo.py emulator-5590
python3 scripts/store_assets/restore_demo.py emulator-5592
```

## Ansichten aufnehmen

```bash
python3 scripts/store_assets/capture_views.py emulator-5588 phone
python3 scripts/store_assets/capture_views.py emulator-5590 tablet7
python3 scripts/store_assets/capture_views.py emulator-5592 tablet10
```

Das Smartphone zeigt Übersicht, Projektdetails, Erfassung, Bauverlauf und
PDF-Vorschau. Beide Tablets zeigen Übersicht, Bauverlauf, Erfassung und
PDF-Vorschau. Die Erfassung enthält einen ungespeicherten Schritt 6 „Rumpf
anpassen“ vom 21. Oktober um 19:00. Dieser wird nach der Aufnahme über den echten
Verwerfen-Dialog entfernt.

`Capture` bietet kleine UI-Helfer für Eingabe, Datumsauswahl und Scrollen.
Eingaben werden nach dem Fokussieren geprüft. `align` scrollt eine reale Ansicht
zu einer Überschrift. Es werden keine Scrollpositionen zusammengefügt.
Die Smartphone-Übersicht wird zum ersten Projektnamen ausgerichtet, damit das
Foto und alle drei Projekte gemeinsam sichtbar sind.
`device.py SERIAL dump` zeigt die sichtbaren Bedienelemente. Jede Aufnahme erhält
eine JSON-Datei mit Zeitstempel, Seriennummer, AVD, Auflösung, Dichte und Paket.
Die Rohbilder liegen unter `build/store-assets/raw/`.

## Gestaltung, Prüfung und Übergabe

```bash
node scripts/store_assets/render.mjs assets store-assets/de-DE
node scripts/store_assets/render.mjs contact store-assets/de-DE
python3 scripts/store_assets/package.py store-assets/de-DE
npx prettier --write store-assets/de-DE/README.md store-assets/de-DE/manifest.json
python3 -m unittest discover -s scripts/store_assets -p 'test_*.py'
node --check scripts/store_assets/render.mjs
bash -n scripts/store_assets/prepare_emulator.sh
npm run check
```

Der Renderer gestaltet nur den Rahmen um echte Aufnahmen. Smartphone-Header
belegen 330 von 1920 Pixeln, die vollständige Aufnahme darunter 1550 Pixel Höhe.
Tablets werden unverändert übernommen. Anthrazit `#141517`, Gelb `#FFD600`,
Weiß und die vorhandenen Roboto-Schriften stammen aus der App.
Das Icon erhält im Store-Export einen deckenden quadratischen Hintergrund.

Der Paketierer prüft genau 15 Upload-PNGs, vollständige Dekodierung, Maße,
Dateigrößen, Farbmodus und Transparenz. Er vergleicht Tablet-Ausgaben mit ihren
Rohaufnahmen und kontrolliert tatsächliche Auflösung, Dichte, Paket und
AVD-Profil. Er erstellt README, Feldzuordnung, Alttexte und Prüfsummenmanifest.
Die Tests prüfen insbesondere Geräteisolation und ungültige Bilder oder Profile.
Jede Grafik zusätzlich einmal auf Lesbarkeit, echte Funktionen und störende
Dialoge ansehen. Keine allgemeine visuelle Regressionstestreihe durchführen.

Fertige Assets liegen versioniert unter `store-assets/de-DE/`. Rohaufnahmen,
Backups, APKs und HTML-Arbeitsdateien bleiben im ignorierten Build-Verzeichnis.
AVDs liegen temporär unter `/dev/shm`. Nach Abschluss ausschließlich die drei
eigenen, zuvor anhand ihres Namens geprüften Emulatoren beenden. Ausgabeordner
öffnen. Kein Upload, Push, Store-Build oder Update eines echten Smartphones.

[Google-Play-Vorgaben](https://support.google.com/googleplay/android-developer/answer/9866151?hl=de)
