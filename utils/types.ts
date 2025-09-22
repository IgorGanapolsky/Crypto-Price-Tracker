// Core data types for the crypto tracker app

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

export interface CoinApiResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
  };
}

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
  };
}

export interface UserSettings {
  selectedCoins: string[];
  theme: 'light' | 'dark';
  adsEnabled: boolean;
}

export interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  card: string;
}