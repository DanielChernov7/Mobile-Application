import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  showChevron?: boolean;
  onPress?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

function SettingsItemComponent({
  icon,
  title,
  subtitle,
  value,
  showChevron = false,
  onPress,
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
}: SettingsItemProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: theme.typography.bodyLarge,
      fontWeight: '500',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    value: {
      fontSize: theme.typography.bodyMedium,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
  });

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color={theme.colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.rightSection}>
        {value && <Text style={styles.value}>{value}</Text>}
        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primaryLight,
            }}
            thumbColor={switchValue ? theme.colors.primary : theme.colors.surface}
          />
        ) : showChevron ? (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textTertiary}
          />
        ) : null}
      </View>
    </Wrapper>
  );
}

export const SettingsItem = memo(SettingsItemComponent);
