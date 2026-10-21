import { useRef } from 'react';
import { FormErrorScroll } from '../../core/ui/form-error-scroll';
import { messages } from '../../core/i18n';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  Body,
  Button,
  Busy,
  Card,
  DateField,
  Field,
  Notice,
  Page,
  useTheme,
} from '../../core/ui/components';
import { PhotoEditor, type PhotoActions } from '../media/attachments';
import { useStepEditor } from './use-step-editor';
import { CaptureGuidance } from './capture-guidance';
import { PhotoExamplesButton } from './photo-examples-button';

export function StepEditorScreen() {
  const { projectId, stepId } = useLocalSearchParams<{
    projectId: string;
    stepId?: string;
  }>();
  const vm = useStepEditor(projectId, stepId);
  const anchors = useRef<Record<string, View | null>>({});
  const c = useTheme();
  const draft = vm.draft;
  if (!draft)
    return (
      <Page ready={!!vm.error}>
        <Notice error text={vm.error} />
        {!vm.error && <Busy />}
      </Page>
    );
  const form = draft.form;
  const actions: PhotoActions = {
    busy: vm.busy,
    pick: vm.pick,
    remove: vm.remove,
    move: vm.move,
    reorder: vm.reorder,
  };
  return (
    <Page>
      <FormErrorScroll target={vm.errorTarget} anchors={anchors} />
      <Stack.Screen
        options={{
          title: stepId ? 'Bauschritt bearbeiten' : 'Bauschritt erfassen',
        }}
      />
      <Notice error text={vm.error} />
      {vm.phase === 'choose' ? (
        <>
          <CaptureGuidance />
          <PhotoExamplesButton disabled={vm.busy} />
          <Button
            icon="edit_note_outlined"
            title={messages.stepFields.withoutPhoto}
            disabled={vm.busy}
            onPress={() => void vm.chooseManual()}
          />
          <Button
            secondary
            icon="photo_camera_outlined"
            title={messages.stepFields.takePhoto}
            disabled={vm.busy}
            onPress={() => void vm.pick('camera')}
          />
          <Button
            secondary
            icon="photo_library_outlined"
            title={messages.stepFields.fromGallery}
            disabled={vm.busy}
            onPress={() => void vm.pick('gallery')}
          />
        </>
      ) : (
        <View style={{ gap: 16 }}>
          <PhotoEditor photos={form.photos} actions={actions} />
          <View
            ref={(view) => {
              anchors.current.number = view;
            }}
            collapsable={false}
          >
            <Field
              error={vm.fieldErrors.number}
              label={messages.stepFields.number.label}
              placeholder={messages.stepFields.number.placeholder}
              keyboardType="number-pad"
              value={form.number}
              onChangeText={(v) => vm.change('number', v)}
              editable={!vm.busy}
              autoFocus={
                !stepId && draft.captureSource === 'manual' && !form.number
              }
              maxLength={500}
            />
          </View>
          <Body muted>{messages.stepFields.number.helper}</Body>
          <View
            ref={(view) => {
              anchors.current.title = view;
            }}
            collapsable={false}
          >
            <Field
              error={vm.fieldErrors.title}
              label={messages.stepFields.title.label}
              placeholder={messages.stepFields.title.placeholder}
              value={form.title}
              onChangeText={(v) => vm.change('title', v)}
              editable={!vm.busy}
              maxLength={500}
            />
          </View>
          <Card>
            <Body strong>{messages.stepFields.occurredAt.title}</Body>
            <View
              ref={(view) => {
                anchors.current.occurredAt = view;
              }}
              collapsable={false}
            >
              <DateField
                label={messages.stepFields.occurredAt.label}
                time
                value={form.occurredAt}
                timezoneOffsetMinutes={form.timezoneOffsetMinutes}
                onChange={(v) => vm.change('occurredAt', v)}
                disabled={vm.busy}
              />
              {!!vm.fieldErrors.occurredAt && (
                <Body style={{ color: c.danger }}>
                  {vm.fieldErrors.occurredAt}
                </Body>
              )}
            </View>
          </Card>
          <View
            ref={(view) => {
              anchors.current.note = view;
            }}
            collapsable={false}
          >
            <Field
              error={vm.fieldErrors.note}
              label={messages.stepFields.note.label}
              placeholder={messages.stepFields.note.placeholder}
              multiline
              numberOfLines={4}
              maxLength={20000}
              value={form.note}
              onChangeText={(v) => vm.change('note', v)}
              editable={!vm.busy}
            />
          </View>
          <Button
            icon={
              stepId || draft.captureSource !== 'photo'
                ? 'save_outlined'
                : 'verified_outlined'
            }
            title={
              vm.busy
                ? 'Wird gespeichert …'
                : stepId
                  ? 'Änderungen speichern'
                  : draft.captureSource === 'photo'
                    ? 'Bauschritt bestätigen und speichern'
                    : 'Bauschritt speichern'
            }
            disabled={vm.busy}
            onPress={() => void vm.save()}
          />
        </View>
      )}
      {vm.busy && <Busy label="Bauschritt und Fotos werden vorbereitet …" />}
    </Page>
  );
}
