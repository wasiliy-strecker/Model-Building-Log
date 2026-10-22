# Erste signierte Store-AAB für ModellbauLog

Den aktuellen App-Stand aus `386ae3e` als Store-Version 1.0.0 (1) gebaut.
Paket `com.appfactory.modellbaulog`, sichtbarer Name `ModellbauLog`, eigener
bestehender Upload-Schlüssel. Keine Versionsänderung für die erste Auslieferung.

App-lokalen Build- und Prüfhelfer nach SerienLog ergänzt. Er prüft die
Android-Konfiguration gegen die Expo-Plugin-Vorlagen und liefert erst nach
erfolgreicher Artefaktprüfung eine unveränderliche benannte AAB samt JSON-Bericht.
Erneute Auslieferung derselben Version bricht vor Gradle ab. Release-Anleitung
und README um die Befehle ergänzt. Referenz-Apps unverändert.

Datei: `build/releases/production/modellbaulog-1.0.0-build-1-production.aab`.
Größe: 48.761.985 Bytes.
SHA-256: `210ccafc2d161eca1cd60ffc711ba83b92dfa5a02d205cb76b0cfa96ec115827`.

Bundletool und Jarsigner bestätigen Paket, Version, Store-Name, vollständige
Signatur mit eigenem Zertifikat und eingebettetes JavaScript. Minimum API 24,
Ziel API 36, ARM64 und x86_64. Alle 44 nativen Bibliotheken besitzen
16-KB-Ausrichtung, die Bundle-Konfiguration fordert 16-KB-ZIP-Ausrichtung.
Keine Netzwerkberechtigungen oder Debug-Freigabe. System-Backup deaktiviert,
app-eigene Ausschlussregeln für Backup und Geräteübertragung vorhanden.
Die geprüften Build-Werkzeuge sind laut Source Map nicht im App-JavaScript.

Prüfung: `npm run check` mit Formatierung, ESLint, TypeScript und 59 Tests in
14 Dateien erfolgreich. Die zwei bestehenden Warnungen zu doppelten Imports
in `report-pagination.test.ts` bleiben unverändert. `npm run check:native`
mit 52 Tests und Modul-Lint erfolgreich. Der bestehende Helfer spart weiterhin
die inkompatiblen Abhängigkeits-Lintläufe aus. `npm run check:store` mit neun
Tests und Shell-Syntaxprüfung erfolgreich. Store-Build samt Store-Lint und
Artefaktprüfung erfolgreich. Überschreibschutz erneut ausgeführt und identische
SHA-256 der Auslieferung bestätigt. Kleine Prüfprotokolle liegen lokal unter
`build/validation/release-1/`.

Zusätzlicher Online-Check `expo install --check` empfiehlt inzwischen drei
neuere Patchversionen für Expo, Router und Sharing und endet deshalb mit Code 1.
Die installierten, getesteten Abhängigkeiten wurden für diese Auslieferung
beibehalten. Keine erzwungenen Updates oder Downgrades.

Deutsche Release-Notizen liegen neben der AAB. Kein Upload, keine Veröffentlichung,
kein Push und keine Änderung an der Dev-Installation oder Smartphone-Daten.
Build-Ausgaben, Prüfprotokolle und private Signierung werden nicht eingecheckt.
