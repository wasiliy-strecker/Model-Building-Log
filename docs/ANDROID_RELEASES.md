# Android-Varianten und Signierung

Stand: 21. Oktober 2026. Es wurde kein Store-Artefakt erstellt oder hochgeladen.

| Variante     | Paket                             | Signatur                          | Start und Netzwerk                             |
| ------------ | --------------------------------- | --------------------------------- | ---------------------------------------------- |
| DevDebug     | `com.appfactory.modellbaulog.dev` | `.local/dev.keystore`             | Metro auf Port 8086                            |
| DevRelease   | `com.appfactory.modellbaulog.dev` | derselbe Dev-Schlüssel            | eingebettetes JavaScript, keine Netzwerkrechte |
| StoreRelease | `com.appfactory.modellbaulog`     | eigener privater Upload-Schlüssel | eingebettetes JavaScript, keine Netzwerkrechte |

StoreDebug und StoreProfile sind gesperrt. Dev und Store haben getrennte Daten,
Berechtigungen und Signaturen. Eine Dev-Installation ersetzt keine Store-App.
DevDebug und DevRelease aktualisieren dieselbe Dev-Installation datenbewahrend.
Die Version bleibt bei gewöhnlicher Entwicklung unverändert.

## Private Upload-Identität

Der lokale Store-Schlüssel liegt unter
`~/.local/share/app-factory/signing/modellbaulog/`. Das Verzeichnis enthält
`upload-keystore.p12`, `key.properties` und das öffentliche
`upload-certificate.pem`. Verzeichnis und Dateien sind nur für den Eigentümer
zugänglich. Diesen Ordner einschließlich Passwortkonfiguration privat sichern.
Er gehört nicht in Git oder ein App-Datenbackup.

Für eine erstmalige Einrichtung ohne vorhandenen Schlüssel:

```bash
python3 scripts/prepare-store-key.py
npm run prebuild
```

Das Skript erzeugt einen eigenen RSA-Schlüssel mit 4096 Bit und bricht ab,
wenn der private Ordner bereits existiert. Vorhandene oder bereits für Play
verwendete Schlüssel müssen wiederhergestellt werden. Sie dürfen nicht neu
erzeugt oder durch den Dev-Schlüssel ersetzt werden.

Expo Prebuild verknüpft die private Konfiguration mit dem Git-ignorierten
`android/key.properties`, sofern dort noch keine eigene Konfiguration liegt.
Alternativ kann `android/key.properties.example` außerhalb von Git ausgefüllt
werden. `storeFile` bezeichnet den absoluten Pfad zum privaten PKCS12-Schlüssel.
Prebuild erzeugt oder ersetzt selbst keine privaten Schlüssel.

## Prüfung ohne Store-Build

Mit JDK 21 und gesetztem `ANDROID_HOME` aus `android/`:

```bash
./gradlew :app:verifyStoreSigning
./gradlew :app:verifyStoreSigning -PmodellbaulogStorePropertiesFile=/tmp/modellbaulog-missing-key.properties
```

Der zweite Aufruf muss bei nicht vorhandener Datei fehlschlagen. Die Prüfung
kontrolliert den privaten Schlüssel, den Alias, die Zertifikatsgültigkeit und
die Trennung vom Dev-Zertifikat. Store-Aufgaben zum Packen und Signieren hängen
von dieser Prüfung ab. Dev-Builds und reine Manifestprüfungen benötigen keinen
Store-Schlüssel. Ein späterer Store-Build oder Upload benötigt einen eigenen Auftrag.

## Eigenständige Dev-Vorschau

```bash
npm run build:preview
npm run install:preview -- DEVICE_ID
```

Die APK liegt unter
`android/app/build/outputs/apk/dev/release/app-dev-release.apk`.
Der Installationshelfer prüft Paket, Version, Debug-Flag, Installer und das
Zertifikat der vorhandenen Installation. Er verwendet ausschließlich
`adb install -r -t -g --no-streaming`. Bei abweichender Signatur bricht er ab.
Nie deinstallieren oder App-Daten löschen, um eine Signaturabweichung zu umgehen.
Die Vorschau übersteht einen Kaltstart ohne Metro oder USB-Portweiterleitung.

Für React-Änderungen während der Entwicklung bleiben DevDebug und Fast Refresh
der Standard. Ein Commit oder eine reine Textänderung rechtfertigt keinen APK-Build.

## Wiederholbare Konfiguration

Das Expo-Plugin erhält die Varianten, Signierung, Bibliothekskorrekturen,
NIO-Desugaring, das eigene Startbild und die Manifestregeln bei Prebuild.
Store und DevRelease entfernen `INTERNET` und `ACCESS_NETWORK_STATE`.
`allowBackup=false` und explizite Regeln schließen Cloud-Backup und
Geräteübertragung für alle Android-Speicherdomänen aus.

Die Datenschutzseiten unter `docs/datenschutz/` und `docs/privacy/` sind auf
GitHub Pages veröffentlicht. Die Einstellungen öffnen
`https://wasiliy-strecker.github.io/Model-Building-Log/datenschutz/` im externen
Browser. Dafür benötigt die App keine eigene Netzwerkberechtigung.

GitHub Pages verwendet den Zweig `gh-pages` mit dem Wurzelverzeichnis `/`.
Er enthält ausschließlich die Kopien von `docs/index.html`,
`docs/datenschutz/index.html`, `docs/privacy/index.html`,
`docs/assets/privacy.css` sowie `.nojekyll`. Bei späteren Datenschutzänderungen
diese statischen Dateien aktualisieren. Der App-Code bleibt getrennt auf `main`.
