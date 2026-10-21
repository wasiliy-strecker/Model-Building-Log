# Abhängigkeiten und Audit

Stand: 21. Oktober 2026. SDK 57 bleibt erhalten. React 19.2.3 und
React Native 0.86.3 werden nicht zurückgestuft.

Die kompatiblen Expo-Patches entsprechen dem geprüften SerienLog-Stand.
`npx --no-install expo install --check` bestätigt die Kompatibilität.

| Paket                  | Aufgelöste Version |
| ---------------------- | ------------------ |
| expo                   | 57.0.30            |
| expo-asset             | 57.0.20            |
| expo-constants         | 57.0.22            |
| expo-crypto            | 57.0.4             |
| expo-dev-client        | 57.0.20            |
| expo-image-manipulator | 57.0.21            |
| expo-linking           | 57.0.13            |
| expo-router            | 57.0.28            |
| expo-sharing           | 57.0.23            |
| expo-splash-screen     | 57.0.10            |
| expo-sqlite            | 57.0.4             |

Das Lockfile aktualisiert außerdem `shell-quote` auf 1.12.0,
`source-map-js` auf 1.2.2 und das nur für Tests verwendete Vite auf 8.3.5.
Der kompatible Vite-Patch enthält die Korrektur für den eingebetteten
Editor-Aufruf. Siehe die [Vite-Versionshinweise zu 8.3.3](https://github.com/vitejs/vite/releases/tag/v8.3.3).

## Verbleibende npm-Meldungen

`npm audit` meldet nach diesen Änderungen 0 kritische und 18 hohe Einträge.
Die hohen Einträge ergeben sich aus zwei noch gemeldeten Ursachen und den
davon abhängigen Paketen im Expo-/Metro-Tooling:

- `braces@3.0.3`: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- `node-forge@1.4.0`: [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv).

Die von npm vorgeschlagenen Rückstufungen auf Expo 44, React Native 0.72 und
ältere Worklets-/Reanimated-Versionen werden nicht übernommen. Der Audit ist
damit nicht meldungsfrei. Backups verwenden Expo Crypto und die eigene
Passwortableitung, nicht node-forge. Das ist keine pauschale Entwarnung für
das Entwicklungswerkzeug. Die Meldungen müssen bei künftigen kompatiblen
Updates erneut geprüft werden.

## Android

`plugins/dependency-versions.gradle` und seine von Expo Prebuild kopierte
Android-Datei legen Gson 2.13.2 und Commons IO 2.14.0 fest. Der aufgelöste
Store-Runtime-Baum bestätigt diese Versionen statt Gson 2.8.6 und
Commons IO 1.4 beziehungsweise 2.6.

App und natives Modul verwenden `desugar_jdk_libs_nio:2.1.5`, damit die
NIO-Aufrufe von Commons IO auch unter Android 7 verfügbar bleiben.
Die gezielten Robolectric-Tests führen Gson-Verarbeitung sowie Commons-IO-
Stream- und Dateinamenoperationen auf API 24, 25 und 35 aus. Sie ergänzen die
bestehenden nativen Prüfungen. Ein Store-Build ist dafür nicht erforderlich.
