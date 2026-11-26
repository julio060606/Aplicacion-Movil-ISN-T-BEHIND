/**
 * =========================================================================
 * src/components/scene/vectors/ScannerVectorial.tsx
 * =========================================================================
 * Textura vectorial plana del ESCÁNER óptico de mostrador.
 * =========================================================================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
  width: number;
  height: number;
}

export const ScannerVectorial: React.FC<Props> = ({ width, height }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 130 128">
        <Defs>
          {/* Gradiente del cristal óptico */}
          <LinearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0B131E" />
            <Stop offset="50%" stopColor="#0F2236" />
            <Stop offset="100%" stopColor="#070C14" />
          </LinearGradient>
        </Defs>

        {/* Base metálica exterior */}
        <Rect x="4" y="6" width="122" height="116" rx="4" fill="#18202A" stroke="#0E131A" strokeWidth="2" />
        
        {/* Bisel frontal */}
        <Rect x="10" y="12" width="110" height="104" rx="2" fill="#202A36" stroke="#334155" strokeWidth="1.5" />

        {/* Ventana de lectura óptica (cristal) */}
        <Rect x="18" y="24" width="94" height="68" rx="2" fill="url(#glassGrad)" stroke="#1E293B" strokeWidth="1.5" />

        {/* Rejilla de calibración de lectura */}
        <Line x1="18" y1="46" x2="112" y2="46" stroke="#1E3A5F" strokeWidth="0.8" strokeDasharray="3,3" />
        <Line x1="18" y1="70" x2="112" y2="70" stroke="#1E3A5F" strokeWidth="0.8" strokeDasharray="3,3" />
        <Line x1="65" y1="24" x2="65" y2="92" stroke="#1E3A5F" strokeWidth="0.8" strokeDasharray="3,3" />

        {/* Haz de luz de escaneo láser (Verde fósforo o Cian C.S.T.) */}
        <Line x1="22" y1="58" x2="108" y2="58" stroke="#00FF66" strokeWidth="2.5" opacity={0.85} />
        <Line x1="26" y1="58" x2="104" y2="58" stroke="#A7F3D0" strokeWidth="1" />

        {/* LED Indicador superior */}
        <Circle cx="26" cy="18" r="3" fill="#00FF66" />
        <SvgText x="34" y="20.5" fill="#64748B" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
          RDY
        </SvgText>

        {/* LED Error / Bus */}
        <Circle cx="104" cy="18" r="3" fill="#38BDF8" opacity={0.6} />

        {/* Etiqueta inferior del consorcio */}
        <Rect x="20" y="96" width="90" height="14" fill="#0B0F17" stroke="#1E293B" strokeWidth="1" />
        <SvgText x="65" y="106" fill="#38BDF8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          SCANNER C.S.T.-OP4
        </SvgText>

        {/* Tornillos esquineros */}
        <Circle cx="14" cy="16" r="1.5" fill="#64748B" />
        <Circle cx="116" cy="16" r="1.5" fill="#64748B" />
        <Circle cx="14" cy="112" r="1.5" fill="#64748B" />
        <Circle cx="116" cy="112" r="1.5" fill="#64748B" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
