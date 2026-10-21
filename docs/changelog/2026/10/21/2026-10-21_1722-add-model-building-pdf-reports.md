# PDF-Einzelprotokolle und vollständige Bauverlaufsprotokolle

SerienLog und Strick & Häkelbuch nur gelesen. Den freigegebenen Plan umgesetzt:
app-lokale PDF-Erzeugung und native Vorschau, Zoom, Drucken und Teilen. PDFs
enthalten alle aktuellen Fotos in gespeicherter Reihenfolge, zwei je Zeile und
ein unpaariges letztes Bild mittig. Textvarianten lesen keine Fotos. Beide
PDF-Listen laden höchstens zehn Dateien, blättern ab elf und korrigieren die
Seite nach Löschung. Gespeicherte Protokolle bleiben unverändert. App-Farben,
gelbe Konturen und rote Löschaktionen verwendet. Neue UI-Texte zentral abgelegt.

SQLite-Schema 2 ergänzt Reports mit Projekt-/Bauschrittzuordnung. Neue
Bauschritte bewahren Projektangaben bei Erfassung und den UTC-Versatz.
Bearbeitungen erhalten die ursprünglichen Angaben. Altbestände bleiben ohne
erfundene historische Daten lesbar. PDF-Dateien und Erfassungsdaten sind im
verschlüsselten Backup enthalten. Wiederherstellung validiert PDF-Inhalt,
Prüfsummen, Größen und Zuordnungen vor der Transaktion. Referenzbasierte
Bereinigung schützt gespeicherte Dateien und Entwürfe.

Android-PDF-Ports aus SerienLog app-lokal angepasst, eigene FileProvider-
Kennung und begrenzte Vorschau-Caches. Manifest/Ressourcen des nativen Moduls
bleiben durch Autolinking bei Expo Prebuild erhalten. Kein PDF-Import, Scanner,
Fotovergleich, zusätzlicher Sortierbutton oder gemeinsames Runtime-Paket.
Dokumentation, AGENTS.md, Lizenzhinweise und beide Datenschutzseiten ergänzt.

Prüfung: `npm run check` erfolgreich mit Formatierung, ESLint, TypeScript und
45 Tests in 11 Dateien. Darunter echte React-/SQLite-Pagination für beide
Listen bei zehn/elf Dateien, Bereichstrennung, leere letzte Seite und Retry.
PDF-Tests prüfen eingebettete Bildobjekte/Reihenfolge, Zweierzeilen, vollständigen
Verlauf, lange Texte, fehlende Fotos, Dateibereinigung, Migration und Backup.
Die unveränderte Legacy-Backup-Fixture bleibt lesbar. Ein synthetisches PDF
mit drei Fotos zusätzlich per Poppler als Text und gerenderte erste Seite
geprüft. Keine privaten Daten dafür verwendet.

`npm run check:native -- -PreactNativeArchitectures=arm64-v8a` erfolgreich,
52 native Tests und Android Lint. Der erste native Check lief mit den bisherigen
Standardarchitekturen, der abschließende Check wurde auf ARM64 begrenzt.
`npm run build:preview` erfolgreich in 1m 8s, nur ARM64, keine zusätzliche
APK-Kopie. Build erforderlich wegen neuer nativer PDF-Funktionen. Danach mit
`npm run install:preview -- A5CS024205005243` Paket, Version, Debug-Flag, Installer
und Signatur geprüft. Dev-Paket `com.appfactory.modellbaulog.dev`, Version 1.0.0
Code 1, nicht debuggable, Installer null, passende Dev-Signatur. Datenbewahrend
installiert und Start angefordert. Smartphone blieb bis zur Dokumentation
gesperrt. Daher noch keine Prüfung der PDF-Bedienung am Gerät. Entsperren wurde
angefragt. Keine Testprojekte oder PDFs auf dem Nutzergerät erzeugt.

Audit: 18 hohe Meldungen aus der bestehenden Expo-/Metro-Abhängigkeitskette,
identisch beim Audit des vorherigen Lockfiles. Keine neuen Meldungen durch die
PDF-Pakete. Kein erzwungenes Fix/Downgrade. Keine Versionsanhebung, Store-Build,
Push oder Veröffentlichung. Lokaler Commit nach erfolgreichen Prüfungen.
