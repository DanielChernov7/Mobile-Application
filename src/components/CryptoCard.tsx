import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { useFavorites } from '../context/FavoritesContext';
import { Cryptocurrency, Currency, CURRENCY_INFO } from '../types';

interface CryptoCardProps {
  crypto: Cryptocurrency;
  currency: Currency;
  onPress: () => void;
}

function CryptoCardComponent({ crypto, currency, onPress }: CryptoCardProps) {
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const currencyInfo = CURRENCY_INFO[currency];
  const isPositive = crypto.price_change_percentage_24h >= 0;
  const favorite = isFavorite(crypto.id);

  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return `${currencyInfo.symbol}${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `${currencyInfo.symbol}${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`;
  };

  const formatMarketCap = (cap: number): string => {
    if (cap >= 1e12) return `${currencyInfo.symbol}${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `${currencyInfo.symbol}${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `${currencyInfo.symbol}${(cap / 1e6).toFixed(2)}M`;
    return `${currencyInfo.symbol}${cap.toLocaleString()}`;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.shadows.medium,
    },
    rankBadge: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      marginRight: theme.spacing.md,
      minWidth: 32,
      alignItems: 'center',
    },
    rankText: {
      fontSize: theme.typography.labelSmall,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    image: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: theme.spacing.md,
    },
    infoContainer: {
      flex: 1,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    name: {
      fontSize: theme.typography.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    price: {
      fontSize: theme.typography.bodyLarge,
      fontWeight: '700',
      color: theme.colors.text,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    symbol: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    marketCap: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    changeText: {
      fontSize: theme.typography.bodyMedium,
      fontWeight: '600',
      color: isPositive ? theme.colors.positive : theme.colors.negative,
      marginLeft: theme.spacing.xs,
    },
    favoriteButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{crypto.market_cap_rank || '-'}</Text>
      </View>
      <Image source={{ uri: crypto.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {crypto.name}
          </Text>
          <Text style={styles.price}>{formatPrice(crypto.current_price)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.leftSection}>
            <Text style={styles.symbol}>{crypto.symbol}</Text>
            <Text style={styles.marketCap}>
              MCap: {formatMarketCap(crypto.market_cap)}
            </Text>
          </View>
          <View style={styles.changeContainer}>
            <Ionicons
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={14}
              color={isPositive ? theme.colors.positive : theme.colors.negative}
            />
            <Text style={styles.changeText}>
              {crypto.price_change_percentage_24h?.toFixed(2) || '0.00'}%
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(crypto.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={favorite ? 'heart' : 'heart-outline'}
          size={22}
          color={favorite ? theme.colors.error : theme.colors.icon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export const CryptoCard = memo(CryptoCardComponent);
