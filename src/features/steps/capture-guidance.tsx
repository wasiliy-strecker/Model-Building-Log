import { View } from 'react-native';
import { messages } from '../../core/i18n';
import { Body, Card } from '../../core/ui/components';

export function CaptureGuidance() {
  const copy = messages.stepFields;
  return (
    <Card style={{ padding: 18, gap: 14 }}>
      <Body strong style={{ fontSize: 18, lineHeight: 26 }}>
        {copy.captureTitle}
      </Body>
      <View>
        <Body>• {copy.captureTips.framing}</Body>
        <Body>• {copy.captureTips.lighting}</Body>
        <Body>• {copy.captureTips.perspective}</Body>
      </View>
      <Body muted>{copy.photoHint}</Body>
      <Body>{copy.captureHint}</Body>
    </Card>
  );
}
