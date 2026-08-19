// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Tipos de navegación y proveedor modular de fuentes
import { RootStackParamList } from './src/models/types';
import { FontProvider } from './src/components/core/FontProvider';

// 2. Pantallas del flujo de juego
import { MainMenuScreen } from './src/screens/MainMenuScreen';
import { WeeklyIntroScreen } from './src/screens/WeeklyIntroScreen';
import { DailyIntroScreen } from './src/screens/DailyIntroScreen';
import { ShiftScreen } from './src/screens/ShiftScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <FontProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainMenu"
          screenOptions={{
            headerShown: false, // Inmersión cinematográfica completa
            animation: 'fade', // Transición de suspenso con fundido oscuro
          }}
        >
          {/* ORDEN DE LA PILA DE NAVEGACIÓN */}
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="WeeklyIntro" component={WeeklyIntroScreen} />
          <Stack.Screen name="DailyIntro" component={DailyIntroScreen} />
          <Stack.Screen name="GameInterface" component={ShiftScreen} />
          <Stack.Screen name="Shift" component={ShiftScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FontProvider>
  );
}