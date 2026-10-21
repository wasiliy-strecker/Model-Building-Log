# Aktionsbuttons kapselrund

Der gemeinsame Fab-Stil verwendet Radius 999 statt 16. Dadurch erhalten
„Projekt anlegen“ und „Bauschritt erfassen“ vollständig runde Enden, auch bei
höheren Buttons durch größere Schrift. Farben, Abstände und Aktionen bleiben
unverändert. Keine Änderung an Referenz-Apps.

## Prüfung und Smartphone

Prettier und ESLint für `src/core/ui/components.tsx`, `npm run typecheck` und
`git diff --check` erfolgreich. Beide Einsatzstellen geprüft. Sie verwenden
unverändert denselben Fab-Stil. Für diese reine Radiusänderung keine neuen
Tests und keine vollständige Testreihe.

Manueller Sichtprüfschritt: Im Dashboard „Projekt anlegen“ und im Projekt
„Bauschritt erfassen“ auf vollständig runde Enden prüfen. Nach der Installation
war das Smartphone gesperrt. Deshalb keine sichtbare Geräteprüfung behauptet.

Die eigenständige Dev-Vorschau benötigt für eine dauerhafte UI-Aktualisierung
wie beauftragt eine neue APK. Nur ARM64 mit
`MODELLOG_ANDROID_ARCHITECTURES=arm64-v8a npm run build:preview` gebaut.
Build erfolgreich in 3 Minuten 2 Sekunden. Keine zusätzliche APK-Kopie.
Mit `npm run install:preview -- A5CS024205005243` datenbewahrend installiert.
Paket, Version, Debug-Flag, Installer und gleiche Signatur vorab geprüft.
Ziel bleibt `com.appfactory.modellbaulog.dev`, Version `1.0.0`, Versionscode `1`,
nicht debuggable, Installer `null`. App gestartet und Prozess bestätigt.
Die installierte APK stimmt per SHA-256 mit dem neuen Build überein:
`285fdde8b5e26622dbdbb48d0e0b2eeb3c1886d912e4a5cf9307a2275526f5a7`.

Kein Push, Store-Build oder Versionswechsel. Changelog auch im Workspace.
