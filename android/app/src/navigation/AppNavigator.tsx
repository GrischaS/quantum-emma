// ============================================================
//  QUANTUM EMMA — Android Navigation v4.0
//  React Native · Expo · Bottom Tabs + Stack
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';

import DashboardScreen  from '../screens/DashboardScreen';
import TradingScreen    from '../screens/TradingScreen';
import WalletScreen     from '../screens/WalletScreen';
import StakingScreen    from '../screens/StakingScreen';
import MiningScreen     from '../screens/MiningScreen';
import ChatScreen       from '../screens/ChatScreen';

const Q = {
  void:'#000008', bg1:'#06001e',
  plasma:'#7c3aed', neutrino:'#8b5cf6',
  gluon:'#06b6d4', higgs:'#fbbf24', lepton:'#4ade80',
  muon:'#fb923c', bright:'#f0f4ff', dim:'#475569',
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const QE_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Q.void,
    card: Q.bg1,
    text: Q.bright,
    border: `${Q.plasma}33`,
    primary: Q.neutrino,
  },
};

function TabIcon({ name, color, focused }: { name: string; color: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Dashboard: '📊',
    Trading:   '💹',
    Wallet:    '💼',
    Staking:   '💎',
    Mining:    '⛏',
    Chat:      '👁',
  };
  return (
    <View style={[styles.iconWrap, focused && { backgroundColor: `${color}22`, borderRadius: 10 }]}>
      <Text style={[styles.iconText, focused && { fontSize: 22 }]}>{icons[name] || '⚛️'}</Text>
    </View>
  );
}

function TabLabel({ name, color }: { name: string; color: string }) {
  return <Text style={[styles.tabLabel, { color }]}>{name}</Text>;
}

const TAB_COLORS: Record<string, string> = {
  Dashboard: Q.plasma,
  Trading:   Q.gluon,
  Wallet:    Q.neutrino,
  Staking:   Q.higgs,
  Mining:    Q.lepton,
  Chat:      Q.muon,
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#03001299',
          borderTopColor: `${Q.plasma}33`,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: TAB_COLORS[route.name] || Q.neutrino,
        tabBarInactiveTintColor: Q.dim,
        tabBarIcon: ({ color, focused }) => <TabIcon name={route.name} color={color} focused={focused}/>,
        tabBarLabel: ({ color }) => <TabLabel name={route.name} color={color}/>,
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen}/>
      <Tab.Screen name="Trading"   component={TradingScreen}/>
      <Tab.Screen name="Wallet"    component={WalletScreen}/>
      <Tab.Screen name="Staking"   component={StakingScreen}/>
      <Tab.Screen name="Mining"    component={MiningScreen}/>
      <Tab.Screen name="Chat"      component={ChatScreen}/>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={QE_THEME}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconWrap:  { width: 40, height: 32, alignItems: 'center', justifyContent: 'center' },
  iconText:  { fontSize: 20 },
  tabLabel:  { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },
});
