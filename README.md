# ModellbauLog

Eigenständige lokale Android-App für Modellbauprojekte. React Native,
TypeScript strict, Expo und SQLite bilden die technische Basis aus Hausakte.
Bildschirmfolge und Bedienabläufe orientieren sich an Strick & Häkelbuch.
Beide Vorlagen bleiben unverändert. Die App verwendet keine gemeinsame Bibliothek.

## Bedienung

Die Übersicht zeigt Projekte mit aktuellem Bauschritt und Foto. Projekte lassen
sich suchen, sortieren, anlegen und bearbeiten. Ein Projekt enthält einen
Pflichtnamen und die optionalen Angaben Modelltyp, Hersteller und Material.
Modelltypen können frei eingegeben oder aus Vorschlägen gewählt werden.
Das Vorschaubild stammt aus dem zeitlich letzten Bauschritt mit Foto.
Neuere Schritte ohne Foto ändern den aktuellen Stand, behalten aber dieses Bild.

Im Projekt führt „Bauschritt erfassen“ zur manuellen Eingabe, Kamera oder Galerie.
Ein Bauschritt enthält eine ganze Schrittnummer ab 0, einen optionalen Titel,
Zeitpunkt, Notizen und geordnete Fotos. Notizen können Farben, Teile und
Arbeitsschritte beschreiben. Der aktuelle Stand ist der zeitlich neueste
Bauschritt. Die Nummer darf kleiner als beim vorherigen Stand sein.
Bearbeiten aktualisiert den vorhandenen Bauschritt.

Fotos lassen sich groß öffnen, zoomen, ergänzen, ersetzen, entfernen und
sortieren. Im Editor dienen langes Drücken und Ziehen oder das Fotomenü zum
Sortieren. Entfernte Fotos werden erst gelöscht, wenn kein gespeicherter
Bauschritt oder Entwurf sie mehr benötigt. Offene Bauschritt-Entwürfe werden
lokal gesichert und sind im Projekt wieder erreichbar.

„Fotos vergleichen“ bietet Projektfotos über mehrere Bauschritte hinweg.
Die Auswahl ist nicht auf zwei Fotos begrenzt. Ihre Reihenfolge bestimmt die
Reihenfolge im Vergleich. Im Hochformat stehen zwei Bilder, im Querformat drei
Bilder nebeneinander. Größere Vergleiche sind scrollbar.

Optionale Projekterinnerungen sind zunächst ausgeschaltet und werden lokal von
Android geplant. Einstellungen bieten verschlüsselte Backups mit Passwort,
Speichern, Teilen und Wiederherstellen. Es gibt keine Konten, Cloud, Werbung,
OCR, Dokumentenscanner, PDF-Funktionen, Teilelager oder Einkaufsverwaltung.

## Entwicklung

Node 22, JDK 21 und ein Android SDK werden benötigt. Die Helfer erkennen
standardmäßig `~/.local/android-sdk` und `~/.local/jdk-21`.
Die Abhängigkeiten sind im Lockfile festgelegt.

```bash
cd /home/unknown/dev/app_factory/modellbaulog
npm ci
npm run check
npm start
```

Metro verwendet Port 8086. Eine erstmalige Dev-Installation oder Änderungen an
nativen Modulen, Paketkennung, Berechtigungen oder eingebauten Ressourcen
benötigen einen neuen Dev-Build. Für normale React-Änderungen genügt Fast Refresh.

```bash
npm run build:dev
npm run check:native
```

Die Dev-APK liegt unter
`android/app/build/outputs/apk/dev/debug/app-dev-debug.apk`.
Sie benötigt den laufenden Metro-Server. Der Build verwendet standardmäßig
ARM64. Für weitere Architekturen kann zum Beispiel
`MODELLOG_ANDROID_ARCHITECTURES=arm64-v8a,x86_64 npm run build:dev` genutzt werden.

Das Installationsskript prüft Paketkennung, Debug-Flag und eine gegebenenfalls
vorhandene Signatur. Es führt ein datenbewahrendes Update aus, richtet Port 8086
ein und öffnet den Dev-Client. `DEVICE_ID` durch die Kennung aus
`adb devices -l` ersetzen.

```bash
npm run install:dev -- DEVICE_ID
```

`npm run build:preview` ist ein optionaler, ausdrücklich anzufordernder
DevRelease-Build mit eingebettetem JavaScript. Nach
`npm run install:preview -- DEVICE_ID` startet er auch ohne Metro direkt in die
App. Für die eigenständige Vorschau sind keine Netzwerkrechte vorhanden.
Der normale Ablauf baut keine Store-Version und erhöht keine Versionsnummer.

## Struktur und Identität

| Bereich                    | Zuständigkeit                                                  |
| -------------------------- | -------------------------------------------------------------- |
| `src/app`                  | Schlanke Expo-Router-Routen und Bootstrap                      |
| `src/features/projects`    | Übersicht, Projektdetails, Verlauf und Erinnerungen            |
| `src/features/steps`       | Bauschritte, Entwürfe und Geschäftsregeln                      |
| `src/features/media`       | Fotos, Viewer und Vergleich                                    |
| `src/features/settings`    | Einstellungen und Backup-Dialoge                               |
| `src/core`                 | Ports, SQLite, Dateiablage, Backups, Medienadapter und UI      |
| `modules/model-log-native` | JPEG-Prüfung, Backup-Dateispeicherung und Android-Erinnerungen |
| `plugins`                  | Wiederholbare Android-Konfiguration für Expo Prebuild          |
| `tests`                    | Kleine Tests mit echtem SQLite und synthetischem JPEG          |

Dev: `com.appfactory.modellbaulog.dev`, sichtbarer Name `ModellbauLog Dev`.
Store: `com.appfactory.modellbaulog`, sichtbarer Name `ModellbauLog`.
Store-Debug und Store-Profile sind gesperrt. Store-Release erhält keine
Dev-Signierung. Ein eigener privater Upload-Schlüssel ist erforderlich,
andernfalls brechen Store-Paketaufgaben ab. Die Dev-Signatur liegt app-lokal in `.local/dev.keystore` und
wird nicht versioniert. Das Build-Skript erhält sie auch bei einer Neuerzeugung
des Android-Ordners. Expo Prebuild läuft normalerweise mit `--no-clean`.

Die Datenbank heißt `modellbaulog.db`. Fotos liegen im privaten App-Speicher.
Android-Cloud-Backups und Geräteübertragung sind ausdrücklich ausgeschlossen.
Das eigene Backupformat verwendet
`.mlbackup`, `modellbaulog_backup` und `MLBACK01`. Backups anderer Apps werden
abgewiesen. AES-256-GCM mit authentifiziertem Header und PBKDF2-HMAC-SHA-256
mit 600000 Runden schützen den Container.
SHA-256 und AES-GCM verwenden die nativen Expo-Funktionen. Die native
Passwortableitung ab Android 8 und der bisherige Fallback für Android 7 bleiben
erhalten. Vorhandene Sicherungen bleiben lesbar.

Ein Backup enthält gespeicherte Projekte, Bauschritte und Fotos. Entwürfe
gehören nicht zum Export. Lokale Entwürfe bleiben beim Wiederherstellen erhalten.
Neuere lokale Datensätze gewinnen beim Zusammenführen gleicher IDs.
Fotos werden als JPEG neu kodiert und auf höchstens 1920 Pixel Kantenlänge
verkleinert. Backups sind auf 128 MiB, das Inhaltsverzeichnis auf 16 MiB und auf
30000 Dateien begrenzt. Eine einzelne Datei darf höchstens 50 MiB groß sein.

Gestaltung: dauerhaft dunkles Anthrazit, weiße Schrift und kräftiges Gelb für
Aktionen. Gelb gefüllte Buttons verwenden dunkle Schrift. Karten, Eingaben und
Dialoge haben dezente graue Konturen. Die App folgt nicht dem System-Farbmodus.
Das eigene App-Icon liegt als SVG in `assets/branding`.
`python3 scripts/generate_icons.py` erzeugt die PNGs mit librsvg und cairo.

[Referenzabgleich](docs/PROCESSING_PARITY.md),
[Prüfung und manuelle Schritte](docs/VALIDATION.md),
[Android-Varianten und Signierung](docs/ANDROID_RELEASES.md),
[Abhängigkeiten](docs/DEPENDENCIES.md),
[Datenschutz](PRIVACY.md) und [Drittanbieterhinweise](THIRD_PARTY_NOTICES.md).
