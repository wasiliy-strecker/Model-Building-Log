# ModellbauLog: Vergleichssymbol und rote Löschaktionen

## Änderung

Der Screenshot vom 21. Oktober 2026, 15:52:15 zeigte eine Ziffer 1 neben
„Fotos vergleichen“. Ursache war der falsche Codepunkt in der Icon-Tabelle.
`compare` verwendet jetzt U+E181 statt U+E3B9. Die Zuordnung wurde mit der
Flutter-Definition der identischen gebündelten Material-Icons-Schrift geprüft.
Alle drei Vergleichsbuttons verwenden damit das richtige Vergleichssymbol.

Löschaktionen verwenden eigene Farben, getrennt von Formularfehlern.
„Projekt löschen“ und „Bauschritt löschen“ erhalten eine rote Kontur mit roter
Schrift und rotem Symbol. Die abschließende Bestätigung ist rot ausgefüllt
mit weißer Beschriftung. „Foto entfernen“ ist als destruktiver Menüeintrag
ebenfalls rot. Bestehende Rundungen, Dialogkonturen und Löschabläufe bleiben
erhalten. Keine Änderung an Fotoauswahl, Vergleichslogik oder gespeicherten Daten.

## Prüfung und Smartphone

`npm run check` erfolgreich: Prettier, ESLint, TypeScript und 35 Tests.
`git diff --check` erfolgreich. Die Kontraste wurden rechnerisch geprüft:
rote Schrift auf den drei dunklen Oberflächen mindestens 4,57:1.
Weiße Schrift auf der roten Bestätigungsfläche erreicht 4,98:1.

Ein ARM64-DevRelease-Build mit `npm run build:preview` erfolgreich.
772 von 797 Gradle-Aufgaben wiederverwendet. Die bestehende Ausgabedatei wurde
aktualisiert, keine weiteren APK-Kopien und kein Store-Paket erstellt.

`npm run install:preview -- A5CS024205005243` prüfte Paket, Version, Debug-Flag,
Installer und übereinstimmende Signatur. Datenbewahrendes Update auf dem HONOR
BVL-N49 erfolgreich. Paket `com.appfactory.modellbaulog.dev`, Version 1.0.0 (1),
nicht debuggable, Installer `null`. Vor dem Update war eine gespeicherte
Bauschrittdetailseite ohne offene Eingaben sichtbar.

Die anschließende Sichtprüfung wartet auf das Entsperren des Smartphones.
Manuell zu prüfen: korrektes Vergleichssymbol in Projekt und Bauschritt,
rote Löschkontur, rote Bestätigung mit weißer Schrift und unveränderte Rückkehr
nach „Abbrechen“. Kein Löschen von Nutzerdaten für die Prüfung.
„Foto entfernen“ soll im Bearbeitungsmenü rot erscheinen, ohne Fotos zu entfernen.

Changelog auch im Workspace abgelegt. Kein Push oder Upload.
