# ModellbauLog: Dev-Vorschau mit abgerundeten Labels aktualisiert

## Auslieferung

Auf ausdrücklichen Wunsch die eigenständig startende DevRelease-Vorschau aus
Commit `9076b6b` mit `npm run build:preview` neu gebaut. Der Build ist erfolgreich.
Prebuild hat keine weiteren Repository-Dateien geändert.

Vor dem Update zeigte das entsperrte Projektformular „Alles gespeichert“.
Es waren keine ungespeicherten Projektänderungen offen. Der Installationshelfer
hat Paket, Version, Debug-Flag, Installer und Signatur geprüft und die APK mit
`adb install -r -t -g --no-streaming` datenbewahrend aktualisiert.

Ziel ist weiterhin `com.appfactory.modellbaulog.dev`, Version 1.0.0 (1), nicht
debuggable, Installer `null`. Die Signatur stimmt mit der vorherigen Installation
überein. Die eigenständige Vorschau enthält keine Netzwerkberechtigungen.

## Gezielte Prüfung

Die aktualisierte App startet auf dem HONOR BVL-N49. Das vorhandene Projekt
ist unverändert vorhanden. Im Projektformular wurden die abgerundeten
Beschriftungshintergründe bei befüllten und fokussierten Textfeldern geprüft.
Auch die Auswahlfelder „Intervall“ und „Tag“ verwenden die abgerundete Form.
Schrift und Feldkonturen bleiben lesbar. Fokusfarbe und deaktivierter
Speichern-Button funktionieren weiterhin. Es wurden keine Felder verändert
oder neue Testdaten gespeichert.

Die Format-, Lint-, TypeScript- und 35 App-Tests aus dem vorherigen Arbeitsschritt
bleiben gültig. Es gab seitdem keine Codeänderung. Datum und Backup-Passwort
verwenden dieselbe zuvor geprüfte interne Labelkomponente, wurden bei diesem
kurzen Gerätecheck aber nicht separat geöffnet.

Kein Store-Build, Versionssprung, Push oder Upload. Die sichtbare Aktualisierung
ist in der installierten APK enthalten und bleibt nach einem Neustart erhalten.
