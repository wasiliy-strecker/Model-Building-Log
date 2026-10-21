import { afterEach, expect, it, vi } from 'vitest';
import { createElement, useState } from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import type { ProjectIconId } from '../src/core/domain/project-icon';
import { ProjectIconPicker } from '../src/features/projects/project-icon-picker';

vi.mock('react-native', () => ({ View: 'View', Pressable: 'Pressable' }));
vi.mock('../src/core/ui/components', async () => {
  const { palette } = await import('../src/core/ui/palette');
  return { Body: 'Body', Card: 'Card', useTheme: () => palette };
});
vi.mock('../src/core/ui/icon', () => ({ Icon: 'Icon' }));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let renderer: ReactTestRenderer | undefined;
afterEach(async () => {
  await act(async () => renderer?.unmount());
  renderer = undefined;
});
function Harness({
  modelType,
  disabled = false,
}: {
  modelType: string;
  disabled?: boolean;
}) {
  const [icon, setIcon] = useState<ProjectIconId>();
  return createElement(ProjectIconPicker, {
    value: icon,
    modelType,
    disabled,
    onChange: setIcon,
  });
}
const option = (label: string) =>
  renderer!.root.findByProps({ accessibilityLabel: label });
const selection = () =>
  renderer!.root
    .findAllByType('Body' as never)
    .at(-1)!
    .children.join('');

it('selects one symbol, keeps it after a model type change and switches back to automatic', async () => {
  await act(async () => {
    renderer = create(createElement(Harness, { modelType: 'Flugzeug' }));
  });
  expect(
    renderer!.root.findAllByProps({ accessibilityRole: 'radio' }),
  ).toHaveLength(9);
  expect(
    option('Automatisch nach Modelltyp: Flugzeug').props.accessibilityState
      .checked,
  ).toBe(true);
  expect(selection()).toBe('Ausgewählt: Flugzeug (automatisch)');

  await act(async () => option('Projektsymbol: Rakete').props.onPress());
  expect(option('Projektsymbol: Rakete').props.accessibilityState.checked).toBe(
    true,
  );
  expect(
    option('Automatisch nach Modelltyp: Flugzeug').props.accessibilityState
      .checked,
  ).toBe(false);
  expect(selection()).toBe('Ausgewählt: Rakete');

  await act(async () =>
    renderer!.update(createElement(Harness, { modelType: 'Schiff' })),
  );
  expect(selection()).toBe('Ausgewählt: Rakete');
  await act(async () =>
    option('Automatisch nach Modelltyp: Schiff').props.onPress(),
  );
  expect(option('Projektsymbol: Rakete').props.accessibilityState.checked).toBe(
    false,
  );
  expect(selection()).toBe('Ausgewählt: Schiff (automatisch)');

  await act(async () =>
    renderer!.update(
      createElement(Harness, { modelType: 'Diorama', disabled: true }),
    ),
  );
  expect(selection()).toBe('Ausgewählt: Diorama (automatisch)');
  for (const radio of renderer!.root.findAllByProps({
    accessibilityRole: 'radio',
  })) {
    expect(radio.props.disabled).toBe(true);
    expect(radio.props.accessibilityState.disabled).toBe(true);
  }
});
