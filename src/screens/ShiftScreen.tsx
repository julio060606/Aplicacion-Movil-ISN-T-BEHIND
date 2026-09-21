/**
 * =========================================================================
 * src/screens/ShiftScreen.tsx
 * =========================================================================
 * RESPONSABILIDAD ÚNICA: Orquestar y renderizar la escena del turno.
 *
 * NO contiene:
 *   ✗ Coordenadas de Figma          → sceneConfig.ts
 *   ✗ Lógica de negocio del juego   → useTurnEngine.ts
 *   ✗ Animaciones de cámara/lámpara → useSceneCamera.ts
 *   ✗ Estado de cajones/carrusel    → useDrawers.ts
 *   ✗ Estado de overlays            → useOverlays.ts
 *
 * SÍ contiene:
 *   ✓ Composición de los 4 hooks
 *   ✓ Roll-Up Door PanResponder (único pannable que no tiene hook propio)
 *   ✓ JSX de render: <GameSprite>, <TouchableOpacity>, overlays
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
import { GameSprite } from '../components/scene/GameSprite';
import {
  ADAPTED_ELEMENTS, ISceneElement, SPRITE_ASSETS,
  FORCE_COLOR_BOXES, SHOW_REFERENCE_COLOR_BOXES, ENABLE_SCREEN_FILTER,
  SCREEN_FILTER_COLOR, COLOR_ZONES, TABLE_CAROUSEL_ITEMS,
  FIGMA_OFFSET_X, FIGMA_OFFSET_Y,
} from '../config/sceneConfig';
import { useTurnEngine }  from '../hooks/useTurnEngine';
import { useSceneCamera } from '../hooks/useSceneCamera';
import { useDrawers }     from '../hooks/useDrawers';
import { useOverlays }    from '../hooks/useOverlays';

type Props = NativeStackScreenProps<RootStackParamList, 'GameInterface' | 'Shift'>;

// ── Helpers de módulo ─────────────────────────────────────────────────────────
/** Busca un elemento por ID (llamado una vez al montar, no en cada render) */
const el = (id: string): ISceneElement => ADAPTED_ELEMENTS.find(e => e.id === id)!;

// =========================================================================
// SUB-COMPONENTE: Flechas de carrusel (solo visual, sin estado)
// =========================================================================
interface CarouselArrowsProps {
  onPrev: () => void; onNext: () => void;
  canPrev: boolean;   canNext: boolean;
  anchorLeft: number; anchorTop: number; anchorWidth: number;
}
const CarouselArrows: React.FC<CarouselArrowsProps> = ({
  onPrev, onNext, canPrev, canNext, anchorLeft, anchorTop, anchorWidth,
}) => (
  <>
    <TouchableOpacity onPress={onPrev} disabled={!canPrev} hitSlop={{ top: 14, bottom: 14, left: 8, right: 8 }}
      style={[styles.carouselArrow, { left: anchorLeft - 30, top: anchorTop - 18, opacity: canPrev ? 1 : 0.3 }]}>
      <Text style={styles.carouselArrowText}>❮</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onNext} disabled={!canNext} hitSlop={{ top: 14, bottom: 14, left: 8, right: 8 }}
      style={[styles.carouselArrow, { left: anchorLeft + anchorWidth + 4, top: anchorTop - 18, opacity: canNext ? 1 : 0.3 }]}>
      <Text style={styles.carouselArrowText}>❯</Text>
    </TouchableOpacity>
  </>
);

// =========================================================================
// PANTALLA PRINCIPAL
// =========================================================================
export const ShiftScreen: React.FC<Props> = ({ route }) => {
  const currentDay = route.params && 'currentDay' in route.params ? route.params.currentDay : 1;

  // ── Escala global ─────────────────────────────────────────────────────────
  const { height: windowHeight } = useWindowDimensions();
  const scale      = windowHeight / 1456;
  const stageWidth = Math.round(646 * scale);

  /** Convierte px Figma relativos al offset → px pantalla */
  const px = (figmaPx: number) => Math.round(figmaPx * scale);
  /** Devuelve estilo absoluto de posición a partir de un ISceneElement */
  const pos = (e: ISceneElement) => ({
    left:   px(e.figmaLeft - FIGMA_OFFSET_X),
    top:    px(e.figmaTop  - FIGMA_OFFSET_Y),
    width:  px(e.figmaWidth),
    height: px(e.figmaHeight),
  });

  // ── Hooks (orden: overlays primero porque provee isBlocked) ──────────────
  const engine   = useTurnEngine(currentDay);
  const overlays = useOverlays(scale, windowHeight);
  const drawers  = useDrawers(scale, overlays.isBlocked);
  const camera   = useSceneCamera(scale, overlays.isBlocked, drawers.carouselFocused);

  // ── Roll-Up Door: PanResponder (lee panConfig de sceneConfig) ─────────────
  const rollEl    = el('roll-up-door');
  const ROLL_MAX  = px(rollEl.panConfig?.maxTranslateY ?? 478);
  const rollSnaps = (rollEl.panConfig?.snapPositions ?? [0, 478]).map(px);
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

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.fullScreen}>
      <StatusBar hidden />
      <View style={styles.screenWrapper}>
        <View style={[styles.stage, { width: stageWidth, height: windowHeight }]} collapsable={false}>

          {/* ================================================================
              CÁMARA GLOBAL: zoom + paneo
              ================================================================ */}
          <Animated.View style={[styles.camera, { transform: camera.cameraTransform }]}>

            {/* Sprites estáticos y sombras — sin interacción */}
            {ADAPTED_ELEMENTS
              .filter(e => e.behavior === 'static' || e.behavior === 'shadow')
              .map(e => (
                <GameSprite key={e.id} element={e} scale={scale}
                  inspectOpacity={e.hasInspectOpacity ? camera.inspectOpacity : undefined}
                />
              ))}

            {/* Roll-Up Door — arrastrable verticalmente */}
            <Animated.View
              {...rollDoorPan.panHandlers}
              style={[{ position: 'absolute', ...pos(rollEl), zIndex: rollEl.zIndex },
                      { transform: [{ translateY: rollDoorY }] }]}
            >
              {SPRITE_ASSETS['roll-up-door'] && !FORCE_COLOR_BOXES
                ? <Image source={SPRITE_ASSETS['roll-up-door']} style={styles.fill} resizeMode="stretch" />
                : <View style={[styles.fallback, { backgroundColor: rollEl.fallbackColor }]}><Text style={styles.fbLabel}>PERSIANA</Text></View>}
            </Animated.View>

            {/* Lámpara Cabeza — arrastrable libremente */}
            <Animated.View
              {...camera.lampPanResponder.panHandlers}
              style={[{ position: 'absolute', ...pos(el('lampara-cabeza')), zIndex: el('lampara-cabeza').zIndex },
                      { transform: [{ translateX: camera.lampX }, { translateY: camera.lampY }] }]}
            >
              {SPRITE_ASSETS['lampara-cabeza'] && !FORCE_COLOR_BOXES
                ? <Image source={SPRITE_ASSETS['lampara-cabeza']} style={styles.fill} resizeMode="stretch" />
                : <View style={[styles.fallback, { backgroundColor: el('lampara-cabeza').fallbackColor }]}><Text style={styles.fbLabel}>LÁMPARA</Text></View>}
            </Animated.View>

            {/* PC — tap abre monitor */}
            {(() => { const e = el('pc'); return (
              <TouchableOpacity key="pc" onPress={overlays.openMonitor}
                disabled={overlays.isBlocked} activeOpacity={0.85}
                style={{ position: 'absolute', ...pos(e), zIndex: e.zIndex }}
              >
                {SPRITE_ASSETS['pc'] && !FORCE_COLOR_BOXES
                  ? <Image source={SPRITE_ASSETS['pc']} style={styles.fill} resizeMode="stretch" />
                  : <View style={[styles.fallback, { backgroundColor: e.fallbackColor }]}><Text style={styles.fbLabel}>PC</Text></View>}
              </TouchableOpacity>
            ); })()}

            {/* Caja Cartón — tap abre submenu */}
            {(() => { const e = el('caja-carton'); return (
              <TouchableOpacity key="caja-carton" onPress={() => drawers.setCajaCartonOpen(v => !v)}
                disabled={overlays.isBlocked} activeOpacity={0.9}
                style={{ position: 'absolute', ...pos(e), zIndex: e.zIndex }}
              >
                {SPRITE_ASSETS['caja-carton'] && !FORCE_COLOR_BOXES
                  ? <Image source={SPRITE_ASSETS['caja-carton']} style={styles.fill} resizeMode="stretch" />
                  : <View style={[styles.fallback, { backgroundColor: e.fallbackColor }]}><Text style={styles.fbLabel}>CAJA CARTÓN {drawers.cajaCartonOpen ? '▲' : ''}</Text></View>}
              </TouchableOpacity>
            ); })()}

            {/* Cajones — estado + animación desde useDrawers */}
            {drawers.drawerIds.map(id => {
              const e      = el(id);
              const drawer = drawers.getDrawer(id);
              if (!drawer) return null;
              return (
                <Animated.View key={id}
                  style={[{ position: 'absolute', ...pos(e), zIndex: drawer.isOpen ? e.zIndex + 10 : e.zIndex },
                          { transform: [{ translateY: drawer.animValue }] }]}
                >
                  <TouchableOpacity onPress={() => drawers.toggleDrawer(id)}
                    disabled={overlays.isBlocked} activeOpacity={0.85} style={StyleSheet.absoluteFill}>
                    {SPRITE_ASSETS[id] && !FORCE_COLOR_BOXES
                      ? <Image source={SPRITE_ASSETS[id]} style={styles.fill} resizeMode="stretch" />
                      : <View style={[styles.fallback, { backgroundColor: e.fallbackColor }]}><Text style={styles.fbLabel}>{e.label} {drawer.isOpen ? '▲' : '▼'}</Text></View>}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}

            {/* Slots visuales + flechas de cajones abiertos */}
            {drawers.drawerIds.map(id => {
              const drawer = drawers.getDrawer(id);
              if (!drawer?.isOpen) return null;
              const slotEl     = el(drawer.carouselSlotId);
              const slotPos    = pos(slotEl);
              const activeSprite = SPRITE_ASSETS[drawer.items[drawer.activeItemIdx]];
              return (
                <React.Fragment key={`open-${id}`}>
                  <View pointerEvents="none"
                    style={{ position: 'absolute', ...slotPos, zIndex: 45 }}>
                    {activeSprite && !FORCE_COLOR_BOXES
                      ? <Image source={activeSprite} style={styles.fill} resizeMode="contain" />
                      : <View style={[styles.fallback, { backgroundColor: 'rgba(185,28,28,0.7)' }]}><Text style={styles.fbLabel}>{drawer.items[drawer.activeItemIdx]}</Text></View>}
                  </View>
                  <CarouselArrows
                    onPrev={() => drawers.prevItem(id)} onNext={() => drawers.nextItem(id)}
                    canPrev={drawer.activeItemIdx > 0} canNext={drawer.activeItemIdx < drawer.items.length - 1}
                    anchorLeft={slotPos.left} anchorTop={slotPos.top + slotPos.height} anchorWidth={slotPos.width}
                  />
                </React.Fragment>
              );
            })}

            {/* Carrusel Mesa — tap enfoca/desenfoca cámara */}
            {(() => { const e = el('carrusel-mesa'); const ePos = pos(e); return (
              <>
                <TouchableOpacity key="carrusel-mesa"
                  onPress={drawers.carouselFocused
                    ? () => { drawers.setCarouselFocused(false); camera.blurCarousel(); }
                    : () => { drawers.setCarouselFocused(true);  camera.focusCarousel(); }}
                  disabled={overlays.isBlocked} activeOpacity={0.9}
                  style={{ position: 'absolute', ...ePos, zIndex: e.zIndex }}
                >
                  {SPRITE_ASSETS['carrusel-mesa'] && !FORCE_COLOR_BOXES
                    ? <Image source={SPRITE_ASSETS['carrusel-mesa']} style={styles.fill} resizeMode="stretch" />
                    : <View style={[styles.fallback, { backgroundColor: e.fallbackColor }]}><Text style={styles.fbLabel}>{TABLE_CAROUSEL_ITEMS[drawers.tableCarouselIdx]}</Text></View>}
                </TouchableOpacity>

                {/* Slot activo del carrusel de mesa */}
                {(() => { const se = el('no-texture'); const activeSrc = SPRITE_ASSETS[TABLE_CAROUSEL_ITEMS[drawers.tableCarouselIdx]]; return (
                  <View key="slot-mesa" pointerEvents="none"
                    style={{ position: 'absolute', ...pos(se), zIndex: se.zIndex }}>
                    {activeSrc && !FORCE_COLOR_BOXES
                      ? <Image source={activeSrc} style={styles.fill} resizeMode="contain" />
                      : <View style={[styles.fallback, { backgroundColor: se.fallbackColor }]}><Text style={styles.fbLabel}>{TABLE_CAROUSEL_ITEMS[drawers.tableCarouselIdx]}</Text></View>}
                  </View>
                ); })()}

                {/* Flechas carrusel mesa */}
                <CarouselArrows
                  onPrev={() => drawers.setTableCarouselIdx(i => Math.max(0, i - 1))}
                  onNext={() => drawers.setTableCarouselIdx(i => Math.min(TABLE_CAROUSEL_ITEMS.length - 1, i + 1))}
                  canPrev={drawers.tableCarouselIdx > 0} canNext={drawers.tableCarouselIdx < TABLE_CAROUSEL_ITEMS.length - 1}
                  anchorLeft={ePos.left} anchorTop={ePos.top + ePos.height} anchorWidth={ePos.width}
                />

                {/* Botón COBRAR */}
                {drawers.carouselFocused && !overlays.isBlocked && (
                  <TouchableOpacity onPress={overlays.openCaja}
                    style={[styles.payButton, { left: ePos.left + ePos.width - px(100), top: ePos.top + ePos.height + px(10), zIndex: 60 }]}>
                    <Text style={styles.payButtonText}>[ COBRAR ]</Text>
                  </TouchableOpacity>
                )}
              </>
            ); })()}

            {/* Zona táctil invisible de inspección (Zona B) */}
            <View style={[styles.inspectZone, { top: px(156), height: px(478), zIndex: 50 }]}
              {...(!overlays.isBlocked && !drawers.carouselFocused ? camera.inspectPanResponder.panHandlers : {})}
            />
          </Animated.View>

          {/* ================================================================
              OVERLAY: APUNTAR
              ================================================================ */}
          {overlays.isAiming && (
            <View style={[StyleSheet.absoluteFill, { zIndex: 990 }]}>
              <View pointerEvents="none"
                style={{ position: 'absolute', ...overlays.positions.apuntar, zIndex: 999 }}>
                {SPRITE_ASSETS['apuntar'] && !FORCE_COLOR_BOXES
                  ? <Image source={SPRITE_ASSETS['apuntar']} style={styles.fill} resizeMode="stretch" />
                  : <View style={[styles.fallback, { backgroundColor: 'rgba(239,68,68,0.40)' }]}><Text style={styles.fbLabel}>APUNTAR</Text></View>}
              </View>
              <View style={[styles.aimButtons, { zIndex: 1000 }]}>
                <TouchableOpacity onPress={overlays.holster} style={styles.aimBtnSecondary}>
                  <Text style={styles.aimBtnText}>[ GUARDAR ]</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { /* TODO: disparo */ overlays.holster(); }} style={styles.aimBtnDanger}>
                  <Text style={styles.aimBtnText}>[ DISPARAR ]</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* OVERLAY DIM — oscurece la escena cuando monitor o caja están abiertos */}
          {overlays.isAnyOverlayOpen && (
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, {
              backgroundColor: '#000',
              opacity: overlays.overlayDimAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.72] }),
              zIndex: 700,
            }]} />
          )}

          {/* ================================================================
              OVERLAY: MONITOR PC
              ================================================================ */}
          {overlays.monitorOpen && (
            <TouchableOpacity activeOpacity={1} onPress={overlays.closeMonitor}
              style={[StyleSheet.absoluteFill, { zIndex: 750 }]}>
              <Animated.View style={{ position: 'absolute', ...overlays.positions.monitor, zIndex: 800, transform: [{ scale: overlays.monitorScale }] }}>
                {SPRITE_ASSETS['monitor-1'] && !FORCE_COLOR_BOXES
                  ? <Image source={SPRITE_ASSETS['monitor-1']} style={styles.fill} resizeMode="stretch" />
                  : <View style={[styles.overlayPanel, { width: overlays.positions.monitor.width, height: overlays.positions.monitor.height }]}>
                      <Text style={styles.overlayTitle}>🖥  MONITOR PC</Text>
                      <Text style={styles.fbDims}>Añade monitor-1.webp — Toca fuera para cerrar</Text>
                    </View>}
              </Animated.View>
            </TouchableOpacity>
          )}

          {/* ================================================================
              OVERLAY: CAJA REGISTRADORA
              ================================================================ */}
          {overlays.cajaOpen && (
            <TouchableOpacity activeOpacity={1} onPress={overlays.closeCaja}
              style={[StyleSheet.absoluteFill, { zIndex: 750 }]}>
              <Animated.View style={{
                position: 'absolute',
                left: overlays.positions.caja.left, top: overlays.cajaSlideTop,
                width: overlays.positions.caja.width, height: overlays.positions.caja.height,
                zIndex: 800,
              }}>
                {SPRITE_ASSETS['registradora-arriba'] && !FORCE_COLOR_BOXES
                  ? <Image source={SPRITE_ASSETS['registradora-arriba']} style={styles.fill} resizeMode="stretch" />
                  : <View style={[styles.overlayPanel, { width: overlays.positions.caja.width, height: overlays.positions.caja.height }]}>
                      <Text style={styles.overlayTitle}>🧾  CAJA REGISTRADORA</Text>
                      <Text style={styles.fbDims}>Toca fuera para cerrar</Text>
                    </View>}
              </Animated.View>
            </TouchableOpacity>
          )}

          {/* Color Boxes de referencia (desarrollo) */}
          {SHOW_REFERENCE_COLOR_BOXES && (
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              {COLOR_ZONES.map(z => (
                <View key={z.label} style={[styles.refBox, { top: px(z.top), height: px(z.height), backgroundColor: z.bg, borderBottomColor: z.border }]}>
                  <Text style={styles.zoneTag}>{z.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Filtro atmosférico diegético */}
          {ENABLE_SCREEN_FILTER && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: SCREEN_FILTER_COLOR, zIndex: 950 }]} pointerEvents="none" />
          )}

        </View>
      </View>
    </View>
  );
};

// =========================================================================
// ESTILOS (solo los propios de esta pantalla)
// =========================================================================
const styles = StyleSheet.create({
  fullScreen:    { flex: 1, backgroundColor: '#000' },
  screenWrapper: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' },
  stage:         { backgroundColor: '#040711', position: 'relative', overflow: 'visible' },
  camera:        { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  fill:          { width: '100%', height: '100%' },
  fallback:      { flex: 1, borderWidth: 1, borderRadius: 2, padding: 2, justifyContent: 'center', alignItems: 'center' },
  fbLabel:       { fontSize: 7.5, color: '#fff', fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  fbDims:        { fontSize: 6.5, color: '#cbd5e1', textAlign: 'center', marginTop: 1, opacity: 0.85 },
  inspectZone:   { position: 'absolute', left: 0, right: 0, backgroundColor: 'transparent' },
  carouselArrow: { position: 'absolute', width: 28, height: 36, backgroundColor: 'rgba(0,0,0,0.68)', borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', justifyContent: 'center', alignItems: 'center', zIndex: 200 },
  carouselArrowText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  payButton:     { position: 'absolute', backgroundColor: 'rgba(0,255,102,0.15)', borderWidth: 1, borderColor: '#00ff66', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 3 },
  payButtonText: { fontFamily: TYPOGRAPHY.systemPC, color: '#00ff66', fontSize: 10, letterSpacing: 1 },
  overlayPanel:  { backgroundColor: 'rgba(15,23,42,0.97)', borderWidth: 1, borderColor: '#00ff66', borderRadius: 4, justifyContent: 'center', alignItems: 'center', padding: 14 },
  overlayTitle:  { fontFamily: TYPOGRAPHY.systemPC, color: '#00ff66', fontSize: 14, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  refBox:        { position: 'absolute', left: 0, right: 0, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, zIndex: 900 },
  zoneTag:       { fontFamily: TYPOGRAPHY.systemPC, fontSize: 12, color: '#fff', letterSpacing: 1, fontWeight: 'bold', opacity: 0.95 },
  aimButtons:    { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20 },
  aimBtnSecondary: { backgroundColor: 'rgba(71,85,105,0.88)', borderWidth: 1, borderColor: '#64748b', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 3 },
  aimBtnDanger:  { backgroundColor: 'rgba(127,29,29,0.88)', borderWidth: 1, borderColor: '#ef4444', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 3 },
  aimBtnText:    { fontFamily: TYPOGRAPHY.systemPC, color: '#fff', fontSize: 11, letterSpacing: 1 },
});
