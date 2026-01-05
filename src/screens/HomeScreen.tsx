import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, useSettings } from '../context';
import { useCryptoData } from '../hooks/useCryptoData';
import { useDebounce } from '../hooks/useDebounce';
import {
  CryptoCard,
  SearchBar,
  CategorySelector,
  SortSelector,
  LoadingIndicator,
  ErrorView,
  EmptyState,
} from '../components';
import { Cryptocurrency, SortOrder, RootStackParamList } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export function HomeScreen() {
  const theme = useTheme();
  const { settings } = useSettings();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(settings.defaultCategory);
  const [sortOrder, setSortOrder] = useState<SortOrder>('market_cap_desc');

  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data,
    loading,
    error,
    refreshing,
    refresh,
    loadMore,
    hasMore,
  } = useCryptoData({
    currency: settings.currency,
    category,
    sortOrder,
    searchQuery: debouncedSearch,
  });

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

  const handleEndReached = useCallback(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.headlineLarge,
      fontWeight: '700',
      color: theme.colors.text,
    },
    listContent: {
      paddingVertical: theme.spacing.sm,
    },
    footerLoader: {
      paddingVertical: theme.spacing.lg,
    },
  });

  const ListHeader = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Crypto Tracker</Text>
        <SortSelector sortOrder={sortOrder} onSortChange={setSortOrder} />
      </View>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <CategorySelector
        selectedCategory={category}
        onSelectCategory={setCategory}
      />
    </View>
  );

  const ListFooter = () => {
    if (!hasMore || data.length === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingIndicator message="Loading more..." />
      </View>
    );
  };

  if (loading && data.length === 0) {
    return (
      <View style={styles.container}>
        {ListHeader}
        <LoadingIndicator fullScreen message="Fetching cryptocurrencies..." />
      </View>
    );
  }

  if (error && data.length === 0) {
    return (
      <View style={styles.container}>
        {ListHeader}
        <ErrorView message={error} onRetry={refresh} />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        {ListHeader}
        <EmptyState
          icon="search-outline"
          title="No results found"
          message={
            searchQuery
              ? `No cryptocurrencies match "${searchQuery}"`
              : 'No cryptocurrencies available in this category'
          }
        />
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
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.listContent}
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={5}
      />
    </View>
  );
}
