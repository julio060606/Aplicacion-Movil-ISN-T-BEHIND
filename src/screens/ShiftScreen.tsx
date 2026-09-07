import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { colors } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import {
  figmaX,
  figmaY,
  figmaW,
  figmaH,
  moderateScale,
  scale,
  verticalScale,
} from '../utils/responsive';

// Componentes diegéticos
import { GameBackground } from '../components/shift/GameBackground';
import { CustomerArea } from '../components/shift/CustomerArea';
import { ProtectionGrille } from '../components/shift/ProtectionGrille';
import { RollUpDoor } from '../components/shift/RollUpDoor';
import { DeskWorkstation } from '../components/shift/DeskWorkstation';
import { DeskDrawers } from '../components/shift/DeskDrawers';
import { InventoryBox } from '../components/shift/InventoryBox';
import { PcAndFaxStation } from '../components/shift/PcAndFaxStation';
import { DraggableNotebook } from '../components/shift/DraggableNotebook';
import { CashRegisterOverlay } from '../components/shift/CashRegisterOverlay';

type Props = NativeStackScreenProps<RootStackParamList, 'GameInterface' | 'Shift'>;

/**
 * =========================================================================
 * SHIFTSCREEN (LIENZO MATEMÁTICO FIGMA 412 x 873.5 - MODO INMERSIVO)
 * =========================================================================
 * - Bloqueo vertical 100% y centrado horizontal en tablets.
 * - Recorte estricto (overflow: 'hidden') en el ancho de los Color Boxes (412px base).
 * - Componentes integrados y apilamiento estricto:
 *   1. Fondo de la Habitación (game_background.webp, zIndex: 0).
 *   2. Color Boxes de Referencia (15%, 25%, 35%, 25% con opacidad 0.30, zIndex: 1).
 *   3. Cliente en Ventanilla (character_client_1.webp, zIndex: 2).
 *   4. Reja de Protección (protection_grille.webp, zIndex: 4).
 *   5. Caja de Inventario (inventory_box.webp, zIndex: 5, inferior a la mesa).
 *   6. Cajones Inferiores (desk_under_workstation zIndex: 6, cajones zIndex: 7, 8).
 *   7. Plataforma de la Mesa (desk_workstation.webp, zIndex: 10).
 *   8. Línea divisoria roja (Y = 349.5px, zIndex: 12).
 *   9. Persiana Enrollable (roll-up door con cabezal estático y física, zIndex: 25).
 *  10. PC Station con Modal (pc_station.webp, zIndex: 40).
 *  11. Cuaderno Compacto (aparece/desaparece con Hold en Cajón Izquierdo, zIndex: 48).
 *  12. Caja Registradora (CashRegisterOverlay calibrada al fondo, zIndex: 60).
 */
// =========================================================================
// FILTRO DIEGÉTICO / ATMOSFÉRICO DE PANTALLA COMPLETA (#34495E)
// =========================================================================
// Cambiar a false para desactivar el filtro de la pantalla móvil:
const ENABLE_SCREEN_FILTER = true;
// Color #34495E con opacidad al 53% (rango solicitado 50% - 56%):
const SCREEN_FILTER_COLOR = 'rgba(52, 73, 94, 0.53)';

export const ShiftScreen: React.FC<Props> = ({ route }) => {
  const currentDay = route.params && 'currentDay' in route.params ? route.params.currentDay : 1;

  // Estados de interacción
  const [isNotebookVisible, setIsNotebookVisible] = useState(false);
  const [isGunDrawn, setIsGunDrawn] = useState(false);
  const [areDrawersOpen, setAreDrawersOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isDoorClosed, setIsDoorClosed] = useState(false);

  const isDoorClosedRef = useRef(false);
  useEffect(() => { isDoorClosedRef.current = isDoorClosed; }, [isDoorClosed]);

  const isGunDrawnRef = useRef(false);
  useEffect(() => { isGunDrawnRef.current = isGunDrawn; }, [isGunDrawn]);

  // Animaciones de cámara para Inspección Top 25% (Opción B: Zoom global)
  const zoomScale = useRef(new Animated.Value(1)).current;
  const cameraTranslateY = useRef(new Animated.Value(0)).current;
  const cameraPanX = useRef(new Animated.Value(0)).current;
  const inspectOpacity = useRef(new Animated.Value(1)).current;
  const isInspecting = useRef(false);

  const MAX_PAN_X = figmaW(160);

  const startInspection = () => {
    isInspecting.current = true;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    Animated.parallel([
      Animated.spring(zoomScale, {
        toValue: 1.7,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(cameraTranslateY, {
        toValue: figmaY(185),
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(inspectOpacity, {
        toValue: 0.18,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const endInspection = () => {
    if (!isInspecting.current) return;
    isInspecting.current = false;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    Animated.parallel([
      Animated.spring(zoomScale, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(cameraTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(cameraPanX, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(inspectOpacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const inspectPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () =>
        !isDoorClosedRef.current && !isGunDrawnRef.current,
      onMoveShouldSetPanResponder: () =>
        isInspecting.current && !isDoorClosedRef.current && !isGunDrawnRef.current,

      onPanResponderGrant: () => {
        startInspection();
      },

      onPanResponderMove: (_, gestureState) => {
        if (!isInspecting.current) return;
        const targetX = gestureState.dx;
        const clampedX = Math.min(Math.max(targetX, -MAX_PAN_X), MAX_PAN_X);
        cameraPanX.setValue(clampedX);
      },

      onPanResponderRelease: () => {
        endInspection();
      },
      onPanResponderTerminate: () => {
        endInspection();
      },
    })
  ).current;

  const toggleNotebook = () => {
    setIsNotebookVisible((prev) => !prev);
  };

  const toggleGun = () => {
    setIsGunDrawn((prev) => !prev);
  };

  return (
    <View style={styles.fullScreen}>
      <StatusBar hidden={true} />

      <View style={styles.screenWrapper}>
        <View style={styles.stageContainer}>
          {/* =========================================================
              CÁMARA GLOBAL DE ESCENARIO (ZOOM + PANEO DE INSPECCIÓN)
              ========================================================= */}
          <Animated.View
            style={[
              styles.cameraContainer,
              {
                transform: [
                  { scale: zoomScale },
                  { translateX: cameraPanX },
                  { translateY: cameraTranslateY },
                ],
              },
            ]}
          >
            {/* =========================================================
                0. FONDO DE LA HABITACIÓN / ESCENARIO - zIndex: 0
                ========================================================= */}
            <GameBackground />

            {/* =========================================================
                1. COLOR BOXES DE REFERENCIA DE FIGMA (OPACIDAD 0.30) - zIndex: 1
                ========================================================= */}
            <View style={styles.colorBoxesLayer} pointerEvents="none">
              {/* BOX 1: ROJO (Top 15% - 0 a 131.10px) */}
              <View style={styles.colorBox1}>
                <View style={styles.colorBoxContent}>
                  <Text style={styles.boxTag}>TOP 15% (131.1px)</Text>
                  <Text style={styles.boxDescription}>ESPEJO // VIGILANCIA // CCTV</Text>
                </View>
              </View>

              {/* BOX 2: DORADO (Top 25% - 131 a 349.50px) */}
              <View style={styles.colorBox2}>
                <View style={styles.colorBoxContent}>
                  <Text style={styles.boxTag}>TOP 25% (218.5px)</Text>
                  <Text style={styles.boxDescription}>VENTANILLA // CLIENTE [DÍA {currentDay}]</Text>
                </View>
              </View>

              {/* LÍNEA DIVISORIA ROJA (Y = 349.5px) */}
              <View style={styles.redDividerLine} />

              {/* BOX 3: CYAN (Bottom 35% - 349 a 655px) */}
              <View style={styles.colorBox3}>
                <View style={styles.colorBoxContent}>
                  <Text style={styles.boxTag}>BOTTOM 35% (305.9px)</Text>
                  <Text style={styles.boxDescription}>MESA PRINCIPAL // CARRUSEL</Text>
                </View>
              </View>

              {/* BOX 4: AZUL MARINO (Bottom 25% - 655 a 873.5px) */}
              <View style={styles.colorBox4}>
                <View style={styles.colorBoxContent}>
                  <Text style={styles.boxTag}>BOTTOM 25% (218.5px)</Text>
                  <Text style={styles.boxDescription}>CAJONES // INVENTARIO</Text>
                </View>
              </View>
            </View>

            {/* =========================================================
                2. CLIENTE EN VENTANILLA (CUSTOMER AREA) - zIndex: 2
                - Se transparenta al mantener presionado el Top 25%
                ========================================================= */}
            <CustomerArea inspectOpacity={inspectOpacity} />

            {/* =========================================================
                3. REJA DE PROTECCIÓN (PROTECTION GRILLE) - zIndex: 4
                - Se transparenta al mantener presionado el Top 25%
                ========================================================= */}
            <ProtectionGrille opacity={inspectOpacity} />

            {/* =========================================================
                ZONA TÁCTIL DE INSPECCIÓN: TOP 25% (Y: 131.1px a 349.5px)
                - Mantener presionado: zoom global + fade de rejas y cliente
                - Desplazar: paneo horizontal
                - Soltar: vuelve suavemente a la normalidad
                - Bloqueado si persiana cerrada o arma desenfundada
                ========================================================= */}
            <View
              style={styles.top25TouchZone}
              {...inspectPanResponder.panHandlers}
            />

            {/* =========================================================
                4. CAJA DE INVENTARIO (INVENTORY BOX) - zIndex: 5
                - Bloqueada físicamente SOLO si hay cajones abiertos.
                ========================================================= */}
            <InventoryBox
              isBlocked={areDrawersOpen}
              disabled={isGunDrawn}
              onInventoryStateChange={setIsInventoryOpen}
            />

            {/* =========================================================
                5. ZONA INFERIOR DE LA MESA Y CAJONES (zIndex: 6, 7, 8)
                - Inhabilitada si la caja de inventario está desplegada.
                - Al sacar el arma, el cajón derecho sigue activo para hold (guardar).
                ========================================================= */}
            <DeskDrawers
              onToggleNotebook={toggleNotebook}
              onToggleGun={toggleGun}
              isGunDrawn={isGunDrawn}
              disabled={isInventoryOpen}
              onDrawersStateChange={setAreDrawersOpen}
            />

            {/* =========================================================
                6. SUPERFICIE DE LA MESA (DESK WORKSTATION) - zIndex: 10
                ========================================================= */}
            <DeskWorkstation />

            {/* =========================================================
                7. PERSIANA ENROLLABLE (ROLL-UP DOOR) - zIndex: 25
                ========================================================= */}
            <RollUpDoor
              disabled={isGunDrawn}
              onDoorStateChange={setIsDoorClosed}
            />

            {/* =========================================================
                8. ESTACIÓN PC (pc_station.webp) - zIndex: 40
                - Hijo directo del stage para respetar el stacking context nativo.
                ========================================================= */}
            <PcAndFaxStation disabled={isGunDrawn} />

            {/* =========================================================
                9. ESTADO DEL ARMA EN MANO (missing_texture.webp + [ SHOOT ])
                ========================================================= */}
            {isGunDrawn && (
              <>
                {/* Sprite provisional del arma en mano (reposo en mesa) */}
                <Image
                  source={require('../assets/sprites/missing_texture.webp')}
                  style={styles.gunSprite}
                  resizeMode="contain"
                />

                {/* Botón [ SHOOT ] en la zona Top 25% */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.shootButton}
                  onPress={() => {
                    // Por el momento no hace nada
                  }}
                >
                  <Text style={styles.shootButtonText}>[ SHOOT ]</Text>
                  <Text style={styles.shootSubText}>OBJETIVO: CLIENTE EN VENTANILLA</Text>
                </TouchableOpacity>
              </>
            )}

            {/* =========================================================
                10. CUADERNO (APARECE/DESAPARECE CON HOLD EN CAJÓN 1) - zIndex: 48
                ========================================================= */}
            {isNotebookVisible && (
              <View pointerEvents={isGunDrawn ? 'none' : 'box-none'} style={StyleSheet.absoluteFill}>
                <DraggableNotebook />
              </View>
            )}

            {/* =========================================================
                11. CAJA REGISTRADORA (CASH REGISTER OVERLAY) - zIndex: 60
                ========================================================= */}
            <CashRegisterOverlay disabled={isGunDrawn || isInventoryOpen} />

            {/* =========================================================
                12. FILTRO DE COLOR EN TODA LA PANTALLA MÓVIL (#34495E)
                - Cubre toda la pantalla móvil sin bloquear gestos (pointerEvents="none")
                ========================================================= */}
            {ENABLE_SCREEN_FILTER && (
              <View style={styles.screenFilterOverlay} pointerEvents="none" />
            )}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stageContainer: {
    height: '100%',
    aspectRatio: 412 / 873.5,
    backgroundColor: '#0a0a0c',
    position: 'relative',
    overflow: 'hidden',
  },

  cameraContainer: {
    ...StyleSheet.absoluteFill,
  },

  colorBoxesLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
    display: 'none', // DESHABILITADO — reactivar quitando esta línea
  },

  colorBox1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: figmaY(0),
    height: figmaH(131.1),
    backgroundColor: 'rgba(213.32, 4.92, 4.92, 0.30)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213.32, 4.92, 4.92, 0.60)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  colorBox2: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: figmaY(131),
    height: figmaH(218.5),
    backgroundColor: 'rgba(182.91, 147.27, 49.25, 0.30)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  redDividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: figmaY(349),
    height: 4,
    backgroundColor: colors.colorbox.dividerLine,
    zIndex: 12,
  },

  colorBox3: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: figmaY(349),
    height: figmaH(305.9),
    backgroundColor: 'rgba(51.08, 173.21, 181.93, 0.30)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  colorBox4: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: figmaY(655),
    height: figmaH(218.5),
    backgroundColor: 'rgba(2.04, 12.73, 66.20, 0.30)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(2.04, 12.73, 66.20, 0.80)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  colorBoxContent: {
    alignItems: 'center',
    paddingHorizontal: scale(8),
  },
  boxTag: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: '#ffffff',
    fontSize: moderateScale(9),
    fontWeight: 'bold',
    letterSpacing: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: 3,
  },
  boxDescription: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    color: '#e2e8f0',
    fontSize: moderateScale(7),
    marginTop: verticalScale(2),
    textAlign: 'center',
  },

  // Zona táctil para inspección Top 25%
  top25TouchZone: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: figmaY(131.1),
    height: figmaH(218.5),
    zIndex: 20, // Entre la reja (4) y la persiana (25)
  },

  // Sprite provisional del arma en mano (reposo sobre cajón derecho)
  gunSprite: {
    position: 'absolute',
    left: figmaX(460),
    top: figmaY(550),
    width: figmaW(140),
    height: figmaH(140),
    zIndex: 45,
    pointerEvents: 'none',
  },

  // Botón [ SHOOT ] en zona Top 25%
  shootButton: {
    position: 'absolute',
    top: figmaY(215),
    alignSelf: 'center',
    backgroundColor: '#991b1b',
    borderWidth: 2,
    borderColor: '#f87171',
    borderRadius: 6,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    zIndex: 50,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  shootButtonText: {
    fontFamily: TYPOGRAPHY.stamps,
    color: '#ffffff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  shootSubText: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: '#fecaca',
    fontSize: moderateScale(7),
    marginTop: verticalScale(2),
  },

  // Filtro de pantalla completa (#34495E con opacidad al 53%)
  screenFilterOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: SCREEN_FILTER_COLOR,
    zIndex: 70, // Por encima de toda la escena y elementos móviles sin bloquear toques
  },
});