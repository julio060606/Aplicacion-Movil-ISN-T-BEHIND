// src/screens/ShiftScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { colors } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

// Componentes flotantes con mecánicas diegéticas
import { PcAndFaxStation } from '../components/shift/PcAndFaxStation';
import { DraggableNotebook } from '../components/shift/DraggableNotebook';
import { CashRegisterOverlay } from '../components/shift/CashRegisterOverlay';

type Props = NativeStackScreenProps<RootStackParamList, 'GameInterface' | 'Shift'>;

/**
 * =========================================================================
 * SHIFTSCREEN (PANTALLA DE TURNO DIEGÉTICA & MODO INMERSIVO)
 * =========================================================================
 * Layout: Flexbox base con Split 40% (Top) y 60% (Bottom) dividido por línea roja.
 * Tipografía: Sistema unificado TYPOGRAPHY (Contexto Corporativo Y2K / Años 2000).
 */
export const ShiftScreen = ({ route }: Props) => {
  const currentDay = route.params && 'currentDay' in route.params ? route.params.currentDay : 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />

      <View style={styles.rootContainer}>
        {/* =========================================================
            1. TOP_ZONE (flex: 0.4 - 40% SUPERIOR)
            ========================================================= */}
        <View style={styles.topZone}>
          {/* Top15Zone (flex: 15/40): Espejo, Centro Vacío, CCTV/Reloj */}
          <View style={styles.top15Zone}>
            {/* Espejo Convexo (Izquierda) */}
            <View style={styles.mirrorBox}>
              <Text style={styles.boxLabel}>ESPEJO CONVEXO</Text>
              <Text style={styles.subLabel}>[ VIGILANCIA ATRÁS ]</Text>
            </View>

            {/* Espacio Central Vacío / Alerta */}
            <View style={styles.topCenterEmpty}>
              <Text style={styles.centerDrafterText}>TURNO: DÍA {currentDay}</Text>
            </View>

            {/* Contenedor CCTV / Reloj (Derecha) */}
            <View style={styles.cctvClockBox}>
              <Text style={styles.cctvLabel}>CCTV // RELOJ</Text>
              <Text style={styles.clockText}>00:00 AM</Text>
              <Text style={styles.cctvStatus}>[ CAM-01: ACTIVA ]</Text>
            </View>
          </View>

          {/* Top25Zone (flex: 25/40): Mostrador y Sprite del Cliente */}
          <View style={styles.top25Zone}>
            <View style={styles.clientSpriteBox}>
              <Text style={styles.clientLabel}>SPRITE DEL CLIENTE / VISITANTE</Text>
              <Text style={styles.clientStatus}>[ ÁREA DE ATENCIÓN DE VENTANILLA ]</Text>
            </View>
          </View>
        </View>

        {/* =========================================================
            2. LÍNEA ROJA DIVISORIA DIEGÉTICA (height: 4, #641111)
            ========================================================= */}
        <View style={styles.redDividerLine} />

        {/* =========================================================
            3. BOTTOM_ZONE (flex: 0.6 - 60% INFERIOR)
            ========================================================= */}
        <View style={styles.bottomZone}>
          {/* Bottom35Zone (flex: 35/60): Escritorio, Carrusel Expandido y Herramientas */}
          <View style={styles.bottom35Zone}>
            {/* Carrusel Central de Documentos (Expandido flex: 1) */}
            <View style={styles.docCarouselBox}>
              <Text style={styles.docCarouselTitle}>ZONA CARRUSEL DE DOCUMENTOS (EXPANDIDO)</Text>
              <Text style={styles.docCarouselSub}>
                [ EXPEDIENTES / PASAPORTES / FORMULARIOS Y REGISTROS ]
              </Text>
            </View>

            {/* Zona de Herramientas (Lámpara UV y Teclado) */}
            <View style={styles.toolsRack}>
              <View style={styles.uvLampBox}>
                <Text style={styles.toolLabel}>LÁMPARA UV</Text>
              </View>
              <View style={styles.keyboardBox}>
                <Text style={styles.toolLabel}>TECLADO MEC.</Text>
              </View>
            </View>
          </View>

          {/* Bottom25Zone (flex: 25/60): Fila Inferior (Cajones e Inventario) */}
          <View style={styles.bottom25Zone}>
            {/* Cajones de Guardado (flex: 0.75 a la izquierda) */}
            <View style={styles.drawerStorageBox}>
              <Text style={styles.drawerTitle}>CAJONES DE GUARDADO (C.S.T.)</Text>
              <Text style={styles.drawerHint}>[ NIDO DEL CUADERNO MASIVO / ARCHIVOS ]</Text>
            </View>

            {/* Inventario (flex: 0.25 a la derecha) */}
            <View style={styles.inventoryBox}>
              <Text style={styles.inventoryTitle}>INVENTARIO</Text>
              <Text style={styles.inventoryCount}>[ 3 SLOTS ]</Text>
            </View>
          </View>
        </View>

        {/* =========================================================
            4. CAPAS FLOTANTES & MECÁNICAS DIEGÉTICAS
            ========================================================= */}
        <PcAndFaxStation />
        <DraggableNotebook />
        <CashRegisterOverlay />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },

  // =========================================================
  // TOP_ZONE (flex: 0.4)
  // =========================================================
  topZone: {
    flex: 0.4,
    backgroundColor: colors.surfaceDark,
  },
  top15Zone: {
    flex: 15 / 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingTop: verticalScale(4),
  },
  mirrorBox: {
    width: scale(90),
    height: '90%',
    backgroundColor: colors.colorbox.mirrorConvex,
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(2),
  },
  topCenterEmpty: {
    flex: 1,
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDrafterText: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: colors.textSubtle,
    fontSize: moderateScale(9),
    letterSpacing: 1,
  },
  cctvClockBox: {
    width: scale(95),
    height: '90%',
    backgroundColor: colors.colorbox.cctvClock,
    borderWidth: 2,
    borderColor: '#38bdf8',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(2),
  },
  cctvLabel: {
    fontFamily: TYPOGRAPHY.digitalMain,
    color: '#e0f2fe',
    fontSize: moderateScale(7),
    fontWeight: 'bold',
  },
  clockText: {
    fontFamily: TYPOGRAPHY.digitalSecondary,
    color: '#ffffff',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  cctvStatus: {
    fontFamily: TYPOGRAPHY.digitalMain,
    color: colors.crtGreen,
    fontSize: moderateScale(6),
  },
  top25Zone: {
    flex: 25 / 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingBottom: verticalScale(4),
  },
  clientSpriteBox: {
    width: '75%',
    height: '90%',
    backgroundColor: colors.colorbox.clientArea,
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  clientLabel: {
    fontFamily: TYPOGRAPHY.stamps,
    color: '#f8fafc',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clientStatus: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    color: '#94a3b8',
    fontSize: moderateScale(8),
    marginTop: verticalScale(4),
  },

  // =========================================================
  // LÍNEA ROJA DIVISORIA
  // =========================================================
  redDividerLine: {
    height: 4,
    backgroundColor: colors.colorbox.dividerLine,
    width: '100%',
    zIndex: 10,
  },

  // =========================================================
  // BOTTOM_ZONE (flex: 0.6)
  // =========================================================
  bottomZone: {
    flex: 0.6,
    backgroundColor: colors.background,
  },
  bottom35Zone: {
    flex: 35 / 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(6),
    gap: scale(6),
  },
  docCarouselBox: {
    flex: 1,
    backgroundColor: colors.colorbox.docCarousel,
    borderWidth: 2,
    borderColor: '#b45309',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(6),
  },
  docCarouselTitle: {
    fontFamily: TYPOGRAPHY.dirtyDoc,
    color: '#fef3c7',
    fontSize: moderateScale(9),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  docCarouselSub: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    color: '#fde68a',
    fontSize: moderateScale(7),
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  toolsRack: {
    width: scale(75),
    justifyContent: 'space-between',
    gap: verticalScale(4),
  },
  uvLampBox: {
    flex: 1,
    backgroundColor: colors.colorbox.uvLamp,
    borderWidth: 2,
    borderColor: '#a855f7',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardBox: {
    flex: 1,
    backgroundColor: colors.colorbox.keyboard,
    borderWidth: 2,
    borderColor: '#6b7280',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolLabel: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: '#ffffff',
    fontSize: moderateScale(7),
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Bottom25Zone: Fila Inferior
  bottom25Zone: {
    flex: 25 / 60,
    flexDirection: 'row',
    paddingHorizontal: scale(6),
    paddingBottom: verticalScale(6),
    gap: scale(6),
  },
  drawerStorageBox: {
    flex: 0.75,
    backgroundColor: colors.colorbox.drawerStorage,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(6),
  },
  drawerTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    color: '#dbeafe',
    fontSize: moderateScale(9),
    fontWeight: 'bold',
  },
  drawerHint: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    color: '#93c5fd',
    fontSize: moderateScale(7),
    marginTop: verticalScale(2),
  },
  inventoryBox: {
    flex: 0.25,
    backgroundColor: colors.colorbox.inventory,
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(4),
  },
  inventoryTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    color: '#d1fae5',
    fontSize: moderateScale(8),
    fontWeight: 'bold',
  },
  inventoryCount: {
    fontFamily: TYPOGRAPHY.digitalMain,
    color: '#a7f3d0',
    fontSize: moderateScale(7),
    marginTop: verticalScale(2),
  },

  // Etiquetas genéricas
  boxLabel: {
    fontFamily: TYPOGRAPHY.stamps,
    color: '#ffffff',
    fontSize: moderateScale(8),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subLabel: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: '#fef3c7',
    fontSize: moderateScale(6),
    textAlign: 'center',
    marginTop: 1,
  },
});