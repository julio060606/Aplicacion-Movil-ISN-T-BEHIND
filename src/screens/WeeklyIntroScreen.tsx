// src/screens/WeeklyIntroScreen.tsx
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { ScreenDelay } from '../components/ui/ScreenDelay';
import { TerminalMailView } from '../components/terminal/TerminalMailView';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyIntro'>;

// Contenido acotado y dividido para no saturar la pantalla y dejar espacio inferior
const WEEK_1_PAGES = [
  // Página 1: Concesión ratificada
  'Estimado Sr. Aris:\n\nNos complace ratificar que sus credenciales corporativas han sido aprobadas.\n\nA traves de su gestion personal, se le ha otorgado la concesion exclusiva del puesto comercial en el Cuadrante 4 de Portwall.\n\nSu personal de mostrador queda formalmente autorizado.',

  // Página 2: Directivas operativas breves
  'DIRECTIVAS PARA EL OPERARIO:\n\n1. Apertura estricta a las 12:00 PM. El toque de queda inicia a las 00:00 AM.\n2. Verifique identificacion civil y comanda de cada visitante sin excepcion.\n3. Todo faltante acarreara sanciones de Clase A y la cancelacion de su estadia.\n\nCumpla con su labor.',
];

export const WeeklyIntroScreen: React.FC<Props> = ({ navigation, route }) => {
  const weekNumber = route.params?.weekNumber ?? 1;

  const handleMailComplete = () => {
    // Avanza a la pantalla de Radio y Día correspondiente
    const dayNumber = (weekNumber - 1) * 7 + 1;
    navigation.navigate('DailyIntro', { dayNumber });
  };

  return (
    <ScreenDelay delay={500} backgroundColor="#0C0C0C">
      <View style={styles.screen}>
        <StatusBar hidden />

        <TerminalMailView
          from="DIR_LOGISTICA@STRATTON-TATE.CORP"
          to="M. ARIS // CONCESIONARIO #402"
          date="10/11/2004 - 08:30:14"
          subject="RATIFICACION DE CONCESION // SECTOR 4"
          refCode={`CST-ORD-WEEK-${weekNumber}`}
          pages={WEEK_1_PAGES}
          onComplete={handleMailComplete}
        />
      </View>
    </ScreenDelay>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0C0C0C', // Fondo 0C0C0C solicitado
  },
});