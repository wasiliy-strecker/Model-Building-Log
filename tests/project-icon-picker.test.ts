import { afterEach, expect, it, vi } from 'vitest';
import { createElement, useEffect } from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { ProjectIconPicker } from '../src/features/projects/project-icon-picker';
import { projectIconOption } from '../src/features/projects/project-icon-model';
import { useProjectEditor } from '../src/features/projects/use-project-editor';
import { fixture } from './support';

vi.mock('react-native', () => ({
  View: 'View',
  Pressable: 'Pressable',
  Platform: { OS: 'android', Version: 36 },
  PermissionsAndroid: {},
}));
vi.mock('expo-router', () => ({
  router: { replace: vi.fn(), dismissTo: vi.fn() },
}));
vi.mock('../src/core/ui/components', async () => {
  const { palette } = await import('../src/core/ui/palette');
  return {
    Body: 'Body',
    Card: 'Card',
    useTheme: () => palette,
    errorText: (error: unknown) =>
      error instanceof Error ? error.message : String(error),
  };
});
vi.mock('../src/core/ui/icon', () => ({ Icon: 'Icon' }));
vi.mock('../src/core/ui/feedback', () => ({
  useFeedback: () => ({ notify: vi.fn() }),
}));
vi.mock('../src/core/ui/use-leave-guard', () => ({
  useLeaveGuard: () => (navigate: () => void) => navigate(),
}));
vi.mock('../src/features/projects/use-reminder-status', () => ({
  useReminderStatusSnapshot: () => ({
    loaded: false,
    status: undefined,
    refresh: vi.fn(),
  }),
}));
vi.mock('../src/core/composition', () => ({
  useServices: () => ({
    log: active!.log,
    refresh: vi.fn(),
    native: { reminderStatus: async () => undefined },
  }),
}));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let active: Awaited<ReturnType<typeof fixture>> | undefined;
let renderer: ReactTestRenderer | undefined;
let editor: ReturnType<typeof useProjectEditor>;
afterEach(async () => {
  await act(async () => renderer?.unmount());
  renderer = undefined;
  await active?.close();
  active = undefined;
});
function Harness({
  id,
  disabled = false,
}: {
  id?: string;
  disabled?: boolean;
}) {
  const vm = useProjectEditor(id);
  useEffect(() => {
    editor = vm;
  }, [vm]);
  if (!vm.project) return null;
  return createElement(ProjectIconPicker, {
    value: projectIconOption(vm.project).id,
    disabled: disabled || vm.busy,
    onChange: (value) => vm.change('icon', value),
  });
}
const option = (label: string) =>
  renderer!.root.findByProps({ accessibilityLabel: label });
const selection = () =>
  renderer!.root
    .findAllByType('Body' as never)
    .at(-1)!
    .children.join('');

it('preselects symbols on type changes, allows overrides and saves custom types with a default or chosen symbol', async () => {
  active = await fixture();
  await act(async () => {
    renderer = create(createElement(Harness));
  });
  expect(
    renderer!.root.findAllByProps({ accessibilityRole: 'radio' }),
  ).toHaveLength(8);
  expect(selection()).toBe('Ausgewählt: Werkzeug');
  expect(
    option('Projektsymbol: Werkzeug').props.accessibilityState.checked,
  ).toBe(true);

  await act(async () => editor.changeModelType('Flugzeug'));
  expect(selection()).toBe('Ausgewählt: Flugzeug');
  expect(
    option('Projektsymbol: Flugzeug').props.accessibilityState.checked,
  ).toBe(true);
  await act(async () => option('Projektsymbol: Rakete').props.onPress());
  expect(
    option('Projektsymbol: Flugzeug').props.accessibilityState.checked,
  ).toBe(false);
  expect(selection()).toBe('Ausgewählt: Rakete');
  await act(async () => editor.change('name', 'Eigenbau'));
  expect(selection()).toBe('Ausgewählt: Rakete');
  await act(async () => {
    await editor.save();
  });
  expect(editor.error).toBe('');
  const id = editor.project!.id;
  expect((await active.repo.project(id))?.icon).toBe('rocket');

  await act(async () => editor.changeModelType('Schiff'));
  expect(selection()).toBe('Ausgewählt: Schiff');
  await act(async () => editor.changeModelType('Eigener RC-Bausatz'));
  expect(selection()).toBe('Ausgewählt: Werkzeug');
  await act(async () => {
    await editor.save();
  });
  expect((await active.repo.project(id))?.icon).toBe('tools');
  await act(async () => option('Projektsymbol: Fahrzeug').props.onPress());
  await act(async () => {
    await editor.save();
  });
  expect((await active.repo.project(id))?.icon).toBe('vehicle');

  await act(async () => renderer!.unmount());
  await act(async () => {
    renderer = create(createElement(Harness, { id }));
  });
  await vi.waitFor(async () => {
    await act(async () => {});
    expect(editor.project?.modelType).toBe('Eigener RC-Bausatz');
  });
  expect(editor.dirty).toBe(false);
  expect(selection()).toBe('Ausgewählt: Fahrzeug');
  await act(async () =>
    renderer!.update(createElement(Harness, { id, disabled: true })),
  );
  for (const radio of renderer!.root.findAllByProps({
    accessibilityRole: 'radio',
  })) {
    expect(radio.props.disabled).toBe(true);
    expect(radio.props.accessibilityState.disabled).toBe(true);
  }
});
