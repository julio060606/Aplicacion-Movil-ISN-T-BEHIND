/**
 * =========================================================================
 * src/components/scene/vectors/BolsaVectorial.tsx
 * =========================================================================
 * Textura vectorial plana del DISPENSADOR DE BOLSAS de mercancía.
 * =========================================================================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Line, Text as SvgText, Circle } from 'react-native-svg';

interface Props {
  width: number;
  height: number;
}

export const BolsaVectorial: React.FC<Props> = ({ width, height }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 57 81">
        {/* Soporte metálico fijado a la mesa */}
        <Rect x="6" y="2" width="45" height="12" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <Circle cx="12" cy="8" r="1.5" fill="#64748B" />
        <Circle cx="45" cy="8" r="1.5" fill="#64748B" />

        {/* Rodillo / Ranura de salida */}
        <Rect x="10" y="10" width="37" height="6" fill="#0A0F18" stroke="#334155" strokeWidth="1" />

        {/* Bolsa de papel kraft / polímero colgando */}
        <Path
          d="M 12 16 L 45 16 L 49 68 L 44 74 L 13 74 L 8 68 Z"
          fill="#524331"
          stroke="#36291C"
          strokeWidth="1.5"
        />

        {/* Dobleces / Pliegues laterales de la bolsa */}
        <Line x1="18" y1="16" x2="16" y2="74" stroke="#3E3022" strokeWidth="1" strokeDasharray="3,2" />
        <Line x1="39" y1="16" x2="41" y2="74" stroke="#3E3022" strokeWidth="1" strokeDasharray="3,2" />

        {/* Asa troquelada de la bolsa */}
        <Rect x="20" y="26" width="17" height="6" rx="3" fill="#2E2317" stroke="#1F160E" strokeWidth="1" />

        {/* Estampado corporativo del C.S.T. en la bolsa */}
        <Rect x="17" y="40" width="23" height="16" fill="#3D3021" stroke="#251C12" strokeWidth="0.8" />
        <SvgText x="28.5" y="49" fill="#2E86C1" fontSize="4.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          C.S.T.
        </SvgText>
        <SvgText x="28.5" y="54" fill="#8C765C" fontSize="3.5" fontFamily="monospace" textAnchor="middle">
          SECTOR 4
        </SvgText>

        {/* Flecha indicadora diegética hacia abajo */}
        <Path d="M 28.5 62 L 25 66 L 32 66 Z" fill="#A8947B" />
        <SvgText x="28.5" y="72" fill="#D6C4AE" fontSize="4.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          JALAR
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
