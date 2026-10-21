# ModellbauLog: gezielter Abgleich und eigenständige Dev-Vorschau

## Auftrag

Die fehlenden Verbesserungen aus SerienLog übernehmen, einschließlich Startlogo
und Projektfotos. Bestehende Fachlogik und Gestaltung erhalten. Keine zusätzlichen
PDF-Funktionen. Eine eigenständige Dev-Vorschau datenbewahrend auf dem Smartphone
installieren. Referenz-Apps unverändert lassen. Kein Store-Build oder Push.

## Umsetzung

- SHA-256 und AES-256-GCM über native Expo-Funktionen. Das MLBACK01-Format und
  PBKDF2-SHA256 mit 600000 Runden bleiben kompatibel, einschließlich Android-7-
  Fallback. Export liest und hasht jede Datei einmal. Wiederherstellung prüft
  vorbereitete Dateien vor der Datenübernahme und erhält neuere lokale Daten
  und Entwürfe. Dateioperationen werden abgewartet. Fortschrittsphasen ergänzt.
- Eigener Startbildschirm mit 180-ms-Übergang. Virtualisierte Projektliste und
  große Vorschaufotos aus dem letzten bebilderten Bauschritt. Der aktuelle
  Stand bleibt unabhängig vom Foto. Vorhandener Viewer wird weiterverwendet.
- Formularfehler direkt am Feld und Scrollen zum ersten Fehler. Die vorhandenen
  sechs übersetzbaren Modelltypen öffnen sich platzabhängig oberhalb oder
  unterhalb und bleiben bei offener Tastatur unabhängig scrollbar.
- Eigener privater Store-Upload-Schlüssel außerhalb von Git mit Signierungs-
  Prüfung und Abbruch bei fehlender Konfiguration. Dev-Signatur erhalten.
  Store und DevRelease ohne Netzwerkrechte. Cloud-Backup und Geräteübertragung
  explizit ausgeschlossen. Alle Regeln bleiben durch Expo Prebuild erhalten.
- Kompatible SDK-57-Patches, Vite-Patch, Gson 2.13.2, Commons IO 2.14.0 und
  Android-7-NIO-Desugaring. Keine erzwungenen Rückstufungen.
- Deutsche und englische Datenschutzseiten lokal vorbereitet. Noch keine
  Veröffentlichung und kein unerreichbarer App-Link. Entwicklungs- und
  Prüfhinweise aktualisiert.

## Prüfung und Gerät

`npm run check` besteht mit 35 Tests, Prettier, ESLint und TypeScript.
`npm run check:native` besteht mit 51 Tests, null Fehlern und 24 Hinweisen.
SDK-Kompatibilität, alle drei Android-Manifeste, aufgelöste Android-Abhängigkeiten,
Store-Signierung einschließlich Fehlfall, wiederholtes Prebuild sowie lokale
Datenschutzlinks geprüft. npm audit verbleibt bei 18 hohen Tooling-Einträgen,
null kritischen Einträgen. Ursachen und Grenzen stehen in docs/DEPENDENCIES.md.

Einmaliger DevRelease-Build wegen nativer Änderungen und beauftragter
Unabhängigkeit von Metro. APK und vorhandene Installation haben dasselbe
Dev-Zertifikat. Datenbewahrendes Update erfolgreich, Version 1.0.0 (1).
Kaltstart öffnet ModellbauLog direkt statt des zuvor sichtbaren Expo-Launchers.
Kein Debug-Flag und keine Netzwerkrechte, keine adb-Portweiterleitung nötig.

Auf dem HONOR-Gerät Vorschläge mit Tastatur, unabhängig scrollbare Liste,
Feldfehler, Passwortbestätigung, Backup-Verschlüsselung, Speicherortabbruch und
erneute Auswahl geprüft. Die Legacy-Sicherung mit Fotos wird erfolgreich bis
zur Importbestätigung gelesen. Vor der Übernahme abgebrochen. Die zuerst
verwendete zu große synthetische Bilddatei wurde in der Test-Sicherung durch
nativ geprüftes JPEG ersetzt und durch einen zusätzlichen Regressionstest
abgesichert. Kein weiterer APK-Build nötig.

Keine Testprojekte gespeichert, temporäre Geräte-Dateien entfernt. Projektfotos
mangels vorhandener Projekte über Repository-Tests geprüft. Erinnerungen,
Dialoge, Buttonformen und sonstige bereits passende Funktionen beibehalten.
SerienLog und MaschinenLog unverändert. Kein Push oder Store-Artefakt.
