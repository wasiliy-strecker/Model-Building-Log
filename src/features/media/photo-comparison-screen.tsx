import { useState } from 'react';
import { FlatList, Pressable, View, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  Body,
  Button,
  Busy,
  Notice,
  Page,
  useTheme,
} from '../../core/ui/components';
import { Icon } from '../../core/ui/icon';
import { photoReference, stepLabel } from '../../core/domain/models';
import { useServices } from '../../core/composition';
import { dateTime } from '../projects/presentation-model';
import { PhotoThumbnail } from './attachments';
import { PhotoViewer } from './photo-viewer';
import { usePhotoComparison } from './use-photo-comparison';

export function PhotoComparisonScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const vm = usePhotoComparison(projectId),
    c = useTheme();
  const { log } = useServices();
  const { width, height } = useWindowDimensions();
  const columns = width > height ? 3 : 2;
  const [gallery, setGallery] = useState<number | null>(null);
  const data = vm.comparing ? vm.selected : vm.items;
  const positions = new Map(
    vm.selected.map((p, index) => [photoReference(p), index + 1]),
  );
  return (
    <Page
      scroll={false}
      ready={!vm.loading}
      bottom={
        <>
          <Body strong>{vm.selected.length} Fotos ausgewählt</Body>
          {vm.comparing ? (
            <Button
              secondary
              icon="edit_outlined"
              title="Auswahl ändern"
              onPress={vm.editSelection}
            />
          ) : (
            <Button
              icon="compare"
              title="Ausgewählte Fotos vergleichen"
              disabled={vm.loading || vm.selected.length < 2}
              onPress={vm.compare}
            />
          )}
          {!!vm.selected.length && (
            <Button secondary title="Auswahl leeren" onPress={vm.clear} />
          )}
        </>
      }
    >
      <Stack.Screen
        options={{ title: vm.comparing ? 'Fotovergleich' : 'Fotos auswählen' }}
      />
      <FlatList
        key={`${columns}-${vm.comparing}`}
        data={data}
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          width: '100%',
          maxWidth: 1000,
          alignSelf: 'center',
          flexGrow: 1,
        }}
        columnWrapperStyle={{ gap: 12 }}
        numColumns={columns}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={3}
        keyExtractor={photoReference}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 12 }}>
            <Body strong style={{ fontSize: 20, lineHeight: 28 }}>
              {vm.name}
            </Body>
            <Body>
              {vm.comparing
                ? 'Die Fotos stehen in deiner Auswahlreihenfolge. Tippe auf ein Bild, um es groß anzusehen.'
                : 'Wähle mindestens zwei Fotos aus deinem Bauverlauf. Die Auswahlreihenfolge bestimmt, welche Bilder nebeneinander stehen.'}
            </Body>
            <Notice error text={vm.error} />
            {!!vm.error && (
              <Button secondary title="Erneut laden" onPress={vm.retry} />
            )}
            {vm.loading && <Busy label="Projektfotos werden geladen …" />}
          </View>
        }
        ListEmptyComponent={
          !vm.loading ? (
            <Body>
              {vm.comparing
                ? 'Keine Fotos ausgewählt.'
                : 'Noch keine Projektfotos vorhanden.'}
            </Body>
          ) : null
        }
        renderItem={({ item, index }) => {
          const position = positions.get(photoReference(item));
          return (
            <Pressable
              accessibilityRole={vm.comparing ? 'button' : 'checkbox'}
              accessibilityState={
                vm.comparing ? undefined : { checked: !!position }
              }
              accessibilityLabel={`${stepLabel(item)}, Foto ${item.photo.name}${position ? `, Auswahl ${position}` : ''}`}
              onPress={() =>
                vm.comparing ? setGallery(index) : vm.toggle(item)
              }
              style={({ pressed }) => ({
                width: `${100 / columns}%`,
                flex: 1,
                maxWidth: `${100 / columns}%`,
                borderWidth: position && !vm.comparing ? 2 : 1,
                borderColor: position && !vm.comparing ? c.primary : c.border,
                borderRadius: 18,
                overflow: 'hidden',
                backgroundColor: c.card,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <PhotoThumbnail
                key={item.photo.file}
                source={{ uri: log.vault.uri(item.photo.file) }}
                resizeMethod="resize"
                resizeMode="contain"
                style={{ width: '100%', aspectRatio: 4 / 3 }}
              />
              <View style={{ padding: 10, gap: 5 }}>
                <View
                  style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
                >
                  {!vm.comparing && (
                    <Icon
                      name={
                        position
                          ? 'check_circle_outline'
                          : 'radio_button_unchecked'
                      }
                      color={position ? c.primary : c.muted}
                      size={20}
                    />
                  )}
                  <Body strong style={{ flex: 1 }}>
                    {position ? `${position}. ` : ''}Schritt {item.number}
                  </Body>
                </View>
                {!!item.title && <Body>{item.title}</Body>}
                <Body muted style={{ fontSize: 12 }}>
                  {dateTime(item.occurredAt)}
                </Body>
              </View>
            </Pressable>
          );
        }}
        ListFooterComponent={
          !vm.comparing && vm.items.length < vm.total ? (
            <View style={{ marginTop: 12 }}>
              <Button
                secondary
                title={
                  vm.moreLoading
                    ? 'Fotos werden geladen …'
                    : 'Weitere Fotos anzeigen'
                }
                disabled={vm.loading || vm.moreLoading}
                onPress={() => void vm.loadMore()}
              />
            </View>
          ) : null
        }
      />
      {gallery !== null && vm.comparing && !!data.length && (
        <PhotoViewer
          images={data.map((item) => ({
            id: photoReference(item),
            uri: log.vault.uri(item.photo.file),
          }))}
          initialIndex={Math.min(gallery, data.length - 1)}
          close={() => setGallery(null)}
        />
      )}
    </Page>
  );
}
