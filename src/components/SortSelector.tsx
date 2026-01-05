import React, { memo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { SortOrder, SORT_OPTIONS } from '../types';

interface SortSelectorProps {
  sortOrder: SortOrder;
  onSortChange: (sort: SortOrder) => void;
}

function SortSelectorComponent({ sortOrder, onSortChange }: SortSelectorProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLabel = SORT_OPTIONS.find(opt => opt.value === sortOrder)?.label || 'Sort';

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.lg,
    },
    buttonText: {
      fontSize: theme.typography.labelMedium,
      color: theme.colors.text,
      marginRight: theme.spacing.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      paddingBottom: theme.spacing.xxxl,
    },
    modalTitle: {
      fontSize: theme.typography.headlineMedium,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    optionLast: {
      borderBottomWidth: 0,
    },
    optionText: {
      fontSize: theme.typography.bodyLarge,
      color: theme.colors.text,
    },
    optionTextSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: theme.spacing.lg,
    },
  });

  const handleSelect = (value: SortOrder) => {
    onSortChange(value);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{currentLabel}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.colors.icon} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Sort By</Text>
            {SORT_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  index === SORT_OPTIONS.length - 1 && styles.optionLast,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    sortOrder === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {sortOrder === option.value && (
                  <Ionicons
                    name="checkmark"
                    size={22}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export const SortSelector = memo(SortSelectorComponent);
