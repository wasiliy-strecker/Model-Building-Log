# ModellbauLog: abgerundete Feldbeschriftungen

## Änderung

Den Smartphone-Screenshot vom 21. Oktober 2026, 14:43:40 geprüft.
Die dunklen Hintergründe der schwebenden Feldbeschriftungen waren rechteckig.

Eine gemeinsame interne Beschriftung verwendet einen nativen View mit Radius 8
und begrenzter Hintergrundfläche. Text-, Auswahl- und Datumsfelder verwenden
sie einheitlich. Dadurch sind auch Modelltyp-Vorschläge, Erinnerungsfelder,
Bauschrittformulare, Suchfelder und Backup-Passwörter abgedeckt.
Position, Schrift, Fokus- und Fehlerfarben sowie die Eingaben bleiben erhalten.

## Prüfung

Prettier, ESLint, TypeScript und alle 35 App-Tests erfolgreich.
Diff und alle drei Verwendungen der gemeinsamen Beschriftung geprüft.
Keine neuen Tests für die reine Stiländerung und keine native Codeänderung.

Manuelle Sichtprüfung nach dem nächsten Geräteupdate: befülltes und fokussiertes
Projektfeld, Auswahlfeld einer Erinnerung, Datum im Bauschritt und Passwortfeld
im Backup-Dialog öffnen. Die Labelhintergründe sollen abgerundet sein und Text
sowie Feldumrandung sauber freistellen. Die neue Darstellung wurde noch nicht
auf dem Smartphone geprüft. Dort läuft eine eigenständige DevRelease-Vorschau,
die kein Fast Refresh unterstützt. Kein automatischer APK-Neubau für diese
reine React-Änderung. Kein Store-Build oder Push.
