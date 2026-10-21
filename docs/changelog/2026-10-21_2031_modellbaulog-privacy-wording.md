# Datenschutz an SerienLog angleichen

Die fünf Datenschutzabsätze in den Einstellungen übernehmen Wortlaut und
Textgewichtung aus SerienLog. Nur „Seriendaten“ und „Weiterschauen“ sind durch
„Projektdaten“ und „Weiterbauen“ ersetzt. Der Exporttext erfasst jetzt auch PDFs.

Deutsche und englische Datenschutzseite folgen denselben 13 Abschnitten und
Formulierungen der Referenz. Projektdaten, Bauschritte mit Erfassungsangaben,
mehrere geordnete Fotos und PDF-Druck bleiben fachlich passend beschrieben.
PRIVACY.md verweist wie bei SerienLog auf die beiden vollständigen Fassungen.
Die ModellbauLog-Farben, Kennungen, Datenverarbeitung und Funktionen bleiben
unverändert. Die Referenz-App wurde nicht geändert. Keine Veröffentlichung
von GitHub Pages, kein neuer App-Link und kein Push.

## Prüfung und Smartphone

`npm run check` erfolgreich. Formatierung und TypeScript fehlerfrei.
Alle 57 Tests in 13 Dateien bestanden. Nur die zwei vorhandenen ESLint-Warnungen
zu doppelten Imports im PDF-Paginierungstest bestehen weiter.
Die fünf App-Absätze automatisiert mit SerienLog verglichen. Abschnittsfolge,
eigene App-Verweise und lokale Links beider HTML-Seiten geprüft.
`git diff --check` erfolgreich. Keine zusätzliche visuelle Testreihe.

Die eigenständige DevRelease-Vorschau benötigt für den dauerhaft sichtbaren
App-Text die vom Nutzer autorisierte APK-Aktualisierung. Ausschließlich ARM64
mit `MODELLOG_ANDROID_ARCHITECTURES=arm64-v8a npm run build:preview` gebaut.
Build erfolgreich in 1 Minute 20 Sekunden, 772 von 797 Aufgaben wiederverwendet.
Keine versionierten Änderungen durch Prebuild und keine zusätzliche APK-Kopie.

Mit `npm run install:preview -- A5CS024205005243` datenbewahrend installiert.
Paket, Version, Debug-Flag, Installer und übereinstimmende Signaturen geprüft.
Ziel bleibt `com.appfactory.modellbaulog.dev`, Version `1.0.0`, Versionscode `1`,
nicht debuggable, Installer `null`. App gestartet und laufenden Prozess bestätigt.
Die installierte APK stimmt per SHA-256 mit dem neuen Build überein:
`ec5ff0704cbaaf1a9eae22bf2f4eb279c0ac65b33656e6f7a281d6b0944357db`.
APK etwa 45,3 MiB. Kein Store-Build und keine Versionsänderung.
