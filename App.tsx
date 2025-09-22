// Main App component - Entry point for the Crypto Tracker app
// This is a production-ready React Native template for crypto price tracking
// Built for micro-SaaS deployment on platforms like Gumroad and CodeCanyon

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

/* 
 * CUSTOMIZATION GUIDE FOR BUYERS:
 * 
 * 1. API Configuration:
 *    - Update utils/constants.ts to modify refresh intervals and default coins
 *    - Replace CoinGecko API with your preferred crypto data provider in utils/api.ts
 * 
 * 2. Monetization:
 *    - Replace ad placeholders in components/AdBanner.tsx with real AdMob banners
 *    - Update AD_UNIT_IDS in utils/constants.ts with your AdMob units
 *    - Consider adding premium features or subscription model
 * 
 * 3. Branding:
 *    - Update app.json with your app name, description, and icons
 *    - Modify color scheme in utils/constants.ts (LIGHT_THEME, DARK_THEME)
 *    - Replace logo and splash screen assets
 * 
 * 4. Features Enhancement:
 *    - Add price alerts in hooks/useCoinData.ts
 *    - Implement portfolio tracking functionality
 *    - Add news feed integration
 *    - Include price charts using react-native-chart-kit
 * 
 * 5. Backend Integration:
 *    - Add user authentication for cloud sync
 *    - Implement push notifications for price alerts
 *    - Add analytics tracking for user behavior
 * 
 * 6. Performance Optimization:
 *    - Implement caching strategy in utils/api.ts
 *    - Add error boundaries for better error handling
 *    - Optimize images and reduce bundle size
 */