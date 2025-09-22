// CoinGecko API service for fetching cryptocurrency data

import axios from 'axios';
import { COINGECKO_BASE_URL } from './constants';
import { CoinData, CoinDetails, SearchCoin } from './types';

const api = axios.create({
  baseURL: COINGECKO_BASE_URL,
  timeout: 10000,
});

/**
 * Fetch current prices for multiple cryptocurrencies
 * @param coinIds Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
 * @returns Promise<CoinData[]>
 */
export const fetchCoinPrices = async (coinIds: string[]): Promise<CoinData[]> => {
  try {
    const idsString = coinIds.join(',');
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: idsString,
        order: 'market_cap_desc',
        per_page: coinIds.length,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h',
      },
    });

    return response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      image: coin.image,
    }));
  } catch (error) {
    console.error('Error fetching coin prices:', error);
    throw new Error('Failed to fetch cryptocurrency prices');
  }
};

/**
 * Search for cryptocurrencies by name or symbol
 * @param query Search query string
 * @returns Promise<SearchCoin[]>
 */
export const searchCoins = async (query: string): Promise<SearchCoin[]> => {
  try {
    const response = await api.get('/search', {
      params: { query },
    });

    return response.data.coins.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      thumb: coin.thumb,
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    throw new Error('Failed to search cryptocurrencies');
  }
};

/**
 * Get detailed information about a specific cryptocurrency
 * @param coinId The ID of the coin
 * @returns Promise<CoinDetails>
 */
export const fetchCoinDetails = async (coinId: string): Promise<CoinDetails> => {
  try {
    const response = await api.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw new Error('Failed to fetch cryptocurrency details');
  }
};

/**
 * Check if the CoinGecko API is accessible
 * @returns Promise<boolean>
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/ping');
    return true;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};