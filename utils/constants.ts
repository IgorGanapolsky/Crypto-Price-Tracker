// App constants and configuration

export const DEFAULT_COINS = ['bitcoin', 'ethereum', 'solana'];

export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const STORAGE_KEYS = {
  SELECTED_COINS: '@crypto_tracker_selected_coins',
  THEME: '@crypto_tracker_theme',
  ADS_ENABLED: '@crypto_tracker_ads_enabled',
} as const;

export const REFRESH_INTERVAL = 30000; // 30 seconds

export const LIGHT_THEME = {
  primary: '#6200EE',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#000000',
  border: '#E0E0E0',
  card: '#FFFFFF',
};

export const DARK_THEME = {
  primary: '#BB86FC',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  border: '#333333',
  card: '#1E1E1E',
};

export const AD_UNIT_IDS = {
  BANNER: __DEV__ 
    ? 'ca-app-pub-3940256099942544/6300978111' // Test ad unit
    : 'YOUR_PRODUCTION_BANNER_AD_UNIT_ID',
};

// Popular cryptocurrencies for search suggestions
export const POPULAR_COINS = [
  'bitcoin',
  'ethereum',
  'solana',
  'cardano',
  'polkadot',
  'chainlink',
  'litecoin',
  'bitcoin-cash',
  'stellar',
  'dogecoin',
];