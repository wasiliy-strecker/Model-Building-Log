# Dev-Vorschau mit Projektsymbolen installiert

Auf ausdrücklichen Nutzerauftrag die bereits gebaute ARM64-DevRelease-APK
mit `npm run install:preview -- A5CS024205005243` auf dem HONOR BVL-N49
installiert. Die neue Symbolauswahl und korrigierten Icons sind damit in der
dauerhaft installierten App enthalten. Kein weiterer APK-Neubau erforderlich.

Die AGENTS.md hält fest, dass offene Formulareingaben und ein gesperrtes
Smartphone ein technisch mögliches Dev-Update nicht verzögern dürfen. Der Nutzer
akzeptiert den möglichen Verlust aktuell ungespeicherter Eingaben bei Updates
und notwendigen Neustarts. Deshalb keine entsprechende Rückfrage oder Wartezeit.
Gespeicherte Daten bleiben geschützt. Deinstallation und Datenlöschung bleiben
ausgeschlossen. Tatsächliche Android-Systembestätigungen oder Installationsfehler
werden weiterhin ausdrücklich benannt.

## Prüfung

Der Installationshelfer hat Zielpaket, Version, Debug-Flag, Installer und die
übereinstimmenden Zertifikate vor dem Update geprüft. Installation mit
`adb install -r -t -g --no-streaming` erfolgreich. Ziel bleibt
`com.appfactory.modellbaulog.dev`, Version `1.0.0` mit Versionscode `1`,
nicht debuggable, Installer `null`. Aktualisierungszeit 21.10.2026, 19:12:34.

SHA-256 der installierten APK stimmt exakt mit dem geprüften neuen Build überein:
`1f14b1c8694b31deb8f6377d649cffa7fa7e955472aa9249ed4a13b44cebbfb3`.
App-Start ausgelöst und laufenden Prozess bestätigt. Der Sperrbildschirm
verhindert lediglich die sichtbare Prüfung. Keine gespeicherten Daten gelöscht,
keine zusätzlichen APK-Kopien angelegt und kein Store-Build oder Push.

Dokumentation, Formatierung, identische Changelog-Kopien und Diff geprüft.
Keine erneuten App-Tests nötig, da seit den 57 erfolgreichen Tests aus dem
Symbolauswahl-Schritt nur Dokumentation geändert wurde.
