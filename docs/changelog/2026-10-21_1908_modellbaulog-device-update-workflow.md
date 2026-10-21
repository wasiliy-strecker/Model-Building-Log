# Geräteupdates als festen Entwicklungsschritt dokumentiert

Die app-lokale AGENTS.md hält den dauerhaften Nutzerauftrag fest: Nach
App-Änderungen das angeschlossene Smartphone selbst aktualisieren. Bei DevDebug
normale React-Änderungen mit Fast Refresh übernehmen. Bei der eigenständigen
DevRelease-Vorschau eine aktuelle Dev-APK bauen und datenbewahrend installieren.
Die bestehende Installationsart beibehalten, offene Eingaben schützen und den
tatsächlichen Gerätestand im Abschluss nennen. Reine Dokumentationsänderungen
benötigen kein Geräteupdate. Kein erneutes Einholen einer Build-Freigabe.

Für die Projektsymbole aus Commit `e7552d1` die ARM64-DevRelease-APK mit
`MODELLOG_ANDROID_ARCHITECTURES=arm64-v8a npm run build:preview` gebaut.
Erfolgreich in 1 Minute 22 Sekunden. 773 von 797 Gradle-Aufgaben wiederverwendet.
Expo-Prebuild hat keine versionierten Konfigurationsdateien geändert.
Keine zusätzlichen APK-Kopien, Store-Artefakte oder Versionssprünge.

## Prüfung und Gerätestand

APK: `android/app/build/outputs/apk/dev/release/app-dev-release.apk`, 45,3 MiB.
Paket `com.appfactory.modellbaulog.dev`, Version `1.0.0` mit Versionscode `1`,
nicht debuggable. Nur ARM64, eingebettetes JavaScript mit der neuen Symbolauswahl
und keine Netzwerkberechtigungen. APK-Signaturprüfung erfolgreich.
SHA-256: `1f14b1c8694b31deb8f6377d649cffa7fa7e955472aa9249ed4a13b44cebbfb3`.

Das verbundene HONOR BVL-N49 verwendet bereits dieselbe DevRelease-Identität und
Version, Installer `null`. Das Smartphone ist noch gesperrt. Vor der Installation
steht die Prüfung auf offene Eingaben aus. Die Entsperrung wurde angefragt.
Bis dahin wurde keine Installation und kein Neustart der App durchgeführt.
Die installierte App und ihre Daten bleiben zum Zeitpunkt dieses Eintrags unverändert.

AGENTS.md, Changelog und Diff auf Formatfehler geprüft. Die 57 erfolgreichen
App-Tests aus dem vorherigen Schritt gelten weiter. Seitdem gab es keine
Laufzeitcodeänderung. Kein Push.
