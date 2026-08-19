// src/screens/DailyIntroScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { colors } from '../theme/colors';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyIntro'>;

export const DailyIntroScreen = ({ navigation, route }: Props) => {
  const { dayNumber } = route.params;

  const handleStartShift = () => {
    navigation.navigate('GameInterface', { currentDay: dayNumber });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ENCABEZADO BUROCRÁTICO CST */}
      <View style={styles.headerBurocrata}>
        <Text style={styles.burocrataText}>CONSORCIO INDUSTRIAL S.T. - C.S.T.</Text>
        <Text style={styles.burocrataText}>CÓDIGO DE AUTORIZACIÓN DE TURNO</Text>
      </View>

      {/* BLOQUE CENTRAL DEL DÍA DINÁMICO */}
      <View style={styles.dayBlock}>
        <View style={styles.customStrikeLine} />
        <Text style={styles.dayNumberText}>[ DÍA {dayNumber} ]</Text>
        <View style={styles.customStrikeLine} />
      </View>

      {/* INSTRUCCIONES INICIALES */}
      <View style={styles.infoBlock}>
        <Text style={styles.infoText}>SU ESTACIÓN DE TRABAJO HA SIDO HABILITADA.</Text>
        <Text style={styles.infoText}>EVITE ERRORES. EL CONSORCIO NO PERDONA.</Text>
      </View>

      {/* BOTÓN DE ENTRADA AL TURNO */}
      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.8}
        onPress={handleStartShift}
      >
        <Text style={styles.startButtonText}>[ INICIAR TURNO ]</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: verticalScale(50),
    paddingHorizontal: scale(20),
  },
  headerBurocrata: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  burocrataText: {
    fontFamily: 'Inconsolata-Light',
    fontSize: moderateScale(11),
    color: colors.textSubtle,
    letterSpacing: scale(1),
    marginBottom: verticalScale(4),
  },
  dayBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: verticalScale(20),
  },
  customStrikeLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.stampRed,
    marginHorizontal: scale(12),
    opacity: 0.85,
  },
  dayNumberText: {
    fontFamily: 'Syne-Mono',
    fontSize: moderateScale(30),
    color: colors.textPrimary,
    fontWeight: 'bold',
    letterSpacing: scale(-1),
  },
  infoBlock: {
    alignItems: 'center',
    marginVertical: verticalScale(20),
  },
  infoText: {
    fontFamily: 'Inconsolata-Light',
    fontSize: moderateScale(13),
    color: colors.textMuted,
    lineHeight: verticalScale(22),
    textAlign: 'center',
  },
  startButton: {
    marginTop: verticalScale(30),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(36),
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: 2,
  },
  startButtonText: {
    fontFamily: 'Inconsolata-Light',
    fontSize: moderateScale(15),
    color: colors.textPrimary,
    letterSpacing: scale(2),
    fontWeight: 'bold',
  },
});