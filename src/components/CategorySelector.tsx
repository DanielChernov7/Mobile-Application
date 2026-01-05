import React, { memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context';
import { CATEGORIES, Category } from '../types';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

function CategorySelectorComponent({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    chip: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceVariant,
      marginRight: theme.spacing.sm,
    },
    chipSelected: {
      backgroundColor: theme.colors.primary,
    },
    chipText: {
      fontSize: theme.typography.labelLarge,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    chipTextSelected: {
      color: '#ffffff',
    },
  });

  const renderChip = (category: Category) => {
    const isSelected = selectedCategory === category.id;
    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.chip, isSelected && styles.chipSelected]}
        onPress={() => onSelectCategory(category.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map(renderChip)}
      </ScrollView>
    </View>
  );
}

export const CategorySelector = memo(CategorySelectorComponent);
