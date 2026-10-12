/**
 * =========================================================================
 * src/screens/ShiftScreen.tsx
 * =========================================================================
 * RESPONSABILIDAD ÚNICA: Orquestar y renderizar la escena del turno (Fase 2).
 *
 * Características de Fase 2:
 *   ✓ Sprites 2.5D ordenados por capa (zIndex) según diseño de Figma
 *   ✓ Roll-Up Door con límite en el fin de la Zona A inferior (410.17 px)
 *   ✓ Hotspots de interacción oficiales (TOGGLE BOTONS de Figma)
 *   ✓ Cajón 1 y Cajón 2 con ciclo de 3 fases y expansión anclada hacia la derecha
 *   ✓ Caja de Cartón con Posición 1 y Posición 2 ("por encima de todo", zIndex 50)
 *   ✓ Exclusión mutua estricta: Caja abierta bloquea cajones; Cajones abiertos bloquean caja
 *   ✓ PC abierto + pantalla negra con terminal CRT interactiva
 * =========================================================================
 */

import React, { useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  StatusBar, Animated, PanResponder, useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { TYPOGRAPHY } from '../theme/typography';
import { ScreenDelay } from '../components/ui/ScreenDelay';
import { GameSprite } from '../components/scene/GameSprite';
import { SceneOverlays } from '../components/scene/SceneOverlays';
import {
  ADAPTED_ELEMENTS, ISceneElement, SPRITE_ASSETS,
  FORCE_COLOR_BOXES, SHOW_REFERENCE_COLOR_BOXES, SHOW_TOGGLE_HITBOXES,
  ENABLE_SCREEN_FILTER, SCREEN_FILTER_COLOR, COLOR_ZONES, TOGGLE_BUTTONS,
  CAJA_POSICION2_METRICS,
  FIGMA_OFFSET_X, FIGMA_OFFSET_Y, FIGMA_CANVAS_WIDTH, FIGMA_CANVAS_HEIGHT,
} from '../config/sceneConfig';
import { useTurnEngine } from '../hooks/useTurnEngine';
import { useOverlays }   from '../hooks/useOverlays';
import { useDrawers }    from '../hooks/useDrawers';

type Props = NativeStackScreenProps<RootStackParamList, 'GameInterface' | 'Shift'>;

const el = (id: string): ISceneElement | undefined => ADAPTED_ELEMENTS.find(e => e.id === id);

export const ShiftScreen: React.FC<Props> = ({ route }) => {
  const currentDay = route.params && 'currentDay' in route.params ? route.params.currentDay : 1;

  // ── Escala global dinámica ────────────────────────────────────────────────
  const { height: windowHeight } = useWindowDimensions();
  const scale      = windowHeight / FIGMA_CANVAS_HEIGHT;
  const stageWidth = Math.round(FIGMA_CANVAS_WIDTH * scale);

  const px = (figmaPx: number) => Math.round(figmaPx * scale);
  const pos = (e: ISceneElement) => ({
    left:   px(e.figmaLeft - FIGMA_OFFSET_X),
    top:    px(e.figmaTop  - FIGMA_OFFSET_Y),
    width:  px(e.figmaWidth),
    height: px(e.figmaHeight),
  });

  // ── Hooks desacoplados ────────────────────────────────────────────────────
  const engine   = useTurnEngine(currentDay);
  const overlays = useOverlays(scale, windowHeight);
  const drawers  = useDrawers(scale, overlays.isBlocked);

  // ── Roll-Up Door: PanResponder (Límite: fin de Zona A inferior = 410.17px) ──
  const rollEl    = el('roll-up-door');
  const ROLL_MAX  = px(rollEl?.panConfig?.maxTranslateY ?? 410.17);
  const rollSnaps = (rollEl?.panConfig?.snapPositions ?? [0, 410.17]).map(px);
  const rollDoorY = useRef(new Animated.Value(0)).current;
  const rollOff   = useRef(0);

  const rollDoorPan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !overlays.isBlocked,
    onMoveShouldSetPanResponder:  (_, g) => !overlays.isBlocked && Math.abs(g.dy) > 5,
    onPanResponderGrant:  () => rollDoorY.stopAnimation(v => { rollOff.current = v; }),
    onPanResponderMove:   (_, g) => {
      rollDoorY.setValue(Math.min(Math.max(rollOff.current + g.dy, 0), ROLL_MAX));
    },
    onPanResponderRelease: (_, g) => {
      const cur  = rollOff.current + g.dy;
      const snap = cur > ROLL_MAX / 2 ? rollSnaps[1] : rollSnaps[0];
      rollOff.current = snap;
      Animated.spring(rollDoorY, { toValue: snap, friction: 10, tension: 40, useNativeDriver: true }).start();
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    },
  })).current;

  // ── Cajones: selección de sprite y cálculo de ancho anclado a la derecha ──
  const currentCajonKey =
    drawers.cajon1State === 'full'
      ? 'cajon1_abierto_completo'
      : drawers.cajon1State === 'half'
      ? 'cajon1_abierto_mitad'
      : drawers.cajon2State === 'full'
      ? 'cajon2_abierto_completo'
      : drawers.cajon2State === 'half'
      ? 'cajon2_abierto_mitad'
      : 'cajones';

  const cajonSource = SPRITE_ASSETS[currentCajonKey] ?? SPRITE_ASSETS['cajones'];
  const cajonAsset  = Image.resolveAssetSource(cajonSource);
  const baseCajonH  = px(280);
  const cajonW      = cajonAsset?.width && cajonAsset?.height
    ? Math.round(baseCajonH * (cajonAsset.width / cajonAsset.height))
    : px(209);

  // ── Caja de Cartón: Posición 1 vs Posición 2 (por encima de todo) ─────────
  const isCajaPos2 = drawers.cajaPos === 2;
  const cajaSource = SPRITE_ASSETS[isCajaPos2 ? 'caja_posicion2' : 'caja_carton'];
  const cajaStyle  = isCajaPos2
    ? {
        left:   px(CAJA_POSICION2_METRICS.left),
        top:    px(CAJA_POSICION2_METRICS.top),
        width:  px(CAJA_POSICION2_METRICS.width),
        height: px(CAJA_POSICION2_METRICS.height),
        zIndex: CAJA_POSICION2_METRICS.zIndex,
      }
    : {
        left:   px(569 - FIGMA_OFFSET_X),
        top:    px(1010 - FIGMA_OFFSET_Y),
        width:  px(277),
        height: px(204),
        zIndex: 8,
      };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <ScreenDelay delay={500} backgroundColor="#0C0C0C">
      <View style={styles.fullScreen}>
        <StatusBar hidden />
        <View style={styles.screenWrapper}>
          <View style={[styles.stage, { width: stageWidth, height: windowHeight }]} collapsable={false}>

            {/* 1. Sprites estáticos del escenario (excluye cajones y caja que son dinámicos) */}
            {ADAPTED_ELEMENTS
              .filter(e => e.id !== 'cajones' && e.id !== 'caja-carton' && (e.behavior === 'static' || e.behavior === 'shadow'))
              .map(e => (
                <GameSprite key={e.id} element={e} scale={scale} />
              ))}

            {/* 2. Caja de Cartón (Posición 1 en zIndex 8, Posición 2 en zIndex 50) */}
            <View pointerEvents="none" style={[{ position: 'absolute', ...cajaStyle }]}>
              {cajaSource && !FORCE_COLOR_BOXES ? (
                <Image source={cajaSource} style={styles.fill} resizeMode="stretch" />
              ) : (
                <View style={[styles.fallback, { backgroundColor: 'rgba(120,53,15,0.7)' }]}>
                  <Text style={styles.fbLabel}>CAJA POS {drawers.cajaPos}</Text>
                </View>
              )}
            </View>

            {/* 3. Cajones (Anclaje fijo en origen y expansión direccional a la derecha) */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left:   px(353 - FIGMA_OFFSET_X),
                top:    px(1061 - FIGMA_OFFSET_Y),
                width:  cajonW,
                height: baseCajonH,
                zIndex: 10,
              }}
            >
              {cajonSource && !FORCE_COLOR_BOXES ? (
                <Image source={cajonSource} style={styles.fill} resizeMode="stretch" />
              ) : (
                <View style={[styles.fallback, { backgroundColor: 'rgba(29,78,216,0.70)' }]}>
                  <Text style={styles.fbLabel}>CAJONES ({currentCajonKey})</Text>
                </View>
              )}
            </View>

            {/* 4. Roll-Up Door (Arrastrable con límite en el fin de zona A inferior) */}
            {rollEl && (
              <Animated.View
                {...rollDoorPan.panHandlers}
                style={[
                  { position: 'absolute', ...pos(rollEl), zIndex: rollEl.zIndex },
                  { transform: [{ translateY: rollDoorY }] },
                ]}
              >
                {SPRITE_ASSETS['roll-up_door'] && !FORCE_COLOR_BOXES ? (
                  <Image source={SPRITE_ASSETS['roll-up_door']} style={styles.fill} resizeMode="stretch" />
                ) : (
                  <View style={[styles.fallback, { backgroundColor: rollEl.fallbackColor }]}>
                    <Text style={styles.fbLabel}>PERSIANA</Text>
                  </View>
                )}
              </Animated.View>
            )}

            {/* 5. Terminal PC (Sprite base en escenario) */}
            {(() => {
              const pcItem = el('pc');
              if (!pcItem) return null;
              return (
                <View pointerEvents="none" style={{ position: 'absolute', ...pos(pcItem), zIndex: pcItem.zIndex }}>
                  {SPRITE_ASSETS['pc'] && !FORCE_COLOR_BOXES ? (
                    <Image source={SPRITE_ASSETS['pc']} style={styles.fill} resizeMode="stretch" />
                  ) : (
                    <View style={[styles.fallback, { backgroundColor: pcItem.fallbackColor }]}>
                      <Text style={styles.fbLabel}>PC</Text>
                    </View>
                  )}
                </View>
              );
            })()}

            {/* 6. Zonas Táctiles de Interacción (TOGGLE BOTONS de Figma, zIndex: 65) */}
            {TOGGLE_BUTTONS.map(btn => {
              if (btn.id === 'toggle-roll-door') return null; // La persiana usa su PanResponder propio

              let onAction: () => void = () => {};
              if (btn.id === 'toggle-pc') onAction = overlays.openMonitor;
              else if (btn.id === 'toggle-cajon-1') onAction = drawers.cycleCajon1;
              else if (btn.id === 'toggle-cajon-2') onAction = drawers.cycleCajon2;
              else if (btn.id === 'toggle-caja') onAction = drawers.toggleCaja;
              else if (btn.id === 'toggle-telefono' || btn.id === 'toggle-gas' || btn.id === 'toggle-med') {
                onAction = () => { try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {} };
              }

              return (
                <TouchableOpacity
                  key={btn.id}
                  onPress={onAction}
                  disabled={overlays.isBlocked}
                  activeOpacity={0.7}
                  style={[
                    styles.hotspot,
                    {
                      left:   px(btn.left),
                      top:    px(btn.top),
                      width:  px(btn.width),
                      height: px(btn.height),
                      backgroundColor: SHOW_TOGGLE_HITBOXES ? btn.color : 'transparent',
                      borderWidth: SHOW_TOGGLE_HITBOXES ? 1 : 0,
                      borderColor: SHOW_TOGGLE_HITBOXES ? 'rgba(255,255,255,0.7)' : 'transparent',
                    },
                  ]}
                >
                  {SHOW_TOGGLE_HITBOXES && <Text style={styles.hotspotLabel}>{btn.label}</Text>}
                </TouchableOpacity>
              );
            })}

            {/* 7. Overlays Diegéticos (PC Abierto + Pantalla Negra CRT, Registradora, Apuntar) */}
            <SceneOverlays overlays={overlays} scale={scale} />

            {/* 8. Color Boxes de Referencia (Desarrollo / Calibración) */}
            {SHOW_REFERENCE_COLOR_BOXES && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {COLOR_ZONES.map(z => (
                  <View key={z.id} style={[styles.refBox, { top: px(z.top), height: px(z.height), backgroundColor: z.bg, borderBottomColor: z.border }]}>
                    <Text style={styles.zoneTag}>{z.label}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 9. Filtro atmosférico diegético */}
            {ENABLE_SCREEN_FILTER && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: SCREEN_FILTER_COLOR, zIndex: 950 }]} pointerEvents="none" />
            )}

          </View>
        </View>
      </View>
    </ScreenDelay>
  );
};

// =========================================================================
// ESTILOS
// =========================================================================
const styles = StyleSheet.create({
  fullScreen:    { flex: 1, backgroundColor: '#000' },
  screenWrapper: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' },
  stage:         { backgroundColor: '#040711', position: 'relative', overflow: 'visible' },
  fill:          { width: '100%', height: '100%' },
  fallback:      { flex: 1, borderWidth: 1, borderRadius: 2, padding: 2, justifyContent: 'center', alignItems: 'center' },
  fbLabel:       { fontSize: 7.5, color: '#fff', fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5 },
  hotspot:       { position: 'absolute', zIndex: 65, justifyContent: 'center', alignItems: 'center' },
  hotspotLabel:  { fontSize: 8, color: '#fff', fontWeight: 'bold', letterSpacing: 0.5, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 2 },
  refBox:        { position: 'absolute', left: 0, right: 0, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, zIndex: 900 },
  zoneTag:       { fontFamily: TYPOGRAPHY.systemPC, fontSize: 12, color: '#fff', letterSpacing: 1, fontWeight: 'bold', opacity: 0.95 },
});
