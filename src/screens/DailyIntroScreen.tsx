// src/screens/DailyIntroScreen.tsx
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { ScreenDelay } from '../components/ui/ScreenDelay';
import { RadioBroadcastView } from '../components/radio/RadioBroadcastView';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyIntro'>;

const DAY_1_PAGES = [
  'Atencion ciudadanos de Portwall.\n\nLa red de transmision del C.S.T. informa que el toque de queda comenzara puntual a las 00:00 HORAS.\n\nTodo transito no autorizado en el Sector 4 sera sancionado.',
  'Reporten cualquier anomalia quimica o sintoma de mareo a los agentes en patrulla.\n\nEl suministro en mostrador queda formalmente habilitado.\n\nCumpla con su jornada.',
];

export const DailyIntroScreen: React.FC<Props> = ({ navigation, route }) => {
  const dayNumber = route.params?.dayNumber ?? 1;

  const handleStartShift = () => {
    // Transición directa al turno de trabajo sobre fondo #0C0C0C
    navigation.navigate('GameInterface', { currentDay: dayNumber });
  };

  return (
    <ScreenDelay delay={500} backgroundColor="#0C0C0C">
      <View style={styles.screen}>
        <StatusBar hidden />

        <RadioBroadcastView
          pages={DAY_1_PAGES}
          dayNumber={dayNumber}
          onStartShift={handleStartShift}
        />
      </View>
    </ScreenDelay>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0C0C0C', // Fondo 0C0C0C permanente
  },
});