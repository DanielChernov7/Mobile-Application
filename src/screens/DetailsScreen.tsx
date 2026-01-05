import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useSettings, useFavorites } from '../context';
import { fetchCryptoDetails } from '../services/api';
import { LoadingIndicator, ErrorView } from '../components';
import { CryptoDetails, RootStackParamList, CURRENCY_INFO } from '../types';

type DetailsRouteProp = RouteProp<RootStackParamList, 'Details'>;

export function DetailsScreen() {
  const theme = useTheme();
  const { settings } = useSettings();
  const { isFavorite, toggleFavorite } = useFavorites();
  const route = useRoute<DetailsRouteProp>();
  const { cryptoId } = route.params;

  const [crypto, setCrypto] = useState<CryptoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currencyInfo = CURRENCY_INFO[settings.currency];
  const favorite = isFavorite(cryptoId);

  const loadData = useCallback(async (useCache = true) => {
    try {
      setError(null);
      const data = await fetchCryptoDetails(cryptoId, useCache);
      setCrypto(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [cryptoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(false);
  }, [loadData]);

  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return `${currencyInfo.symbol}${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `${currencyInfo.symbol}${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })}`;
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) return `${currencyInfo.symbol}${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${currencyInfo.symbol}${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${currencyInfo.symbol}${(num / 1e6).toFixed(2)}M`;
    return `${currencyInfo.symbol}${num.toLocaleString()}`;
  };

  const formatSupply = (num: number | null): string => {
    if (num === null) return 'N/A';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.lg,
    },
    headerCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      ...theme.shadows.medium,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: theme.spacing.lg,
    },
    name: {
      fontSize: theme.typography.displaySmall,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    symbol: {
      fontSize: theme.typography.bodyLarge,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: theme.spacing.lg,
    },
    priceContainer: {
      alignItems: 'center',
    },
    price: {
      fontSize: theme.typography.displayMedium,
      fontWeight: '700',
      color: theme.colors.text,
    },
    changeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    changeText: {
      fontSize: theme.typography.bodyLarge,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    favoriteButton: {
      position: 'absolute',
      top: theme.spacing.lg,
      right: theme.spacing.lg,
      padding: theme.spacing.sm,
    },
    statsCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.small,
    },
    sectionTitle: {
      fontSize: theme.typography.headlineSmall,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -theme.spacing.sm,
    },
    statItem: {
      width: '50%',
      paddingHorizontal: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    statLabel: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    statValue: {
      fontSize: theme.typography.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text,
    },
    rangeContainer: {
      marginBottom: theme.spacing.lg,
    },
    rangeLabel: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    rangeBar: {
      height: 8,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 4,
      overflow: 'hidden',
    },
    rangeFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    rangeValues: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xs,
    },
    rangeValue: {
      fontSize: theme.typography.labelSmall,
      color: theme.colors.textSecondary,
    },
    descriptionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.small,
    },
    description: {
      fontSize: theme.typography.bodyMedium,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    linksCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xxxl,
      ...theme.shadows.small,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    linkButtonLast: {
      borderBottomWidth: 0,
    },
    linkText: {
      fontSize: theme.typography.bodyMedium,
      color: theme.colors.primary,
      marginLeft: theme.spacing.md,
      flex: 1,
    },
  });

  if (loading) {
    return <LoadingIndicator fullScreen message="Loading details..." />;
  }

  if (error || !crypto) {
    return <ErrorView message={error || 'Failed to load'} onRetry={handleRefresh} />;
  }

  const isPositive = crypto.price_change_percentage_24h >= 0;
  const priceRangePercent = crypto.high_24h > crypto.low_24h
    ? ((crypto.current_price - crypto.low_24h) / (crypto.high_24h - crypto.low_24h)) * 100
    : 50;

  const cleanDescription = crypto.description?.en
    ?.replace(/<[^>]*>/g, '')
    ?.substring(0, 500);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.headerCard}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(cryptoId)}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={28}
            color={favorite ? theme.colors.error : theme.colors.icon}
          />
        </TouchableOpacity>
        <Image source={{ uri: crypto.image }} style={styles.image} />
        <Text style={styles.name}>{crypto.name}</Text>
        <Text style={styles.symbol}>{crypto.symbol}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(crypto.current_price)}</Text>
          <View style={styles.changeRow}>
            <Ionicons
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={20}
              color={isPositive ? theme.colors.positive : theme.colors.negative}
            />
            <Text
              style={[
                styles.changeText,
                { color: isPositive ? theme.colors.positive : theme.colors.negative },
              ]}
            >
              {crypto.price_change_percentage_24h?.toFixed(2)}% (24h)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Price Range (24h)</Text>
        <View style={styles.rangeContainer}>
          <View style={styles.rangeBar}>
            <View
              style={[styles.rangeFill, { width: `${priceRangePercent}%` }]}
            />
          </View>
          <View style={styles.rangeValues}>
            <Text style={styles.rangeValue}>
              Low: {formatPrice(crypto.low_24h)}
            </Text>
            <Text style={styles.rangeValue}>
              High: {formatPrice(crypto.high_24h)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Market Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Market Cap</Text>
            <Text style={styles.statValue}>
              {formatLargeNumber(crypto.market_cap)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Market Cap Rank</Text>
            <Text style={styles.statValue}>#{crypto.market_cap_rank}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>24h Volume</Text>
            <Text style={styles.statValue}>
              {formatLargeNumber(crypto.total_volume)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Circulating Supply</Text>
            <Text style={styles.statValue}>
              {formatSupply(crypto.circulating_supply)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Supply</Text>
            <Text style={styles.statValue}>
              {formatSupply(crypto.total_supply)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Max Supply</Text>
            <Text style={styles.statValue}>
              {formatSupply(crypto.max_supply)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>All-Time High</Text>
            <Text style={styles.statValue}>{formatPrice(crypto.ath)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>ATH Change</Text>
            <Text
              style={[
                styles.statValue,
                {
                  color:
                    crypto.ath_change_percentage >= 0
                      ? theme.colors.positive
                      : theme.colors.negative,
                },
              ]}
            >
              {crypto.ath_change_percentage?.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {cleanDescription && (
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About {crypto.name}</Text>
          <Text style={styles.description}>
            {cleanDescription}
            {crypto.description?.en && crypto.description.en.length > 500 && '...'}
          </Text>
        </View>
      )}

      {crypto.links && (
        <View style={styles.linksCard}>
          <Text style={styles.sectionTitle}>Links</Text>
          {crypto.links.homepage?.[0] && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(crypto.links!.homepage[0])}
            >
              <Ionicons name="globe-outline" size={22} color={theme.colors.primary} />
              <Text style={styles.linkText} numberOfLines={1}>
                Website
              </Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={theme.colors.textTertiary}
              />
            </TouchableOpacity>
          )}
          {crypto.links.blockchain_site?.[0] && (
            <TouchableOpacity
              style={[styles.linkButton, styles.linkButtonLast]}
              onPress={() => Linking.openURL(crypto.links!.blockchain_site[0])}
            >
              <Ionicons name="cube-outline" size={22} color={theme.colors.primary} />
              <Text style={styles.linkText} numberOfLines={1}>
                Explorer
              </Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={theme.colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}
