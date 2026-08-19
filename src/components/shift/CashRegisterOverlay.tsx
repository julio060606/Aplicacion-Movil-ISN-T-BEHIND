// src/components/shift/CashRegisterOverlay.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { scale, verticalScale, moderateScale, screenDimensions } from '../../utils/responsive';

const OVERLAY_HEIGHT = screenDimensions.height * 0.52;
const TAB_HEIGHT = verticalScale(32);

/**
 * =========================================================================
 * CAJA REGISTRADORA / OVERLAY DESLIZABLE (CASH REGISTER OVERLAY)
 * =========================================================================
 * Tipografía:
 * - Pantalla y Monedas: TYPOGRAPHY.digitalSecondary (Orbitron)
 * - Botones y Etiquetas: TYPOGRAPHY.digitalMain (Chakra Petch)
 */
export const CashRegisterOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleRegister = () => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [OVERLAY_HEIGHT - TAB_HEIGHT, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      {/* PESTAÑA SUPERIOR DE APERTURA / CIERRE */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleRegister}
        style={styles.handleTab}
      >
        <Text style={styles.handleText}>
          {isOpen ? '▼ [ CERRAR CAJA REGISTRADORA ]' : '▲ [ ABRIR CAJA REGISTRADORA ]'}
        </Text>
      </TouchableOpacity>

      {/* CUERPO MASIVO DE LA CAJA REGISTRADORA */}
      <View style={styles.registerBody}>
        {/* Fila 1: Pantalla Digital Orbitron y Teclado Chakra Petch */}
        <View style={styles.topRow}>
          <View style={styles.cashDisplay}>
            <Text style={styles.displayLabel}>TOTAL TURNO (CST-DIGITAL)</Text>
            <Text style={styles.displayAmount}>$ 142.50</Text>
          </View>
          <View style={styles.keypadMock}>
            <Text style={styles.keypadText}>[ 7 ][ 8 ][ 9 ]</Text>
            <Text style={styles.keypadText}>[ 4 ][ 5 ][ 6 ]</Text>
            <Text style={styles.keypadText}>[ 1 ][ 2 ][ 3 ]</Text>
            <Text style={styles.keypadText}>[ C ][ 0 ][ = ]</Text>
          </View>
        </View>

        {/* Fila 2: Cajón de Billetes y Monedas */}
        <View style={styles.drawerSlots}>
          <View style={styles.billSlot}>
            <Text style={styles.slotLabel}>BILLETES 50</Text>
            <Text style={styles.slotValue}>[ 4 UNID. ]</Text>
          </View>
          <View style={styles.billSlot}>
            <Text style={styles.slotLabel}>BILLETES 20</Text>
            <Text style={styles.slotValue}>[ 10 UNID. ]</Text>
          </View>
          <View style={styles.billSlot}>
            <Text style={styles.slotLabel}>MONEDAS</Text>
            <Text style={styles.slotValue}>[ 22.50 ]</Text>
          </View>
        </View>

        <View style={styles.statusFooter}>
          <Text style={styles.footerNote}>
            CAJA REGISTRADORA DIGITAL V.2004 // BLOQUEO ACTIVO DE ESCRITORIO
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: OVERLAY_HEIGHT,
    zIndex: 60,
  },
  handleTab: {
    height: TAB_HEIGHT,
    backgroundColor: colors.colorbox.cashRegister,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(16),
  },
  handleText: {
    fontFamily: TYPOGRAPHY.digitalMain,
    color: '#a7f3d0',
    fontSize: moderateScale(9),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerBody: {
    flex: 1,
    backgroundColor: colors.colorbox.cashRegister,
    borderTopWidth: 2,
    borderColor: '#059669',
    padding: scale(10),
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    height: '42%',
    justifyContent: 'space-between',
    gap: scale(8),
  },
  cashDisplay: {
    flex: 0.6,
    backgroundColor: '#022c22',
    borderWidth: 2,
    borderColor: colors.crtGreen,
    borderRadius: 4,
    padding: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayLabel: {
    fontFamily: TYPOGRAPHY.digitalMain,
    color: colors.crtGreenDim,
    fontSize: moderateScale(8),
  },
  displayAmount: {
    fontFamily: TYPOGRAPHY.digitalSecondary,
    color: colors.crtGreen,
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginTop: verticalScale(2),
  },
  keypadMock: {
    flex: 0.4,
    backgroundColor: '#065f46',
    borderWidth: 1,
    borderColor: '#34d399',
    borderRadius: 4,
    padding: scale(4),
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  keypadText: {
    fontFamily: TYPOGRAPHY.digitalMain,
    color: '#d1fae5',
    fontSize: moderateScale(8),
    fontWeight: 'bold',
  },
  drawerSlots: {
    flexDirection: 'row',
    height: '42%',
    justifyContent: 'space-between',
    gap: scale(6),
  },
  billSlot: {
    flex: 1,
    backgroundColor: '#047857',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(4),
  },
  slotLabel: {
    fontFamily: TYPOGRAPHY.digitalMain,
    color: '#ecfdf5',
    fontSize: moderateScale(7),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slotValue: {
    fontFamily: TYPOGRAPHY.digitalSecondary,
    color: '#a7f3d0',
    fontSize: moderateScale(8),
    fontWeight: 'bold',
    marginTop: verticalScale(3),
  },
  statusFooter: {
    alignItems: 'center',
    paddingVertical: verticalScale(2),
  },
  footerNote: {
    fontFamily: TYPOGRAPHY.digitalMain,
    color: '#6ee7b7',
    fontSize: moderateScale(7),
    letterSpacing: 0.5,
  },
});
