# Deutsche Play-Store-Grafiken für ModellbauLog

15 Upload-Grafiken unter `store-assets/de-DE/` erstellt: vorhandenes Icon,
Feature-Grafik, fünf Smartphone-Aufnahmen und je vier Aufnahmen für 7- und
10-Zoll-Tablets. Kurze deutsche Nutzenüberschriften folgen SerienLog, Farben und
Icon stammen aus ModellbauLog. Tablets zeigen unveränderte echte App-Aufnahmen.
Vorschau, Upload-Anleitung mit Alttexten und Bildherkunft sowie Prüfsummenmanifest
liegen bei.

App-lokale Hilfen für isolierte AVDs, UI-Eingabe, Demo-Backup-Wiederherstellung,
Aufnahmen, Layout und Validierung ergänzt. Drei fiktive Projekte und fünf
Bauschritte über die echte Oberfläche angelegt. Das vorhandene synthetische
Cockpitfoto angehängt und ein echtes PDF-Bauverlaufsprotokoll erstellt.
Den identischen Datenstand über das App-Backup auf beide Tablet-Profile übertragen.

Die vorhandenen APKs enthielten nur ARM64. Für die Aufnahme-AVDs wurde einmal
`MODELLOG_ANDROID_ARCHITECTURES=x86_64 npm run build:preview` gebaut.
Dev-Paket `com.appfactory.modellbaulog.dev`, Version 1.0.0 (1). Kein Store-Build,
Upload, Push oder Zugriff auf Nutzerdaten. Produktcode, echtes Smartphone und
fremde Emulatoren blieben unverändert.

Prüfung: `npm run check` erfolgreich mit 59 Tests in 14 Dateien. Zwei bereits
vorhandene Lint-Warnungen zu doppelten Imports in `report-pagination.test.ts`.
Sechs Werkzeugtests für Geräteisolation und ungültige Bild- oder Aufnahmeprofile
bestanden. Python-, JavaScript- und Shell-Syntax geprüft.
Alle 15 PNGs vollständig dekodiert und auf Anzahl, Maße, Dateigröße, Farbmodus,
Transparenz, Aufnahmeprofile und Prüfsummen geprüft. Tablet-Ausgaben entsprechen
ihren Rohaufnahmen. Größte Upload-Datei: 797.007 Bytes. Alle Motive visuell auf
Lesbarkeit, deutsche Texte und echte Funktionen geprüft.
