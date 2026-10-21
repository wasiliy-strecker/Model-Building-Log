# Prüfung von ModellbauLog

Erstprüfung: 2. Oktober 2026. Abgleich der Erinnerungen und Modelltypen: 20. Oktober 2026.

## Automatisierte Prüfung

`npm run check` prüft Prettier, ESLint, TypeScript und die kleine Vitest-Suite.
Elf Tests in drei Dateien verwenden echtes SQLite aus Node 22.
Sie decken chronologische Stände, Verlauf und Suche, exakte ganze Nummern,
persistente Foto-Entwürfe, Ersetzen und Sortieren, Referenzschutz beim Löschen,
Projektlöschung und Vergleich über mehrere Seiten ab.

Backups werden mit einer unabhängigen Node-AES-GCM-Implementierung entschlüsselt.
Falsches Passwort, manipulierte Daten und fremde App-Kennung werden abgewiesen.
Wiederherstellung erhält neuere lokale Notizen und offene Entwürfe, repariert
passende fehlende Fotos und bereinigt vorbereitete Dateien bei einem Datenbankfehler.
Die JPEG-Testdatei ist synthetisch. Der Node-Inspector ist ein Testadapter.
Die echte Android-JPEG-Prüfung wird separat im nativen Modul getestet.

`npm run check:native` führt die nativen Unit-Tests und Android Lint für das
eigene Modul aus. JPEG-Decoding verwendet Robolectric mit nativer Grafik.
Zusätzlich werden private Dateigrenzen, Backup-Speicherabbruch und
Erinnerungsplanung einschließlich Fehlerfällen geprüft.

Der einmalige Dev-Build ist wegen neuer Paketkennung, nativem Modul und
App-Ressourcen erforderlich. Er verwendet ausschließlich `assembleDevDebug`
für ARM64. Ein Store-Build oder Push gehört nicht zur Prüfung.

Ergebnisse:

- Prettier, ESLint und TypeScript bestehen ohne Fehler oder ESLint-Warnungen.
- Vitest: 11 Tests in drei Dateien erfolgreich.
- Native Unit-Tests: 34 erfolgreich, keine Fehler oder übersprungenen Tests.
- Android Lint: keine Fehler. 22 Hinweise zu übernommenen API-Zweigen,
  Berechtigungsanalyse, KTX-Schreibweisen und verfügbaren Abhängigkeitsversionen.
  Genaue Alarme werden nur nach Prüfung der Android-Freigabe geplant.
- Android-JavaScript mit Metro erfolgreich gebündelt. Dev-Export ausschließlich
  zur Modul- und Routenprüfung unter `/tmp/modellbaulog-metro-check`.
- DevDebug-APK erfolgreich für ARM64 gebaut. Paketkennung
  `com.appfactory.modellbaulog.dev`, Name `ModellbauLog Dev`, Version 1.0.0,
  versionCode 1, debuggable, minSdk 24 und targetSdk 36.
- Zertifikat: `CN=ModellbauLog Local Development`. Der eigene Schlüssel liegt
  außerhalb des von Expo generierten Android-Ordners und ist Git-ignoriert.
- `bash -n scripts/*.sh` besteht. Beide Vorlagen haben unveränderte Git-Arbeitsstände.

Ein voller Datenträger unterbrach zunächst den C++-Build. Unvollständige,
generierte C++-Dateien der neuen App wurden entfernt. Ein nachweislich
unvollständiger Expo-Plugin-Transform im Gradle-Cache wurde ebenfalls entfernt.
Build und native Prüfung wurden danach ohne Build-Cache mit `--rerun-tasks`
erfolgreich ausgeführt. Die Helfer verwenden eigene Gradle-Prozesse über
`--no-daemon` und Expo Prebuild mit `--no-clean`. Vorlagen wurden nicht bereinigt
oder verändert. Zusätzliche Store-Artefakte wurden nicht erzeugt.

Nur bekannte Abstürze der SDK-57-Abhängigkeitsanalyse für Expo Modules Core und
Worklets sind im nativen Prüfsystem ausgenommen. Die Analyse des eigenen
Moduls und seine Unit-Tests bleiben aktiv.

Nach der Cache-Reparatur besteht auch der normale Aufruf `npm run check:native`
ohne zusätzliche Wiederholungs- oder Cache-Flags.

## Kurze manuelle Prüfung auf Android

Diese Schritte sind dokumentiert und noch nicht auf einem realen Gerät ausgeführt.
Beim Prüfen war kein Android-Gerät per adb angeschlossen. Es wurden keine
aufwendigen visuellen Testreihen oder Emulator-Reihen durchgeführt.

1. „Spitfire“ mit Modelltyp „Flugzeug“, Hersteller und Material anlegen.
   Projekt wieder öffnen und Angaben ändern. Nach Neustart bleiben sie erhalten.
2. Manuell Schritt 0, optionalen Titel und eine Farbnotiz erfassen.
   Ganze Nummern akzeptieren. Leere, negative und gebrochene Nummern abweisen.
   Einen älteren Zeitpunkt ergänzen. Der aktuelle Stand bleibt der zeitlich neueste.
3. Mehrere Galeriefotos und ein Kamerafoto zu einem Schritt hinzufügen.
   Vollbild, Wischen und Zoom öffnen. Fotos durch Ziehen oder das Menü sortieren.
   Ein Foto ersetzen und eines entfernen. Speichern und Reihenfolge erneut öffnen.
4. Einen Schritt bearbeiten und danach Änderungen verwerfen.
   Der gespeicherte Stand und seine Fotos bleiben erhalten.
   Während offener Fotoauswahl die App beenden. Nach Neustart den Entwurf
   weiterführen und die wiederhergestellten Fotos oder die Fehlermeldung prüfen.
5. Fotos verschiedener Schritte in eigener Reihenfolge auswählen und vergleichen.
   Mehr als drei Bilder wählen und scrollen. Im Hochformat zwei und im Querformat
   drei Spalten prüfen. Ein Vergleichsfoto groß öffnen und zur Auswahl zurückkehren.
6. Mehr als zehn Schritte erfassen. Den Verlauf weiterblättern und nach Titel,
   Farbnotiz oder Datum suchen. Ein vorhandener Schritt bleibt bearbeitbar.
7. Backup mit Passwort erstellen. Dateiauswahl abbrechen und erneut speichern.
   Teilen nur über eine bewusst gewählte App auslösen. Wiederherstellen und
   anschließend Projekte, Fotoreihenfolge und neuere lokale Änderungen prüfen.
8. Eine Erinnerung einschalten, Test auslösen und Android-Berechtigungen prüfen.
   Die gespeicherte Benachrichtigung öffnet das richtige Projekt. Erinnerung
   deaktivieren und Projekt löschen. Es bleiben keine aktiven Projektalarme.

## Bekannte Tooling-Einschränkung

`npm audit` meldet vier hohe Einträge im Expo-CLI-Abhängigkeitsbaum durch
`node-forge@1.4.0`. Die offizielle Meldung
[GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv)
führt am Prüfungstag keine korrigierte Version auf. Eine von npm vorgeschlagene
Rückstufung auf Expo 44 wurde nicht vorgenommen. ModellbauLog-Backups verwenden
Noble und die Android-Passwortableitung, nicht node-forge.

## Abgleich vom 20. Oktober 2026

Referenzen sind SerienLog `84be04e` und `e0eeece` sowie der dokumentierte
MaschinenLog-Store-Stand `3052bc8` mit Version 1.0.0 (5).

`npm run check` besteht mit 24 Tests in sechs Dateien, Prettier, ESLint und
TypeScript. `npm run check:native` besteht mit 41 Tests, null Lint-Fehlern und
22 bestehenden Hinweisen. Die neuen Tests decken Moduswechsel mit abgelehntem
oder unbekanntem Status, fehlende Einstellungsseiten, passende Kanalauswahl,
Intervallwechsel, Test-Benachrichtigungen und Erhalt eigener Modelltypen ab.
Native Tests prüfen das gemeinsame eigene Symbol und #315F69 für normale und
pünktliche Benachrichtigungen, Projektlinks, blockierte Kanäle und die erneute
Aufhebung fehlgeschlagener Termine.

Ein DevDebug-Update war wegen der nativen Schnittstelle und des neuen
Benachrichtigungssymbols nötig. `npm run build:dev` und der datenbewahrende
Installationshelfer bestehen. Paket und Signatur passen zur vorhandenen
Dev-Installation. Version bleibt 1.0.0 (1). Startseite und Formular mit den
sechs Modelltypen auf dem HONOR-Gerät geprüft. Keine Projekte gespeichert.
Weitere Gerätebedienung beendet, als SerienLog im Vordergrund erschien.
Benachrichtigungsanzeige und tatsächliche Zustellung sind nicht am Gerät
abgenommen. Kein Store-Build und kein Push.

Kurze ergänzende manuelle Prüfung:

1. Ein vorhandenes Projekt mit eigenem Modelltyp öffnen. Der Wert bleibt
   erhalten. Die Vorschlagsliste enthält nur Flugzeug, Fahrzeug, Schiff,
   Figur, Diorama und Sonstiges. Einen eigenen Begriff eingeben, speichern
   und erneut öffnen.
2. Zwischen Normal und Pünktlich mit Ton wechseln. Bei fehlender Freigabe
   öffnet sich Alarme & Erinnerungen. Nach Rückkehr aktualisiert sich der
   Status. Den gewählten Modus und die Intervallfelder beibehalten.
3. Nur einen Erinnerungskanal in Android sperren. Die betroffene Art meldet
   die Sperre und öffnet ihren Kanal. Der andere Modus bleibt verfügbar.
   Anschließend die vorherige Android-Einstellung wiederherstellen.
4. Beide Arten testen. Eigenes Flugzeug-und-Pinsel-Symbol, App-Farbe und
   korrekter Bauschritt sollen erscheinen. Ein gespeichertes Projekt wird
   beim Antippen geöffnet. Die Testmeldung verschwindet nach einer Minute.
   Nicht-stören-Hinweise beachten, ohne daraus eine Tonzusage abzuleiten.
5. Einen regulären Termin auslösen lassen. Erinnerung deaktivieren und erneut
   öffnen. Es soll kein Projektalarm zurückbleiben. Keine Testdaten oder
   geänderten Systemfreigaben dauerhaft zurücklassen.

Die Vorschläge und Formulartexte liegen in `src/core/i18n/de.ts` unter
stabilen Schlüsseln. Gespeicherte Modelltypen bleiben freie Zeichenketten.
Eine spätere Übersetzung der Vorschläge darf diese Werte nicht umschreiben.

## Gezielter Abgleich vom 21. Oktober 2026

SerienLog `7a11906` dient als technische Referenz. Die bestehende Modellbau-
Fachlogik, Erinnerungen, sechs Modelltypen, Dialoge und Buttonformen bleiben
erhalten. PDF-Funktionen sind für ModellbauLog nicht relevant.

`npm run check` besteht mit 35 Tests in zehn Dateien, Prettier, ESLint und
TypeScript. Die ergänzten Tests prüfen:

- Alte MLBACK01-Datei mit dem neuen nativen Crypto-Adapter, vollständiger
  Historie, Fotoreihenfolge und Nummern oberhalb der JavaScript-Zahlengenauigkeit.
- Einmaliges Lesen und Hashen je Datei beim Export, Fortschrittsphasen,
  AES-GCM-Austausch mit unabhängiger Implementierung und korrekte Byte-Ausschnitte.
- Beschädigte Eingaben und geschriebene Dateien sowie einen Datenbankfehler
  beim Wiederherstellen. Vorhandene Daten und Entwürfe bleiben erhalten,
  vorbereitete Dateien werden bereinigt.
- Abwarten verzögerter Dateioperationen beim Speichern und Teilen.
- Letztes bebildertes Projektfoto trotz zwölf neuerer Schritte ohne Foto,
  geänderte Fotoreihenfolge und Entfernen des letzten bebilderten Schritts.
- Vorhandene Formularregeln und die Vorschlagsposition oberhalb oder unterhalb
  des Feldes bei begrenztem Platz.

`npm run check:native` besteht mit 51 Tests, null Fehlern und 24 Lint-Hinweisen.
Gson und Commons IO werden zusätzlich auf Android-API 24, 25 und 35 geprüft.
Das Foto der alten Backup-Testdatei wird zusätzlich vom Android-Decoder geprüft.
Die Hinweise umfassen weiterhin übernommene API-Zweige, KTX-Schreibweisen und
Abhängigkeitsversionen. Die Einschränkung bei der Analyse der Expo-/Worklets-
Abhängigkeiten aus der Erstprüfung bleibt bestehen.

`expo install --check` bestätigt die SDK-Kompatibilität. Der aktuelle
[Abhängigkeitsbericht](DEPENDENCIES.md) dokumentiert die verbleibenden
18 hohen npm-Audit-Einträge. Es wurden keine erzwungenen Rückstufungen vorgenommen.

Die drei zusammengeführten Android-Manifeste wurden geprüft. StoreRelease und
DevRelease haben keine Netzwerkrechte. DevDebug behält die Rechte für Metro.
Alle Varianten schließen Android-Cloud-Backups und Geräteübertragungen aus.
Der Store-Runtime-Baum löst Gson 2.13.2 und Commons IO 2.14.0 auf. Die private
Store-Signierung besteht die eigenständige Prüfung. Eine fehlende Konfiguration
führt zum erwarteten Abbruch. Dabei wurde kein Store-Artefakt gebaut.

Die lokal vorbereiteten deutschen und englischen Datenschutzseiten wurden
auf Modellbau-Inhalte und funktionierende relative Links geprüft. Sie laden
keine externen Schriften oder Skripte. Veröffentlichung und App-Link bleiben
einem gesonderten Auftrag vorbehalten.

### Dev-Vorschau auf dem HONOR BVL-N49

Der ausdrücklich beauftragte einmalige `npm run build:preview` besteht.
Die APK enthält JavaScript und hat keine Netzwerkrechte. Paket ist
`com.appfactory.modellbaulog.dev`, Version bleibt 1.0.0 (1), ARM64, minSdk 24,
targetSdk 36, nicht debuggable. `npm run install:preview -- A5CS024205005243`
hat die Signatur mit der bisherigen DevDebug-Installation verglichen und die
App datenbewahrend aktualisiert. Der Installer wird weiterhin als `null` gemeldet.

Vor dem Update war der Expo-Launcher geöffnet. Danach erscheinen Startseite
und Projektformular im vorhandenen ModellbauLog-Stil. Die sechs Vorschläge
sind bei offener Tastatur unabhängig scrollbar, einschließlich „Sonstiges“.
Ein leerer Projektname zeigt den Fehler unmittelbar unter dem Feld. Die
ungespeicherten Testeingaben wurden verworfen.

Ein verschlüsseltes Backup wurde mit Passwortbestätigung bis zur Android-
Speicherortauswahl erstellt. Abbruch und erneutes Wählen des Speicherorts
funktionieren. Das nicht gespeicherte Backup wurde anschließend verworfen.
Eine mit dem ursprünglichen Codec erzeugte Sicherung wurde mit nativer
Passwortableitung, AES-GCM, SHA-256 und JPEG-Prüfung bis zur Bestätigung
gelesen. Sie enthält ein Projekt und zwei Bauschritte. Der Import wurde dort
abgebrochen. Es wurden keine Projekte, Bauschritte oder Fotos übernommen.

Die erste synthetische Backup-Probe enthielt versehentlich das unverkleinerte
2500-Pixel-Eingabefoto. Die vorhandene Android-Prüfung lehnte es korrekt ab.
Die feste Legacy-Testdatei enthält jetzt ein mit dem Android-Decoder geprüftes
32-Pixel-JPEG. Vitest prüft die bytegenaue Übereinstimmung. Dafür wurden nur
Tests und Testdaten angepasst, kein weiterer APK-Build ausgeführt.

Temporäre Geräte-Testdateien sind entfernt. Ein anschließender Kaltstart
meldet `LaunchState: COLD` und öffnet direkt die unveränderte leere Projektliste.
Es besteht keine adb-Portweiterleitung. Projektfotos wurden mangels gespeicherter
Projekte nicht am Gerät abgenommen. Ihre Auswahl, Reihenfolge und der davon
unabhängige aktuelle Bauschritt sind durch die Repository-Tests abgedeckt.
Es gab keine umfangreiche visuelle Testreihe, keinen Store-Build und keinen Push.

## Farbwechsel vom 21. Oktober 2026

Die freigegebenen Vorschauen werden als festes dunkles Theme umgesetzt. Die
Farbrollen liegen in `src/core/ui/palette.ts`. Expo verwendet ebenfalls dauerhaft
Dunkelmodus. Startansicht und Theme verwenden denselben anthrazitfarbenen Hintergrund.

`npm run check` besteht mit 35 Tests, Prettier, ESLint und TypeScript.
`npm run check:native` besteht mit 51 Tests, null Lint-Fehlern und den 24
bestehenden Hinweisen. Der vorhandene Test für reguläre und Test-Erinnerungen
prüft Gelb (`#FFD600`) in beiden Benachrichtigungsmodi und das eigene Symbol.
Eine kleine Kontrastberechnung ergibt 15,26:1 für Haupttext auf Karten,
8,44:1 für Hilfetext, 12,94:1 für dunklen Text auf gelben Buttons,
11,28:1 für gelbe sekundäre Aktionen und 7,72:1 für gefüllte Fehleraktionen.

SVG-Symbole neu erzeugt, Prebuild und `npm run build:preview` erfolgreich.
Der Build ist wegen der eingebetteten Symbole und nativen Farbänderungen nötig.
Das Build-Skript führt Prebuild erneut aus und erhält die neuen Einstellungen.
Die DevRelease-Vorschau wurde nach Paket-, Versions-, Debug-, Installer- und
Signaturprüfung mit `npm run install:preview -- A5CS024205005243` datenbewahrend
installiert. Version bleibt 1.0.0 (1), Paket `com.appfactory.modellbaulog.dev`.
Die APK ist nicht debuggable und hat weiterhin keine Netzwerkrechte.

Auf dem HONOR BVL-N49 sind Übersicht, Projektformular, gelber Eingabefokus und
deaktivierter Speichern-Button geprüft. Ein Kaltstart bei vorübergehend hellem
Smartphone-Modus meldet `LaunchState: COLD`. Die App bleibt anthrazitfarben mit
weißer Schrift und gelben Aktionen. Anschließend den vorherigen dunklen
Systemmodus wiederhergestellt. Das vorhandene Projekt bleibt erhalten.
Weitere Gerätebedienung ist wegen paralleler Bedienung von ZählerstandLog pausiert.
Es wurde kein neues Projekt gespeichert und kein vorhandenes Projekt geändert.

Ausstehend ist die kurze Sichtprüfung von Feldfehler, Dialog, Bottom Sheet und
Test-Benachrichtigung. Keine aufwendige visuelle Testreihe, kein Store-Build und
kein Push.
