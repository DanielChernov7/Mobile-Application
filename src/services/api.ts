import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cryptocurrency, CryptoDetails, Currency, SortOrder } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Cache keys
const CACHE_KEYS = {
  COINS_LIST: 'cache_coins_list',
  COIN_DETAILS: 'cache_coin_details_',
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// API client with error handling
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
});

// Helper to get cached data
async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const entry: CacheEntry<T> = JSON.parse(cached);
      if (Date.now() - entry.timestamp < CACHE_DURATION) {
        return entry.data;
      }
    }
  } catch (error) {
    console.warn('Cache read error:', error);
  }
  return null;
}

// Helper to set cached data
async function setCache<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn('Cache write error:', error);
  }
}

// Error handling helper
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string }>;
    if (axiosError.response) {
      const status = axiosError.response.status;
      if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(axiosError.response.data?.error || `Request failed (${status})`);
    }
    if (axiosError.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    throw new Error('Network error. Please check your internet connection.');
  }
  throw new Error('An unexpected error occurred.');
}

// Fetch list of cryptocurrencies
export async function fetchCryptoList(params: {
  currency: Currency;
  category?: string;
  sortOrder?: SortOrder;
  page?: number;
  perPage?: number;
  searchQuery?: string;
  useCache?: boolean;
}): Promise<Cryptocurrency[]> {
  const {
    currency,
    category = '',
    sortOrder = 'market_cap_desc',
    page = 1,
    perPage = 50,
    searchQuery = '',
    useCache = true,
  } = params;

  const cacheKey = `${CACHE_KEYS.COINS_LIST}_${currency}_${category}_${sortOrder}_${page}_${searchQuery}`;

  // Try to get cached data first
  if (useCache) {
    const cached = await getCached<Cryptocurrency[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    // If there's a search query, use the search endpoint
    if (searchQuery.trim()) {
      const searchResponse = await apiClient.get('/search', {
        params: { query: searchQuery },
      });

      const coinIds = searchResponse.data.coins
        .slice(0, perPage)
        .map((coin: { id: string }) => coin.id)
        .join(',');

      if (!coinIds) {
        return [];
      }

      const response = await apiClient.get('/coins/markets', {
        params: {
          vs_currency: currency,
          ids: coinIds,
          order: sortOrder,
          per_page: perPage,
          page: 1,
          sparkline: false,
        },
      });

      await setCache(cacheKey, response.data);
      return response.data;
    }

    // Regular list fetch
    const response = await apiClient.get('/coins/markets', {
      params: {
        vs_currency: currency,
        category: category || undefined,
        order: sortOrder,
        per_page: perPage,
        page,
        sparkline: false,
      },
    });

    await setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    // On error, try to return stale cache
    const staleCache = await getCached<Cryptocurrency[]>(cacheKey);
    if (staleCache) {
      console.log('Returning stale cache due to error');
      return staleCache;
    }
    handleApiError(error);
  }
}

// Fetch single cryptocurrency details
export async function fetchCryptoDetails(
  coinId: string,
  useCache: boolean = true
): Promise<CryptoDetails> {
  const cacheKey = `${CACHE_KEYS.COIN_DETAILS}${coinId}`;

  if (useCache) {
    const cached = await getCached<CryptoDetails>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await apiClient.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });

    const data: CryptoDetails = {
      id: response.data.id,
      symbol: response.data.symbol,
      name: response.data.name,
      image: response.data.image?.large || '',
      current_price: response.data.market_data?.current_price?.usd || 0,
      market_cap: response.data.market_data?.market_cap?.usd || 0,
      market_cap_rank: response.data.market_cap_rank || 0,
      fully_diluted_valuation: response.data.market_data?.fully_diluted_valuation?.usd || null,
      total_volume: response.data.market_data?.total_volume?.usd || 0,
      high_24h: response.data.market_data?.high_24h?.usd || 0,
      low_24h: response.data.market_data?.low_24h?.usd || 0,
      price_change_24h: response.data.market_data?.price_change_24h || 0,
      price_change_percentage_24h: response.data.market_data?.price_change_percentage_24h || 0,
      market_cap_change_24h: response.data.market_data?.market_cap_change_24h || 0,
      market_cap_change_percentage_24h: response.data.market_data?.market_cap_change_percentage_24h || 0,
      circulating_supply: response.data.market_data?.circulating_supply || 0,
      total_supply: response.data.market_data?.total_supply || null,
      max_supply: response.data.market_data?.max_supply || null,
      ath: response.data.market_data?.ath?.usd || 0,
      ath_change_percentage: response.data.market_data?.ath_change_percentage?.usd || 0,
      ath_date: response.data.market_data?.ath_date?.usd || '',
      atl: response.data.market_data?.atl?.usd || 0,
      atl_change_percentage: response.data.market_data?.atl_change_percentage?.usd || 0,
      atl_date: response.data.market_data?.atl_date?.usd || '',
      last_updated: response.data.last_updated || '',
      description: response.data.description,
      links: response.data.links,
      market_data: response.data.market_data,
    };

    await setCache(cacheKey, data);
    return data;
  } catch (error) {
    const staleCache = await getCached<CryptoDetails>(cacheKey);
    if (staleCache) {
      return staleCache;
    }
    handleApiError(error);
  }
}

// Clear all cache
export async function clearCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith('cache_'));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.warn('Cache clear error:', error);
  }
}
