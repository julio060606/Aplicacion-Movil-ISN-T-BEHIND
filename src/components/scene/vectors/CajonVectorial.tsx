/**
 * =========================================================================
 * src/components/scene/vectors/CajonVectorial.tsx
 * =========================================================================
 * Textura vectorial plana del CAJÓN industrial corredizo.
 * =========================================================================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle, Text as SvgText, G } from 'react-native-svg';

interface Props {
  width: number;
  height: number;
  isOpen?: boolean;
}

export const CajonVectorial: React.FC<Props> = ({ width, height, isOpen = false }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 364 200">
        {/* Sombra base */}
        <Rect x="4" y="6" width="356" height="188" fill="#05080E" opacity={0.7} />

        {/* Marco exterior del cajón */}
        <Rect x="8" y="10" width="348" height="180" fill="#1A202C" stroke="#0F172A" strokeWidth="3" />

        {/* Chapa frontal biselada */}
        <Rect x="16" y="18" width="332" height="164" fill={isOpen ? '#242D3D' : '#1E2636'} stroke="#334155" strokeWidth="2" />

        {/* Remaches en las 4 esquinas */}
        <Circle cx="28" cy="30" r="3" fill="#64748B" />
        <Circle cx="336" cy="30" r="3" fill="#64748B" />
        <Circle cx="28" cy="170" r="3" fill="#64748B" />
        <Circle cx="336" cy="170" r="3" fill="#64748B" />

        {/* Placa metálica de identificación central */}
        <Rect x="122" y="32" width="120" height="28" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
        <SvgText x="182" y="49" fill="#38BDF8" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          {isOpen ? '[ CAJÓN 01: ABIERTO ]' : '[ GAVETA TÉCNICA 01 ]'}
        </SvgText>

        {/* Manija / Tirador central de acero */}
        <Rect x="137" y="88" width="90" height="24" rx="4" fill="#0A0F18" stroke="#64748B" strokeWidth="2" />
        <Rect x="145" y="93" width="74" height="14" rx="2" fill="#334155" />
        {/* Tornillos de la manija */}
        <Circle cx="141" cy="100" r="2.5" fill="#94A3B8" />
        <Circle cx="223" cy="100" r="2.5" fill="#94A3B8" />

        {/* Cerradura de llave de seguridad debajo del tirador */}
        <Circle cx="182" cy="136" r="6" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
        <Rect x="180.5" y="136" width="3" height="6" fill="#0F172A" />

        {/* Ranuras de ventilación industrial */}
        <Line x1="40" y1="148" x2="100" y2="148" stroke="#0F172A" strokeWidth="2" />
        <Line x1="40" y1="154" x2="100" y2="154" stroke="#0F172A" strokeWidth="2" />
        <Line x1="264" y1="148" x2="324" y2="148" stroke="#0F172A" strokeWidth="2" />
        <Line x1="264" y1="154" x2="324" y2="154" stroke="#0F172A" strokeWidth="2" />

        {/* Rieles visibles si está abierto */}
        {isOpen && (
          <G>
            <Rect x="12" y="16" width="340" height="8" fill="#38BDF8" opacity={0.3} />
            <SvgText x="182" y="174" fill="#60A5FA" fontSize="8" fontFamily="monospace" textAnchor="middle">
              RIEL EXTENDIDO // PULSAR PARA CERRAR
            </SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
