import { messages } from '../../core/i18n';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  Body,
  Button,
  Busy,
  Field,
  Notice,
  Page,
} from '../../core/ui/components';
import { SuggestionField } from '../../core/ui/suggestion-field';
import { useProjectEditor } from './use-project-editor';
import { ReminderEditor } from './reminder-editor';
export function ProjectEditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const vm = useProjectEditor(id);
  const r = vm.project;
  if (!r)
    return (
      <Page ready={!!vm.error}>
        <Notice error text={vm.error} />
        {!vm.error && <Busy />}
      </Page>
    );
  const repair = vm.reminderNeedsRepair;
  return (
    <Page
      bottom={
        <>
          {!id && (
            <Body muted style={{ fontSize: 12 }}>
              {messages.projectFields.saveHint}
            </Body>
          )}
          {repair && <Body>{messages.reminders.repairHint}</Body>}
          <Button
            icon={id && !vm.dirty ? 'check_circle_outline' : 'save_outlined'}
            title={
              vm.busy
                ? 'Wird gespeichert …'
                : repair && !vm.dirty
                  ? messages.reminders.repair
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
      <Stack.Screen
        options={{ title: id ? 'Projekt bearbeiten' : 'Projekt anlegen' }}
      />
      <View style={{ gap: 16 }}>
        <Notice error text={vm.error} />
        <SuggestionField
          label={messages.projectFields.modelType.label}
          placeholder={messages.projectFields.modelType.placeholder}
          helper={messages.projectFields.modelType.helper}
          value={r.modelType}
          suggestions={vm.modelTypeSuggestions}
          disabled={vm.busy}
          showAllOnFocus
          onChange={(v) => vm.change('modelType', v)}
        />
        <Field
          label={messages.projectFields.name.label}
          placeholder={messages.projectFields.name.placeholder}
          value={r.name}
          onChangeText={(v) => vm.change('name', v)}
          editable={!vm.busy}
          maxLength={500}
        />
        <Field
          label={messages.projectFields.manufacturer.label}
          placeholder={messages.projectFields.manufacturer.placeholder}
          value={r.manufacturer}
          onChangeText={(v) => vm.change('manufacturer', v)}
          editable={!vm.busy}
          maxLength={500}
        />
        <Field
          label={messages.projectFields.material.label}
          placeholder={messages.projectFields.material.placeholder}
          value={r.material}
          onChangeText={(v) => vm.change('material', v)}
          editable={!vm.busy}
          maxLength={500}
        />
        <ReminderEditor
          reminder={r.reminder}
          busy={vm.busy}
          onChange={(value) => vm.change('reminder', value)}
          status={vm.reminderStatus}
          refreshStatus={vm.refreshReminderStatus}
          recordId={id ?? null}
          label={r.name}
          categoryLabel={r.modelType}
        />
      </View>
    </Page>
  );
}
