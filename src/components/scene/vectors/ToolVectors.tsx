/**
 * =========================================================================
 * src/components/scene/vectors/ToolVectors.tsx
 * =========================================================================
 * Gráficos vectoriales planos para las herramientas de cajón y slots:
 * - Linterna UV
 * - Lupa de Inspección
 * - Revólver .38
 * - Píldoras C.S.T.
 * =========================================================================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Path, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

export interface ToolDef {
  id: string;
  name: string;
  shortName: string;
  code: string;
  type: 'LINTERNA_UV' | 'LUPA' | 'REVOLVER' | 'PILDORAS';
}

export const TOOLS_CATALOG: ToolDef[] = [
  { id: 'linterna_uv', name: 'LINTERNA UV // ULTRAVIOLETA', shortName: 'LINTERNA UV', code: 'CST-UV-01', type: 'LINTERNA_UV' },
  { id: 'lupa', name: 'LUPA METROLÓGICA 8X', shortName: 'LUPA 8X', code: 'CST-LUP-04', type: 'LUPA' },
  { id: 'revolver', name: 'REVÓLVER .38 // SERVICIO', shortName: 'REVÓLVER .38', code: 'D.S.U.-W38', type: 'REVOLVER' },
  { id: 'pildoras', name: 'ESTABILIZADOR PROFILÁCTICO', shortName: 'PÍLDORAS CST', code: 'PHARM-VAL-B', type: 'PILDORAS' },
];

interface ToolIconProps {
  type: ToolDef['type'];
  width: number;
  height: number;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ type, width, height }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      {type === 'LINTERNA_UV' && (
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="uvBeam" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#6B21A8" stopOpacity="0.2" />
            </LinearGradient>
          </Defs>
          {/* Haz UV */}
          <Path d="M 35 30 L 65 30 L 85 85 L 15 85 Z" fill="url(#uvBeam)" />
          {/* Cuerpo cilíndrico de linterna */}
          <Rect x="40" y="8" width="20" height="26" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <Rect x="36" y="24" width="28" height="8" rx="2" fill="#334155" />
          {/* Lente violeta */}
          <Circle cx="50" cy="30" r="10" fill="#9333EA" stroke="#C084FC" strokeWidth="1.5" />
          <Circle cx="50" cy="30" r="4" fill="#F3E8FF" />
          <SvgText x="50" y="94" fill="#C084FC" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            [ UV-365nm ]
          </SvgText>
        </Svg>
      )}

      {type === 'LUPA' && (
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="lensGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>
          {/* Mango metálico en diagonal */}
          <Line x1="62" y1="62" x2="88" y2="88" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <Line x1="62" y1="62" x2="88" y2="88" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          {/* Aro de la lupa */}
          <Circle cx="44" cy="44" r="26" fill="url(#lensGrad)" stroke="#64748B" strokeWidth="4" />
          <Circle cx="44" cy="44" r="22" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4,2" />
          {/* Destello de luz en el cristal */}
          <Path d="M 28 34 A 18 18 0 0 1 48 24" fill="none" stroke="#F0F9FF" strokeWidth="2.5" strokeLinecap="round" />
          <SvgText x="44" y="47" fill="#E0F2FE" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            8X
          </SvgText>
        </Svg>
      )}

      {type === 'REVOLVER' && (
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          {/* Cañón del arma */}
          <Rect x="20" y="38" width="46" height="12" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
          <Rect x="16" y="36" width="6" height="5" fill="#475569" />
          {/* Tambor cilíndrico */}
          <Rect x="44" y="34" width="22" height="18" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
          <Line x1="44" y1="43" x2="66" y2="43" stroke="#0F172A" strokeWidth="1" />
          {/* Armazón y gatillo */}
          <Rect x="60" y="44" width="10" height="14" fill="#1E293B" />
          <Path d="M 64 56 C 58 56, 56 50, 56 46" fill="none" stroke="#94A3B8" strokeWidth="2" />
          {/* Empuñadura de madera/baquelita */}
          <Path d="M 66 46 L 82 76 C 80 82, 70 82, 68 80 L 58 56 Z" fill="#4E3629" stroke="#2B1D16" strokeWidth="2" />
          <Circle cx="72" cy="66" r="2" fill="#A8947B" />
          <SvgText x="50" y="94" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">
            .38 SPECIAL
          </SvgText>
        </Svg>
      )}

      {type === 'PILDORAS' && (
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          {/* Frasco farmacéutico ámbar/azul C.S.T. */}
          <Rect x="34" y="24" width="32" height="52" rx="4" fill="#1E3A8A" stroke="#2E86C1" strokeWidth="2" opacity={0.85} />
          {/* Tapa blanca con precinto */}
          <Rect x="37" y="16" width="26" height="10" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <Line x1="37" y1="20" x2="63" y2="20" stroke="#64748B" strokeWidth="1" />
          {/* Etiqueta corporativa */}
          <Rect x="36" y="34" width="28" height="26" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
          <SvgText x="50" y="44" fill="#38BDF8" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            C.S.T.
          </SvgText>
          <SvgText x="50" y="52" fill="#E2E8F0" fontSize="5" fontFamily="monospace" textAnchor="middle">
            ESTABILIZ.
          </SvgText>
          {/* Píldora individual al lado */}
          <Path d="M 68 62 C 68 56, 76 56, 76 62 L 76 72 C 76 78, 68 78, 68 72 Z" fill="#2E86C1" stroke="#38BDF8" strokeWidth="1" />
          <Line x1="68" y1="67" x2="76" y2="67" stroke="#FFFFFF" strokeWidth="1" />
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
