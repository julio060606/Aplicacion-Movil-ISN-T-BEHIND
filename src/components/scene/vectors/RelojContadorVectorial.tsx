/**
 * =========================================================================
 * src/components/scene/vectors/RelojContadorVectorial.tsx
 * =========================================================================
 * Textura vectorial plana del CONTADOR / RELOJ DIEGÉTICO C.S.T.
 * =========================================================================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Text as SvgText, Line, G } from 'react-native-svg';

interface Props {
  width: number;
  height: number;
  timeText?: string;
  amountText?: string;
}

export const RelojContadorVectorial: React.FC<Props> = ({
  width,
  height,
  timeText = '12:00',
  amountText = '$ 00.00',
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 114 105">
        {/* Carcasa exterior de baquelita / chapa de pared */}
        <Rect x="4" y="5" width="106" height="95" rx="5" fill="#131B26" stroke="#080E16" strokeWidth="2" />
        
        {/* Placa metálica interna */}
        <Rect x="8" y="9" width="98" height="87" rx="3" fill="#1E2837" stroke="#334155" strokeWidth="1.2" />

        {/* Tornillos de anclaje */}
        <Circle cx="14" cy="15" r="2" fill="#64748B" />
        <Circle cx="100" cy="15" r="2" fill="#64748B" />
        <Circle cx="14" cy="89" r="2" fill="#64748B" />
        <Circle cx="100" cy="89" r="2" fill="#64748B" />

        {/* Pantalla digital CRT / VFD verde ámbar */}
        <Rect x="14" y="22" width="86" height="42" rx="2" fill="#0A140F" stroke="#14532D" strokeWidth="1.5" />
        
        {/* Líneas sutiles de scanline en la pantalla */}
        <Line x1="14" y1="32" x2="100" y2="32" stroke="#14532D" strokeWidth="0.6" opacity={0.6} />
        <Line x1="14" y1="42" x2="100" y2="42" stroke="#14532D" strokeWidth="0.6" opacity={0.6} />
        <Line x1="14" y1="52" x2="100" y2="52" stroke="#14532D" strokeWidth="0.6" opacity={0.6} />

        {/* Display del reloj in-game */}
        <SvgText x="57" y="42" fill="#00FF66" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          {timeText}
        </SvgText>

        {/* Indicador secundario de turno / caja */}
        <SvgText x="57" y="56" fill="#F59E0B" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          {amountText}
        </SvgText>

        {/* Panel inferior con botones de calibración */}
        <G>
          <Circle cx="30" cy="76" r="4.5" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <SvgText x="30" y="78.5" fill="#94A3B8" fontSize="5.5" fontFamily="monospace" textAnchor="middle">
            H
          </SvgText>

          <Circle cx="46" cy="76" r="4.5" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <SvgText x="46" y="78.5" fill="#94A3B8" fontSize="5.5" fontFamily="monospace" textAnchor="middle">
            M
          </SvgText>

          {/* Etiqueta C.S.T. de cronometría */}
          <Rect x="60" y="70" width="38" height="12" fill="#0B131E" stroke="#1E3A5F" strokeWidth="1" />
          <SvgText x="79" y="78.5" fill="#38BDF8" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            TURNO 12H
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
