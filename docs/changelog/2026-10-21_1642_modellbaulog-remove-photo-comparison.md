# ModellbauLog: Fotovergleich und zusätzlichen Sortierbutton entfernen

## Änderung

Auf Wunsch den separaten Button „Fotos sortieren“ aus den Bauschrittdetails
entfernt. Das Sortieren über „Bearbeiten“ bleibt erhalten: langes Drücken und
Ziehen sowie „Nach vorne“ und „Nach hinten“ im Fotomenü.

Den Fotovergleich vollständig entfernt: Einstiege in Projekt und Bauschritt,
Vergleichsroute, Auswahlansicht, Vergleichs-Hook und Auswahlmodell.
Die ausschließlich dafür verwendeten Fotozählabfragen, Repository-Methode,
Referenzfunktion und Icons sind ebenfalls entfernt. Der Projektfototyp bleibt
für die Vorschaubilder erhalten. Schrittdifferenzen im Bauverlauf sind unverändert.

Der Aufnahmehinweis beschreibt nun einen Blickwinkel mit sichtbaren Details.
README, aktuelle Prüfschritte, Referenzabgleich und lokale deutsche/englische
Datenschutztexte beschreiben den verbleibenden Funktionsumfang. AGENTS.md hält
den neuen Wunsch fest. Keine Veröffentlichung der Webseiten.

Fotoeditor, Vollbild, Zoom, Beispielfotos, geordnete gespeicherte Fotos,
Entwürfe und Backups bleiben erhalten. Keine Datenmigration oder Datenlöschung.

## Prüfung

`npm run check` erfolgreich: Prettier, ESLint, TypeScript und 34 Tests in
neun Dateien. Der eine Test für die entfernte Vergleichsfunktion entfällt.
Der bestehende Sortier- und Ersetzungstest prüft die Reihenfolge jetzt direkt
am erneut geladenen Bauschritt. Erhalt bei Abbruch, Dateibereinigung,
Projektvorschaubilder und Backups sind weiterhin abgedeckt.
Suche nach verbleibenden Vergleichseinstiegen, Routen und Verwendungen der
entfernten Abfragen sowie `git diff --check` erfolgreich.

## Smartphone

Ein ARM64-DevRelease-Build mit `npm run build:preview` erfolgreich.
35 Sekunden, 773 von 797 Gradle-Aufgaben wiederverwendet. Bestehende APK
aktualisiert, keine zusätzlichen Auslieferungskopien oder Store-Artefakte.

`npm run install:preview -- A5CS024205005243` prüfte Paket, Version, Debug-Flag,
Installer und übereinstimmende Signatur. Datenbewahrendes Update auf dem HONOR
BVL-N49 erfolgreich. Paket `com.appfactory.modellbaulog.dev`, Version 1.0.0 (1),
nicht debuggable, Installer `null`.

Das Smartphone ist gesperrt. Die kurze Sichtprüfung bleibt ausstehend:
Projekt und Bauschritt ohne Vergleichsaktionen öffnen. Bei mehreren Fotos
erscheint kein zusätzlicher Sortierbutton. Über „Bearbeiten“ sind Sortierhinweis
und Verschiebemenü weiterhin erreichbar. Für die Prüfung keine gespeicherten
Nutzerfotos verändern.

Changelog auch im Workspace abgelegt. Kein Push oder Upload.
