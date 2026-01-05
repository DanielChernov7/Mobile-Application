// Cryptocurrency data types from CoinGecko API
export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CryptoDetails extends Cryptocurrency {
  description?: {
    en: string;
  };
  links?: {
    homepage: string[];
    blockchain_site: string[];
  };
  market_data?: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
  };
}

// Category type
export interface Category {
  id: string;
  name: string;
}

// Settings types
export type Currency = 'usd' | 'eur' | 'gbp' | 'jpy' | 'btc';
export type FontSize = 'small' | 'medium' | 'large';
export type ThemeMode = 'light' | 'dark';
export type SortOrder = 'market_cap_desc' | 'market_cap_asc' | 'price_desc' | 'price_asc' | 'volume_desc' | 'name_asc';

export interface AppSettings {
  currency: Currency;
  fontSize: FontSize;
  theme: ThemeMode;
  defaultCategory: string;
}

// API response types
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  Details: { cryptoId: string; cryptoName: string };
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};

// Currency display info
export const CURRENCY_INFO: Record<Currency, { symbol: string; name: string }> = {
  usd: { symbol: '$', name: 'US Dollar' },
  eur: { symbol: '€', name: 'Euro' },
  gbp: { symbol: '£', name: 'British Pound' },
  jpy: { symbol: '¥', name: 'Japanese Yen' },
  btc: { symbol: '₿', name: 'Bitcoin' },
};

// Sort options
export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'market_cap_desc', label: 'Market Cap ↓' },
  { value: 'market_cap_asc', label: 'Market Cap ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'volume_desc', label: 'Volume ↓' },
  { value: 'name_asc', label: 'Name A-Z' },
];

// Categories for filtering
export const CATEGORIES: Category[] = [
  { id: '', name: 'All' },
  { id: 'decentralized-finance-defi', name: 'DeFi' },
  { id: 'non-fungible-tokens-nft', name: 'NFT' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'layer-1', name: 'Layer 1' },
  { id: 'layer-2', name: 'Layer 2' },
  { id: 'meme-token', name: 'Meme' },
  { id: 'stablecoins', name: 'Stablecoins' },
];
