# Legacy-Backup

`backup-v1.bin` wurde mit dem unveränderten ModellbauLog-Codec aus Commit
`254be9a` erzeugt, dem Stand vor der Umstellung auf native Kryptografie.
`backup-v1.json` enthält den erwarteten Inhalt. Das Testpasswort lautet `Modell26`.
Beide Dateien enthalten ausschließlich synthetische Testdaten.

Die Sicherung enthält zwei Bauschritte mit den exakten Nummern `0` und
`9007199254740993`, mehrere geordnete Fotos und ein gemeinsam referenziertes
Foto. Sie prüft die Lesbarkeit vorhandener MLBACK01-Sicherungen unabhängig
davon, ob der aktuelle Codec neue Sicherungen korrekt erzeugt.

Die eingebetteten Fotos entsprechen bytegenau der synthetischen 32 × 32 Pixel
großen Datei `legacy-backup-photo.jpg` im Ressourcenordner der nativen Tests.
`PhotoFilesTest` prüft diese Datei mit dem Android-Decoder. Die größere
Eingabedatei `assets/synthetic-photo.jpg` ist für den Import mit anschließender
Verkleinerung gedacht. Sie darf nicht unverändert als gespeichertes Foto in
einer Backup-Testdatei verwendet werden.
