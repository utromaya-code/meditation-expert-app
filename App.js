import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Context
import { AppProvider } from './src/context/AppContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PracticesScreen from './src/screens/PracticesScreen';
import PracticeDetailScreen from './src/screens/PracticeDetailScreen';
import ProgramScreen from './src/screens/ProgramScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import JournalScreen from './src/screens/JournalScreen';
import JournalHistoryScreen from './src/screens/JournalHistoryScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import MeditationSetupScreen from './src/screens/MeditationSetupScreen';

// Theme
const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#d4af37',
    background: '#0a0a0f',
    card: '#12121a',
    text: '#f0f0f5',
    border: 'rgba(212, 175, 55, 0.1)',
    notification: '#d4af37',
  },
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Главная') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Практики') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Программа') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Профиль') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#d4af37',
        tabBarInactiveTintColor: '#6a6a7a',
        tabBarStyle: {
          backgroundColor: '#12121a',
          borderTopColor: 'rgba(212, 175, 55, 0.1)',
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Главная" component={HomeScreen} />
      <Tab.Screen name="Практики" component={PracticesScreen} />
      <Tab.Screen name="Программа" component={ProgramScreen} />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NavigationContainer theme={DarkTheme}>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0a0a0f' },
            }}
          >
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="PracticeDetail" 
              component={PracticeDetailScreen}
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="Player" 
              component={PlayerScreen}
              options={{
                presentation: 'fullScreenModal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="Subscription" 
              component={SubscriptionScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="Statistics" 
              component={StatisticsScreen}
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="Journal" 
              component={JournalScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="JournalHistory" 
              component={JournalHistoryScreen}
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="Achievements" 
              component={AchievementsScreen}
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="MeditationSetup" 
              component={MeditationSetupScreen}
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
