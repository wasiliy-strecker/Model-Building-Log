import { createContext, useContext, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { StartupError, StartupPending } from '../startup/startup';
export const light = {
  background: '#F5F3EF',
  card: '#FFFCF7',
  input: '#F0F2EE',
  ink: '#1C282B',
  muted: '#4E6064',
  primary: '#315F69',
  onPrimary: '#FFFFFF',
  soft: '#D6EBEB',
  onSoft: '#1B444B',
  secondaryContainer: '#F1DFD2',
  onSecondaryContainer: '#6B4935',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',
  border: '#CBD4CF',
  outline: '#718181',
  danger: '#BA1A1A',
  onDanger: '#FFFFFF',
  elevated: '#E7EBE6',
  disabled: '#D7DADD',
  dark: false,
};
export const dark: typeof light = {
  background: '#172428',
  card: '#203337',
  input: '#142024',
  ink: '#E2ECEB',
  muted: '#B5C8C7',
  primary: '#A2CFD3',
  onPrimary: '#12383F',
  soft: '#1B444B',
  onSoft: '#D6EBEB',
  secondaryContainer: '#6B4935',
  onSecondaryContainer: '#F1DFD2',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  border: '#435B60',
  outline: '#8DA5A8',
  danger: '#FFB4AB',
  onDanger: '#690005',
  elevated: '#293C40',
  disabled: '#34464A',
  dark: true,
};
const ThemeContext = createContext(light);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [attempt, setAttempt] = useState(0);
  return (
    <FontThemeProvider key={attempt} retry={() => setAttempt((n) => n + 1)}>
      {children}
    </FontThemeProvider>
  );
}
function FontThemeProvider({
  children,
  retry,
}: {
  children: ReactNode;
  retry(): void;
}) {
  const scheme = useColorScheme();
  const [loaded, error] = useFonts({
    Roboto: require('../../../assets/ui/Roboto-Regular.ttf'),
    RobotoMedium: require('../../../assets/ui/Roboto-Medium.ttf'),
    RobotoBold: require('../../../assets/ui/Roboto-Bold.ttf'),
    RobotoBlack: require('../../../assets/ui/Roboto-Black.ttf'),
    MaterialIcons: require('../../../assets/ui/MaterialIcons-Regular.otf'),
  });
  if (error)
    return (
      <StartupError
        message="Die Schriftarten konnten nicht geladen werden."
        retry={retry}
      />
    );
  if (!loaded) return <StartupPending />;
  return (
    <ThemeContext.Provider value={scheme === 'dark' ? dark : light}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
