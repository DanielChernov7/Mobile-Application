import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, useSettings, useFavorites } from '../context';
import { fetchCryptoList } from '../services/api';
import {
  CryptoCard,
  LoadingIndicator,
  ErrorView,
  EmptyState,
} from '../components';
import { Cryptocurrency, RootStackParamList } from '../types';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export function FavoritesScreen() {
  const theme = useTheme();
  const { settings } = useSettings();
  const { favorites } = useFavorites();
  const navigation = useNavigation<FavoritesScreenNavigationProp>();

  const [data, setData] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async (isRefresh = false) => {
    if (favorites.length === 0) {
      setData([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const allCrypto = await fetchCryptoList({
        currency: settings.currency,
        perPage: 250,
        useCache: !isRefresh,
      });

      const favoritesCrypto = allCrypto.filter(crypto =>
        favorites.includes(crypto.id)
      );

      setData(favoritesCrypto);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [favorites, settings.currency]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRefresh = useCallback(() => {
    loadFavorites(true);
  }, [loadFavorites]);

  const handleCryptoPress = useCallback((crypto: Cryptocurrency) => {
    navigation.navigate('Details', {
      cryptoId: crypto.id,
      cryptoName: crypto.name,
    });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: Cryptocurrency }) => (
      <CryptoCard
        crypto={item}
        currency={settings.currency}
        onPress={() => handleCryptoPress(item)}
      />
    ),
    [settings.currency, handleCryptoPress]
  );

  const keyExtractor = useCallback((item: Cryptocurrency) => item.id, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.headlineLarge,
      fontWeight: '700',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.bodyMedium,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    listContent: {
      paddingVertical: theme.spacing.sm,
    },
  });

  const ListHeader = (
    <View style={styles.header}>
      <Text style={styles.title}>Favorites</Text>
      <Text style={styles.subtitle}>
        {favorites.length} {favorites.length === 1 ? 'coin' : 'coins'} saved
      </Text>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        {ListHeader}
        <EmptyState
          icon="heart-outline"
          title="No favorites yet"
          message="Tap the heart icon on any cryptocurrency to add it to your favorites"
        />
      </View>
    );
  }

  if (loading && data.length === 0) {
    return (
      <View style={styles.container}>
        {ListHeader}
        <LoadingIndicator fullScreen message="Loading favorites..." />
      </View>
    );
  }

  if (error && data.length === 0) {
    return (
      <View style={styles.container}>
        {ListHeader}
        <ErrorView message={error} onRetry={handleRefresh} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
