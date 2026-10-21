# Projektsymbole mit Auswahl und Automatik

Unter dem Modelltyp bietet das Projektformular jetzt acht Symbole in einem
Raster mit vier Spalten: Flugzeug, Fahrzeug, Schiff, Figur, Diorama, Eisenbahn,
Rakete und Werkzeug. Die Auswahl folgt dem Bedienmuster von MaschinenLog mit
gerundeten Flächen, dünner gelber Auswahlkontur, Häkchen, verständlicher
Beschriftung und Radio-Zuständen für Screenreader. Während des Speicherns
sind die Optionen gesperrt. Die Auswahl liegt innerhalb der vorhandenen
Schutzfläche für geöffnete Modelltyp-Vorschläge.

„Automatisch nach Modelltyp“ ist der Standard. Die Zuordnung ignoriert
Groß-/Kleinschreibung und äußere Leerzeichen. Unbekannte oder leere Modelltypen
und „Sonstiges“ verwenden das Werkzeug. Die sechs Modelltyp-Vorschläge bleiben
unverändert. Eisenbahn und Rakete werden bei eigener Eingabe ebenfalls erkannt.
Eine eigene Symbolauswahl bleibt beim Wechsel des Modelltyps erhalten.
Die Automatik lässt sich jederzeit wieder auswählen.

Das optionale Projektfeld `icon` speichert stabile englische IDs in der vorhandenen
JSON-Struktur. Ein fehlender Wert bedeutet Automatik. Bestehende Projekte und
alte Backups benötigen keine Migration. Verschlüsselte Backups erhalten eigene
Auswahlen. Alle neuen sichtbaren Texte liegen unter stabilen Übersetzungsschlüsseln.
Dashboard und Projektdetails verwenden dieselbe Symbolauflösung. Fotovorschau,
Erinnerungssymbole, PDF-Gestaltung und Erfassungsdaten bleiben unverändert.

Die fünf bisher falschen Zeichencodes für Flugzeug, Fahrzeug, Schiff, Figur und
Diorama sind korrigiert. Eisenbahn und Rakete ergänzen die vorhandene Icon-Zuordnung.
Alle acht Codes wurden mit der zur gebündelten Schrift passenden Material-Icons-
Definition abgeglichen. Der Referenzfont und die App-Schrift stimmen per SHA-256
überein. Keine neue Schrift, Bibliothek oder native Änderung.

## Prüfung

`npm run check` erfolgreich. Formatierung und TypeScript ohne Fehler.
ESLint meldet weiterhin die zwei bereits vorhandenen Import-Warnungen in
`tests/report-pagination.test.ts`, keine Fehler. Alle 57 Tests in 13 Dateien
bestanden, einschließlich Zuordnung, Auswahlinteraktion, Rückkehr zur Automatik,
Sperre beim Speichern, SQLite-Neuöffnung, Speicherung nach Modelltypänderungen
und verschlüsselter Backup-Wiederherstellung mit und ohne Symbol-ID.
Die vorhandene Legacy-Backup-Prüfung bleibt erfolgreich.

README und Diff geprüft. Changelog im Workspace mit identischer App-Kopie.
Keine umfangreichen visuellen Testreihen, nativen Tests, Builds, Installation
oder Push. Die installierte Smartphone-Version bleibt unverändert.
