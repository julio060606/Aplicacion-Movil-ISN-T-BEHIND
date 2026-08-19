// src/screens/WeeklyIntroScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { colors } from '../theme/colors';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyIntro'>;

const TRANSMISSION_TEXT =
  '>> CONEXIÓN ESTABLECIDA... C.S.T. RED DE TRANSMISIÓN LOCAL... SECTOR 4 APERTURADO... ESPERE NUEVAS DIRECTIVAS.';

export const WeeklyIntroScreen = ({ navigation, route }: Props) => {
  const weekNumber = route.params?.weekNumber ?? 1;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let charIndex = 0;
    const textInterval = setInterval(() => {
      if (charIndex <= TRANSMISSION_TEXT.length) {
        setDisplayText(TRANSMISSION_TEXT.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(textInterval);
      }
    }, 50);

    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(textInterval);
  }, [animatedOpacity]);

  const handleContinue = () => {
    navigation.navigate('DailyIntro', { dayNumber: (weekNumber - 1) * 7 + 1 });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* MOCK VISUAL / SPRITE: RADIO DE TRANSMISIÓN */}
      <View style={styles.radioMockContainer}>
        <View style={styles.radioSpeakerGrid}>
          <View style={styles.speakerLine} />
          <View style={styles.speakerLine} />
          <View style={styles.speakerLine} />
        </View>
        <Text style={styles.radioIndicatorText}>[ RECEPTOR AM - FREC. 84.2 ]</Text>
      </View>

      {/* TEXTO ANIMADO DE MÁQUINA DE ESCRIBIR */}
      <Animated.Text style={[styles.transmissionText, { opacity: animatedOpacity }]}>
        {displayText}
        <Text style={styles.cursor}>█</Text>
      </Animated.Text>

      {/* BOTÓN DE CONFIRMACIÓN */}
      <TouchableOpacity
        style={styles.continueButton}
        activeOpacity={0.7}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>[ CONFIRMAR RECEPCIÓN ]</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(20),
  },
  radioMockContainer: {
    width: scale(180),
    height: scale(140),
    borderWidth: 1,
    borderColor: colors.borderMedium,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(35),
    borderRadius: 4,
  },
  radioSpeakerGrid: {
    width: '70%',
    gap: verticalScale(6),
    marginBottom: verticalScale(12),
  },
  speakerLine: {
    height: 2,
    backgroundColor: colors.borderMedium,
    opacity: 0.7,
  },
  radioIndicatorText: {
    fontFamily: 'Inconsolata-Light',
    fontSize: moderateScale(10),
    color: colors.crtGreenDim,
    letterSpacing: scale(1),
  },
  transmissionText: {
    fontFamily: 'Inconsolata-Light',
    fontSize: moderateScale(15),
    color: colors.crtGreen,
    textAlign: 'center',
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(40),
    paddingHorizontal: scale(10),
  },
  cursor: {
    color: colors.crtGreen,
  },
  continueButton: {
    borderWidth: 1,
    borderColor: colors.crtGreen,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(28),
    backgroundColor: colors.crtGreenGlow,
    borderRadius: 2,
  },
  buttonText: {
    fontFamily: 'Inconsolata-Light',
    fontSize: moderateScale(14),
    color: colors.crtGreen,
    letterSpacing: scale(1.5),
  },
});