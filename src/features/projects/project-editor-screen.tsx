import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMaterialDateTime } from '../../core/ui/material-date-time';
import {
  Body,
  Button,
  Busy,
  Card,
  DateField,
  Field,
  Notice,
  Page,
  SelectField,
  MaterialSwitch,
  useTheme,
} from '../../core/ui/components';
import { Icon } from '../../core/ui/icon';
import { SuggestionField } from '../../core/ui/suggestion-field';
import type { Reminder } from '../../core/domain/models';
import { useProjectEditor } from './use-project-editor';
import { useReminderStatus } from './use-projects';
import { needsReminderRepair } from './reminder-repair';
const intervals: Record<Reminder['interval'], string> = {
  hourly: 'Stündlich',
  daily: 'Täglich',
  weekly: 'Wöchentlich',
  monthly: 'Monatlich',
  yearly: 'Jährlich',
};
const weekdays = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
];
export function ProjectEditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const vm = useProjectEditor(id),
    c = useTheme(),
    status = useReminderStatus(),
    picker = useMaterialDateTime();
  const r = vm.project;
  if (!r)
    return (
      <Page ready={!!vm.error}>
        <Notice error text={vm.error} />
        {!vm.error && <Busy />}
      </Page>
    );
  const reminder = r.reminder;
  const repair = !!id && needsReminderRepair(r, status);
  const time = reminder
    ? `${String(reminder.hour).padStart(2, '0')}:${String(reminder.minute).padStart(2, '0')} Uhr`
    : '';
  async function pickTime() {
    const date = new Date();
    date.setHours(reminder!.hour, reminder!.minute);
    const value = await picker.time(date);
    if (value)
      vm.reminder({ hour: value.getHours(), minute: value.getMinutes() });
  }
  return (
    <Page
      bottom={
        <>
          {!id && (
            <Body muted style={{ fontSize: 12 }}>
              Speichere zuerst das Projekt. Anschließend kannst du deinen ersten
              Bauschritt mit oder ohne Fotos erfassen.
            </Body>
          )}
          {repair && (
            <Body>
              Die Erinnerung ist nicht bestätigt. Mit Speichern wird sie erneut
              eingerichtet.
            </Body>
          )}
          <Button
            icon={id && !vm.dirty ? 'check_circle_outline' : 'save_outlined'}
            title={
              vm.busy
                ? 'Wird gespeichert …'
                : repair && !vm.dirty
                  ? 'Erinnerung erneut speichern'
                  : id && !vm.dirty
                    ? 'Alles gespeichert'
                    : id
                      ? 'Änderungen speichern'
                      : 'Projekt speichern'
            }
            disabled={vm.busy || (!vm.dirty && !repair)}
            onPress={() => void vm.save()}
          />
        </>
      }
    >
      {picker.dialog}
      <Stack.Screen
        options={{ title: id ? 'Projekt bearbeiten' : 'Projekt anlegen' }}
      />
      <View style={{ gap: 16 }}>
        <Notice error text={vm.error} />
        <SuggestionField
          label="Modelltyp (optional)"
          placeholder="z. B. Flugzeug oder Diorama"
          helper="Vorschlag auswählen oder eigenen Modelltyp eingeben."
          value={r.modelType}
          suggestions={vm.modelTypeSuggestions}
          disabled={vm.busy}
          showAllOnFocus
          onChange={(v) => vm.change('modelType', v)}
        />
        <Field
          label="Projektname *"
          placeholder="z. B. Spitfire Mk. IX, 1:48"
          value={r.name}
          onChangeText={(v) => vm.change('name', v)}
          editable={!vm.busy}
          maxLength={500}
        />
        <Field
          label="Hersteller (optional)"
          placeholder="z. B. Revell, Tamiya oder Eigenbau"
          value={r.manufacturer}
          onChangeText={(v) => vm.change('manufacturer', v)}
          editable={!vm.busy}
          maxLength={500}
        />
        <Field
          label="Material (optional)"
          placeholder="z. B. Kunststoff, Holz, Resin oder Metall"
          value={r.material}
          onChangeText={(v) => vm.change('material', v)}
          editable={!vm.busy}
          maxLength={500}
        />
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Body style={{ fontSize: 16 }}>Projekterinnerung</Body>
              <Body muted>Optional und nur lokal auf diesem Gerät</Body>
            </View>
            <MaterialSwitch
              label="Erinnerung aktivieren"
              value={!!reminder}
              disabled={vm.busy}
              onValueChange={vm.toggleReminder}
            />
          </View>
          {reminder && (
            <View style={{ gap: 16 }}>
              <SelectField
                label="Intervall"
                value={reminder.interval}
                options={Object.entries(intervals).map(([value, label]) => ({
                  value,
                  label,
                }))}
                disabled={vm.busy}
                onChange={(value) =>
                  vm.reminder({
                    interval: value as Reminder['interval'],
                    day:
                      value === 'weekly'
                        ? Math.min(reminder.day, 7)
                        : reminder.day,
                  })
                }
              />
              {reminder.interval === 'yearly' && (
                <SelectField
                  label="Monat"
                  value={String(reminder.month)}
                  options={Array.from({ length: 12 }, (_, i) => ({
                    value: String(i + 1),
                    label: new Date(2026, i, 1).toLocaleString('de-DE', {
                      month: 'long',
                    }),
                  }))}
                  onChange={(v) => vm.reminder({ month: Number(v) })}
                />
              )}
              {reminder.interval === 'weekly' && (
                <SelectField
                  label="Wochentag"
                  value={String(reminder.day)}
                  options={weekdays.map((label, i) => ({
                    label,
                    value: String(i + 1),
                  }))}
                  onChange={(v) => vm.reminder({ day: Number(v) })}
                />
              )}
              {(reminder.interval === 'monthly' ||
                reminder.interval === 'yearly') && (
                <SelectField
                  label="Tag"
                  value={String(reminder.day)}
                  options={Array.from({ length: 31 }, (_, i) => String(i + 1))}
                  onChange={(v) => vm.reminder({ day: Number(v) })}
                />
              )}
              {reminder.interval === 'hourly' ? (
                <DateField
                  label="Erster Termin"
                  time
                  value={new Date(reminder.startsAtMillis).toISOString()}
                  onChange={(v) =>
                    vm.reminder({ startsAtMillis: new Date(v).getTime() })
                  }
                />
              ) : (
                <View style={{ gap: 8 }}>
                  <Body>Uhrzeit: {time}</Body>
                  <Button
                    secondary
                    icon="schedule"
                    title="Uhrzeit ändern"
                    onPress={() => void pickTime()}
                  />
                </View>
              )}
              {(['normal', 'punctualWithSound'] as const).map((mode) => (
                <Card
                  key={mode}
                  onPress={() => vm.reminder({ deliveryMode: mode })}
                  style={{
                    borderColor:
                      reminder.deliveryMode === mode ? c.primary : c.border,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      name={
                        reminder.deliveryMode === mode
                          ? 'check_circle_outline'
                          : 'notifications_active_outlined'
                      }
                      color={c.primary}
                    />
                    <View style={{ flex: 1, gap: 4 }}>
                      <Body strong>
                        {mode === 'normal'
                          ? 'Normale Erinnerung'
                          : 'Pünktlich mit Ton'}
                      </Body>
                      <Body muted>
                        {mode === 'normal'
                          ? 'Android kann die Erinnerung etwas später anzeigen.'
                          : 'Benötigt die Freigabe für genaue Alarme. Android-Einstellungen können den Ton beeinflussen.'}
                      </Body>
                    </View>
                  </View>
                </Card>
              ))}
              {status && !status.notifications && (
                <>
                  <Notice
                    error
                    text="Benachrichtigungen sind in Android blockiert."
                  />
                  <Button
                    secondary
                    title="Benachrichtigungen erlauben"
                    onPress={() => void vm.openReminderSettings(false)}
                  />
                </>
              )}
              {reminder.deliveryMode === 'punctualWithSound' &&
                status &&
                !status.exact && (
                  <>
                    <Notice text="Ohne Freigabe für genaue Alarme erinnert Android möglicherweise später." />
                    <Button
                      secondary
                      title="Alarme & Erinnerungen erlauben"
                      onPress={() => void vm.openReminderSettings(true)}
                    />
                  </>
                )}
              <Button
                secondary
                icon="notifications_active_outlined"
                title="Erinnerung testen"
                disabled={vm.busy}
                onPress={() =>
                  void vm.testReminder(
                    reminder.deliveryMode === 'punctualWithSound',
                  )
                }
              />
            </View>
          )}
        </Card>
      </View>
    </Page>
  );
}
