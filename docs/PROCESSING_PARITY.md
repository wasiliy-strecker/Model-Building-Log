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
Erinnerungen sind optional. Der Vergleich erlaubt beliebig viele ausgewählte
Fotos eines Projekts über mehrere Bauschritte hinweg.

| Vorlage                                                    | Umsetzung in ModellbauLog                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Projektübersicht mit Suche, Sortierung und aktuellem Stand | Projektkarten mit Modelltyp, Material, aktuellem Schritt und Foto                          |
| Projekt anlegen und bearbeiten                             | Name, Modelltyp, Hersteller, Material und optionale Erinnerung                             |
| Projektansicht mit Stand, Aktionen und letzten Einträgen   | Aktueller Bauschritt, Projektangaben und die letzten zehn Bauschritte                      |
| Gesamter Projektverlauf                                    | Suche und Seiten zu je zehn Bauschritten, Datum, Vorschaubild, Notiz und Schrittdifferenz  |
| Reihe oder Runde erfassen                                  | Pflichtnummer ab 0, optionaler Titel und Zeitpunkt                                         |
| Manuell, Kamera oder Galerie wählen                        | Gleicher Einstieg mit anschließendem Editor                                                |
| Notizen zum Projektstand                                   | Freie Notiz zu Farben, Teilen und Arbeitsschritten je Bauschritt                           |
| Mehrere Fotos je Stand                                     | Mehrfachauswahl, private JPEG-Ablage, Fotoeditor und Vollbild-Zoom                         |
| Foto entfernen und ersetzen                                | Entwurfsänderung mit Referenzprüfung vor Dateibereinigung                                  |
| Fotoreihenfolge ändern                                     | Ziehen durch langes Drücken und Fotomenü mit Verschieben                                   |
| Bestehenden Stand bearbeiten                               | Vorhandenen Bauschritt aktualisieren, ohne künstliche Revisionen                           |
| Offenen Stand weiterführen                                 | Dauerhafte lokale Entwürfe und Android-Picker-Wiederaufnahme                               |
| Visueller Vergleich                                        | Projektweite Auswahl, Auswahlreihenfolge und scrollbares Raster mit zwei oder drei Spalten |
| Lokale Projekterinnerungen                                 | Kopierte Android-Planung, eigene Kanäle, Receiver und Deep Links                           |
| Verschlüsselte Sicherung                                   | Übernommener Hausakte-Container mit eigener Kennung und JPEG-Prüfung                       |

Aus Hausakte wurden schlanke Routen, Feature-Hooks, Services, Ports, SQLite,
private Dateiablage, Dialogaktionen, Vorschlagsfelder, Datumsauswahl,
Fotoeditor, Viewer, Snackbar, Verlassen-Schutz und verschlüsselte Backups
übernommen oder passend angepasst.

OCR, Dokumentenscanner, PDF-Erzeugung, PDF-Vorschau, Dokumentanhänge und
entsprechende native Abhängigkeiten wurden nicht übernommen. Die Android-
Dokumentauswahl bleibt ausschließlich für verschlüsselte Backup-Dateien.
Teilelager, Einkauf und weitere fachliche Zusatzfunktionen sind nicht enthalten.

Die Gestaltung bleibt in Aufbau und Bedienung an der Referenz orientiert.
Petrol, Kupferakzente, warme Flächen und ein eigenes Icon geben der neuen App
eine unabhängige Identität. Das dunkle Thema folgt der Systemeinstellung.
