# ModellbauLog: kompakte Beispielfotos für Bauschritte

## Änderung

„Bauschritt erfassen“ zeigt wie SerienLog eine Anleitung und „Beispiele ansehen“.
Die Texte sind an Modellbau angepasst und liegen mit Bildtiteln und
Bedienhilfen unter stabilen Übersetzungsschlüsseln.

Die lokale Galerie enthält vier eigens generierte Motive: Cockpitmontage,
Karosserielackierung, Rumpfbeplankung und Dioramabau. Große Bilder, Wischen,
Pfeiltasten und Positionsanzeige folgen der Referenz. Das Bottom Sheet
verwendet die bestehenden Farben, abgerundeten Ecken und eine dezente Kontur.
Die Beispiele sind als KI-generiert gekennzeichnet und dienen nur zur Ansicht.
Sie werden nicht in Projekte, Entwürfe oder Backups übernommen.

Vier JPEGs mit 960 × 720 Pixeln benötigen insgesamt 468.018 Byte, rund 457 KiB.
Keine Metadaten, zusätzlichen Vorschaubilder oder Downloads. Herkunft und
Generierungsprompts stehen in `assets/photo-examples/`.
SerienLog und andere Referenz-Apps bleiben unverändert.

## Prüfung und Geräteupdate

`npm run check` erfolgreich: Prettier, ESLint, TypeScript und 35 Tests.
Zusätzliche Formatprüfung der Asset-Dokumentation und `git diff --check`
erfolgreich. JPEG-Dimensionen, fehlende EXIF-Metadaten und Größenbudget geprüft.
Die optimierte APK enthält genau die vier unveränderten JPEGs und nur ARM64.

Auf ausdrücklichen Wunsch einmal `npm run build:preview` gebaut.
759 von 797 Gradle-Aufgaben wurden wiederverwendet. Vorhandene Ausgabedatei
genutzt, keine zusätzlichen Auslieferungskopien, Emulator- oder Store-Builds.

`npm run install:preview -- A5CS024205005243` hat Paket, Version, Debug-Flag,
Installer und übereinstimmende Signatur geprüft. Datenbewahrendes Update per
`adb install -r -t -g --no-streaming` auf dem HONOR BVL-N49 erfolgreich.
Ziel bleibt `com.appfactory.modellbaulog.dev`, Version 1.0.0 (1), nicht
debuggable, Installer `null`. Vorher war die Auswahlseite ohne Formulareingaben
geöffnet. Das vorhandene Projekt und der gesicherte Entwurf bleiben verfügbar.

Auf dem Smartphone Anleitung, Galerieöffnung, alle vier Bildseiten,
Positionsanzeige, deaktivierte Randpfeile, horizontales Wischen und Schließen
geprüft. Danach erscheint unverändert die Erfassungsauswahl. Keine Projektdaten
oder Bauschritte für den Test angelegt oder bearbeitet.

Die installierte Vorschau enthält die Änderung auch nach einem Kaltstart.
Kein Versionssprung, Push oder Upload.
