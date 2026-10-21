# Projektsymbole ohne Automatik-Schalter

„Automatisch nach Modelltyp“ und der zusätzliche Automatik-Zusatz entfallen.
Das Projektformular zeigt ausschließlich die acht auswählbaren Symbole mit
genau einer markierten Auswahl. Beim Auswählen oder Ändern des Modelltyps wird
das passende Symbol vorausgewählt. Neue Projekte sowie leere oder eigene,
unbekannte Modelltypen beginnen mit Werkzeug. Anschließend lässt sich jedes
Symbol frei wählen. Änderungen an anderen Projektfeldern behalten die Auswahl.

Beim Speichern wird die konkrete Symbol-ID übernommen. Gespeicherte Auswahlen
bleiben beim erneuten Öffnen erhalten. Ältere Projekte und Backups ohne Symbol-ID
zeigen weiterhin das zum Modelltyp passende Symbol. Keine Datenbankmigration.
Hilfetext und README an die vereinfachte Bedienung angepasst. Die sechs
Modelltyp-Vorschläge, Fotovorschau, PDFs und Erinnerungen bleiben unverändert.

## Prüfung und Smartphone

`npm run check` erfolgreich. Alle 57 Tests in 13 Dateien bestanden.
Der aktualisierte Interaktionstest verwendet den tatsächlichen Projekteditor
und SQLite. Geprüft sind Vorauswahl bei Modelltypwechsel, eigene Symbole,
Werkzeug als Standard, Speichern eigener Modelltypen mit und ohne geändertes
Symbol sowie das erneute Öffnen ohne unbeabsichtigte Formularänderung.
Bestehende Backup- und Legacy-Prüfungen bleiben erfolgreich.
Formatierung und TypeScript ohne Fehler. Nur die zwei bereits bekannten
ESLint-Import-Warnungen im PDF-Paginierungstest bleiben bestehen.

Die eigenständige DevRelease-Vorschau ausschließlich für ARM64 mit
`MODELLOG_ANDROID_ARCHITECTURES=arm64-v8a npm run build:preview` gebaut.
Erfolgreich in 49 Sekunden. 773 von 797 Gradle-Aufgaben wiederverwendet.
Prebuild hat keine versionierten Konfigurationsdateien geändert.

Mit `npm run install:preview -- A5CS024205005243` datenbewahrend auf dem HONOR
BVL-N49 installiert. Paket, Version, Debug-Flag, Installer und übereinstimmende
Signaturen vor dem Update geprüft. Ziel bleibt `com.appfactory.modellbaulog.dev`,
Version `1.0.0` mit Versionscode `1`, nicht debuggable, Installer `null`.
Die installierte APK stimmt per SHA-256 mit dem neuen Build überein:
`fc1528b24e420824376b9a0dfb4e884ae13f73c4ee89a938373b6405b70d2bfe`.
App-Start ausgelöst und laufenden Prozess bestätigt. Der Sperrbildschirm wurde
wie vereinbart nicht zum Hindernis für das Update gemacht. Keine sichtbare
Geräteprüfung hinter dem Sperrbildschirm behauptet.

APK etwa 45,3 MiB. Eingebettetes JavaScript enthält die Symbolauswahl ohne die
entfernte Automatik-Option. Keine zusätzlichen APK-Kopien, Store-Builds,
Versionssprünge oder Push. Changelog im Workspace und als identische App-Kopie.
