/**
 * =========================================================================
 * src/components/scene/vectors/CartillaRacionamientoVectorial.tsx
 * =========================================================================
 * CARTILLA DE RACIONAMIENTO CIVIL C.S.T. (Vectorial)
 * 
 * Contiene cupones de alimentos y combustible con SELLO INVISIBLE
 * que solo se revela al pasar el haz de la linterna ultravioleta (UV).
 * =========================================================================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Line,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface Props {
  width: number;
  height: number;
  citizenName?: string;
  rationCode?: string;
  isUvLit?: boolean;
}

export const CartillaRacionamientoVectorial: React.FC<Props> = ({
  width,
  height,
  citizenName = 'M. ARIS // 0402',
  rationCode = 'RAT-1986-B4',
  isUvLit = false,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 364 365">
        <Defs>
          <LinearGradient id="paperGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#2A241A" />
            <Stop offset="100%" stopColor="#1B1710" />
          </LinearGradient>
          <LinearGradient id="headerRation" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#854D0E" />
            <Stop offset="100%" stopColor="#A16207" />
          </LinearGradient>
        </Defs>

        {/* Sombra de la cartilla */}
        <Rect x="16" y="24" width="332" height="318" rx="4" fill="#030710" opacity={0.65} />

        {/* Hoja de papel manila / envejecida */}
        <Rect x="12" y="20" width="340" height="324" rx="4" fill="url(#paperGrad)" stroke="#78350F" strokeWidth="2" />
        <Rect x="18" y="26" width="328" height="312" rx="3" fill="none" stroke="#523214" strokeWidth="1" strokeDasharray="3,2" />

        {/* Cabecera oficial de racionamiento */}
        <Rect x="18" y="26" width="328" height="46" rx="2" fill="url(#headerRation)" />
        <SvgText x="182" y="44" fill="#FEF08A" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          CONSORCIO STRATTON-TATE // RACIONAMIENTO
        </SvgText>
        <SvgText x="182" y="58" fill="#FDE047" fontSize="8" fontFamily="monospace" textAnchor="middle">
          CARTILLA DE ASIGNACIÓN CALÓRICA OBLIGATORIA
        </SvgText>

        {/* Datos del titular */}
        <G>
          <SvgText x="32" y="94" fill="#A16207" fontSize="7.5" fontFamily="monospace">
            TITULAR:
          </SvgText>
          <SvgText x="85" y="94" fill="#FEF3C7" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
            {citizenName}
          </SvgText>

          <SvgText x="32" y="110" fill="#A16207" fontSize="7.5" fontFamily="monospace">
            CÓDIGO:
          </SvgText>
          <SvgText x="85" y="110" fill="#FCD34D" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
            {rationCode}
          </SvgText>
        </G>

        {/* CUPONES DE RACIONAMIENTO (Matriz de 3 cupones) */}
        {/* CUPÓN 1: RACIÓN DE CARNE */}
        <G>
          <Rect x="30" y="130" width="145" height="70" rx="3" fill="#1C150C" stroke="#78350F" strokeWidth="1.2" strokeDasharray="4,2" />
          <SvgText x="102" y="148" fill="#D97706" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            [ CUPÓN 01: CARNE ]
          </SvgText>
          <SvgText x="102" y="162" fill="#E2E8F0" fontSize="7" fontFamily="monospace" textAnchor="middle">
            CUPO: 500g // LATA
          </SvgText>
          <SvgText x="102" y="186" fill="#64748B" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
            VÁLIDO DÍA 01-03
          </SvgText>
        </G>

        {/* CUPÓN 2: HARINA Y PAN */}
        <G>
          <Rect x="189" y="130" width="145" height="70" rx="3" fill="#1C150C" stroke="#78350F" strokeWidth="1.2" strokeDasharray="4,2" />
          <SvgText x="261" y="148" fill="#D97706" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            [ CUPÓN 02: HARINA ]
          </SvgText>
          <SvgText x="261" y="162" fill="#E2E8F0" fontSize="7" fontFamily="monospace" textAnchor="middle">
            CUPO: 1.5 KG
          </SvgText>
          <SvgText x="261" y="186" fill="#64748B" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
            VÁLIDO DÍA 01-03
          </SvgText>
        </G>

        {/* CUPÓN 3: COMBUSTIBLE / QUEROSENO */}
        <G>
          <Rect x="30" y="212" width="304" height="60" rx="3" fill="#1C150C" stroke="#78350F" strokeWidth="1.2" strokeDasharray="4,2" />
          <SvgText x="182" y="232" fill="#D97706" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            [ CUPÓN 03: QUEROSENO DOMÉSTICO // 2 LITROS ]
          </SvgText>
          <SvgText x="182" y="248" fill="#CBD5E1" fontSize="7" fontFamily="monospace" textAnchor="middle">
            SUMINISTRO CONTROLADO // SECTOR 4
          </SvgText>
        </G>

        {/* Pie institucional */}
        <SvgText x="182" y="298" fill="#92400E" fontSize="7" fontFamily="monospace" textAnchor="middle">
          ESTA CARTILLA ES PERSONAL E INTRANSFERIBLE
        </SvgText>
        <SvgText x="182" y="310" fill="#78350F" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          EL C.S.T. ANULA CUALQUIER CUPÓN DESPRENDIDO ILEGALMENTE
        </SvgText>

        {/* ── SELLO INVISIBLE REVELADO CON LUZ UV ────────────────────────── */}
        {isUvLit && (
          <G opacity={0.88}>
            {/* Tinta invisible de fósforo tenue */}
            <Circle cx="182" cy="180" r="55" fill="none" stroke="#9A82A8" strokeWidth="2" strokeDasharray="5,2" />
            <Circle cx="182" cy="180" r="48" fill="none" stroke="#708B9B" strokeWidth="1" />
            
            {/* Emblema C.S.T. tenue */}
            <Path d="M 152 175 Q 182 155 212 175 Q 182 195 152 175 Z" fill="none" stroke="#9A82A8" strokeWidth="1.5" />
            
            <SvgText x="182" y="172" fill="#B5A2C0" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              ★ SELLO INVISIBLE C.S.T. ★
            </SvgText>
            <SvgText x="182" y="184" fill="#8FA4B4" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              CUPO VERIFICADO: OK
            </SvgText>
            <SvgText x="182" y="196" fill="#887888" fontSize="5.5" fontFamily="monospace" textAnchor="middle">
              SEC-4 // NO ADULTERADO
            </SvgText>

            {/* Fibras de fósforo tenues */}
            <Path d="M 45 150 Q 60 140 75 155" stroke="#9A82A8" strokeWidth="1.2" fill="none" />
            <Path d="M 270 145 Q 285 160 300 150" stroke="#708B9B" strokeWidth="1.2" fill="none" />
            <Path d="M 80 235 Q 100 245 120 230" stroke="#8A9E8C" strokeWidth="1.2" fill="none" />

            <SvgText x="182" y="330" fill="#B5A2C0" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              [ VALIDACIÓN UV: SELLO Y FIBRAS AUTÉNTICAS DETECTADAS ]
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
