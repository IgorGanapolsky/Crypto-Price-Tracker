// Custom hook for managing cryptocurrency data and user settings

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCoinPrices, searchCoins } from '../utils/api';
import { STORAGE_KEYS, DEFAULT_COINS, REFRESH_INTERVAL } from '../utils/constants';
import { CoinData, SearchCoin, UserSettings } from '../utils/types';

export const useCoinData = () => {
  const [coinData, setCoinData] = useState<CoinData[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<string[]>(DEFAULT_COINS);
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load user settings from storage on app start
  useEffect(() => {
    loadUserSettings();
  }, []);

  // Fetch coin data when selected coins change
  useEffect(() => {
    if (selectedCoins.length > 0) {
      fetchData();
    }
  }, [selectedCoins]);

  // Set up auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedCoins.length > 0) {
        refreshData();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedCoins]);

  const loadUserSettings = async () => {
    try {
      const [savedCoins, savedAdsEnabled] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_COINS),
        AsyncStorage.getItem(STORAGE_KEYS.ADS_ENABLED),
      ]);

      if (savedCoins) {
        const parsedCoins = JSON.parse(savedCoins);
        setSelectedCoins(parsedCoins.length > 0 ? parsedCoins : DEFAULT_COINS);
      }

      if (savedAdsEnabled !== null) {
        setAdsEnabled(JSON.parse(savedAdsEnabled));
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      setSelectedCoins(DEFAULT_COINS);
    }
  };

  const fetchData = async () => {
    try {
      setError(null);
      const data = await fetchCoinPrices(selectedCoins);
      setCoinData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
  }, [selectedCoins]);

  const addCoin = async (coinId: string) => {
    try {
      if (!selectedCoins.includes(coinId)) {
        const newSelectedCoins = [...selectedCoins, coinId];
        setSelectedCoins(newSelectedCoins);
        await AsyncStorage.setItem(
          STORAGE_KEYS.SELECTED_COINS,
          JSON.stringify(newSelectedCoins)
        );
      }
    } catch (error) {
      console.error('Error adding coin:', error);
    }
  };

  const removeCoin = async (coinId: string) => {
    try {
      const newSelectedCoins = selectedCoins.filter(id => id !== coinId);
      // Ensure at least one coin remains
      if (newSelectedCoins.length === 0) {
        newSelectedCoins.push(DEFAULT_COINS[0]);
      }
      setSelectedCoins(newSelectedCoins);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_COINS,
        JSON.stringify(newSelectedCoins)
      );
      
      // Update coin data to remove the deleted coin
      setCoinData(prev => prev.filter(coin => coin.id !== coinId));
    } catch (error) {
      console.error('Error removing coin:', error);
    }
  };

  const toggleAds = async () => {
    try {
      const newAdsEnabled = !adsEnabled;
      setAdsEnabled(newAdsEnabled);
      await AsyncStorage.setItem(
        STORAGE_KEYS.ADS_ENABLED,
        JSON.stringify(newAdsEnabled)
      );
    } catch (error) {
      console.error('Error toggling ads:', error);
    }
  };

  const searchForCoins = async (query: string): Promise<SearchCoin[]> => {
    try {
      return await searchCoins(query);
    } catch (error) {
      console.error('Error searching coins:', error);
      return [];
    }
  };

  const resetToDefaults = async () => {
    try {
      setSelectedCoins(DEFAULT_COINS);
      setAdsEnabled(true);
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.SELECTED_COINS,
          JSON.stringify(DEFAULT_COINS)
        ),
        AsyncStorage.setItem(STORAGE_KEYS.ADS_ENABLED, JSON.stringify(true)),
      ]);
    } catch (error) {
      console.error('Error resetting to defaults:', error);
    }
  };

  return {
    coinData,
    selectedCoins,
    adsEnabled,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refreshData,
    addCoin,
    removeCoin,
    toggleAds,
    searchForCoins,
    resetToDefaults,
  };
};