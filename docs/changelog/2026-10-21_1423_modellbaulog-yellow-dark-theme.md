# ModellbauLog: Anthrazit, Weiß und Gelb

## Änderungen

- Festes dunkles Theme unabhängig vom Smartphone-Modus. Zentrale Palette für
  Anthrazit, weiße Schrift, gelbe Aktionen und dezente graue Konturen.
- Hauptbuttons und Projekt-anlegen-Aktion gelb mit dunkler Schrift. Sekundäre
  Aktionen gelb umrandet, Eingaben bei Fokus gelb, deaktivierte Aktionen neutral.
  Löschaktionen behalten Rot und verwenden die passende kontrastreiche Schrift.
- Verlauf, Dialoge, Bottom Sheets, Snackbar, Datumsauswahl und Startfehleransicht
  verwenden die neue Farbgebung. Aufbau, Rundungen und Bedienung bleiben erhalten.
- Vorhandenes Flugzeug-Pinsel-Motiv neu eingefärbt. Launcher- und Splash-Ressourcen
  aus dem SVG erzeugt. Native Startansicht und Systemleisten bleiben dunkel.
- Reguläre und Test-Benachrichtigungen verwenden den gelben App-Akzent.
  Expo-Konfiguration und Plugin erhalten die nativen Einstellungen bei Prebuild.
- Fachlogik, Kennungen, Datenformate, Signaturen und Version bleiben unverändert.

## Prüfung und Auslieferung

- Prettier, ESLint, TypeScript und alle 35 App-Tests erfolgreich.
- Alle 51 nativen Tests erfolgreich. Android Lint ohne Fehler mit 24 bestehenden
  Hinweisen. Der vorhandene Benachrichtigungstest prüft die neue Farbe in beiden
  Modi für reguläre und Test-Benachrichtigungen.
- Textkontraste für Haupttext, Hilfetext, gelbe Buttons, sekundäre Aktionen und
  Fehleraktionen rechnerisch geprüft. Alle geprüften Kombinationen über 4,5:1.
- Prebuild und DevRelease-Build erfolgreich. Der Neubau war wegen der geänderten
  eingebetteten Symbole, des nativen Startbilds und der Benachrichtigungsfarbe nötig.
- Dev-Vorschau auf HONOR BVL-N49 datenbewahrend aktualisiert. Paket
  `com.appfactory.modellbaulog.dev`, Version 1.0.0 (1), nicht debuggable,
  Installer `null`. Signatur vor dem Update mit der vorhandenen APK verglichen.
  Netzwerkrechte und Android-Cloud-Backup bleiben ausgeschlossen.
- Übersicht, Projektformular, deaktivierter Speichern-Button und gelber
  Eingabefokus am Gerät gesehen. Kaltstart im hellen Smartphone-Modus erfolgreich,
  ModellbauLog bleibt dunkel. Den vorherigen dunklen Systemmodus wiederhergestellt.
- Weitere Gerätebedienung wegen gleichzeitiger Bedienung von ZählerstandLog
  pausiert. Kein neues Projekt gespeichert und vorhandene Projekte nicht geändert.
- Kein Store-Build, Versionssprung, Push oder Upload.
