/**
 * =========================================================================
 * src/components/scene/vectors/DniCardVectorial.tsx
 * =========================================================================
 * DOCUMENTO NACIONAL DE IDENTIDAD / CARNET CIVIL C.S.T. (Vectorial)
 * 
 * Con soporte diegético de fluorescencia reactiva bajo Linterna UV.
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
  fullName?: string;
  idNumber?: string;
  citizenLevel?: string;
  status?: string;
  isUvLit?: boolean; // Activado cuando la linterna UV enfoca la credencial
}

export const DniCardVectorial: React.FC<Props> = ({
  width,
  height,
  fullName = 'M. ARIS // 0402',
  idNumber = 'CST-8812-402-B',
  citizenLevel = 'NIVEL 3 [OPERARIO]',
  status = 'CONCESIÓN SECTOR 4',
  isUvLit = false,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 364 365">
        <Defs>
          {/* Sombra ambiental */}
          <LinearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1E2837" />
            <Stop offset="100%" stopColor="#131B26" />
          </LinearGradient>
          <LinearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#1E3A8A" />
            <Stop offset="100%" stopColor="#2E86C1" />
          </LinearGradient>
        </Defs>

        {/* Sombra de la credencial sobre la mesa */}
        <Rect x="16" y="24" width="332" height="318" rx="6" fill="#030710" opacity={0.7} />

        {/* Tarjeta Plastificada Base */}
        <Rect
          x="12"
          y="20"
          width="340"
          height="324"
          rx="6"
          fill="url(#cardGrad)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Borde interior de seguridad antifraude */}
        <Rect
          x="18"
          y="26"
          width="328"
          height="312"
          rx="4"
          fill="none"
          stroke="#1E293B"
          strokeWidth="1"
          strokeDasharray="4,2"
        />

        {/* CABECERA CORPORATIVA C.S.T. */}
        <Rect x="18" y="26" width="328" height="48" rx="3" fill="url(#headerGrad)" />
        <SvgText x="182" y="44" fill="#F8FAFC" fontSize="10.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          CONSORCIO STRATTON-TATE // REGISTRO CIVIL
        </SvgText>
        <SvgText x="182" y="58" fill="#BAE6FD" fontSize="8" fontFamily="monospace" textAnchor="middle">
          IDENTIFICACIÓN DE CIUDADANÍA OBLIGATORIA
        </SvgText>

        {/* COLUMNA IZQUIERDA: RECUADRO DE FOTOGRAFÍA BIOMÉTRICA */}
        <Rect x="30" y="86" width="105" height="128" rx="2" fill="#0B131E" stroke="#475569" strokeWidth="1.5" />
        
        {/* Silueta vectorial del ciudadano */}
        <G opacity={0.85}>
          <Circle cx="82.5" cy="132" r="24" fill="#334155" stroke="#475569" strokeWidth="1" />
          <Path
            d="M 52 196 C 52 165, 113 165, 113 196 Z"
            fill="#334155"
            stroke="#475569"
            strokeWidth="1"
          />
        </G>
        <SvgText x="82.5" y="206" fill="#64748B" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          FOTO OFICIAL
        </SvgText>

        {/* Sello circular del C.S.T. sobre la esquina de la foto */}
        <Circle cx="124" cy="192" r="22" fill="none" stroke="#2E86C1" strokeWidth="1.8" opacity={0.85} />
        <Circle cx="124" cy="192" r="17" fill="none" stroke="#2E86C1" strokeWidth="0.8" strokeDasharray="3,2" />
        <SvgText x="124" y="190" fill="#38BDF8" fontSize="5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          VERIFICADO
        </SvgText>
        <SvgText x="124" y="197" fill="#38BDF8" fontSize="4.5" fontFamily="monospace" textAnchor="middle">
          C.S.T.-1986
        </SvgText>

        {/* COLUMNA DERECHA: DATOS DE FILIACIÓN */}
        <G>
          <SvgText x="148" y="98" fill="#64748B" fontSize="7" fontFamily="monospace">
            SUJETO / NOMBRE:
          </SvgText>
          <SvgText x="148" y="112" fill="#F1F5F9" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
            {fullName}
          </SvgText>

          <SvgText x="148" y="128" fill="#64748B" fontSize="7" fontFamily="monospace">
            REGISTRO / SERIE:
          </SvgText>
          <SvgText x="148" y="142" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            {idNumber}
          </SvgText>

          <SvgText x="148" y="158" fill="#64748B" fontSize="7" fontFamily="monospace">
            CATEGORÍA CIVIL:
          </SvgText>
          <SvgText x="148" y="172" fill="#FCD34D" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
            {citizenLevel}
          </SvgText>

          <SvgText x="148" y="188" fill="#64748B" fontSize="7" fontFamily="monospace">
            JURISDICCIÓN:
          </SvgText>
          <SvgText x="148" y="201" fill="#86EFAC" fontSize="8" fontFamily="monospace">
            {status}
          </SvgText>
        </G>

        {/* BANDA DE SEGURIDAD / CÓDIGO DE BARRAS INFERIOR */}
        <Rect x="30" y="226" width="304" height="2" fill="#334155" />
        
        {/* Código de barras matricial */}
        <G opacity={0.75}>
          {Array.from({ length: 36 }).map((_, i) => (
            <Line
              key={i}
              x1={34 + i * 8}
              y1="234"
              x2={34 + i * 8}
              y2="258"
              stroke="#94A3B8"
              strokeWidth={i % 3 === 0 ? 3 : i % 2 === 0 ? 1.5 : 2}
            />
          ))}
        </G>

        {/* TEXTO DE PIE DIEGÉTICO */}
        <SvgText x="182" y="274" fill="#64748B" fontSize="7" fontFamily="monospace" textAnchor="middle">
          ESTA CREDENCIAL DEBE PRESENTARSE ANTE CUALQUIER INSPECCIÓN DEL C.S.T.
        </SvgText>
        <SvgText x="182" y="286" fill="#475569" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          LA ADULTERACIÓN DE ESTE DOCUMENTO ACARREA SANCIÓN DE CLASE A
        </SvgText>

        {/* ── SELLO DE SEGURIDAD ULTRAVIOLETA (REVELADO CON LINTERNA UV) ── */}
        {isUvLit && (
          <G opacity={0.88}>
            {/* Tinta invisible de fósforo tenue */}
            <Rect x="20" y="78" width="324" height="142" rx="4" fill="none" stroke="#9A82A8" strokeWidth="1.2" strokeDasharray="5,3" />
            
            {/* Sello de agua invisible central */}
            <Circle cx="230" cy="148" r="46" fill="none" stroke="#A592B0" strokeWidth="2" opacity={0.8} />
            <Circle cx="230" cy="148" r="38" fill="none" stroke="#708B9B" strokeWidth="1" strokeDasharray="4,2" />
            
            <SvgText x="230" y="142" fill="#C5B2D0" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              ★ SELLO INVISIBLE C.S.T. ★
            </SvgText>
            <SvgText x="230" y="154" fill="#8FA4B4" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              SEC-UV-VALID: OK
            </SvgText>

            {/* Fibras fluorescentes de seguridad tenue */}
            <Path d="M 40 100 Q 55 95 65 110" stroke="#9A82A8" strokeWidth="1" fill="none" />
            <Path d="M 110 160 Q 118 175 130 170" stroke="#708B9B" strokeWidth="1" fill="none" />
            <Path d="M 280 110 Q 295 125 310 115" stroke="#9A82A8" strokeWidth="1" fill="none" />
            <Path d="M 70 240 Q 85 250 95 238" stroke="#8A9E8C" strokeWidth="1" fill="none" />

            {/* Microtexto ultravioleta */}
            <SvgText x="182" y="306" fill="#B5A2C0" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              [ VALIDACIÓN UV: FIBRA BIOMÉTRICA CONFORME ]
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
