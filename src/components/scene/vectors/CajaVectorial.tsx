/**
 * =========================================================================
 * src/components/scene/vectors/CajaVectorial.tsx
 * =========================================================================
 * Textura vectorial plana de la CAJA DE CARTÓN industrial.
 * =========================================================================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Line, Text as SvgText, G } from 'react-native-svg';

interface Props {
  width: number;
  height: number;
  isOpen?: boolean;
}

export const CajaVectorial: React.FC<Props> = ({ width, height, isOpen = false }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 364 226">
        {/* Sombra base */}
        <Rect x="6" y="8" width="352" height="212" fill="#1A140E" opacity={0.6} />

        {/* Cuerpo principal de la caja (Cartón kraft oscuro) */}
        <Rect
          x="10"
          y="12"
          width="344"
          height="202"
          fill={isOpen ? '#433423' : '#4E3D2B'}
          stroke="#2A1F14"
          strokeWidth="3"
        />

        {/* Textura de solapas y pliegues */}
        <Line x1="10" y1="70" x2="354" y2="70" stroke="#36291C" strokeWidth="2" strokeDasharray="6,4" />
        <Line x1="182" y1="12" x2="182" y2="214" stroke="#2E2317" strokeWidth="2" />

        {/* Cinta de embalaje desgastada en cruz */}
        <Rect x="164" y="12" width="36" height="202" fill="#755E3F" opacity={0.75} />
        <Line x1="164" y1="12" x2="164" y2="214" stroke="#5A472E" strokeWidth="1" />
        <Line x1="200" y1="12" x2="200" y2="214" stroke="#5A472E" strokeWidth="1" />

        {/* Solapa superior interactiva si está abierta */}
        {isOpen ? (
          <G>
            {/* Interior oscuro de la caja abierta */}
            <Rect x="24" y="24" width="316" height="80" fill="#18120B" stroke="#2B1E12" strokeWidth="2" />
            {/* Solapa levantada izquierda */}
            <Path d="M 20 24 L 60 -10 L 175 -8 L 180 24 Z" fill="#634F37" stroke="#2E2317" strokeWidth="2" />
            {/* Solapa levantada derecha */}
            <Path d="M 184 24 L 189 -8 L 304 -10 L 344 24 Z" fill="#5C4933" stroke="#2E2317" strokeWidth="2" />
            <SvgText x="182" y="68" fill="#A8947B" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              [ CONTENIDO VISIBLE ]
            </SvgText>
          </G>
        ) : (
          <G>
            {/* Sello de envío C.S.T. */}
            <Rect x="30" y="90" width="105" height="55" fill="#3D3021" stroke="#251C12" strokeWidth="1.5" />
            <SvgText x="82" y="112" fill="#2E86C1" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              C.S.T. CARGO
            </SvgText>
            <SvgText x="82" y="126" fill="#8C765C" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
              LOTE #402-B
            </SvgText>
            <SvgText x="82" y="137" fill="#8C765C" fontSize="7" fontFamily="monospace" textAnchor="middle">
              SEC. 4 // PORTWALL
            </SvgText>

            {/* Ícono de advertencia de caja cerrada */}
            <Path d="M 280 135 L 295 105 L 310 135 Z" fill="#A67C52" opacity={0.6} />
            <SvgText x="295" y="132" fill="#1C140D" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              !
            </SvgText>
          </G>
        )}

        {/* Borde exterior acentuado */}
        <Rect x="10" y="12" width="344" height="202" fill="none" stroke="#241B11" strokeWidth="2" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
