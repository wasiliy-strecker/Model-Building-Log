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

PDF-Einzel- und Bauverlaufsprotokolle werden lokal erzeugt. Die Foto-Variante
enthält alle aktuell gespeicherten Fotos in ihrer Reihenfolge. Gespeicherte PDFs
bleiben unverändert und gehören zum verschlüsselten Backup. Beide PDF-Listen
zeigen zehn Dateien pro Seite. Keine PDF-Importfunktion, OCR, Scanner,
Teilelager, Einkaufsverwaltung oder Cloud.
Neue Bauschritte bewahren Projektangaben bei Erfassung und den UTC-Versatz.
Altbestände ohne diese Daten bleiben unbekannt. Bearbeiten bewahrt die damaligen
Projektangaben. Nur ein geänderter Zeitpunkt aktualisiert seinen UTC-Versatz.
Fotoauswahl hat keine feste Mengenbegrenzung. Fotos werden im Editor sortiert.
Kein eigener Fotovergleich. Technische Backup-Größenlimits bleiben erhalten.
Dateibereinigung erst nach erfolgreichen Transaktionen. Gespeicherte Fotos und
Entwürfe bei der Referenzprüfung beachten.

## Entwicklung und Prüfung

`npm ci`, `npm run format`, `npm run check`.
Gezielte kleine Tests und konkrete manuelle Prüfschritte verwenden. Keine
aufwendigen visuellen Testreihen. Bei Änderungen am nativen Modul zusätzlich
`npm run check:native`. Codegen nur bei geänderten Eingaben oder Konfiguration.

Bei Entwicklungsaufträgen mit App-Änderungen gehört die Aktualisierung des
angeschlossenen Smartphones zum Auftrag. Der Nutzer hat dies dauerhaft
autorisiert. Nicht nach dem Code-Commit aufhören und nicht erneut um Erlaubnis
für das erforderliche Dev-Update bitten. Die vorhandene Installationsart
beibehalten und den leichtesten passenden Weg verwenden.

- Bei DevDebug mit Metro normale React-/Text-/Designänderungen per Fast Refresh
  aktualisieren. `npm start` verwendet Metro-Port 8086. Eine unterbrochene
  Verbindung zunächst wiederherstellen. Bei Bedarf die App neu starten.
- Bei der aktuell verwendeten eigenständigen DevRelease-Vorschau werden Änderungen
  erst durch eine neue APK dauerhaft sichtbar. Hier nach App-Änderungen
  `npm run build:preview` und `npm run install:preview -- DEVICE` ausführen.
  Dieser Neubau ist durch den dauerhaften Nutzerauftrag ausdrücklich erlaubt,
  auch bei reinen Text- oder Designänderungen.
- Native Änderungen oder fehlende kompatible Dev-Installationen benötigen einen
  passenden Dev-Neubau. `npm run build:dev` erzeugt DevDebug. Beide Dev-Modi
  verwenden dieselbe eigene Paketkennung und app-lokale Signatur.

Vor Neustart oder Installation offene Eingaben prüfen und schützen. Vor einem
Neubau den konkreten Grund nennen. Speicherplatzschonend nur die benötigte
Smartphone-Architektur bauen, derzeit ARM64, und keine zusätzlichen APK-Kopien
oder Store-Artefakte erzeugen. Reine Dokumentationsänderungen benötigen kein
Geräteupdate. Ohne angeschlossenes Gerät das fehlende Update ausdrücklich
benennen. Abschließend den tatsächlichen Zustand melden: „Direkt testen“,
„App neu starten“ oder „Neu installiert“. Ein Fast Refresh aktualisiert nur
die laufende Dev-Sitzung, nicht die dauerhaft installierte APK.

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
