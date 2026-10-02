import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Body, Card, useTheme } from '../../core/ui/components';
import { Icon } from '../../core/ui/icon';
import { dateTime, type HistoryItem } from './presentation-model';

export function HistoryTile({ item }: { item: HistoryItem }) {
  const c = useTheme();
  const [failedUri, setFailedUri] = useState<string>();
  const { step, photoUri, photoCount, progressText, comparison } = item;
  const photoFailed = !!photoUri && failedUri === photoUri;
  // Match the reference's modelType accent at 14 percent opacity.
  const dateAccent = c.dark ? '#E2B99B' : '#9A6546';
  return (
    <Card
      onPress={() =>
        router.push({ pathname: '/step/[id]', params: { id: step.id } })
      }
      style={s.card}
    >
      <View
        style={[s.dateBadge, { backgroundColor: dateAccent + '24' }]}
        accessibilityLabel={`Erfasst am ${dateTime(step.occurredAt)} Uhr`}
      >
        <Icon name="calendar_month_outlined" size={17} />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[s.date, { color: c.ink }]}
        >
          Erfasst · {dateTime(step.occurredAt)} Uhr
        </Text>
      </View>
      <View style={s.row}>
        <View
          accessible
          accessibilityRole={photoUri ? 'image' : undefined}
          accessibilityLabel={
            photoFailed
              ? `Foto nicht verfügbar: ${step.title}`
              : photoCount
                ? `${photoCount} ${photoCount === 1 ? 'Foto' : 'Fotos'}: ${step.title}`
                : `Ohne Foto: ${step.title}`
          }
          style={[s.thumbnail, { backgroundColor: c.soft }]}
        >
          {photoUri && !photoFailed ? (
            <Image
              key={photoUri}
              source={{ uri: photoUri }}
              resizeMode="cover"
              resizeMethod="resize"
              style={StyleSheet.absoluteFill}
              onError={() => setFailedUri(photoUri)}
              accessible={false}
            />
          ) : (
            <Icon
              name={
                photoFailed ? 'broken_image_outlined' : 'edit_note_outlined'
              }
              size={30}
              color={c.onSoft}
            />
          )}
          {photoCount > 1 && (
            <View style={s.photoBadge}>
              <Text style={s.photoCount}>{photoCount} Fotos</Text>
            </View>
          )}
        </View>
        <View style={s.summary}>
          <Text style={[s.activity, { color: c.muted }]}>
            {step.title || 'Aktueller Bauschritt'}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[s.progress, { color: c.ink }]}
          >
            {progressText}
          </Text>
          {!!comparison && <Body style={s.comparison}>{comparison}</Body>}
        </View>
        <Icon name="chevron_right" color={c.muted} />
      </View>
      {!!step.note.trim() && (
        <View style={s.noteRow}>
          <Icon name="notes_outlined" size={18} color={c.muted} />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[s.note, { color: c.muted }]}
          >
            {step.note.trim()}
          </Text>
        </View>
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  // React Native includes the one-point border in layout. Flutter paints it.
  card: { padding: 13, gap: 12 },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  date: {
    flex: 1,
    fontFamily: 'RobotoBold',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  thumbnail: {
    width: 92,
    height: 92,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#000000DE',
  },
  photoCount: { color: '#FFFFFF', fontFamily: 'Roboto', fontSize: 12 },
  summary: { flex: 1, marginLeft: 14, marginRight: 8 },
  activity: {
    fontFamily: 'RobotoBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  progress: {
    marginTop: 2,
    fontFamily: 'RobotoBlack',
    fontSize: 22,
    lineHeight: 28,
  },
  comparison: { marginTop: 8 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  note: {
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
});
