// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Tipos de navegación y proveedores
import { RootStackParamList } from './src/models/types';
import { FontProvider } from './src/components/core/FontProvider';
import { AssetProvider } from './src/context/AssetContext';

// 2. Pantallas y navegadores del flujo de juego
import { MenuDrawerNavigator } from './src/navigation/MenuDrawerNavigator';
import { MainMenuScreen } from './src/screens/MainMenuScreen';
import { OperatorRegistrationScreen } from './src/screens/OperatorRegistrationScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WeeklyIntroScreen } from './src/screens/WeeklyIntroScreen';
import { DailyIntroScreen } from './src/screens/DailyIntroScreen';
import { ShiftScreen } from './src/screens/ShiftScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <FontProvider>
      <AssetProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="MenuDrawer"
            screenOptions={{
              headerShown: false, // Inmersión cinematográfica completa
              animation: 'fade', // Transición de suspenso con fundido oscuro
            }}
          >
            {/* 1. NAVEGADOR DE CAJÓN (DRAWER) COMO RAÍZ PRINCIPAL */}
            <Stack.Screen name="MenuDrawer" component={MenuDrawerNavigator} />

            {/* 2. PANTALLA DE REGISTRO / FORMULARIO CON VALIDACIONES (SEMANA 4) */}
            <Stack.Screen name="OperatorRegistration" component={OperatorRegistrationScreen} />

            {/* 3. RUTAS DE LA PILA DE NAVEGACIÓN (STACK) */}
            <Stack.Screen name="MainMenu" component={MainMenuScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="WeeklyIntro" component={WeeklyIntroScreen} />
            <Stack.Screen name="DailyIntro" component={DailyIntroScreen} />
            <Stack.Screen name="GameInterface" component={ShiftScreen} />
            <Stack.Screen name="Shift" component={ShiftScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AssetProvider>
    </FontProvider>
  );
}