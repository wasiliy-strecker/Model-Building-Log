# ModellbauLog – Store-Grafiken

15 Upload-Dateien für den deutschen Google-Play-Eintrag.

Die Nummerierung bestimmt die Upload-Reihenfolge innerhalb des jeweiligen Feldes.

| Datei                                       | Play-Console-Feld          | Maße        | Dateigröße    |
| ------------------------------------------- | -------------------------- | ----------- | ------------- |
| `icon/modellbaulog-icon-512.png`            | App-Symbol                 | 512 × 512   | 22.389 Bytes  |
| `feature/modellbaulog-feature-1024x500.png` | Vorstellungsgrafik         | 1024 × 500  | 262.495 Bytes |
| `phone/01-uebersicht.png`                   | Smartphone-Screenshots     | 1080 × 1920 | 667.318 Bytes |
| `phone/02-projektdetails.png`               | Smartphone-Screenshots     | 1080 × 1920 | 717.863 Bytes |
| `phone/03-bauschritt.png`                   | Smartphone-Screenshots     | 1080 × 1920 | 299.129 Bytes |
| `phone/04-bauverlauf.png`                   | Smartphone-Screenshots     | 1080 × 1920 | 364.787 Bytes |
| `phone/05-pdf-protokoll.png`                | Smartphone-Screenshots     | 1080 × 1920 | 413.977 Bytes |
| `tablet7/01-uebersicht.png`                 | 7-Zoll-Tablet-Screenshots  | 1080 × 1920 | 678.856 Bytes |
| `tablet7/02-bauverlauf.png`                 | 7-Zoll-Tablet-Screenshots  | 1080 × 1920 | 186.483 Bytes |
| `tablet7/03-bauschritt.png`                 | 7-Zoll-Tablet-Screenshots  | 1080 × 1920 | 104.204 Bytes |
| `tablet7/04-pdf-protokoll.png`              | 7-Zoll-Tablet-Screenshots  | 1080 × 1920 | 351.257 Bytes |
| `tablet10/01-uebersicht.png`                | 10-Zoll-Tablet-Screenshots | 1440 × 2560 | 797.007 Bytes |
| `tablet10/02-bauverlauf.png`                | 10-Zoll-Tablet-Screenshots | 1440 × 2560 | 451.432 Bytes |
| `tablet10/03-bauschritt.png`                | 10-Zoll-Tablet-Screenshots | 1440 × 2560 | 111.314 Bytes |
| `tablet10/04-pdf-protokoll.png`             | 10-Zoll-Tablet-Screenshots | 1440 × 2560 | 565.441 Bytes |

`VORSCHAU.png`, `README.md` und `manifest.json` dienen der Prüfung und werden nicht hochgeladen.

## Herkunft

App: ModellbauLog 1.0.0 (1), eigenständige Dev-Preview für x86_64.
Paket: `com.appfactory.modellbaulog.dev`. Quellstand: `5d76cfedc105f1c57d539462c7cf16cbf0a64d0e`.
APK-Prüfsumme: `fb55d1c7833b0b0b65d536c5c7cb9e5637ef2fdab2cc5830140458a0e7b7198b`.

Echte Android-Aufnahmen aus drei eigenen API-35-Emulatoren mit deutscher Oberfläche und normaler Schriftgröße.
Smartphone: 1080 × 1920 bei 360 dpi. Nexus-7-Profil: 1080 × 1920 bei 240 dpi. Nexus-10-Profil: 1440 × 2560 bei 240 dpi.
Die vollständigen Smartphone-Aufnahmen sind proportional auf 1550 Pixel Höhe skaliert, darüber stehen kurze Nutzenüberschriften.
Tablet-Bilder sind direkte Aufnahmen ohne zusätzlichen Text, Geräterahmen oder Layoutänderung.

Alle Projekte und Bauschritte sind fiktiv und wurden über die echte Oberfläche erfasst.
Das Bauverlaufsprotokoll wurde in der App erzeugt. Die Tablet-Daten stammen aus deren echtem verschlüsselten Demo-Backup.
Das Foto stammt aus `assets/photo-examples/01_flugzeug_cockpit.jpg`. Es ist ein eigenes KI-generiertes Beispiel vom 21. Oktober 2026.
Bildherkunft und vollständiger Prompt sind in `assets/photo-examples/README.md` und `prompts.json` dokumentiert.
Das bestehende Icon stammt aus `assets/icon.png`. Nur der Store-Export wurde auf 512 Pixel skaliert und bis in die Ecken mit Anthrazit gefüllt.
Roboto und die Schriftlizenz liegen unter `assets/ui/`.

Reproduktionshinweise: `scripts/store_assets/README.md`. Rohbilder und Aufnahmeprofile: `build/store-assets/raw/`.

## Prüfung

PNG-Dekodierung, Anzahl, Maße, Farbmodus, Transparenz und Dateigrößen werden automatisch geprüft.
Das Manifest enthält SHA-256-Prüfsummen und die Herkunft jeder Aufnahme. Tablet-Ausgaben entsprechen ihren Rohaufnahmen.
Alle Grafiken wurden zusätzlich auf Lesbarkeit, deutsche Texte und echte Funktionen angesehen.

[Google-Play-Vorgaben](https://support.google.com/googleplay/android-developer/answer/9866151?hl=de)

## Alt-Texte

### icon/modellbaulog-icon-512.png

ModellbauLog-Symbol mit weißem Modellflugzeug und gelbem Pinsel auf dunklem Hintergrund.

### feature/modellbaulog-feature-1024x500.png

ModellbauLog: Dein Modellbau. Schritt für Schritt. Bauschritte, Fotos und PDF-Protokolle mit echter App-Ansicht.

### phone/01-uebersicht.png

Modellbauprojekte mit aktuellem Bauschritt und einem Foto der Cockpitmontage.

### phone/02-projektdetails.png

Propellerflugzeug mit Projektfoto, Modelltyp, Material und zuletzt gespeichertem Bauschritt.

### phone/03-bauschritt.png

Manuelle Erfassung eines Bauschritts mit Schrittnummer, Titel, Zeitpunkt und Notiz.

### phone/04-bauverlauf.png

Bauverlauf des Propellerflugzeugs mit drei gespeicherten Schritten, Datum, Notizen und Foto.

### phone/05-pdf-protokoll.png

Echtes Bauverlaufsprotokoll in der integrierten PDF-Vorschau mit Drucken und Teilen.

### tablet7/01-uebersicht.png

Modellbauprojekte mit aktuellem Bauschritt und einem Foto der Cockpitmontage.

### tablet7/02-bauverlauf.png

Bauverlauf des Propellerflugzeugs mit drei gespeicherten Schritten, Datum, Notizen und Foto.

### tablet7/03-bauschritt.png

Manuelle Erfassung eines Bauschritts mit Schrittnummer, Titel, Zeitpunkt und Notiz.

### tablet7/04-pdf-protokoll.png

Echtes Bauverlaufsprotokoll in der integrierten PDF-Vorschau mit Drucken und Teilen.

### tablet10/01-uebersicht.png

Modellbauprojekte mit aktuellem Bauschritt und einem Foto der Cockpitmontage.

### tablet10/02-bauverlauf.png

Bauverlauf des Propellerflugzeugs mit drei gespeicherten Schritten, Datum, Notizen und Foto.

### tablet10/03-bauschritt.png

Manuelle Erfassung eines Bauschritts mit Schrittnummer, Titel, Zeitpunkt und Notiz.

### tablet10/04-pdf-protokoll.png

Echtes Bauverlaufsprotokoll in der integrierten PDF-Vorschau mit Drucken und Teilen.
