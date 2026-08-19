// src/components/shift/PcAndFaxStation.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { scale, verticalScale, moderateScale, screenDimensions } from '../../utils/responsive';

/**
 * =========================================================================
 * ESTACIÓN DE TRABAJO: PC TERMINAL + IMPRESORA DE FAX & MULTAS (AMPLIADO)
 * =========================================================================
 * Tipografía:
 * - PC: TYPOGRAPHY.systemPC (Inconsolata)
 * - Fax: TYPOGRAPHY.faxMain (Share Tech Mono) & TYPOGRAPHY.faxSecondary (VT323)
 */
export const PcAndFaxStation = () => {
  const [isFineActive, setIsFineActive] = useState(false);
  const fineAnim = useRef(new Animated.Value(0)).current; // 0 = Oculta arriba, 1 = Tapando PC

  const toggleFine = () => {
    if (isFineActive) {
      Animated.timing(fineAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setIsFineActive(false));
    } else {
      setIsFineActive(true);
      Animated.timing(fineAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }).start();
    }
  };

  const fineTranslateY = fineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-verticalScale(150), 0],
  });

  return (
    <View style={styles.container}>
      {/* 1. IMPRESORA FAX (Encima del monitor) */}
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={toggleFine} 
        style={styles.faxContainer}
      >
        <Text style={styles.faxTitle}>[ IMPRESORA FAX C.S.T. ]</Text>
        <Text style={styles.faxSubText}>
          {isFineActive ? '⚠️ MULTA EMITIDA' : 'TAP: SIMULAR MULTA'}
        </Text>
      </TouchableOpacity>

      {/* 2. MONITOR PC TERMINAL (Debajo del Fax - Ampliado) */}
      <View style={styles.pcMonitor}>
        <View style={styles.pcScreen}>
          <Text style={styles.pcHeader}>PC TERMINAL // SISTEMA C.S.T.</Text>
          <Text style={styles.pcLine}>ESTADO: OPERATIVO V.2.4</Text>
          <Text style={styles.pcLine}>BASE DATOS: CONEXIÓN EN VIVO</Text>
          <Text style={styles.pcLine}>REGISTROS: 4 PENDIENTES</Text>
          <Text style={styles.pcBlink}>_ CURSOR TERMINAL ACTIVO</Text>
        </View>

        {/* 3. HOJA DE MULTA ANIMADA (Ceguera selectiva sobre la pantalla) */}
        <Animated.View
          style={[
            styles.finePaper,
            {
              transform: [{ translateY: fineTranslateY }],
              opacity: fineAnim,
            },
          ]}
          pointerEvents={isFineActive ? 'auto' : 'none'}
        >
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={toggleFine}
            style={styles.fineContent}
          >
            <Text style={styles.fineAlert}>⚠️ INFRACCIÓN CST</Text>
            <Text style={styles.fineText}>MULTA POR RETARDO DE TURNO</Text>
            <Text style={styles.finePenalty}>-50 CRÉDITOS</Text>
            <Text style={styles.fineDismiss}>[ TOCAR PARA DESCARTAR ]</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: scale(4),
    top: screenDimensions.counterHeight - verticalScale(95),
    width: scale(150),
    zIndex: 40,
  },
  faxContainer: {
    height: verticalScale(46),
    backgroundColor: colors.colorbox.faxPrinter,
    borderWidth: 2,
    borderColor: '#b91c1c',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(4),
    paddingHorizontal: scale(4),
  },
  faxTitle: {
    fontFamily: TYPOGRAPHY.faxMain,
    color: '#ffffff',
    fontSize: moderateScale(10),
    letterSpacing: 0.5,
  },
  faxSubText: {
    fontFamily: TYPOGRAPHY.faxSecondary,
    color: '#fca5a5',
    fontSize: moderateScale(11),
    marginTop: 1,
  },
  pcMonitor: {
    height: verticalScale(145),
    backgroundColor: colors.colorbox.pcTerminal,
    borderWidth: 2,
    borderColor: '#38bdf8',
    borderRadius: 6,
    padding: scale(6),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  pcScreen: {
    flex: 1,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 3,
    padding: scale(6),
    justifyContent: 'space-between',
  },
  pcHeader: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: '#38bdf8',
    fontSize: moderateScale(9),
    fontWeight: 'bold',
  },
  pcLine: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: colors.crtGreen,
    fontSize: moderateScale(8),
    lineHeight: verticalScale(11),
  },
  pcBlink: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: colors.crtGreen,
    fontSize: moderateScale(9),
    fontWeight: 'bold',
  },
  finePaper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.colorbox.faxFinePaper,
    borderWidth: 2,
    borderColor: colors.colorbox.faxPrinter,
    padding: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    zIndex: 50,
  },
  fineContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fineAlert: {
    fontFamily: TYPOGRAPHY.stamps,
    color: '#991b1b',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  fineText: {
    fontFamily: TYPOGRAPHY.faxMain,
    color: '#1f2937',
    fontSize: moderateScale(9),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  finePenalty: {
    fontFamily: TYPOGRAPHY.digitalSecondary,
    color: '#b91c1c',
    fontSize: moderateScale(11),
    fontWeight: 'bold',
  },
  fineDismiss: {
    fontFamily: TYPOGRAPHY.faxSecondary,
    color: '#4b5563',
    fontSize: moderateScale(11),
    letterSpacing: 0.5,
  },
});
