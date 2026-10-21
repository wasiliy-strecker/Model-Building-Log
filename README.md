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

Optionale Projekterinnerungen sind zunächst ausgeschaltet und werden lokal von
Android geplant. Einstellungen bieten verschlüsselte Backups mit Passwort,
Speichern, Teilen und Wiederherstellen. Es gibt keine Konten, Cloud, Werbung,
OCR, Dokumentenscanner, PDF-Import, Teilelager oder Einkaufsverwaltung.

## PDF-Protokolle und Erfassungsdaten

„PDF erstellen“ bietet „PDF mit Fotos erstellen“ und „PDF ohne Fotos erstellen“.
Beim Bauschritt entsteht ein Einzelprotokoll. Beim Projekt enthält das
Bauverlaufsprotokoll alle gespeicherten Bauschritte, Notizen und Schrittdifferenzen,
unabhängig von Suche oder angezeigter Verlaufsseite. Alle aktuellen Fotos folgen
ihrer gespeicherten Reihenfolge, zwei je Zeile. Ein letztes einzelnes Bild wird
in derselben Größe zentriert. Bilder werden nicht beschnitten. Die Variante ohne
Fotos benötigt keine Fotodateien. Ohne Bauschritte ist kein Export möglich.

Gespeicherte Einzelprotokolle und Bauverlaufsprotokolle haben getrennte Listen
mit zehn Dateien pro Seite. Ab elf erscheinen Seitennummer, Zurück und Weiter.
Die integrierte Android-Vorschau unterstützt Scrollen, Zoom, Drucken und Teilen.
Löschen eines Bauschritts entfernt dessen Einzelprotokolle. Gespeicherte
Bauverlaufsprotokolle bleiben bis zur eigenen Löschung oder Projektlöschung
bestehen. Exportierte Kopien werden dadurch nicht gelöscht.

Neue Bauschritte speichern Name, Modelltyp, Hersteller und Material beim ersten
Speichern sowie den UTC-Versatz des gewählten Zeitpunkts. Abweichende damalige
Projektangaben erscheinen in den Details und PDFs. Bearbeiten erhält diese
Angaben. Der UTC-Versatz ändert sich nur bei bewusst geändertem Zeitpunkt.
Bei älteren Einträgen werden fehlende Erfassungsdaten nicht erfunden. PDFs
kennzeichnen die Verwendung heutiger Projektangaben und der Gerätezeitzone.

PDF-Dateien sind auf 50 MiB und Protokolle auf 2000 Seiten einschließlich
Teil-Deckblättern begrenzt. Eingebettete Fotodateien dürfen zusammen höchstens
64 MiB umfassen. Größere Verläufe lassen sich ohne Fotos oder als Einzelprotokolle
exportieren. Ab mehr als 100 Seiten entstehen Teile mit höchstens 100 Seiten,
inklusive Deckblatt. Die Vorschau hält höchstens sechs gerenderte Seiten auf
Disk und einen begrenzten Bitmap-Cache. Es werden keine großen Test-PDF-Sammlungen
auf dem Smartphone angelegt.

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

| Bereich                    | Zuständigkeit                                                         |
| -------------------------- | --------------------------------------------------------------------- |
| `src/app`                  | Schlanke Expo-Router-Routen und Bootstrap                             |
| `src/features/projects`    | Übersicht, Projektdetails, Verlauf und Erinnerungen                   |
| `src/features/steps`       | Bauschritte, Entwürfe und Geschäftsregeln                             |
| `src/features/media`       | Fotoeditor und Vollbildansicht                                        |
| `src/features/settings`    | Einstellungen und Backup-Dialoge                                      |
| `src/core`                 | Ports, SQLite, Dateiablage, Backups, Medienadapter und UI             |
| `modules/model-log-native` | JPEG-Prüfung, PDF-Vorschau, Teilen, Drucken, Backups und Erinnerungen |
| `plugins`                  | Wiederholbare Android-Konfiguration für Expo Prebuild                 |
| `tests`                    | Kleine Tests mit echtem SQLite und synthetischem JPEG                 |

Dev: `com.appfactory.modellbaulog.dev`, sichtbarer Name `ModellbauLog Dev`.
Store: `com.appfactory.modellbaulog`, sichtbarer Name `ModellbauLog`.
Store-Debug und Store-Profile sind gesperrt. Store-Release erhält keine
Dev-Signierung. Ein eigener privater Upload-Schlüssel ist erforderlich,
andernfalls brechen Store-Paketaufgaben ab. Die Dev-Signatur liegt app-lokal in `.local/dev.keystore` und
wird nicht versioniert. Das Build-Skript erhält sie auch bei einer Neuerzeugung
des Android-Ordners. Expo Prebuild läuft normalerweise mit `--no-clean`.

Die Datenbank heißt `modellbaulog.db`. Schema 2 ergänzt die Protokolltabelle datenbewahrend. Fotos und PDFs liegen im privaten App-Speicher.
Android-Cloud-Backups und Geräteübertragung sind ausdrücklich ausgeschlossen.
Das eigene Backupformat verwendet
`.mlbackup`, `modellbaulog_backup` und `MLBACK01`. Backups anderer Apps werden
abgewiesen. AES-256-GCM mit authentifiziertem Header und PBKDF2-HMAC-SHA-256
mit 600000 Runden schützen den Container.
SHA-256 und AES-GCM verwenden die nativen Expo-Funktionen. Die native
Passwortableitung ab Android 8 und der bisherige Fallback für Android 7 bleiben
erhalten. Vorhandene Sicherungen bleiben lesbar.

Ein Backup enthält gespeicherte Projekte, Bauschritte samt Erfassungsdaten, Fotos und gespeicherte PDF-Protokolle. Entwürfe
gehören nicht zum Export. Lokale Entwürfe bleiben beim Wiederherstellen erhalten.
Neuere lokale Datensätze gewinnen beim Zusammenführen gleicher IDs.
Fotos werden als JPEG neu kodiert und auf höchstens 1920 Pixel Kantenlänge
verkleinert. Backups sind auf 128 MiB, das Inhaltsverzeichnis auf 16 MiB und auf
30000 Dateien begrenzt. Eine einzelne Datei darf höchstens 50 MiB groß sein.

Gestaltung: dauerhaft dunkles Anthrazit, weiße Schrift und kräftiges Gelb für
Aktionen. Gelb gefüllte Buttons verwenden dunkle Schrift. Karten, Eingaben und
Dialoge haben dünne gelbe Konturen mit leichtem Schein. Die App folgt nicht dem System-Farbmodus.
Das eigene App-Icon liegt als SVG in `assets/branding`.
`python3 scripts/generate_icons.py` erzeugt die PNGs mit librsvg und cairo.

[Referenzabgleich](docs/PROCESSING_PARITY.md),
[Prüfung und manuelle Schritte](docs/VALIDATION.md),
[Android-Varianten und Signierung](docs/ANDROID_RELEASES.md),
[Abhängigkeiten](docs/DEPENDENCIES.md),
[Datenschutz](PRIVACY.md) und [Drittanbieterhinweise](THIRD_PARTY_NOTICES.md).
