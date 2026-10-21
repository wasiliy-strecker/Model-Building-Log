# Abgleich der Vorlagen

Geprüfte technische Basis: Hausakte, Commit
`dfd6fc8` (Document baseline Dev installation on HONOR).
Geprüfte fachliche und visuelle Referenz: Strick & Häkelbuch, Commit
`5094df0` (Document generated build cache cleanup).
Die jeweiligen Arbeitsverzeichnisse waren vor und nach der Umsetzung sauber.
ModellbauLog ist eine unabhängige Kopie mit eigenen Abhängigkeiten und Daten.

Die vor Umsetzung geklärten Entscheidungen sind im Modell abgebildet.
Die Schrittnummer ist eine ganze Zahl ab 0 und Pflicht.
Ein Titel ist optional. Der aktuelle Stand folgt dem Zeitpunkt des Bauschritts.
Erinnerungen sind optional. Der eigene Fotovergleich und der zusätzliche
Sortierbutton in den Bauschrittdetails wurden am 21. Oktober 2026 auf Wunsch
entfernt. Fotos werden weiterhin beim Bearbeiten sortiert.

| Vorlage                                                    | Umsetzung in ModellbauLog                                                                 |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Projektübersicht mit Suche, Sortierung und aktuellem Stand | Projektkarten mit Modelltyp, Material, aktuellem Schritt und Foto                         |
| Projekt anlegen und bearbeiten                             | Name, Modelltyp, Hersteller, Material und optionale Erinnerung                            |
| Projektansicht mit Stand, Aktionen und letzten Einträgen   | Aktueller Bauschritt, Projektangaben und die letzten zehn Bauschritte                     |
| Gesamter Projektverlauf                                    | Suche und Seiten zu je zehn Bauschritten, Datum, Vorschaubild, Notiz und Schrittdifferenz |
| Reihe oder Runde erfassen                                  | Pflichtnummer ab 0, optionaler Titel und Zeitpunkt                                        |
| Manuell, Kamera oder Galerie wählen                        | Gleicher Einstieg mit anschließendem Editor                                               |
| Notizen zum Projektstand                                   | Freie Notiz zu Farben, Teilen und Arbeitsschritten je Bauschritt                          |
| Mehrere Fotos je Stand                                     | Mehrfachauswahl, private JPEG-Ablage, Fotoeditor und Vollbild-Zoom                        |
| Foto entfernen und ersetzen                                | Entwurfsänderung mit Referenzprüfung vor Dateibereinigung                                 |
| Fotoreihenfolge ändern                                     | Ziehen durch langes Drücken und Fotomenü mit Verschieben                                  |
| Bestehenden Stand bearbeiten                               | Vorhandenen Bauschritt aktualisieren, ohne künstliche Revisionen                          |
| Offenen Stand weiterführen                                 | Dauerhafte lokale Entwürfe und Android-Picker-Wiederaufnahme                              |
| Lokale Projekterinnerungen                                 | Kopierte Android-Planung, eigene Kanäle, Receiver und Deep Links                          |
| Verschlüsselte Sicherung                                   | Übernommener Hausakte-Container mit eigener Kennung und JPEG-Prüfung                      |

Aus Hausakte wurden schlanke Routen, Feature-Hooks, Services, Ports, SQLite,
private Dateiablage, Dialogaktionen, Vorschlagsfelder, Datumsauswahl,
Fotoeditor, Viewer, Snackbar, Verlassen-Schutz und verschlüsselte Backups
übernommen oder passend angepasst.

PDF-Einzel- und Bauverlaufsprotokolle übernehmen nun den fachlichen Umfang von
Strick & Häkelbuch: alle aktuellen Fotos, geordnete Zweierzeilen, vollständiger
Bauverlauf, gespeicherte Erfassungsdaten und ursprünglicher UTC-Versatz.
Die React-Native-Erzeugung, Android-Vorschau, Mehrteiler, Teilen, Drucken und
Zehner-Pagination beider PDF-Listen basieren auf lokal angepassten SerienLog-
Bausteinen. Kein PDF-Import, OCR oder Dokumentenscanner. Die Dokumentauswahl
bleibt ausschließlich für verschlüsselte Backup-Dateien.

Gespeicherte Protokolle bleiben nach Fotoänderungen unverändert und sind Teil
des ModellbauLog-Backups. SQLite-Schema 2 und optionale Erfassungsfelder erhalten
bestehende Daten. Alte Backups ohne Reports und Erfassungsdaten bleiben lesbar.

Die Gestaltung verwendet dunkles Anthrazit, weiße Schrift, gelbe Aktionen und
rote Löschkonturen. Kein zusätzlicher Hellmodus, Fotovergleich oder Sortierbutton.
