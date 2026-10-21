import { createElement } from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DeviceExternalLinks } from '../src/core/links/external-links';
import { SettingsScreen } from '../src/features/settings/settings-screen';

const ports = vi.hoisted(() => ({ openURL: vi.fn() }));
vi.mock('react-native', () => ({
  Linking: ports,
  Keyboard: { dismiss: vi.fn() },
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Modal: 'Modal',
  Pressable: 'Pressable',
  ScrollView: 'ScrollView',
  Text: 'Text',
  View: 'View',
}));
vi.mock('../src/core/composition', () => ({
  useServices: () => ({ links: new DeviceExternalLinks() }),
}));
vi.mock('../src/core/ui/feedback', () => ({ useFeedback: () => ({}) }));
vi.mock('../src/core/ui/use-leave-guard', () => ({ useLeaveGuard: vi.fn() }));
vi.mock('../src/core/ui/icon', () => ({ Icon: 'Icon' }));
vi.mock('../src/core/ui/dialog-actions', () => ({
  DialogActions: 'DialogActions',
}));
vi.mock('../src/core/ui/components', () => ({
  Body: 'Body',
  BusyOverlay: 'BusyOverlay',
  Button: 'Button',
  Card: 'Card',
  Field: 'Field',
  Heading: 'Heading',
  Notice: 'Notice',
  Page: 'Page',
  useTheme: () => ({ border: '#444' }),
  errorText: (error: unknown) =>
    error instanceof Error ? error.message : String(error),
}));

let view: ReactTestRenderer;
const button = () =>
  view.root.findByProps({ title: 'Datenschutzerklärung öffnen' });
beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.resetAllMocks();
  ports.openURL.mockResolvedValue(undefined);
  await act(async () => {
    view = create(createElement(SettingsScreen));
  });
});
afterEach(async () => {
  await act(async () => view.unmount());
});

it('opens the ModellbauLog privacy page in the external browser from settings', async () => {
  let opened!: () => void;
  ports.openURL.mockReturnValue(
    new Promise<void>((resolve) => {
      opened = resolve;
    }),
  );
  await act(async () => button().props.onPress());
  expect(ports.openURL).toHaveBeenCalledExactlyOnceWith(
    'https://wasiliy-strecker.github.io/Model-Building-Log/datenschutz/',
  );
  expect(button().props.disabled).toBe(true);
  await act(async () => opened());
  expect(button().props.disabled).toBe(false);
  expect(view.root.findByProps({ error: true }).props.text).toBe('');
});

it('shows a readable browser failure and allows another attempt', async () => {
  ports.openURL.mockRejectedValueOnce(new Error('No activity handles intent'));
  await act(async () => button().props.onPress());
  expect(view.root.findByProps({ error: true }).props.text).toBe(
    'Die Datenschutzerklärung konnte nicht geöffnet werden. Bitte versuche es erneut.',
  );
  expect(button().props.disabled).toBe(false);
  await act(async () => button().props.onPress());
  expect(ports.openURL).toHaveBeenCalledTimes(2);
  expect(view.root.findByProps({ error: true }).props.text).toBe('');
});
