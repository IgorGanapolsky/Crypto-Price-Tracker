// Reusable coin card component for displaying cryptocurrency data

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { CoinData } from '../utils/types';

interface CoinCardProps {
  coin: CoinData;
  onRemove?: (coinId: string) => void;
  showRemoveButton?: boolean;
}

export const CoinCard: React.FC<CoinCardProps> = ({
  coin,
  onRemove,
  showRemoveButton = false,
}) => {
  const { theme } = useTheme();

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    }
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatPercentageChange = (change: number) => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change.toFixed(2)}%`;
  };

  const isPositiveChange = coin.price_change_percentage_24h >= 0;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    coinInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    coinImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
    },
    coinDetails: {
      flex: 1,
    },
    coinName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    coinSymbol: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
    },
    removeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.surface,
    },
    priceSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    price: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
    },
    priceChange: {
      fontSize: 14,
      fontWeight: '600',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    positiveChange: {
      color: '#10B981',
      backgroundColor: '#D1FAE5',
    },
    negativeChange: {
      color: '#EF4444',
      backgroundColor: '#FEE2E2',
    },
    marketCapRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    marketCapLabel: {
      fontSize: 12,
      color: theme.text,
      opacity: 0.6,
    },
    marketCapValue: {
      fontSize: 12,
      color: theme.text,
      opacity: 0.8,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.coinInfo}>
          <Image
            source={{ uri: coin.image }}
            style={styles.coinImage}
            accessibilityLabel={`${coin.name} logo`}
          />
          <View style={styles.coinDetails}>
            <Text style={styles.coinName} numberOfLines={1}>
              {coin.name}
            </Text>
            <Text style={styles.coinSymbol}>
              {coin.symbol}
            </Text>
          </View>
        </View>
        {showRemoveButton && onRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(coin.id)}
            accessibilityLabel={`Remove ${coin.name} from tracking`}
            accessibilityRole="button"
          >
            <Ionicons
              name="close"
              size={16}
              color={theme.text}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.price}>
          {formatPrice(coin.current_price)}
        </Text>
        <Text
          style={[
            styles.priceChange,
            isPositiveChange ? styles.positiveChange : styles.negativeChange,
          ]}
        >
          {formatPercentageChange(coin.price_change_percentage_24h)}
        </Text>
      </View>

      <View style={styles.marketCapRow}>
        <Text style={styles.marketCapLabel}>
          Market Cap
        </Text>
        <Text style={styles.marketCapValue}>
          {formatMarketCap(coin.market_cap)}
        </Text>
      </View>
    </View>
  );
};