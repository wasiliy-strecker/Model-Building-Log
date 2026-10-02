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
} from '../../core/ui/components';
import { PhotoEditor, type PhotoActions } from '../media/attachments';
import { useStepEditor } from './use-step-editor';

export function StepEditorScreen() {
  const { projectId, stepId } = useLocalSearchParams<{
    projectId: string;
    stepId?: string;
  }>();
  const vm = useStepEditor(projectId, stepId);
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
      <Stack.Screen
        options={{
          title: stepId ? 'Bauschritt bearbeiten' : 'Bauschritt erfassen',
        }}
      />
      <Notice error text={vm.error} />
      {vm.phase === 'choose' ? (
        <>
          <Card>
            <Body strong style={{ fontSize: 18 }}>
              Merke dir, wo du weitermachst.
            </Body>
            <Body>
              Trage deinen aktuellen Bauschritt ein. Fotos und Notizen halten
              fest, wie dein Modell gerade aussieht.
            </Body>
            <Body muted>
              Für spätere Vergleiche helfen ein ähnlicher Blickwinkel und gutes
              Licht. Fotos werden lokal als JPEG mit höchstens 1920 Pixeln
              gespeichert. Standort- und Aufnahmemetadaten werden nicht
              übernommen.
            </Body>
          </Card>
          <Button
            icon="edit_note_outlined"
            title="Stand eintragen"
            disabled={vm.busy}
            onPress={() => void vm.chooseManual()}
          />
          <Button
            secondary
            icon="photo_camera_outlined"
            title="Modell fotografieren"
            disabled={vm.busy}
            onPress={() => void vm.pick('camera')}
          />
          <Button
            secondary
            icon="photo_library_outlined"
            title="Fotos aus Galerie"
            disabled={vm.busy}
            onPress={() => void vm.pick('gallery')}
          />
        </>
      ) : (
        <View style={{ gap: 16 }}>
          <PhotoEditor photos={form.photos} actions={actions} />
          <Field
            label="Aktueller Bauschritt *"
            placeholder="z. B. 12"
            keyboardType="number-pad"
            value={form.number}
            onChangeText={(v) => vm.change('number', v)}
            editable={!vm.busy}
            autoFocus={
              !stepId && draft.captureSource === 'manual' && !form.number
            }
            maxLength={500}
          />
          <Body muted>
            Ganze Schrittnummer ab 0. Trage ein, wo du gerade aufgehört hast.
          </Body>
          <Field
            label="Titel (optional)"
            placeholder="z. B. Cockpit lackieren"
            value={form.title}
            onChangeText={(v) => vm.change('title', v)}
            editable={!vm.busy}
            maxLength={500}
          />
          <Card>
            <Body strong>Datum und Uhrzeit</Body>
            <DateField
              label="Zeitpunkt des Bauschritts"
              time
              value={form.occurredAt}
              onChange={(v) => vm.change('occurredAt', v)}
              disabled={vm.busy}
            />
          </Card>
          <Field
            label="Notiz"
            placeholder="Farben, Teile und Arbeitsschritte, z. B. Grundierung, Farbnummer oder nächste Handgriffe"
            multiline
            numberOfLines={4}
            maxLength={20000}
            value={form.note}
            onChangeText={(v) => vm.change('note', v)}
            editable={!vm.busy}
          />
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
