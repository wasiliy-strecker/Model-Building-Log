# ModellbauLog mit SerienLog und MaschinenLog abgleichen

Die SerienLog-Commits `84be04e` und `e0eeece` sowie MaschinenLog bei
`3052bc8` geprüft. MaschinenLog dokumentiert diesen Stand als Store-Auslieferung
1.0.0 (5). Die Terminberechnung, Berechtigungsprüfung und Wiederaufnahme aus
SerienLog entsprechen diesem Stand. Dessen zusätzliche Zählersymbole bleiben
außerhalb von ModellbauLog.

Erinnerungen in eigene Feature-Komponenten und Hooks aufgeteilt. Auswahl von
Normal und Pünktlich mit Ton, Intervallwechsel, stündlicher Start mit Prüfung der
Zeitumstellung, Android-Einstellungen mit Rückfallpfaden und verständliche
Test-Rückmeldungen übernommen. Normal meldet bei fehlgeschlagenem oder
unbekanntem Status keinen Fehler für genaue Alarme. Pünktlich bleibt auch bei
fehlgeschlagener Einstellungsseite ausgewählt. App-Sperren, Kanal-Sperren,
Nicht-stören-Modus und unbestätigte Termine werden getrennt angezeigt.

Fehlgeschlagenes Ausschalten bleibt im nativen Status sichtbar und wird beim
Synchronisieren und Wiederaufnehmen erneut versucht. Test-Benachrichtigungen
verwenden den bearbeiteten Projektnamen, Modelltyp und zeitlich neuesten
Bauschritt. Reguläre und Test-Benachrichtigungen nutzen dieselbe eigene Farbe
#315F69 und ein weißes Flugzeug-und-Pinsel-Symbol aus der App-Grafik.
Bestehende Kanal-IDs, Alarm-Intents, Preferences, Datenbank, Backups,
Paketkennungen und Signatur bleiben erhalten.

Genau sechs deutsche Modelltyp-Vorschläge zentral abgelegt: Flugzeug, Fahrzeug,
Schiff, Figur, Diorama und Sonstiges. Gespeicherte eigene Werte erweitern die
Liste nicht und bleiben unverändert bearbeitbar. Der deutsche Sprachkatalog
unter `src/core/i18n/` enthält stabile Schlüssel für die Vorschläge, Projekt-
und Bauschrittfelder sowie Erinnerungsfelder, Hilfetexte und Rückmeldungen.
Keine neue Sprache, Datenmigration oder gemeinsame Bibliothek eingeführt.

Prüfung: `npm run check` erfolgreich mit Prettier, ESLint, TypeScript und
24 Tests in sechs Dateien. Die gezielten Ergänzungen prüfen Modusfehler,
Kanalwahl, Intervallgedächtnis, Testanforderungen, Statusmeldungen und eigene
Modelltypen mit echtem SQLite einschließlich erneutem Öffnen.
`npm run check:native` erfolgreich mit 41 JVM-Tests, null Lint-Fehlern und
22 bestehenden Lint-Hinweisen. Native Tests prüfen beide Benachrichtigungsarten,
App-Symbol, Farbe, Projektlink, Kanalsperren und erneutes Ausschalten.

Wegen der geänderten nativen Schnittstelle und Symbolressource einmal
`npm run build:dev` ausgeführt. DevDebug für ARM64 gebaut und mit
`npm run install:dev -- A5CS024205005243` datenbewahrend aktualisiert.
Paket `com.appfactory.modellbaulog.dev`, Version 1.0.0 (1), debuggable,
Installer null. Die Signatur wurde gegen die vorhandene Installation geprüft
und stimmt überein. Keine Deinstallation oder Datenlöschung.

Startseite, Projektformular und die sechs Vorschläge auf dem HONOR-Gerät
bestätigt. Keine Projektdaten gespeichert. Die Gerätebedienung beendet, als
SerienLog im Vordergrund erschien. Tatsächliche Benachrichtigungsanzeige,
Ton und spätere Terminzustellung auf dem Gerät bleiben manuell zu prüfen.
Metro-Port 8086 läuft weiter. Keine aufwendige visuelle Testreihe.

Referenz-Apps nicht verändert. Kein Store-Build, Versionssprung oder Push.
Lokaler Commit nach erfolgreicher Prüfung.
