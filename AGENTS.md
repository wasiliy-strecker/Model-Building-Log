# ModellbauLog

Eigenständige Android-App mit React Native, TypeScript strict, Expo und SQLite.
Zusätzlich gelten die Regeln aus `../AGENTS.md`. Die React-Native-Architektur ist
ausdrücklich beauftragt. Keine Runtime-Abhängigkeiten zu Nachbar-Apps.

## Architektur und Referenzen

Technische Basis ist Hausakte. Bildschirmfolge und Bedienabläufe folgen
Strick & Häkelbuch. Änderungen bleiben in dieser App. Routen in `src/app`
bleiben schlank. Zustand liegt in Feature-Hooks, Geschäftsregeln in Services.
SQLite, Dateien, Fotoprüfung und Gerätefunktionen liegen hinter Ports.

Projekte enthalten Name, Modelltyp, Hersteller, Material und optionale lokale
Erinnerungen. Bauschritte speichern eine exakte ganze Schrittnummer ab 0,
optionalen Titel, Zeitpunkt, Notiz und geordnete Fotos. Der aktuelle Stand ist
der zeitlich neueste Bauschritt, nicht die höchste Schrittnummer. Bearbeiten
ersetzt den aktuellen Datensatz ohne Revisionen.

Keine OCR, Scanner, PDF-Funktionen, Teilelager, Einkaufsverwaltung oder Cloud.
Fotoauswahl und Vergleich haben keine feste Mengenbegrenzung. Technische
Backup-Größenlimits bleiben erhalten. Dateibereinigung erst nach erfolgreichen
Transaktionen. Gespeicherte Fotos und Entwürfe bei der Referenzprüfung beachten.

## Entwicklung und Prüfung

`npm ci`, `npm run format`, `npm run check`.
Gezielte kleine Tests und konkrete manuelle Prüfschritte verwenden. Keine
aufwendigen visuellen Testreihen. Bei Änderungen am nativen Modul zusätzlich
`npm run check:native`. Codegen nur bei geänderten Eingaben oder Konfiguration.

`npm start` verwendet Metro-Port 8086. DevDebug und Fast Refresh sind der
Standard. `npm run build:dev` baut die Dev-APK. Native Änderungen benötigen
einen neuen Build. `npm run build:preview` erstellt auf ausdrücklichen Wunsch
eine eigenständig startende DevRelease-APK. Beide Dev-Modi verwenden dieselbe
eigene Paketkennung und app-lokale Signatur.

`android/` ist versioniert. Native Konfigurationsänderungen auch in
`plugins/with-modellbaulog-android.js` abbilden. Das Build-Skript führt Prebuild
mit `--no-clean` aus. Der app-lokale Dev-Schlüssel liegt außerhalb des
generierten Android-Ordners in `.local/dev.keystore`. Das Build-Skript kopiert
ihn vor Gradle in die App. Keine fremden Metro-Sitzungen beenden.

## Identität und Auslieferung

Dev ist `com.appfactory.modellbaulog.dev`, Name `ModellbauLog Dev`.
Store ist `com.appfactory.modellbaulog`, Name `ModellbauLog`. Store-Debug ist
gesperrt. Store-Release bleibt ohne private Signierung unbaubar zur Auslieferung.
Der eigene Upload-Schlüssel liegt außerhalb des Checkouts. Einrichtung und
Guard-Prüfung stehen in `docs/ANDROID_RELEASES.md`. Store und DevRelease haben
keine Netzwerkberechtigungen. Nur DevDebug verwendet Metro.
Kein Store-Build, Push oder Upload ohne Auftrag. Dev-Arbeit erhöht keine Version.

Vor Installation Paket, Version, Debug-Flag, Installer und Signatur prüfen.
`npm run install:dev -- DEVICE` verwendet ausschließlich
`adb install -r -t -g --no-streaming`. Nie deinstallieren oder App-Daten löschen.

Nach erfolgreichen Prüfungen lokalen Commit erstellen. Changelog im Workspace
unter `CODEX/changelog/YYYY/MM/DD/` und als Kopie in `docs/changelog/` ablegen.
Keine Schlüssel, Backups, privaten Fotos, Build-Ausgaben oder Caches committen.
