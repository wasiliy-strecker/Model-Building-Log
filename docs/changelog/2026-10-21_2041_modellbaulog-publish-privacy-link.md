# Kurze Datenschutzkarte mit veröffentlichter GitHub-Seite

Die App zeigt wie MaschinenLog drei kurze Absätze zu lokaler Verarbeitung,
Aufbewahrung und Datenschutzkontakt. Darunter öffnet „Datenschutzerklärung
öffnen“ die vollständige deutsche Erklärung im externen Browser.
Die längeren Foto- und Backup-Absätze entfallen in der App. Bei einem fehlenden
Browser erscheint der deutsche Fehlerhinweis wie im Vorbild. Die Aktion wird
anschließend wieder freigegeben. Der Geräteaufruf liegt hinter einem eigenen
ExternalLinks-Port. Keine neue Netzwerkberechtigung und keine neue Abhängigkeit.

Die vorbereiteten deutschen und englischen Seiten, Sprachstartseite und das
Stylesheet sind auf GitHub Pages veröffentlicht. Sie besitzen dieselben 13
Abschnitte und dasselbe Layout wie MaschinenLog, mit ModellbauLog-Inhalten.
ModellbauLog verwendet weiterhin keine OCR oder ML-Kit-Bibliothek.

Deutsch: https://wasiliy-strecker.github.io/Model-Building-Log/datenschutz/
English: https://wasiliy-strecker.github.io/Model-Building-Log/privacy/

GitHub Pages war zuvor nicht aktiviert und lieferte HTTP 404. Auf den ergänzten
Nutzerauftrag wurde der gesonderte Zweig `gh-pages` eingerichtet und veröffentlicht.
Er enthält nur `index.html`, beide Datenschutzseiten, `assets/privacy.css` und
`.nojekyll`. Veröffentlichungscommit: `c5d1a06`.
Der entfernte App-Zweig `main` bleibt unverändert bei `504541e`.
README, PRIVACY.md und Dokumentation beschreiben die aktive Veröffentlichung.
Referenz-Apps unverändert. Kein Store-Build und keine Versionsänderung.

## Prüfung

`npm run check` erfolgreich. Alle 59 Tests in 14 Dateien bestanden.
Zwei neue Tests führen den tatsächlichen Einstellungsbildschirm samt Hook und
Geräteadapter aus. Sie prüfen die eigene Browseradresse, Sperren während des
Aufrufs, Fehleranzeige und einen erfolgreichen erneuten Versuch.
Formatierung und TypeScript fehlerfrei. Nur die zwei bestehenden ESLint-Warnungen
zu doppelten Imports im PDF-Paginierungstest bleiben bestehen.

Die drei App-Absätze mit MaschinenLog verglichen. Gliederung und relative Links
beider Datenschutzseiten geprüft. GitHub Pages meldet `built`. Startseite,
deutsche und englische Erklärung sowie CSS liefern HTTP 200 und stimmen
bytegenau mit den lokalen Quelldateien überein.

## Smartphone

Die eigenständige Dev-Vorschau mit eingebettetem JavaScript benötigt für den
neuen Button eine dauerhaft installierte APK. Ausschließlich ARM64 mit
`MODELLOG_ANDROID_ARCHITECTURES=arm64-v8a npm run build:preview` gebaut.
Build erfolgreich in 2 Minuten 31 Sekunden. 772 von 797 Aufgaben wiederverwendet.
Mit `npm run install:preview -- A5CS024205005243` datenbewahrend installiert.
Paket, Version, Debug-Flag, Installer und gleiche Signaturen geprüft.
Ziel bleibt `com.appfactory.modellbaulog.dev`, Version `1.0.0`, Versionscode `1`,
nicht debuggable, Installer `null`. App-Start und APK-Hash geprüft:
`51c609f0f0535c5bd7c2c8736b6466e9ceb8f2874e8585e9d9c0f13e96826e9c`.

Auf dem angeschlossenen HONOR die Einstellungen geöffnet und den tatsächlichen
Datenschutzbutton angetippt. Chrome zeigt die richtige GitHub-Pages-Adresse
und die vollständige Erklärung für ModellbauLog. Keine aufwendige visuelle
Testreihe und keine zusätzlichen APK-Kopien.
