/**
 * =========================================================================
 * src/components/scene/SceneOverlays.tsx
 * =========================================================================
 * RESPONSABILIDAD ÚNICA: Renderizar los overlays diegéticos del turno:
 *   - Overlay Dim (oscurecimiento de fondo)
 *   - Monitor PC (pc_abierto + pantalla_negra interactiva según Figma)
 *   - Caja Registradora (slide animado)
 *   - Apuntar (mira y acciones de defensa)
 * =========================================================================
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { TYPOGRAPHY } from '../../theme/typography';
import {
  SPRITE_ASSETS, FORCE_COLOR_BOXES,
  PC_ABIERTO_METRICS, PANTALLA_NEGRA_METRICS,
} from '../../config/sceneConfig';
import { useOverlays } from '../../hooks/useOverlays';

interface SceneOverlaysProps {
  overlays: ReturnType<typeof useOverlays>;
  scale: number;
}

export const SceneOverlays: React.FC<SceneOverlaysProps> = ({ overlays, scale }) => {
  return (
    <>
      {/* OVERLAY: APUNTAR */}
      {overlays.isAiming && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 990 }]}>
          <View pointerEvents="none"
            style={{ position: 'absolute', ...overlays.positions.apuntar, zIndex: 999 }}>
            {SPRITE_ASSETS['apuntar'] && !FORCE_COLOR_BOXES ? (
              <Image source={SPRITE_ASSETS['apuntar']} style={styles.fill} resizeMode="stretch" />
            ) : (
              <View style={[styles.fallback, { backgroundColor: 'rgba(239,68,68,0.40)' }]}>
                <Text style={styles.fbLabel}>APUNTAR</Text>
              </View>
            )}
          </View>
          <View style={[styles.aimButtons, { zIndex: 1000 }]}>
            <TouchableOpacity onPress={overlays.holster} style={styles.aimBtnSecondary}>
              <Text style={styles.aimBtnText}>[ GUARDAR ]</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => overlays.holster()} style={styles.aimBtnDanger}>
              <Text style={styles.aimBtnText}>[ DISPARAR ]</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* OVERLAY DIM — Oscurece la escena al abrir modales */}
      {overlays.isAnyOverlayOpen && (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, {
          backgroundColor: '#000',
          opacity: overlays.overlayDimAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.72] }),
          zIndex: 700,
        }]} />
      )}

      {/* OVERLAY: MONITOR PC (Fase 2 — pc_abierto + pantalla_negra interactiva) */}
      {overlays.monitorOpen && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 750 }]}>
          {/* Fondo marco PC Abierto */}
          <Image
            source={SPRITE_ASSETS['pc_abierto']}
            style={{
              position: 'absolute',
              left:   Math.round(PC_ABIERTO_METRICS.left * scale),
              top:    Math.round(PC_ABIERTO_METRICS.top * scale),
              width:  Math.round(PC_ABIERTO_METRICS.width * scale),
              height: Math.round(PC_ABIERTO_METRICS.height * scale),
            }}
            resizeMode="stretch"
          />

          {/* Pantalla negra interactiva de la terminal */}
          <View
            style={{
              position: 'absolute',
              left:   Math.round(PANTALLA_NEGRA_METRICS.left * scale),
              top:    Math.round(PANTALLA_NEGRA_METRICS.top * scale),
              width:  Math.round(PANTALLA_NEGRA_METRICS.width * scale),
              height: Math.round(PANTALLA_NEGRA_METRICS.height * scale),
              backgroundColor: '#000',
              overflow: 'hidden',
            }}
          >
            {SPRITE_ASSETS['pantalla_negra'] && (
              <Image source={SPRITE_ASSETS['pantalla_negra']} style={StyleSheet.absoluteFill} resizeMode="stretch" />
            )}

            <View style={styles.crtTerminalContainer}>
              <View style={styles.crtHeaderRow}>
                <Text style={styles.crtHeaderTitle}>C.S.T. TERMINAL OS // v2.0</Text>
                <TouchableOpacity onPress={overlays.closeMonitor} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.crtCloseBtn}>[X]</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.crtBody}>
                <Text style={styles.crtGreenText}>{'>'} SISTEMA CONECTADO</Text>
                <Text style={styles.crtSubText}>{'>'} GARITA #04 // PORTWALL</Text>
                <Text style={styles.crtStatus}>[ MENU EN CONSTRUCCION ]</Text>
              </View>

              <TouchableOpacity onPress={overlays.closeMonitor} style={styles.crtExitBar}>
                <Text style={styles.crtExitText}>[ ESC / VOLVER AL MOSTRADOR ]</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* OVERLAY: CAJA REGISTRADORA */}
      {overlays.cajaOpen && (
        <TouchableOpacity activeOpacity={1} onPress={overlays.closeCaja}
          style={[StyleSheet.absoluteFill, { zIndex: 750 }]}>
          <Animated.View style={{
            position: 'absolute',
            left: overlays.positions.caja.left, top: overlays.cajaSlideTop,
            width: overlays.positions.caja.width, height: overlays.positions.caja.height,
            zIndex: 800,
          }}>
            {SPRITE_ASSETS['registradora-arriba'] && !FORCE_COLOR_BOXES ? (
              <Image source={SPRITE_ASSETS['registradora-arriba']} style={styles.fill} resizeMode="stretch" />
            ) : (
              <View style={[styles.overlayPanel, { width: overlays.positions.caja.width, height: overlays.positions.caja.height }]}>
                <Text style={styles.overlayTitle}>🧾  CAJA REGISTRADORA</Text>
                <Text style={styles.fbDims}>Toca fuera para cerrar</Text>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fill:            { width: '100%', height: '100%' },
  fallback:        { flex: 1, borderWidth: 1, borderRadius: 2, padding: 2, justifyContent: 'center', alignItems: 'center' },
  fbLabel:         { fontSize: 7.5, color: '#fff', fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5 },
  fbDims:          { fontSize: 6.5, color: '#cbd5e1', textAlign: 'center', marginTop: 1, opacity: 0.85 },
  overlayPanel:    { backgroundColor: 'rgba(15,23,42,0.97)', borderWidth: 1, borderColor: '#00ff66', borderRadius: 4, justifyContent: 'center', alignItems: 'center', padding: 14 },
  overlayTitle:    { fontFamily: TYPOGRAPHY.systemPC, color: '#00ff66', fontSize: 14, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  aimButtons:      { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20 },
  aimBtnSecondary: { backgroundColor: 'rgba(71,85,105,0.88)', borderWidth: 1, borderColor: '#64748b', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 3 },
  aimBtnDanger:    { backgroundColor: 'rgba(127,29,29,0.88)', borderWidth: 1, borderColor: '#ef4444', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 3 },
  aimBtnText:      { fontFamily: TYPOGRAPHY.systemPC, color: '#fff', fontSize: 11, letterSpacing: 1 },
  // Terminal CRT
  crtTerminalContainer: { flex: 1, padding: 8, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.82)' },
  crtHeaderRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#00ff66', paddingBottom: 4 },
  crtHeaderTitle:  { fontFamily: TYPOGRAPHY.systemPC, color: '#00ff66', fontSize: 9, letterSpacing: 0.8, fontWeight: 'bold' },
  crtCloseBtn:     { fontFamily: TYPOGRAPHY.systemPC, color: '#ef4444', fontSize: 10, fontWeight: 'bold' },
  crtBody:         { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
  crtGreenText:    { fontFamily: TYPOGRAPHY.systemPC, color: '#00ff66', fontSize: 8.5, letterSpacing: 0.5 },
  crtSubText:      { fontFamily: TYPOGRAPHY.systemPC, color: '#68d391', fontSize: 7.5, opacity: 0.8 },
  crtStatus:       { fontFamily: TYPOGRAPHY.systemPC, color: '#cbd5e1', fontSize: 7.5, marginTop: 6, opacity: 0.6 },
  crtExitBar:      { borderTopWidth: 1, borderTopColor: 'rgba(0,255,102,0.3)', paddingTop: 4, alignItems: 'center' },
  crtExitText:     { fontFamily: TYPOGRAPHY.systemPC, color: '#00ff66', fontSize: 7.5, letterSpacing: 0.5 },
});
