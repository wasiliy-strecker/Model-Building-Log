# ModellbauLog: feine gelbe Dialogkonturen mit dezentem Glow

## Änderung

Den letzten Smartphone-Screenshot vom 21. Oktober 2026, 15:38:13 geprüft.
Dialoge und Bottom Sheets verwenden jetzt eine zentrale Kontur von 0,5 dp
im App-Gelb mit 70 Prozent Deckkraft. Ein kleiner, unversetzter Schatten
mit 8 dp Weichzeichnung und 14 Prozent Deckkraft erzeugt einen dezenten Glow.

Die gemeinsame Darstellung gilt für Bestätigungsdialoge, Auswahl-Sheets,
Beispielfotos, Datum und Uhrzeit, Backup-Passwörter und Fortschrittsdialoge.
Vorhandene Rundungen, Abstände und Bedienabläufe bleiben erhalten.
Verankerte Menüs, Karten, Eingabefelder und die Vollbild-Fotoansicht sind
unverändert. Keine zusätzlichen Bilder, Pakete oder nativen Änderungen.
Ältere Android-Versionen ohne Unterstützung für äußere Box-Schatten zeigen
weiterhin die dünne gelbe Kontur.

## Prüfung und Smartphone

`npm run check` erfolgreich: Prettier, ESLint, TypeScript und 35 Tests.
Diff und alle fünf Verwendungen des gemeinsamen Konturstils geprüft.
Keine zusätzlichen Tests für die reine Darstellung.

Die bestehende eigenständige Smartphone-Vorschau wurde wie beim vorherigen
Update mit `npm run build:preview` aktualisiert. Ein ARM64-Dev-Build in der
vorhandenen Ausgabedatei, 34 Sekunden, 773 von 797 Gradle-Aufgaben wiederverwendet.
Keine zusätzlichen Auslieferungskopien und kein Store-Build.

`npm run install:preview -- A5CS024205005243` prüfte Paket, Version, Debug-Flag,
Installer und übereinstimmende Signatur. Datenbewahrende Installation auf dem
HONOR BVL-N49 erfolgreich. Paket `com.appfactory.modellbaulog.dev`,
Version 1.0.0 (1), nicht debuggable, Installer `null`.
Vor dem Update war die Beispielgalerie ohne Formulareingaben geöffnet.

Backup-Passwortdialog und Beispielfoto-Sheet auf dem Smartphone visuell geprüft.
Die feine gelbe Kontur und das weiche Leuchten sind sichtbar. Passwortdialog
ohne Eingaben abgebrochen. Keine Backups oder Testdaten erstellt, Projekt und
gesicherter Entwurf weiterhin vorhanden. Die Beispielgalerie bleibt geöffnet.
Datum, Uhrzeit und Fortschritt nutzen denselben Stil und wurden nicht gesondert
auf dem Gerät geöffnet.

Changelog auch im Workspace abgelegt. Kein Push oder Upload.
