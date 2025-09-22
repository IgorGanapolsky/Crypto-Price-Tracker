// Home screen displaying cryptocurrency prices with refresh functionality

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Header } from '../components/Header';
import { CoinCard } from '../components/CoinCard';
import { AdBanner } from '../components/AdBanner';
import { useTheme } from '../hooks/useTheme';
import { useCoinData } from '../hooks/useCoinData';
import { RootStackParamList } from '../utils/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const {
    coinData,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refreshData,
    adsEnabled,
  } = useCoinData();

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleRefresh = async () => {
    try {
      await refreshData();
    } catch (err) {
      Alert.alert(
        'Refresh Failed',
        'Unable to refresh prices. Please check your internet connection.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    return `${Math.floor(diffSecs / 3600)}h ago`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    scrollContainer: {
      paddingBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    loadingText: {
      color: theme.text,
      fontSize: 16,
      marginTop: 16,
      textAlign: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    errorText: {
      color: '#EF4444',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyText: {
      color: theme.text,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 16,
      opacity: 0.7,
    },
    settingsButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    settingsButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    lastUpdatedContainer: {
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    lastUpdatedText: {
      color: theme.text,
      fontSize: 12,
      opacity: 0.6,
    },
    refreshButton: {
      padding: 8,
    },
  });

  const HeaderRightComponent = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={isRefreshing}
        accessibilityLabel="Refresh prices"
        accessibilityRole="button"
      >
        <Ionicons
          name="refresh"
          size={24}
          color={theme.text}
          style={{
            opacity: isRefreshing ? 0.5 : 1,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleSettingsPress}
        accessibilityLabel="Open settings"
        accessibilityRole="button"
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color={theme.text}
        />
      </TouchableOpacity>
    </View>
  );

  if (isLoading && coinData.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Header
          title="Crypto Tracker"
          rightComponent={<HeaderRightComponent />}
        />
        <View style={styles.loadingContainer}>
          <Ionicons
            name="refresh"
            size={48}
            color={theme.primary}
          />
          <Text style={styles.loadingText}>
            Loading cryptocurrency prices...
          </Text>
        </View>
      </View>
    );
  }

  if (error && coinData.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Header
          title="Crypto Tracker"
          rightComponent={<HeaderRightComponent />}
        />
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color="#EF4444"
          />
          <Text style={styles.errorText}>
            {error}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRefresh}
          >
            <Text style={styles.retryButtonText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (coinData.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Header
          title="Crypto Tracker"
          rightComponent={<HeaderRightComponent />}
        />
        <View style={styles.emptyContainer}>
          <Ionicons
            name="add-circle-outline"
            size={48}
            color={theme.primary}
          />
          <Text style={styles.emptyText}>
            No cryptocurrencies selected.{'\n'}
            Add some coins to start tracking!
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <Text style={styles.settingsButtonText}>
              Add Coins
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Header
        title="Crypto Tracker"
        rightComponent={<HeaderRightComponent />}
      />
      
      <View style={styles.lastUpdatedContainer}>
        <Text style={styles.lastUpdatedText}>
          Last updated: {formatLastUpdated(lastUpdated)}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top ad banner */}
        <AdBanner visible={adsEnabled} size="banner" />

        {/* Coin list */}
        {coinData.map((coin, index) => (
          <CoinCard
            key={coin.id}
            coin={coin}
          />
        ))}

        {/* Bottom ad banner if more than 3 coins */}
        {coinData.length > 3 && (
          <AdBanner visible={adsEnabled} size="large" />
        )}
      </ScrollView>
    </View>
  );
};