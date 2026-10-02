# Prüfung von ModellbauLog

Stand: 2. Oktober 2026.

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
