import type { ViewStyle } from 'react-native';
import { palette } from './palette';

// A fine accent edge with a soft halo, shared by dialogs and bottom sheets.
// React Native omits the shadow on older Android versions, keeping the border.
export const overlayFrameStyle: ViewStyle = {
  borderWidth: 0.5,
  borderColor: palette.primary + 'B3',
  boxShadow: [
    {
      offsetX: 0,
      offsetY: 0,
      blurRadius: 8,
      spreadDistance: 0,
      color: palette.primary + '24',
    },
  ],
};
