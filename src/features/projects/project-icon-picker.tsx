import { Pressable, View, type ViewStyle } from 'react-native';
import type { ProjectIconId } from '../../core/domain/project-icon';
import { messages } from '../../core/i18n';
import { Body, Card, useTheme } from '../../core/ui/components';
import { Icon } from '../../core/ui/icon';
import { projectIconOptions } from './project-icon-model';

export function ProjectIconPicker({
  value,
  disabled,
  onChange,
}: {
  value: ProjectIconId;
  disabled: boolean;
  onChange(value: ProjectIconId): void;
}) {
  const c = useTheme();
  const text = messages.projectIcons;
  function optionStyle(checked: boolean, pressed: boolean): ViewStyle {
    return {
      minHeight: 56,
      padding: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: checked ? c.primary : c.border,
      backgroundColor: checked ? c.secondaryContainer : c.card,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
    };
  }
  return (
    <Card>
      <Body strong>{text.title}</Body>
      <Body muted>{text.helper}</Body>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={text.title}
        style={{ gap: 8 }}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {projectIconOptions.map((option) => {
            const checked = option.id === value;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityLabel={text.optionLabel.replace(
                  '{symbol}',
                  option.label,
                )}
                accessibilityState={{ checked, selected: checked, disabled }}
                disabled={disabled}
                onPress={() => onChange(option.id)}
                style={({ pressed }) => [
                  optionStyle(checked, pressed),
                  { flexBasis: '22%', flexGrow: 1 },
                ]}
              >
                <Icon
                  name={option.glyph}
                  size={28}
                  color={checked ? c.primary : c.muted}
                />
                {checked && (
                  <View style={{ position: 'absolute', top: 3, right: 3 }}>
                    <Icon name="check" size={12} color={c.primary} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
      <Body strong>
        {text.selected.replace('{symbol}', text.labels[value])}
      </Body>
    </Card>
  );
}
