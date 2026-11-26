/**
 * =========================================================================
 * src/components/scene/vectors/ProductVectors.tsx
 * =========================================================================
 * Gráficos vectoriales de productos en estética monocromática industrial:
 * - Paleta apagada, sobria, sin neones (grises acero, carbón, pátina vintage).
 * - Renderizado en formato PEQUEÑO (pila en ventanilla derecha).
 * - Renderizado en formato GRANDE (cuadrado de examen izquierdo).
 * - Sello UV con fósforo tenue y realista a 365nm.
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
import { IProductItem } from '../../../models/products';

interface Props {
  product: IProductItem;
  size: 'small' | 'large';
  width: number;
  height: number;
  isUvLit?: boolean;
}

export const ProductVectors: React.FC<Props> = ({
  product,
  size,
  width,
  height,
  isUvLit = false,
}) => {
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, { width, height }]}>
      {/* ── 1. LATA METÁLICA INDUSTRIAL ──────────────────────────────── */}
      {product.iconType === 'LATA' && (
        <Svg width="100%" height="100%" viewBox={isSmall ? '0 0 100 100' : '0 0 280 280'}>
          <Defs>
            <LinearGradient id="canSteel" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#1E2631" />
              <Stop offset="45%" stopColor="#3F4D5E" />
              <Stop offset="75%" stopColor="#2E3946" />
              <Stop offset="100%" stopColor="#151C24" />
            </LinearGradient>
            <LinearGradient id="canBand" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#1A222D" />
              <Stop offset="100%" stopColor="#0F141A" />
            </LinearGradient>
          </Defs>

          {isSmall ? (
            <G>
              <Rect x="26" y="18" width="48" height="64" rx="5" fill="url(#canSteel)" stroke="#111822" strokeWidth="2" />
              <Rect x="26" y="34" width="48" height="32" fill="url(#canBand)" />
              <Line x1="30" y1="48" x2="70" y2="48" stroke="#4A5A6D" strokeWidth="1" />
              <SvgText x="50" y="56" fill="#C2CAD3" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
                C.S.T.
              </SvgText>
            </G>
          ) : (
            <G>
              <Rect x="50" y="30" width="180" height="220" rx="12" fill="url(#canSteel)" stroke="#0E1318" strokeWidth="3.5" />
              <Line x1="50" y1="50" x2="230" y2="50" stroke="#5A6B7C" strokeWidth="2.5" />
              <Line x1="50" y1="230" x2="230" y2="230" stroke="#222B35" strokeWidth="2.5" />
              {/* Etiqueta monocromática industrial */}
              <Rect x="50" y="68" width="180" height="138" fill="url(#canBand)" stroke="#324050" strokeWidth="1.5" />
              <SvgText x="140" y="98" fill="#8E9DAE" fontSize="10.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                CONSORCIO STRATTON-TATE
              </SvgText>
              <SvgText x="140" y="118" fill="#E2E7EC" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {product.name}
              </SvgText>
              <SvgText x="140" y="138" fill="#7C8B9B" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                PESO NETO: {product.weightKg} KG // LOTE: {product.code}
              </SvgText>
              <SvgText x="140" y="156" fill="#CBD5E1" fontSize="9" fontFamily="monospace" textAnchor="middle">
                TARIFA FIJADA: ${product.officialPrice} CST
              </SvgText>
              {/* Código de barras matricial */}
              <Rect x="82" y="168" width="116" height="18" fill="#A8B4C0" />
              {Array.from({ length: 18 }).map((_, i) => (
                <Line key={i} x1={86 + i * 6} y1="170" x2={86 + i * 6} y2="184" stroke="#10151C" strokeWidth={i % 4 === 0 ? 2 : 1} />
              ))}
            </G>
          )}

          {/* Sello UV en fósforo tenue */}
          {!isSmall && isUvLit && (
            <G opacity={0.88}>
              <Circle cx="140" cy="138" r="58" fill="none" stroke="#9A82A8" strokeWidth="2" strokeDasharray="5,3" />
              <Circle cx="140" cy="138" r="50" fill="none" stroke="#708B9B" strokeWidth="1" />
              <SvgText x="140" y="135" fill="#B5A0C2" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {product.uvStampText}
              </SvgText>
              <SvgText x="140" y="148" fill="#8FA8B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                FÓSFORO 365nm // CONFORME
              </SvgText>
            </G>
          )}
        </Svg>
      )}

      {/* ── 2. FRASCO FARMACÉUTICO MONOCROMO ─────────────────────────── */}
      {product.iconType === 'MEDICINA' && (
        <Svg width="100%" height="100%" viewBox={isSmall ? '0 0 100 100' : '0 0 280 280'}>
          <Defs>
            <LinearGradient id="bottleAmberDark" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#1C1814" />
              <Stop offset="50%" stopColor="#352D24" />
              <Stop offset="100%" stopColor="#15120E" />
            </LinearGradient>
          </Defs>

          {isSmall ? (
            <G>
              <Rect x="32" y="18" width="36" height="12" rx="2" fill="#9CA3AF" stroke="#4B5563" strokeWidth="1" />
              <Rect x="28" y="30" width="44" height="56" rx="4" fill="url(#bottleAmberDark)" stroke="#26201A" strokeWidth="1.5" />
              <Rect x="33" y="44" width="34" height="26" fill="#11161D" />
              <SvgText x="50" y="60" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                MED
              </SvgText>
            </G>
          ) : (
            <G>
              <Rect x="105" y="26" width="70" height="24" rx="3" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
              <Rect x="72" y="50" width="136" height="192" rx="8" fill="url(#bottleAmberDark)" stroke="#221C16" strokeWidth="3" />
              <Rect x="88" y="84" width="104" height="124" fill="#0C1016" stroke="#334155" strokeWidth="1.5" />
              <SvgText x="140" y="112" fill="#7E92A2" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                C.S.T. FARMACÉUTICA
              </SvgText>
              <SvgText x="140" y="130" fill="#E2E8F0" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {product.name}
              </SvgText>
              <SvgText x="140" y="150" fill="#8090A0" fontSize="8" fontFamily="monospace" textAnchor="middle">
                DOSIS CONTROLADA // {product.code}
              </SvgText>
              <SvgText x="140" y="170" fill="#CBD5E1" fontSize="9" fontFamily="monospace" textAnchor="middle">
                TARIFA: ${product.officialPrice} CST
              </SvgText>
            </G>
          )}

          {!isSmall && isUvLit && (
            <G opacity={0.88}>
              <Circle cx="140" cy="140" r="52" fill="none" stroke="#9A82A8" strokeWidth="1.8" strokeDasharray="4,2" />
              <SvgText x="140" y="136" fill="#B5A0C2" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {product.uvStampText}
              </SvgText>
              <SvgText x="140" y="150" fill="#7FA0B4" fontSize="7" fontFamily="monospace" textAnchor="middle">
                FIBRAS QUÍMICAS ACTIVAS
              </SvgText>
            </G>
          )}
        </Svg>
      )}

      {/* ── 3. PAQUETE DE TABACO / CIGARRILLOS (PAPEL KRAFT) ─────────── */}
      {product.iconType === 'CIGARROS' && (
        <Svg width="100%" height="100%" viewBox={isSmall ? '0 0 100 100' : '0 0 280 280'}>
          {isSmall ? (
            <G>
              <Rect x="28" y="20" width="44" height="64" rx="3" fill="#2E2822" stroke="#1A1612" strokeWidth="1.5" />
              <Rect x="28" y="20" width="44" height="16" fill="#221D18" />
              <SvgText x="50" y="56" fill="#A89B8D" fontSize="7" fontFamily="monospace" textAnchor="middle">
                TABAC
              </SvgText>
            </G>
          ) : (
            <G>
              <Rect x="76" y="38" width="128" height="206" rx="5" fill="#332C24" stroke="#1A1612" strokeWidth="3" />
              <Rect x="76" y="38" width="128" height="50" fill="#241E18" stroke="#1A1612" strokeWidth="1.5" />
              <Circle cx="140" cy="134" r="36" fill="#201A14" stroke="#4A3F33" strokeWidth="1.5" />
              <SvgText x="140" y="132" fill="#C5B6A5" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                TABAC NOIR
              </SvgText>
              <SvgText x="140" y="146" fill="#7D7264" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                20 CIGARRILLOS
              </SvgText>
              <SvgText x="140" y="194" fill="#B4A696" fontSize="9" fontFamily="monospace" textAnchor="middle">
                OFICIAL: ${product.officialPrice} CST
              </SvgText>
              <SvgText x="140" y="210" fill="#887868" fontSize="8" fontFamily="monospace" textAnchor="middle">
                CALLE: ${product.blackMarketPrice} CST
              </SvgText>
            </G>
          )}

          {!isSmall && isUvLit && (
            <G opacity={0.88}>
              <Rect x="68" y="108" width="144" height="66" rx="3" fill="none" stroke="#9A82A8" strokeWidth="2" strokeDasharray="5,2" />
              <SvgText x="140" y="136" fill="#B5A0C2" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {product.uvStampText}
              </SvgText>
              <SvgText x="140" y="152" fill="#7FA0B4" fontSize="7" fontFamily="monospace" textAnchor="middle">
                TIMBRADO CND-4 AUSENTE
              </SvgText>
            </G>
          )}
        </Svg>
      )}

      {/* ── 4. BIDÓN DE QUEROSENO DE METAL ───────────────────────────── */}
      {product.iconType === 'GASOLINA' && (
        <Svg width="100%" height="100%" viewBox={isSmall ? '0 0 100 100' : '0 0 280 280'}>
          {isSmall ? (
            <G>
              <Rect x="26" y="26" width="48" height="58" rx="4" fill="#26313C" stroke="#12181E" strokeWidth="1.5" />
              <Rect x="52" y="18" width="14" height="10" rx="1.5" fill="#141B22" />
              <SvgText x="50" y="58" fill="#94A3B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                FUEL
              </SvgText>
            </G>
          ) : (
            <G>
              <Rect x="66" y="48" width="148" height="196" rx="8" fill="#2B3743" stroke="#131A21" strokeWidth="3" />
              <Rect x="150" y="26" width="38" height="24" rx="3" fill="#17202A" stroke="#0D1318" strokeWidth="2" />
              <Path d="M 94 48 L 94 30 C 94 22, 140 22, 140 30 L 140 48" fill="none" stroke="#18232D" strokeWidth="6" strokeLinecap="round" />
              <Rect x="80" y="90" width="120" height="110" fill="#141C24" stroke="#374857" strokeWidth="1.5" />
              <SvgText x="140" y="120" fill="#7E94A7" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                QUEROSENO DOMÉSTICO
              </SvgText>
              <SvgText x="140" y="140" fill="#C2D0DE" fontSize="9" fontFamily="monospace" textAnchor="middle">
                VOLUMEN: 2.0 LITROS
              </SvgText>
              <SvgText x="140" y="160" fill="#9EB2C3" fontSize="9" fontFamily="monospace" textAnchor="middle">
                PRECIO: ${product.officialPrice} CST
              </SvgText>
              <SvgText x="140" y="180" fill="#697D8F" fontSize="8" fontFamily="monospace" textAnchor="middle">
                USO REGULADO // PORTWALL
              </SvgText>
            </G>
          )}

          {!isSmall && isUvLit && (
            <G opacity={0.88}>
              <Circle cx="140" cy="140" r="52" fill="none" stroke="#9A82A8" strokeWidth="2" strokeDasharray="4,2" />
              <SvgText x="140" y="136" fill="#B5A0C2" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {product.uvStampText}
              </SvgText>
              <SvgText x="140" y="150" fill="#7FA0B4" fontSize="7" fontFamily="monospace" textAnchor="middle">
                DESTILERÍA C.S.T. 02 // OK
              </SvgText>
            </G>
          )}
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
