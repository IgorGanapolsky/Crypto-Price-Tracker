// Settings screen for coin selection, theme toggle, and app preferences

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Header } from '../components/Header';
import { CoinCard } from '../components/CoinCard';
import { useTheme } from '../hooks/useTheme';
import { useCoinData } from '../hooks/useCoinData';
import { SearchCoin } from '../utils/types';

export const Settings: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme();
  const {
    coinData,
    selectedCoins,
    adsEnabled,
    addCoin,
    removeCoin,
    toggleAds,
    searchForCoins,
    resetToDefaults,
  } = useCoinData();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchCoin[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchForCoins(query.trim());
      // Filter out already selected coins
      const filteredResults = results.filter(
        coin => !selectedCoins.includes(coin.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      Alert.alert('Search Error', 'Failed to search for cryptocurrencies');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCoin = async (coinId: string) => {
    try {
      await addCoin(coinId);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
      Alert.alert('Success', 'Cryptocurrency added to tracking list');
    } catch (error) {
      Alert.alert('Error', 'Failed to add cryptocurrency');
    }
  };

  const handleRemoveCoin = async (coinId: string) => {
    if (selectedCoins.length <= 1) {
      Alert.alert(
        'Cannot Remove',
        'You must track at least one cryptocurrency'
      );
      return;
    }

    Alert.alert(
      'Remove Cryptocurrency',
      'Are you sure you want to remove this coin from tracking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeCoin(coinId),
        },
      ]
    );
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset your coin selection and preferences to default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetToDefaults,
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    section: {
      marginVertical: 8,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
      marginTop: 2,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
      marginTop: 2,
    },
    searchContainer: {
      backgroundColor: theme.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    searchInput: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      color: theme.text,
    },
    searchResults: {
      backgroundColor: theme.card,
      maxHeight: 200,
    },
    searchResultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    searchResultImage: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 12,
    },
    searchResultInfo: {
      flex: 1,
    },
    searchResultName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
    },
    searchResultSymbol: {
      fontSize: 12,
      color: theme.text,
      opacity: 0.7,
    },
    addButton: {
      padding: 8,
    },
    loadingIndicator: {
      padding: 16,
      alignItems: 'center',
    },
    coinList: {
      paddingBottom: 20,
    },
    emptyText: {
      textAlign: 'center',
      color: theme.text,
      opacity: 0.7,
      padding: 16,
    },
    resetButton: {
      margin: 16,
      backgroundColor: '#EF4444',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    resetButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    addCoinButton: {
      padding: 8,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Header
        title="Settings"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>App Preferences</Text>
              <Text style={styles.sectionSubtitle}>
                Customize your experience
              </Text>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch between light and dark themes
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={isDark ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Show Ads</Text>
              <Text style={styles.settingDescription}>
                Support the app by showing advertisements
              </Text>
            </View>
            <Switch
              value={adsEnabled}
              onValueChange={toggleAds}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={adsEnabled ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Tracked Cryptocurrencies Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Tracked Coins</Text>
              <Text style={styles.sectionSubtitle}>
                {selectedCoins.length} coin{selectedCoins.length !== 1 ? 's' : ''} selected
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addCoinButton}
              onPress={() => setShowSearch(!showSearch)}
              accessibilityLabel="Add cryptocurrency"
              accessibilityRole="button"
            >
              <Ionicons
                name={showSearch ? "close" : "add"}
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Search Section */}
          {showSearch && (
            <>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search cryptocurrencies..."
                  placeholderTextColor={theme.text + '80'}
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {isSearching && (
                <View style={styles.loadingIndicator}>
                  <ActivityIndicator size="small" color={theme.primary} />
                </View>
              )}

              {searchResults.length > 0 && (
                <ScrollView style={styles.searchResults} nestedScrollEnabled>
                  {searchResults.map((coin) => (
                    <TouchableOpacity
                      key={coin.id}
                      style={styles.searchResultItem}
                      onPress={() => handleAddCoin(coin.id)}
                    >
                      <View style={styles.searchResultInfo}>
                        <Text style={styles.searchResultName}>
                          {coin.name}
                        </Text>
                        <Text style={styles.searchResultSymbol}>
                          {coin.symbol}
                        </Text>
                      </View>
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color={theme.primary}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                <Text style={styles.emptyText}>
                  No cryptocurrencies found for "{searchQuery}"
                </Text>
              )}
            </>
          )}

          {/* Current Coins List */}
          <View style={styles.coinList}>
            {coinData.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                onRemove={handleRemoveCoin}
                showRemoveButton={true}
              />
            ))}
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetToDefaults}
        >
          <Text style={styles.resetButtonText}>
            Reset to Defaults
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};