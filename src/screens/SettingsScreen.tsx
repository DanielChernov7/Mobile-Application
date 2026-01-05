import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useSettings, useFavorites } from '../context';
import { SettingsItem } from '../components';
import {
  Currency,
  FontSize,
  CURRENCY_INFO,
  CATEGORIES,
} from '../types';

export function SettingsScreen() {
  const theme = useTheme();
  const { settings, setCurrency, setFontSize, setTheme, setDefaultCategory, resetSettings } = useSettings();
  const { clearFavorites, favorites } = useFavorites();

  const [currencyModal, setCurrencyModal] = useState(false);
  const [fontSizeModal, setFontSizeModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);

  const currencies: { value: Currency; label: string }[] = [
    { value: 'usd', label: 'US Dollar ($)' },
    { value: 'eur', label: 'Euro (€)' },
    { value: 'gbp', label: 'British Pound (£)' },
    { value: 'jpy', label: 'Japanese Yen (¥)' },
    { value: 'btc', label: 'Bitcoin (₿)' },
  ];

  const fontSizes: { value: FontSize; label: string; description: string }[] = [
    { value: 'small', label: 'Small', description: 'Compact text size' },
    { value: 'medium', label: 'Medium', description: 'Default text size' },
    { value: 'large', label: 'Large', description: 'Larger, easier to read' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingVertical: theme.spacing.lg,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.headlineLarge,
      fontWeight: '700',
      color: theme.colors.text,
    },
    sectionTitle: {
      fontSize: theme.typography.labelLarge,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.sm,
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
      maxHeight: '70%',
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: theme.spacing.lg,
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
    optionContent: {
      flex: 1,
    },
    optionText: {
      fontSize: theme.typography.bodyLarge,
      color: theme.colors.text,
    },
    optionTextSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    optionDescription: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    resetButton: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xxl,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
    },
    resetButtonText: {
      fontSize: theme.typography.bodyLarge,
      fontWeight: '600',
      color: theme.colors.error,
    },
    version: {
      textAlign: 'center',
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textTertiary,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xxl,
    },
  });

  const getCurrencyLabel = () => {
    return CURRENCY_INFO[settings.currency]?.name || settings.currency.toUpperCase();
  };

  const getFontSizeLabel = () => {
    return settings.fontSize.charAt(0).toUpperCase() + settings.fontSize.slice(1);
  };

  const getCategoryLabel = () => {
    const category = CATEGORIES.find(c => c.id === settings.defaultCategory);
    return category?.name || 'All';
  };

  const handleCurrencySelect = async (currency: Currency) => {
    await setCurrency(currency);
    setCurrencyModal(false);
  };

  const handleFontSizeSelect = async (fontSize: FontSize) => {
    await setFontSize(fontSize);
    setFontSizeModal(false);
  };

  const handleCategorySelect = async (categoryId: string) => {
    await setDefaultCategory(categoryId);
    setCategoryModal(false);
  };

  const handleThemeToggle = async (isDark: boolean) => {
    await setTheme(isDark ? 'dark' : 'light');
  };

  const handleReset = async () => {
    await resetSettings();
    await clearFavorites();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <Text style={styles.sectionTitle}>Display</Text>

      <SettingsItem
        icon="moon-outline"
        title="Dark Mode"
        subtitle="Use dark color scheme"
        isSwitch
        switchValue={settings.theme === 'dark'}
        onSwitchChange={handleThemeToggle}
      />

      <SettingsItem
        icon="text-outline"
        title="Font Size"
        subtitle="Adjust text size throughout the app"
        value={getFontSizeLabel()}
        showChevron
        onPress={() => setFontSizeModal(true)}
      />

      <Text style={styles.sectionTitle}>Content</Text>

      <SettingsItem
        icon="cash-outline"
        title="Currency"
        subtitle="Display prices in selected currency"
        value={getCurrencyLabel()}
        showChevron
        onPress={() => setCurrencyModal(true)}
      />

      <SettingsItem
        icon="grid-outline"
        title="Default Category"
        subtitle="Category to show on app launch"
        value={getCategoryLabel()}
        showChevron
        onPress={() => setCategoryModal(true)}
      />

      <Text style={styles.sectionTitle}>Data</Text>

      <SettingsItem
        icon="heart"
        title="Favorites"
        subtitle={`${favorites.length} coins saved`}
        value=""
      />

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reset All Settings</Text>
      </TouchableOpacity>

      <Text style={styles.version}>CryptoTracker v1.0.0</Text>

      {/* Currency Modal */}
      <Modal
        visible={currencyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setCurrencyModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCurrencyModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {currencies.map((currency, index) => (
                <TouchableOpacity
                  key={currency.value}
                  style={[
                    styles.option,
                    index === currencies.length - 1 && styles.optionLast,
                  ]}
                  onPress={() => handleCurrencySelect(currency.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      settings.currency === currency.value && styles.optionTextSelected,
                    ]}
                  >
                    {currency.label}
                  </Text>
                  {settings.currency === currency.value && (
                    <Ionicons
                      name="checkmark"
                      size={22}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Font Size Modal */}
      <Modal
        visible={fontSizeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setFontSizeModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFontSizeModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Font Size</Text>
            {fontSizes.map((size, index) => (
              <TouchableOpacity
                key={size.value}
                style={[
                  styles.option,
                  index === fontSizes.length - 1 && styles.optionLast,
                ]}
                onPress={() => handleFontSizeSelect(size.value)}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      settings.fontSize === size.value && styles.optionTextSelected,
                    ]}
                  >
                    {size.label}
                  </Text>
                  <Text style={styles.optionDescription}>{size.description}</Text>
                </View>
                {settings.fontSize === size.value && (
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

      {/* Category Modal */}
      <Modal
        visible={categoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Default Category</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {CATEGORIES.map((category, index) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.option,
                    index === CATEGORIES.length - 1 && styles.optionLast,
                  ]}
                  onPress={() => handleCategorySelect(category.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      settings.defaultCategory === category.id && styles.optionTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                  {settings.defaultCategory === category.id && (
                    <Ionicons
                      name="checkmark"
                      size={22}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
