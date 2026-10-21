export const de = {
  backupProgress: {
    preparing: 'Backup wird vorbereitet',
    checking: 'Dateien werden geprüft',
    encrypting: 'Backup wird verschlüsselt',
    decrypting: 'Backup wird entschlüsselt',
    restoring: 'Backup wird wiederhergestellt',
    preparingLocation: 'Speicherort wird vorbereitet …',
    files: '{completed} von {total}',
  },
  validation: {
    projectName: 'Bitte einen Projektnamen eingeben.',
    shortText: 'Dieses Feld darf höchstens 500 Zeichen enthalten.',
    stepNumber: 'Bitte eine ganze Schrittnummer ab 0 eingeben.',
    occurredAt: 'Bitte ein gültiges Datum und eine Uhrzeit auswählen.',
    note: 'Die Notiz darf höchstens 20.000 Zeichen enthalten.',
  },
  projectPhoto: {
    unavailable: 'Bild nicht verfügbar',
    unavailableLabel: 'Bild von {title} nicht verfügbar',
    enlargeLabel: 'Bild von {title} vergrößern',
  },
  startup: { loading: 'ModellbauLog wird gestartet' },
  modelTypes: {
    aircraft: 'Flugzeug',
    vehicle: 'Fahrzeug',
    ship: 'Schiff',
    figure: 'Figur',
    diorama: 'Diorama',
    other: 'Sonstiges',
  },
  projectFields: {
    modelType: {
      label: 'Modelltyp (optional)',
      placeholder: 'z. B. Flugzeug oder Diorama',
      helper: 'Vorschlag auswählen oder eigenen Modelltyp eingeben.',
    },
    name: {
      label: 'Projektname *',
      placeholder: 'z. B. Spitfire Mk. IX, 1:48',
    },
    manufacturer: {
      label: 'Hersteller (optional)',
      placeholder: 'z. B. Revell, Tamiya oder Eigenbau',
    },
    material: {
      label: 'Material (optional)',
      placeholder: 'z. B. Kunststoff, Holz, Resin oder Metall',
    },
    saveHint:
      'Speichere zuerst das Projekt. Anschließend kannst du deinen ersten Bauschritt mit oder ohne Fotos erfassen.',
    defaultName: 'Modellbauprojekt',
  },
  stepFields: {
    captureTitle: 'Für ein gut erkennbares Foto',
    captureTips: {
      framing: 'Modell und aktuellen Bauschritt vollständig aufnehmen',
      lighting: 'Spiegelungen, Schatten und Unschärfe vermeiden',
      comparison: 'Für Vergleiche einen ähnlichen Blickwinkel wählen',
    },
    number: {
      label: 'Aktueller Bauschritt *',
      placeholder: 'z. B. 12',
      helper:
        'Ganze Schrittnummer ab 0. Trage ein, wo du gerade aufgehört hast.',
    },
    title: {
      label: 'Titel (optional)',
      placeholder: 'z. B. Cockpit lackieren',
    },
    occurredAt: {
      title: 'Datum und Uhrzeit',
      label: 'Zeitpunkt des Bauschritts',
    },
    note: {
      label: 'Notiz',
      placeholder:
        'Farben, Teile und Arbeitsschritte, z. B. Grundierung, Farbnummer oder nächste Handgriffe',
    },
    captureHint:
      'Den aktuellen Bauschritt trägst du anschließend selbst ein. Die Schrittnummer ist ein Pflichtfeld. Fotos und eine Notiz sind optional.',
    photoHint:
      'Das Foto wird für die lokale Speicherung auf maximal 1920 Pixel an der längsten Kante verkleinert und als JPEG optimiert. Aufnahme- und Standortmetadaten werden nicht übernommen.',
    withoutPhoto: 'Ohne Foto erfassen',
    takePhoto: 'Foto aufnehmen',
    fromGallery: 'Fotos aus Galerie',
  },
  photoExamples: {
    open: 'Beispiele ansehen',
    title: 'Beispielfotos',
    close: 'Schließen',
    dismiss: 'Beispiele schließen',
    unavailable: 'Beispiel konnte nicht geladen werden.',
    imageLabel: 'Beispielfoto: {label}',
    guidance:
      'Modell und Bauschritt gut erkennbar aufnehmen. Trage danach selbst ein, bei welchem Bauschritt du gerade aufgehört hast.',
    previous: 'Vorheriges Beispiel',
    next: 'Nächstes Beispiel',
    position: '{current} von {total}',
    attribution: 'KI-generierte Beispiele · nur zur Ansicht',
    labels: {
      aircraft: 'Flugzeug · Cockpit montieren',
      vehicle: 'Fahrzeug · Karosserie lackieren',
      ship: 'Schiff · Rumpf beplanken',
      diorama: 'Diorama · Gelände gestalten',
    },
  },
  reminders: {
    title: 'Projekterinnerung',
    helper: 'Optional und nur lokal auf diesem Gerät',
    enable: 'Erinnerung aktivieren',
    interval: 'Intervall',
    month: 'Monat',
    weekday: 'Wochentag',
    day: 'Tag',
    startDate: 'Startdatum',
    startTime: 'Startzeit',
    time: 'Uhrzeit',
    changeDate: 'Datum ändern',
    changeTime: 'Uhrzeit ändern',
    deliveryMode: 'Art der Erinnerung',
    intervals: {
      hourly: 'Stündlich',
      daily: 'Täglich',
      weekly: 'Wöchentlich',
      monthly: 'Monatlich',
      yearly: 'Jährlich',
    },
    weekdays: {
      monday: 'Montag',
      tuesday: 'Dienstag',
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag',
    },
    modes: {
      normal: {
        title: 'Normal',
        description:
          'Kann leicht verzögert erscheinen. Die Systemeinstellung „Nicht stören“ wird berücksichtigt.',
      },
      punctualWithSound: {
        title: 'Pünktlich mit Ton',
        description:
          'Wird möglichst genau zur gewählten Uhrzeit wie ein Alarm ausgelöst.',
      },
    },
    hourlyHint: 'Ab dem gewählten Start alle 60 Minuten. Nächste Erinnerung: ',
    timeSuffix: ' Uhr',
    exactHint:
      'Für pünktliche Erinnerungen muss Android „Alarme & Erinnerungen“ erlauben. Aktiviere die Freigabe, damit die Erinnerung zuverlässig zur gewählten Zeit mit Ton erscheint.',
    allowExact: 'Alarme & Erinnerungen erlauben',
    openExact: '„Alarme & Erinnerungen“ öffnen',
    openSettings: 'Einstellungen öffnen',
    edit: 'Erinnerung bearbeiten',
    appBlocked: 'Benachrichtigungen sind ausgeschaltet',
    channelBlocked: 'Diese Erinnerungsart ist ausgeschaltet',
    appBlockedHint:
      'Erlaube Benachrichtigungen für ModellbauLog in den Android-Einstellungen, damit Erinnerungen angezeigt werden können.',
    channelBlockedHint:
      'Aktiviere die Benachrichtigungskategorie für diese Erinnerungsart in den Android-Einstellungen.',
    quiet: '„Nicht stören“ ist aktiv',
    quietNormalHint:
      'Normale Erinnerungen können ohne Ton oder eingeblendetes Banner erscheinen.',
    quietPunctualHint:
      'Ob ein Alarmton oder Banner erscheint, hängt von deinen „Nicht stören“-Einstellungen und der Alarmlautstärke ab.',
    unknownHint:
      'Der Erinnerungsstatus konnte nicht bestätigt werden. Du kannst die Daten trotzdem speichern.',
    repairHint:
      'Die Erinnerung ist nicht bestätigt. Mit Speichern wird sie erneut eingerichtet.',
    repair: 'Erinnerung erneut speichern',
    test: 'Erinnerung jetzt testen',
    testing: 'Test-Erinnerung wird gesendet …',
    testHint:
      'Ziehe die Benachrichtigungsleiste herunter. Die Test-Erinnerung verschwindet nach einer Minute.',
    feedback: {
      invalidClockTime:
        'Diese Uhrzeit ist wegen der Zeitumstellung nicht verfügbar. Bitte wähle eine andere Uhrzeit.',
      invalidTime: 'Bitte eine andere Uhrzeit wählen.',
      exactSettingsFailed:
        'Die Android-Einstellung „Alarme & Erinnerungen“ konnte nicht geöffnet werden. Öffne sie manuell in den Einstellungen deines Smartphones.',
      quietSettingsFailed:
        'Die Systemeinstellungen konnten nicht geöffnet werden. Du findest „Nicht stören“ in den Einstellungen deines Smartphones.',
      notificationSettingsFailed:
        'Die Einstellungen konnten nicht geöffnet werden. Öffne in den Einstellungen deines Smartphones „Apps“, dann „ModellbauLog“ und „Benachrichtigungen“.',
      punctualRetained: ' „Pünktlich mit Ton“ bleibt ausgewählt.',
      statusUnknown: 'Der Erinnerungsstatus konnte nicht bestätigt werden.',
      testPosted: 'Test-Erinnerung wurde an Android übergeben. ',
      testQuiet:
        ' „Nicht stören“ ist aktiv. Ton und Banner können unterdrückt werden.',
      testAppBlocked: 'Benachrichtigungen sind nicht erlaubt.',
      testChannelBlocked: 'Diese Erinnerungsart ist in Android gesperrt.',
      testFailed: 'Test-Erinnerung konnte nicht angezeigt werden.',
      savedCancelFailed:
        'Daten gespeichert. Die Erinnerung konnte nicht ausgeschaltet werden. Öffne die Erinnerung und speichere erneut.',
      savedBlocked:
        'Daten gespeichert. Erinnerungen sind in Android blockiert. Öffne die Erinnerung und dann die Android-Einstellungen.',
      savedUnknown:
        'Daten gespeichert. Der Erinnerungsstatus konnte nicht geprüft werden. Öffne die Erinnerung und speichere erneut.',
      savedUnconfirmed:
        'Daten gespeichert. Die Erinnerung konnte nicht bestätigt werden. Öffne die Erinnerung und speichere erneut.',
      savedInexact:
        'Daten gespeichert. Für eine pünktliche Erinnerung öffne „Alarme & Erinnerungen“ in den Android-Einstellungen.',
    },
    status: {
      cancelFailed: 'Ausschalten fehlgeschlagen',
      retryHint: 'Bitte öffne die Erinnerung und speichere erneut.',
      blocked: 'Erinnerung blockiert',
      appBlocked: 'Benachrichtigungen sind ausgeschaltet.',
      channelBlocked: 'Diese Erinnerungsart ist ausgeschaltet.',
      unplanned: 'Erinnerung nicht geplant',
      inexact: 'Pünktlichkeit nicht erlaubt',
      inexactHint:
        'Erlaube „Alarme & Erinnerungen“ in Android. Bis dahin kann die Erinnerung verspätet erscheinen.',
      exactPending: 'Pünktliche Planung ausstehend',
      exactPendingHint:
        'Der Termin ist noch ungenau geplant. Öffne die Erinnerung und speichere erneut.',
      deliveryFailed: 'Letzte Zustellung fehlgeschlagen',
      testHint:
        'Bitte öffne die Erinnerung und nutze „Erinnerung jetzt testen“.',
      unknown: 'Planungsstatus unbekannt',
      unknownHint:
        'Der Erinnerungsstatus konnte nicht bestätigt werden. Öffne die Erinnerung zum Prüfen.',
      overdue: 'Erinnerung steht noch aus',
      next: 'Nächste Erinnerung',
      overdueHint: '. Android hat diesen Termin noch nicht verarbeitet.',
    },
  },
} as const;
