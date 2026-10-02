# ModellbauLog als eigenständige React-Native-App erstellen

Neue Android-App unter `modellbaulog/` aus der lokal geprüften Hausakte-Codebasis
mit React Native, TypeScript strict, Expo und SQLite. Bildschirmfolge und
Bedienung orientieren sich an Strick & Häkelbuch. Beide Vorlagen bleiben unverändert.

Projekte mit Name, Modelltyp, Hersteller und Material. Bauschritte mit ganzer
Pflichtnummer ab 0, optionalem Titel, Zeitpunkt, Notiz und geordneten Fotos.
Bearbeiten, chronologischer Verlauf mit Suche und Seiten, dauerhafte Entwürfe,
Fotoersatz und sichere Dateibereinigung. Projektweiter Fotovergleich mit freier
Auswahlreihenfolge und zwei oder drei Spalten.

Eigene Petrol- und Kupfergestaltung, dunkles Systemthema und SVG-App-Icon.
Optionale lokale Erinnerungen und verschlüsselte `.mlbackup`-Backups mit eigener
Kennung. Restore erhält neuere lokale Inhalte, offene Entwürfe und repariert
passende fehlende Fotodateien einschließlich ihrer Entwurfsreferenzen.
Keine OCR, Scanner, PDF-Funktionen, Teilelager oder Einkaufsverwaltung.

Eigene Dev- und Store-Kennungen, getrennte Daten, keine gemeinsame Bibliothek.
App-lokaler Dev-Schlüssel außerhalb des generierten Android-Ordners.
Prebuild mit `--no-clean`, Gradle-Helfer mit eigenen Prozessen und ARM64 als
schlankem Standard. Kein Store-Build, Upload oder Push.

Prüfung: Prettier, ESLint und TypeScript erfolgreich. Elf Vitest-Tests mit echtem
SQLite und unabhängiger Backup-Entschlüsselung erfolgreich. 34 native Unit-Tests
und Android Lint ohne Fehler erfolgreich. Metro-Android-Bündel und DevDebug-APK
gebaut. Eigene Paketkennung, Version und Dev-Zertifikat geprüft.
Ein voller Datenträger und ein unvollständiger Gradle-Transform erforderten die
Bereinigung generierter Dateien und einen gezielten Neuversuch.

Keine Installation oder reale Bedienprüfung, da kein Android-Gerät angeschlossen
ist. Kurze manuelle Prüfschritte, Startanleitung, Referenzabgleich, Datenschutz
und der ungepatchte Expo-CLI/node-forge-Audit-Hinweis stehen in den App-Dokumenten.
