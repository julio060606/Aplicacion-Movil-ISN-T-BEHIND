/**
 * =========================================================================
 * src/components/scene/InHandToolOverlay.tsx
 * =========================================================================
 * Renderizado en primer plano (en mano) de la herramienta activa.
 * 
 * - Controlado dinámicamente por la inclinación del acelerómetro (expo-sensors).
 * - Para LINTERNA_UV: proyecta un cono de luz UV reactivo que revela sellos
 *   antifraude en las credenciales C.S.T. al iluminarlas.
 * - Desactivación inmediata al tocar el slot o botón de enfundar.
 * =========================================================================
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
  Line,
} from 'react-native-svg';
import { ToolDef } from './vectors/ToolVectors';
import { TYPOGRAPHY } from '../../theme/typography';

interface Props {
  activeTool: ToolDef | null;
  scale: number;
  stageWidth: number;
  stageHeight: number;
  tiltX: number;
  tiltY: number;
  onDeactivate: () => void;
  onUvTargetStateChange: (isTargetingDni: boolean) => void;
}

export const InHandToolOverlay: React.FC<Props> = ({
  activeTool,
  scale,
  stageWidth,
  stageHeight,
  tiltX,
  tiltY,
  onDeactivate,
  onUvTargetStateChange,
}) => {
  if (!activeTool) return null;

  // Centro de la mesa de inspección (relativo al stage 1049 x 484)
  const baseCenterX = 330 * scale;
  const baseCenterY = 240 * scale;

  // Desplazamiento dinámico por acelerómetro
  const spotX = Math.max(
    60 * scale,
    Math.min(stageWidth - 60 * scale, baseCenterX + tiltX * 220 * scale)
  );
  const spotY = Math.max(
    50 * scale,
    Math.min(stageHeight - 50 * scale, baseCenterY + tiltY * 140 * scale)
  );

  // Zona del carrusel de documentos (Figma 463-313 = 150, 183-69 = 114, w: 364, h: 365)
  const docLeft = 140 * scale;
  const docRight = (140 + 360) * scale;
  const docTop = 100 * scale;
  const docBottom = (100 + 350) * scale;

  const isTargetingDni =
    activeTool.type === 'LINTERNA_UV' &&
    spotX >= docLeft &&
    spotX <= docRight &&
    spotY >= docTop &&
    spotY <= docBottom;

  useEffect(() => {
    onUvTargetStateChange(isTargetingDni);
  }, [isTargetingDni, onUvTargetStateChange]);

  // Posición de la mano del operador sosteniendo la herramienta (borde inferior)
  const handX = stageWidth * 0.48;
  const handY = stageHeight - 12 * scale;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* ── 1. PROYECCIÓN DE LUZ DE LINTERNA UV ────────────────────────── */}
      {activeTool.type === 'LINTERNA_UV' && (
        <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Defs>
            {/* Haz cónico UV tenue */}
            <LinearGradient id="uvConeGrad" x1={handX} y1={handY} x2={spotX} y2={spotY} gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#4A3B58" stopOpacity="0.75" />
              <Stop offset="70%" stopColor="#6C587D" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#9381A4" stopOpacity="0.15" />
            </LinearGradient>

            {/* Mancha focal ultravioleta sobre la mesa (fósforo suave a 365nm) */}
            <RadialGradient
              id="uvSpotGrad"
              cx={spotX}
              cy={spotY}
              r={90 * scale}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#A894B8" stopOpacity="0.65" />
              <Stop offset="45%" stopColor="#7B698C" stopOpacity="0.4" />
              <Stop offset="85%" stopColor="#4D3F59" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#251E2B" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Cono de luz desde la linterna hacia el foco */}
          <Path
            d={`M ${handX - 25 * scale} ${handY} L ${spotX - 70 * scale} ${spotY} A ${70 * scale} ${50 * scale} 0 0 1 ${spotX + 70 * scale} ${spotY} L ${handX + 25 * scale} ${handY} Z`}
            fill="url(#uvConeGrad)"
          />

          {/* Círculo de luz UV focalizada sobre los objetos */}
          <Circle cx={spotX} cy={spotY} r={80 * scale} fill="url(#uvSpotGrad)" />
          <Circle
            cx={spotX}
            cy={spotY}
            r={76 * scale}
            fill="none"
            stroke="#9381A4"
            strokeWidth={1}
            strokeDasharray="4,3"
            opacity={0.5}
          />
        </Svg>
      )}

      {/* ── 2. LUPA METROLÓGICA 8X ───────────────────────────────────────── */}
      {activeTool.type === 'LUPA' && (
        <Svg style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Defs>
            <RadialGradient id="lensReflect" cx={spotX} cy={spotY} r={65 * scale} gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
              <Stop offset="75%" stopColor="#0284C7" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#0369A1" stopOpacity="0.1" />
            </RadialGradient>
          </Defs>
          {/* Lente circular con retícula metrológica */}
          <Circle cx={spotX} cy={spotY} r={65 * scale} fill="url(#lensReflect)" stroke="#94A3B8" strokeWidth={5 * scale} />
          <Circle cx={spotX} cy={spotY} r={58 * scale} fill="none" stroke="#38BDF8" strokeWidth={1} strokeDasharray="3,2" />
          <Line x1={spotX - 40 * scale} y1={spotY} x2={spotX + 40 * scale} y2={spotY} stroke="#38BDF8" strokeWidth={1} opacity={0.5} />
          <Line x1={spotX} y1={spotY - 40 * scale} x2={spotX} y2={spotY + 40 * scale} stroke="#38BDF8" strokeWidth={1} opacity={0.5} />
          {/* Mango hacia la mano */}
          <Line x1={spotX + 46 * scale} y1={spotY + 46 * scale} x2={handX} y2={handY} stroke="#334155" strokeWidth={10 * scale} strokeLinecap="round" />
        </Svg>
      )}

      {/* ── 3. MANO DEL OPERARIO CON LA HERRAMIENTA (Borde inferior) ───── */}
      <View style={[styles.handContainer, { left: handX - 70 * scale, top: handY - 55 * scale }]}>
        <Svg width={140 * scale} height={70 * scale} viewBox="0 0 140 70">
          {/* Manga de uniforme de operario C.S.T. */}
          <Rect x="42" y="32" width="56" height="38" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <Line x1="42" y1="46" x2="98" y2="46" stroke="#2E86C1" strokeWidth="2" />
          {/* Guante de trabajo de cuero gris/marrón */}
          <Path d="M 46 32 C 46 16, 94 16, 94 32 Z" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
          {/* Dedos envolviendo empuñadura */}
          <Circle cx="56" cy="24" r="6" fill="#475569" />
          <Circle cx="66" cy="22" r="6" fill="#475569" />
          <Circle cx="76" cy="22" r="6" fill="#475569" />
          <Circle cx="86" cy="24" r="6" fill="#475569" />
        </Svg>
      </View>

      {/* ── 4. BANNER DIEGÉTICO DE HERRAMIENTA EN MANO // TELEMETRÍA ───── */}
      <View style={styles.hudTopRight} pointerEvents="box-none">
        <View style={styles.hudCard}>
          <View style={styles.hudHeader}>
            <Text style={styles.hudTitle}>[ EN MANO: {activeTool.shortName} ]</Text>
            <TouchableOpacity onPress={onDeactivate} style={styles.stowBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Text style={styles.stowBtnText}>[ GUARDAR X ]</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hudSub}>
            INCLINACIÓN SENSOR: X: {tiltX.toFixed(2)} // Y: {tiltY.toFixed(2)}
          </Text>
          {isTargetingDni && (
            <Text style={styles.hudUvAlert}>
              ★ FLUORESCENCIA C.S.T. DETECTADA EN CREDENCIAL ★
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 85, // Encima de la mesa, debajo de overlays superiores
  },
  handContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudTopRight: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    alignItems: 'flex-end',
  },
  hudCard: {
    backgroundColor: 'rgba(7, 12, 20, 0.92)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 200,
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  hudTitle: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 8.5,
    color: '#CBD5E1',
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  hudSub: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7.5,
    color: '#64748B',
  },
  hudUvAlert: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7.5,
    color: '#B5A2C0',
    fontWeight: 'bold',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  stowBtn: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#475569',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  stowBtnText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7.5,
    color: '#F8FAFC',
  },
});
