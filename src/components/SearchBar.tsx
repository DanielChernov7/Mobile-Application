import React, { memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

function SearchBarComponent({
  value,
  onChangeText,
  placeholder = 'Search cryptocurrencies...',
}: SearchBarProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.md,
      height: 48,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: theme.typography.bodyMedium,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
    },
    clearButton: {
      padding: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={theme.colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="close-circle"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export const SearchBar = memo(SearchBarComponent);
