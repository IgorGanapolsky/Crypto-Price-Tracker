// Ad banner component with placeholder for monetization

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface AdBannerProps {
  visible: boolean;
  size?: 'banner' | 'large';
}

export const AdBanner: React.FC<AdBannerProps> = ({
  visible,
  size = 'banner',
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const { width } = Dimensions.get('window');
  const bannerHeight = size === 'banner' ? 50 : 100;

  const styles = StyleSheet.create({
    container: {
      width: width - 32,
      height: bannerHeight,
      backgroundColor: theme.surface,
      borderRadius: 8,
      marginHorizontal: 16,
      marginVertical: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      borderStyle: 'dashed',
    },
    text: {
      color: theme.text,
      fontSize: 12,
      opacity: 0.6,
      textAlign: 'center',
    },
    subtitle: {
      color: theme.text,
      fontSize: 10,
      opacity: 0.4,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        📱 Ad Space Available
      </Text>
      <Text style={styles.subtitle}>
        Replace with AdMob banner for monetization
      </Text>
    </View>
  );
};