# CryptoTracker - React Native Mobile App

A cryptocurrency tracking mobile application built with React Native, Expo, and TypeScript. This app fetches real-time cryptocurrency data from the CoinGecko API and provides a clean, intuitive interface for browsing and tracking crypto prices.

## Project Overview

CryptoTracker is a full-featured mobile application that allows users to:
- Browse cryptocurrency prices and market data
- Filter by categories (DeFi, NFT, Gaming, etc.)
- Search for specific cryptocurrencies
- Sort by various criteria (market cap, price, volume)
- Save favorite coins for quick access
- Customize display preferences (currency, font size, theme)

## API Used

**CoinGecko API** (Free, no API key required)
- Base URL: `https://api.coingecko.com/api/v3`

### Endpoints Used:
| Endpoint | Purpose |
|----------|---------|
| `/coins/markets` | Fetch list of cryptocurrencies with market data |
| `/coins/{id}` | Fetch detailed information for a specific coin |
| `/search` | Search cryptocurrencies by name or symbol |

## Technology Stack

- **Framework**: React Native with Expo SDK 50
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State Management**: React Context API
- **Persistence**: AsyncStorage
- **HTTP Client**: Axios
- **Icons**: @expo/vector-icons (Ionicons)

## Project Structure

```
/
├── App.tsx                          # Main app entry point
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── app.json                         # Expo configuration
├── babel.config.js                  # Babel configuration
└── src/
    ├── components/                  # Reusable UI components
    │   ├── CryptoCard.tsx          # Cryptocurrency list item
    │   ├── SearchBar.tsx           # Search input component
    │   ├── CategorySelector.tsx    # Category filter chips
    │   ├── SortSelector.tsx        # Sort options modal
    │   ├── LoadingIndicator.tsx    # Loading state component
    │   ├── ErrorView.tsx           # Error state component
    │   ├── EmptyState.tsx          # Empty state component
    │   ├── SettingsItem.tsx        # Settings list item
    │   └── index.ts                # Component exports
    ├── screens/                     # App screens
    │   ├── HomeScreen.tsx          # Main cryptocurrency list
    │   ├── DetailsScreen.tsx       # Coin details view
    │   ├── FavoritesScreen.tsx     # Saved favorites list
    │   ├── SettingsScreen.tsx      # App settings
    │   └── index.ts                # Screen exports
    ├── context/                     # React Context providers
    │   ├── SettingsContext.tsx     # App settings state
    │   ├── ThemeContext.tsx        # Theme management
    │   ├── FavoritesContext.tsx    # Favorites management
    │   └── index.ts                # Context exports
    ├── services/                    # API and external services
    │   └── api.ts                  # CoinGecko API client
    ├── hooks/                       # Custom React hooks
    │   ├── useDebounce.ts          # Debounce hook
    │   └── useCryptoData.ts        # Crypto data fetching hook
    ├── navigation/                  # Navigation configuration
    │   └── index.tsx               # Stack and tab navigators
    ├── theme/                       # Theming system
    │   └── index.ts                # Colors, typography, spacing
    └── types/                       # TypeScript type definitions
        └── index.ts                # Shared types and interfaces
```

## Requirements Mapping

### 1. API Usage (20%)
**Location**: `src/services/api.ts`
- Fetches cryptocurrency data from CoinGecko API
- Implements loading, error, and success states
- Includes response caching for offline support
- Proper error handling with user-friendly messages

### 2. Displaying Information (20%)
**Location**: `src/screens/HomeScreen.tsx`, `src/components/CryptoCard.tsx`
- Displays cryptocurrency list with:
  - Coin icon, name, and symbol
  - Current price in selected currency
  - 24-hour price change (with color coding)
  - Market cap and ranking
- Detail view shows comprehensive market statistics

### 3. Browsing/Switching Information (20%)
**Location**: `src/screens/HomeScreen.tsx`, `src/components/`
Multiple navigation methods implemented:
1. **Category Filter** (`CategorySelector.tsx`): Horizontal scrollable chips (All, DeFi, NFT, Gaming, Layer 1/2, Meme, Stablecoins)
2. **Sort Options** (`SortSelector.tsx`): Modal with sorting by market cap, price, volume, or name
3. **Search Bar** (`SearchBar.tsx`): Real-time search with debouncing
4. **Pagination**: Infinite scroll with "load more" functionality
5. **Pull-to-refresh**: Refresh data with swipe gesture
6. **Bottom Tabs**: Navigation between Market, Favorites, and Settings

### 4. App Settings (10%)
**Location**: `src/screens/SettingsScreen.tsx`, `src/context/SettingsContext.tsx`
- **Currency Selection**: Choose display currency (USD, EUR, GBP, JPY, BTC)
- **Default Category**: Set preferred category on app launch
- Settings persist using AsyncStorage and survive app restart

### 5. Font Size + Theme Selection (10%)
**Location**: `src/screens/SettingsScreen.tsx`, `src/theme/index.ts`
- **Font Size**: Three options (Small, Medium, Large)
- **Theme Toggle**: Light and Dark mode
- Changes apply immediately throughout the app
- Settings persist across app restarts

### 6. Nice & Convenient UI Design (20%)
**Implemented throughout the app**:
- Consistent spacing and typography scale
- Card-based design with shadows
- Color-coded price changes (green/red)
- Loading spinners and skeleton states
- Empty states with helpful messages
- Error states with retry buttons
- Smooth animations and transitions
- Proper touch targets (48x48 minimum)
- Pull-to-refresh with native feel
- Modal sheets for option selection

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Install Dependencies
```bash
# Navigate to project directory
cd Mobilerakendus

# Install dependencies
npm install
```

### Run the App
```bash
# Start Expo development server
npm start

# Or run on specific platform
npm run android    # Android
npm run ios        # iOS (macOS only)
npm run web        # Web browser
```

### Testing on Device
1. Install **Expo Go** app on your phone
2. Scan the QR code shown in the terminal
3. The app will load on your device

## Where Settings Are Stored

Settings are persisted using `@react-native-async-storage/async-storage`:

| Setting | Storage Key | Location |
|---------|-------------|----------|
| Currency, Font Size, Theme, Category | `@cryptotracker_settings` | `src/context/SettingsContext.tsx` |
| Favorite Coins | `@cryptotracker_favorites` | `src/context/FavoritesContext.tsx` |
| API Cache | `cache_*` | `src/services/api.ts` |

## Grading Checklist

| Criterion | Weight | Implementation |
|-----------|--------|----------------|
| **API Usage** | 20% | CoinGecko API with loading/error states, caching (`src/services/api.ts`) |
| **Displaying Info** | 20% | Crypto list with prices, icons, changes, market cap (`HomeScreen.tsx`, `CryptoCard.tsx`) |
| **Browsing/Switching** | 20% | Categories, sorting, search, pagination, tabs (`CategorySelector.tsx`, `SortSelector.tsx`, `SearchBar.tsx`) |
| **Nice UI Design** | 20% | Cards, spacing, colors, loading states, empty states, error handling |
| **App Settings** | 10% | Currency and default category saved persistently (`SettingsScreen.tsx`) |
| **Font Size + Theme** | 10% | 3 font sizes + light/dark toggle with immediate effect (`SettingsScreen.tsx`, `ThemeContext.tsx`) |

## Features Summary

- Real-time cryptocurrency prices and market data
- Category-based filtering (DeFi, NFT, Gaming, etc.)
- Multiple sorting options
- Debounced search functionality
- Infinite scroll pagination
- Pull-to-refresh
- Favorites system
- Detailed coin view with statistics
- Persistent settings (currency, font size, theme, category)
- Light and dark theme support
- Responsive font sizing
- Offline cache support
- Error handling with retry option
- Empty state displays

## Screenshots

*[Add screenshots here after running the app]*

### Home Screen
- Cryptocurrency list with market data
- Category chips and sort button
- Search bar

### Details Screen
- Coin information and statistics
- Price range indicator
- Market data grid

### Settings Screen
- Theme toggle
- Font size selector
- Currency picker
- Default category selection

### Favorites Screen
- Saved cryptocurrencies
- Quick access to favorites

---

Built with React Native + Expo + TypeScript
