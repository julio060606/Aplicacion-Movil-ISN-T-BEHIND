// App.tsx
import React from 'react';
import { View } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Tipos de navegación y proveedores de sistema
import { RootStackParamList } from './src/models/types';
import { FontProvider } from './src/components/core/FontProvider';
import { MenuThemeProvider } from './src/context/MenuThemeContext';

// 2. Pantallas del menú principal y pre-juego
import { MenuDrawerNavigator } from './src/navigation/MenuDrawerNavigator';
import { MainMenuScreen } from './src/screens/MainMenuScreen';
import { StorySaveSelectScreen } from './src/screens/StorySaveSelectScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ExtrasScreen } from './src/screens/ExtrasScreen';

// 3. Pantallas de flujo de juego
import { OperatorRegistrationScreen } from './src/screens/OperatorRegistrationScreen';
import { WeeklyIntroScreen } from './src/screens/WeeklyIntroScreen';
import { DailyIntroScreen } from './src/screens/DailyIntroScreen';
import { ShiftScreen } from './src/screens/ShiftScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#0C0C0C' }}>
      <NavigationContainer
        theme={{
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: '#0C0C0C',
            card: '#0C0C0C',
          },
        }}
      >
        <Stack.Navigator
          initialRouteName="MenuDrawer"
          screenOptions={{
            headerShown: false,
            animation: 'none',
            contentStyle: { backgroundColor: '#0C0C0C' },
          }}
        >
          {/* ── DRAWER RAÍZ (menú lateral, pantalla inicial) ── */}
          <Stack.Screen name="MenuDrawer" component={MenuDrawerNavigator} />

          {/* ── PRE-JUEGO: MENÚ Y SUBPANTALLAS ── */}
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="StorySaveSelect" component={StorySaveSelectScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Extras" component={ExtrasScreen} />

          {/* ── FLUJO DE JUEGO ── */}
          <Stack.Screen name="OperatorRegistration" component={OperatorRegistrationScreen} />
          <Stack.Screen name="WeeklyIntro" component={WeeklyIntroScreen} />
          <Stack.Screen name="DailyIntro" component={DailyIntroScreen} />
          <Stack.Screen name="GameInterface" component={ShiftScreen} />
          <Stack.Screen name="Shift" component={ShiftScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <FontProvider>
      <MenuThemeProvider>
        <RootNavigation />
      </MenuThemeProvider>
    </FontProvider>
  );
}