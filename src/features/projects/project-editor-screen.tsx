import { useRef, useState } from 'react';
import { FormErrorScroll } from '../../core/ui/form-error-scroll';
import { messages } from '../../core/i18n';
import { Keyboard, View } from 'react-native';
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
import { ProjectIconPicker } from './project-icon-picker';
export function ProjectEditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const vm = useProjectEditor(id);
  const anchors = useRef<Record<string, View | null>>({});
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
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
      <FormErrorScroll target={vm.errorTarget} anchors={anchors} />
      <Stack.Screen
        options={{ title: id ? 'Projekt bearbeiten' : 'Projekt anlegen' }}
      />
      <View style={{ gap: 16 }}>
        <Notice error text={vm.error} />
        <View
          ref={(view) => {
            anchors.current.modelType = view;
          }}
          collapsable={false}
          style={{ zIndex: 1 }}
        >
          <SuggestionField
            error={vm.fieldErrors.modelType}
            label={messages.projectFields.modelType.label}
            placeholder={messages.projectFields.modelType.placeholder}
            helper={messages.projectFields.modelType.helper}
            value={r.modelType}
            suggestions={vm.modelTypeSuggestions}
            disabled={vm.busy}
            onOpenChange={setSuggestionsOpen}
            showAllOnFocus
            onChange={(v) => vm.change('modelType', v)}
          />
        </View>
        <View
          pointerEvents={suggestionsOpen ? 'box-only' : 'auto'}
          onTouchStart={suggestionsOpen ? Keyboard.dismiss : undefined}
          accessibilityElementsHidden={suggestionsOpen}
          importantForAccessibility={
            suggestionsOpen ? 'no-hide-descendants' : 'auto'
          }
          style={{ gap: 16 }}
        >
          <ProjectIconPicker
            value={r.icon}
            modelType={r.modelType}
            disabled={vm.busy}
            onChange={(value) => vm.change('icon', value)}
          />
          <View
            ref={(view) => {
              anchors.current.name = view;
            }}
            collapsable={false}
          >
            <Field
              error={vm.fieldErrors.name}
              label={messages.projectFields.name.label}
              placeholder={messages.projectFields.name.placeholder}
              value={r.name}
              onChangeText={(v) => vm.change('name', v)}
              editable={!vm.busy}
              maxLength={500}
            />
          </View>
          <View
            ref={(view) => {
              anchors.current.manufacturer = view;
            }}
            collapsable={false}
          >
            <Field
              error={vm.fieldErrors.manufacturer}
              label={messages.projectFields.manufacturer.label}
              placeholder={messages.projectFields.manufacturer.placeholder}
              value={r.manufacturer}
              onChangeText={(v) => vm.change('manufacturer', v)}
              editable={!vm.busy}
              maxLength={500}
            />
          </View>
          <View
            ref={(view) => {
              anchors.current.material = view;
            }}
            collapsable={false}
          >
            <Field
              error={vm.fieldErrors.material}
              label={messages.projectFields.material.label}
              placeholder={messages.projectFields.material.placeholder}
              value={r.material}
              onChangeText={(v) => vm.change('material', v)}
              editable={!vm.busy}
              maxLength={500}
            />
          </View>
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
      </View>
    </Page>
  );
}
