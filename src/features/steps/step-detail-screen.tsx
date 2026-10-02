import { View, Text } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  Body,
  Button,
  Busy,
  Card,
  Notice,
  Page,
  useTheme,
} from '../../core/ui/components';
import { dateTime } from '../projects/presentation-model';
import { PhotoGallery } from '../media/attachments';
import { useStepDetail } from './use-step-detail';

export function StepDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vm = useStepDetail(id),
    c = useTheme();
  const step = vm.step;
  if (!step)
    return (
      <Page ready={!vm.loading}>
        <Notice error text={vm.error} />
        {vm.loading ? <Busy /> : <Body>Bauschritt nicht gefunden.</Body>}
      </Page>
    );
  const edit = () =>
    router.push({
      pathname: '/step/edit',
      params: { projectId: step.projectId, stepId: id },
    });
  return (
    <Page ready={!vm.loading}>
      <Stack.Screen options={{ title: 'Bauschritt' }} />
      {!!step.photos.length && (
        <View style={{ gap: 8 }}>
          <Body strong style={{ fontSize: 16 }}>
            Aktuelle Fotos ({step.photos.length})
          </Body>
          {step.photos.length > 1 && (
            <Button
              secondary
              icon="swap_horiz"
              title="Fotos sortieren"
              onPress={edit}
            />
          )}
          <PhotoGallery photos={step.photos} />
        </View>
      )}
      <Text
        style={{
          fontFamily: 'RobotoBlack',
          fontSize: 36,
          lineHeight: 44,
          color: c.ink,
        }}
      >
        Schritt {step.number}
      </Text>
      {!!step.title && (
        <Body strong style={{ fontSize: 20, lineHeight: 28 }}>
          {step.title}
        </Body>
      )}
      <Body>
        {[vm.project?.modelType, vm.project?.name].filter(Boolean).join(' · ')}
      </Body>
      <View style={{ gap: 12, marginTop: 4, marginBottom: 6 }}>
        <Button
          secondary
          icon="edit_outlined"
          title="Bearbeiten"
          onPress={edit}
        />
        {vm.photoCount >= 2 && (
          <Button
            secondary
            icon="compare"
            title="Fotos vergleichen"
            onPress={() =>
              router.push({
                pathname: '/project/compare',
                params: { projectId: step.projectId },
              })
            }
          />
        )}
        <Button
          secondary
          danger
          icon="delete_outline"
          title="Bauschritt löschen"
          disabled={vm.busy}
          onPress={() => void vm.remove()}
        />
      </View>
      <Notice error text={vm.error} />
      <Card>
        <Body strong>Bauschrittinformationen</Body>
        <Body>{dateTime(step.occurredAt)}</Body>
        {!!step.note && <Body>{step.note}</Body>}
        <Body muted style={{ fontSize: 12 }}>
          Zuletzt bearbeitet: {dateTime(step.updatedAt)}
        </Body>
      </Card>
    </Page>
  );
}
