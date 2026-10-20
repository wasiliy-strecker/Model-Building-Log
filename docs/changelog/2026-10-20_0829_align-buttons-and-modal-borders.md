# Buttons und Dialograhmen an MaschinenLog angleichen

ModellbauLog gegen MaschinenLog `3052bc8` geprüft. Die gemeinsamen Buttons
stimmen bereits überein: Aktions- und Dialogbuttons Radius 40, schwebender
Anlegen-Button Radius 16, Kartenoptionen Radius 18 und einfache Menüzeilen
Radius 0. Diese Formen bleiben erhalten.

Bestätigungen, verankerte Menüs, Backup-Passwortdialoge sowie Datum und Uhrzeit
erhalten die gleiche feine Kontur mit Breite 1 in der eigenen Themefarbe
`border`. Untere Auswahlpanels verwenden wie MaschinenLog die erhöhte
Oberfläche, Schatten und einen stärker abgedunkelten Hintergrund. Obere Ecken
bleiben mit Radius 28 rund, untere Ecken gerade. Fortschrittsdialoge übernehmen
Kontur, Schatten, maximale Breite 360 und die stärkere Abdunklung der Referenz.
Eigene ModellbauLog-Farben in hellem und dunklem Design bleiben erhalten.

`npm run check` besteht mit Prettier, ESLint, TypeScript und 24 Tests.
Direkter Quellvergleich bestätigt gleiche Implementierungen für IconButton,
Button, Fab, SelectField, BusyOverlay, MaterialSwitch, DialogActions und den
Datums-/Uhrzeitdialog. Keine neuen Tests für reine Stilwerte.

Die bestehende DevDebug-App ist mit Metro auf Port 8086 verbunden. Änderungen
werden über Fast Refresh bereitgestellt. Kein Neustart oder APK-Neubau nötig.
Der HONOR-Sperrbildschirm verhinderte eine Sichtprüfung. Keine Eingaben,
Projektdaten oder Geräteeinstellungen verändert.

Kurze manuelle Prüfung nach dem Entsperren: Einen Bestätigungsdialog ohne
Bestätigung schließen, die Backup-Passwortabfrage abbrechen sowie eine
Intervallauswahl von unten öffnen und wegziehen. Feinen Rahmen am gesamten
Dialog und an den oberen Rundungen des Auswahlpanels prüfen. Datum und Uhrzeit
öffnen und ohne Änderung schließen. Runde Aktionsbuttons und eckige einfache
Menüzeilen mit MaschinenLog vergleichen.

Changelog im Workspace und in der App abgelegt. Referenz-App unverändert.
Kein Push, Store-Build oder nativer Build. Lokaler Commit nach den Prüfungen.
