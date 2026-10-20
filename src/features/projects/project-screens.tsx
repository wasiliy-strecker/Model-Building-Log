import { View, Text } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  Body,
  Button,
  Busy,
  Card,
  Field,
  Heading,
  Page,
  Title,
  Fab,
  IconButton,
  Notice,
  useTheme,
} from '../../core/ui/components';
import { Icon, modelTypeIcon } from '../../core/ui/icon';
import { useFeedback } from '../../core/ui/feedback';
import { useProjects, useProjectDetail } from './use-projects';
import { HistoryTile } from './history-tile';
import {
  dateTime,
  stepSummary,
  reminderSummary,
  sortLabels,
  type ProjectSort,
} from './presentation-model';
import { PAGE_SIZE, type Project } from '../../core/domain/models';
import type { ReminderStatus } from '../../core/native/model-native';
import { ReminderScheduleStatus } from './reminder-status';
export function ReminderInfo({
  project,
  status,
}: {
  project: Project;
  status?: ReminderStatus;
}) {
  const c = useTheme();
  const r = project.reminder;
  const s = status?.schedules.find((s) => s.recordId === project.id);
  if (!r && s?.planningState !== 'cancelFailed') return null;
  return (
    <View style={{ gap: 6 }}>
      {r && (
        <Body strong style={{ fontSize: 12 }}>
          Erinnern: {reminderSummary(r)}
        </Body>
      )}
      <ReminderScheduleStatus
        reminder={r}
        status={status}
        recordId={project.id}
        onEdit={() =>
          router.push({ pathname: '/project/edit', params: { id: project.id } })
        }
      />
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 12,
          backgroundColor: c.soft,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon name="notifications_active_outlined" size={19} color={c.onSoft} />
        <Body strong style={{ fontSize: 12, color: c.onSoft, flex: 1 }}>
          Letzte Erinnerung:{' '}
          {s?.lastTriggeredAtMillis
            ? `${dateTime(s.lastTriggeredAtMillis)} Uhr`
            : 'noch keine'}
        </Body>
      </View>
    </View>
  );
}
export function ProjectsScreen() {
  const vm = useProjects(),
    c = useTheme(),
    feedback = useFeedback();
  const create = () => router.push('/project/edit');
  return (
    <Page
      ready={!vm.loading}
      fab={<Fab title="Projekt anlegen" onPress={create} />}
    >
      {vm.loading ? (
        <Busy label="Projekte werden geladen …" />
      ) : vm.error ? (
        <>
          <Notice error text={vm.error} />
          <Button title="Erneut laden" onPress={vm.retry} />
        </>
      ) : vm.empty ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            gap: 20,
          }}
        >
          <Icon name="build" size={72} color={c.primary} />
          <Title>Erstes Projekt anlegen</Title>
          <Body style={{ textAlign: 'center' }}>
            Vom ersten Bauteil bis zum letzten Pinselstrich: Halte deinen
            Bauschritt mit Fotos und Notizen fest. Deine Projekte bleiben lokal
            auf deinem Gerät gespeichert.
          </Body>
        </View>
      ) : (
        <>
          <Title subtitle="Deine Modelle, dein Tempo. Merke dir, wo du weitermachst.">
            Deine Projekte
          </Title>
          <View style={{ marginTop: 4 }}>
            <Field
              label="Projekte suchen"
              leading="search"
              value={vm.search}
              onChangeText={vm.setSearch}
              trailing={vm.search ? 'close' : undefined}
              onTrailingPress={() => vm.setSearch('')}
              returnKeyType="search"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <Body muted>
              {vm.items.length}{' '}
              {vm.search
                ? 'Treffer'
                : vm.items.length === 1
                  ? 'Projekt'
                  : 'Projekte'}
            </Body>
            <Button
              secondary
              icon="sort"
              menu
              title={sortLabels[vm.sort]}
              onPress={(anchor) =>
                void feedback
                  .choose({
                    title: 'Projekte sortieren',
                    anchor,
                    options: (Object.keys(sortLabels) as ProjectSort[]).map(
                      (value) => ({
                        value,
                        label: sortLabels[value],
                        icon: value === vm.sort ? 'check' : undefined,
                      }),
                    ),
                  })
                  .then((value) => {
                    if (value) vm.setSort(value as ProjectSort);
                  })
              }
            />
          </View>
          {!vm.items.length && (
            <Card>
              <Icon name="search" size={42} color={c.primary} />
              <Body>Keine passenden Projekte gefunden.</Body>
            </Card>
          )}
          {vm.items.map(({ project, latest, lastEdited }) => (
            <Card
              key={project.id}
              onPress={() =>
                router.push({
                  pathname: '/project/[id]',
                  params: { id: project.id },
                })
              }
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: c.primary + '1F',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon
                    name={modelTypeIcon(project.modelType)}
                    color={c.primary}
                  />
                  {vm.status?.schedules.find((s) => s.recordId === project.id)
                    ?.isNotificationActive && (
                    <View
                      style={{
                        position: 'absolute',
                        right: -2,
                        top: -4,
                        backgroundColor: c.danger,
                        borderRadius: 10,
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text style={{ color: c.background, fontSize: 11 }}>
                        1
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Body strong style={{ fontSize: 16, lineHeight: 24 }}>
                    {project.name}
                  </Body>
                  <Body muted>
                    {[project.modelType, project.material]
                      .filter(Boolean)
                      .join(' · ')}
                  </Body>
                  <Text
                    style={{
                      fontFamily: 'RobotoBlack',
                      fontSize: 22,
                      lineHeight: 28,
                      color: c.ink,
                      marginTop: 2,
                    }}
                  >
                    {stepSummary(latest)}
                  </Text>
                  <Body muted style={{ fontSize: 12, lineHeight: 16 }}>
                    Zuletzt bearbeitet: {dateTime(lastEdited)}
                  </Body>
                  {vm.drafts.some((d) => d.projectId === project.id) && (
                    <Body muted style={{ fontSize: 12 }}>
                      Gesicherter Formularentwurf
                    </Body>
                  )}
                  <ReminderInfo project={project} status={vm.status} />
                </View>
                <Icon name="chevron_right" />
              </View>
            </Card>
          ))}
        </>
      )}
    </Page>
  );
}
export function Pager({
  offset,
  total,
  onChange,
}: {
  offset: number;
  total: number;
  onChange(n: number): void;
}) {
  return total > PAGE_SIZE ? (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <IconButton
        icon="chevron_left"
        label="Vorherige Seite"
        disabled={offset === 0}
        onPress={() => onChange(Math.max(0, offset - PAGE_SIZE))}
      />
      <Body>
        Seite {Math.floor(offset / PAGE_SIZE) + 1} von{' '}
        {Math.ceil(total / PAGE_SIZE)}
      </Body>
      <IconButton
        icon="chevron_right"
        label="Nächste Seite"
        disabled={offset + PAGE_SIZE >= total}
        onPress={() => onChange(offset + PAGE_SIZE)}
      />
    </View>
  ) : null;
}
export function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vm = useProjectDetail(id),
    c = useTheme(),
    feedback = useFeedback();
  const r = vm.project;
  const edit = () => router.push({ pathname: '/project/edit', params: { id } });
  const capture = () =>
    router.push({ pathname: '/step/edit', params: { projectId: id } });
  if (!r)
    return (
      <Page ready={!vm.loading}>
        <Notice error text={vm.error} />
        {vm.loading ? <Busy /> : <Body>Projekt nicht gefunden.</Body>}
      </Page>
    );
  return (
    <Page
      ready={!vm.loading}
      fab={
        <Fab
          title="Bauschritt erfassen"
          icon="add_a_photo_outlined"
          onPress={capture}
        />
      }
    >
      <Stack.Screen options={{ title: r.name }} />
      <Card onPress={edit} style={{ margin: 4, padding: 17, gap: 0 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: c.primary + '1F',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={modelTypeIcon(r.modelType)} color={c.primary} />
          </View>
          <Body
            strong
            style={{
              flex: 1,
              fontSize: 16,
              lineHeight: 24,
              letterSpacing: 0.15,
            }}
          >
            {r.modelType || 'Modellbauprojekt'}
          </Body>
          <Icon name="chevron_right" color={c.muted} />
        </View>
        <Body
          style={{
            marginTop: 14,
            fontFamily: 'RobotoBlack',
            fontSize: 28,
            lineHeight: 36,
            letterSpacing: 0,
          }}
        >
          {stepSummary(vm.steps[0] ?? null)}
        </Body>
        {!!vm.steps[0] && (
          <Body>Zuletzt am {dateTime(vm.steps[0].occurredAt)}</Body>
        )}
        <View style={{ marginTop: 10 }}>
          {!!r.manufacturer && <Body>Hersteller: {r.manufacturer}</Body>}
          {!!r.material && <Body>Material: {r.material}</Body>}
          <ReminderInfo project={r} status={vm.status} />
        </View>
      </Card>
      <View style={{ gap: 12 }}>
        <Button
          secondary
          icon="edit_outlined"
          title="Projekt & Erinnerung bearbeiten"
          onPress={edit}
        />
        <Button
          secondary
          danger
          icon="delete_outline"
          title="Projekt löschen"
          disabled={vm.busy}
          onPress={() =>
            void feedback
              .confirm(
                'Projekt löschen?',
                'Das Projekt, seine Bauschritte, Fotos und Entwürfe werden dauerhaft gelöscht. Externe Backups bleiben erhalten.',
              )
              .then((ok) => {
                if (ok) void vm.remove();
              })
          }
        />
      </View>
      <Notice error text={vm.error} />
      {vm.photoCount >= 2 && (
        <Button
          secondary
          icon="compare"
          title="Fotos vergleichen"
          onPress={() =>
            router.push({
              pathname: '/project/compare',
              params: { projectId: id },
            })
          }
        />
      )}
      {vm.drafts.map((draft) => (
        <Card key={draft.id}>
          <Body strong>Gesicherter Entwurf</Body>
          <Body>
            {draft.stepId
              ? 'Änderungen an einem Bauschritt'
              : 'Neuer Bauschritt'}
            {draft.form.number ? ` · Schritt ${draft.form.number}` : ''}
          </Body>
          <Button
            secondary
            icon="edit_note_outlined"
            title="Entwurf fortsetzen"
            onPress={() =>
              router.push({
                pathname: '/step/edit',
                params: {
                  projectId: id,
                  ...(draft.stepId ? { stepId: draft.stepId } : {}),
                },
              })
            }
          />
        </Card>
      ))}
      <View style={{ marginTop: vm.total > 0 ? 6 : 18, gap: 8 }}>
        <Heading>Bauverlauf</Heading>
        {vm.total > 0 && (
          <Body style={{ fontFamily: 'RobotoMedium', letterSpacing: 0.1 }}>
            {vm.total === 1
              ? '1 Bauschritt'
              : `${vm.steps.length} von ${vm.total} Bauschritten`}
          </Body>
        )}
        {!vm.total && (
          <Card
            onPress={capture}
            style={{ margin: 4, padding: 23, gap: 0, alignItems: 'center' }}
          >
            <Icon name="add_a_photo_outlined" size={44} color={c.primary} />
            <Body style={{ marginTop: 10, textAlign: 'center' }}>
              Noch kein Bauschritt. Trage ein, wo du gerade aufgehört hast, und
              ergänze Fotos oder Notizen zu deinem Modell.
            </Body>
            <View
              style={{
                marginTop: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Body
                strong
                style={{ color: c.primary, textAlign: 'center', flexShrink: 1 }}
              >
                Ersten Bauschritt erfassen
              </Body>
              <Icon name="chevron_right" color={c.primary} />
            </View>
          </Card>
        )}
        <View style={{ gap: 10 }}>
          {vm.historyItems.map((item) => (
            <HistoryTile key={item.step.id} item={item} />
          ))}
        </View>
      </View>
      {vm.total > PAGE_SIZE && (
        <Button
          secondary
          icon="manage_search_outlined"
          title="Alle Bauschritte anzeigen"
          onPress={() =>
            router.push({ pathname: '/project/history', params: { id } })
          }
        />
      )}
    </Page>
  );
}
export function ProjectHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vm = useProjectDetail(id, true),
    c = useTheme();
  return (
    <Page
      ready={!vm.loading}
      top={
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 12,
            gap: 12,
            backgroundColor: c.background,
          }}
        >
          <Body
            style={{
              fontFamily: 'RobotoMedium',
              fontSize: 16,
              lineHeight: 24,
              letterSpacing: 0.15,
            }}
          >
            {vm.project?.name ?? ''}
          </Body>
          <Field
            label="Bauschritte suchen"
            leading="search"
            value={vm.search}
            onChangeText={vm.setSearch}
            trailing={vm.search ? 'close' : undefined}
            onTrailingPress={() => vm.setSearch('')}
          />
        </View>
      }
      bottom={
        <Pager offset={vm.offset} total={vm.total} onChange={vm.setOffset} />
      }
    >
      <Stack.Screen options={{ title: 'Bauverlauf' }} />
      <Notice error text={vm.error} />
      {vm.loading ? (
        <Busy />
      ) : (
        <View style={{ gap: 8 }}>
          <Body style={{ fontFamily: 'RobotoMedium', letterSpacing: 0.1 }}>
            {vm.total === 0
              ? 'Keine Bauschritte gefunden'
              : vm.total === 1
                ? vm.search.trim()
                  ? '1 Treffer'
                  : '1 Bauschritt'
                : `${vm.offset + 1}–${Math.min(vm.offset + PAGE_SIZE, vm.total)} von ${vm.total} ${vm.search.trim() ? 'Treffern' : 'Bauschritten'}`}
          </Body>
          <View style={{ gap: 10 }}>
            {vm.historyItems.map((item) => (
              <HistoryTile key={item.step.id} item={item} />
            ))}
          </View>
        </View>
      )}
    </Page>
  );
}
