/**
 * =========================================================================
 * src/components/scene/DualInspectionCarousel.tsx
 * =========================================================================
 * Carrusel interactivo en la mesa de trabajo (55% izquierdo):
 * - PRODUCTO EN EXAMEN (Grande y detallado, transferido desde la pila derecha)
 * - FICHA DE EXPEDIENTE
 * - DNI CIVIL C.S.T. (Con sello invisible reactivo a luz UV)
 * - CARTILLA DE RACIONAMIENTO (Con sello invisible reactivo a luz UV)
 * =========================================================================
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { HORIZONTAL_SPRITES } from '../../config/horizontalSceneConfig';
import { DniCardVectorial } from './vectors/DniCardVectorial';
import { CartillaRacionamientoVectorial } from './vectors/CartillaRacionamientoVectorial';
import { ProductVectors } from './vectors/ProductVectors';
import { IProductItem } from '../../models/products';
import { TYPOGRAPHY } from '../../theme/typography';

interface Props {
  pFicha: { left: number; top: number; width: number; height: number };
  pRecuadroIzq: { left: number; top: number; width: number; height: number };
  carruselIndex: number;
  onChangeIndex: (index: number) => void;
  activeExamProduct: IProductItem | null;
  onReturnProductToPile: () => void;
  onOpenPcForProduct: () => void;
  isUvLit?: boolean;
  zIndex?: number;
}

export const DualInspectionCarousel: React.FC<Props> = ({
  pFicha,
  pRecuadroIzq,
  carruselIndex,
  onChangeIndex,
  activeExamProduct,
  onReturnProductToPile,
  onOpenPcForProduct,
  isUvLit = false,
  zIndex = 30,
}) => {
  // Cantidad de pestañas: 0 = Producto (si hay uno activo), 1 = Ficha, 2 = DNI, 3 = Cartilla
  const maxTabs = activeExamProduct ? 4 : 3;

  const handlePrev = () => {
    Haptics.selectionAsync().catch(() => {});
    onChangeIndex(carruselIndex > 0 ? carruselIndex - 1 : maxTabs - 1);
  };

  const handleNext = () => {
    Haptics.selectionAsync().catch(() => {});
    onChangeIndex(carruselIndex < maxTabs - 1 ? carruselIndex + 1 : 0);
  };

  const getBadgeTitle = () => {
    if (activeExamProduct && carruselIndex === 0) return `[ EXAMEN: ${activeExamProduct.shortName} ]`;
    if (carruselIndex === (activeExamProduct ? 1 : 0)) return '[ 01. FICHA TÉCNICA ]';
    if (carruselIndex === (activeExamProduct ? 2 : 1)) return '[ 02. DNI CIVIL C.S.T. ]';
    return '[ 03. CARTILLA RACIÓN ]';
  };

  return (
    <>
      {/* ── CONTENIDO PRINCIPAL EN EL CUADRADO GRANDE DE EXAMEN ─────────── */}
      <View style={[styles.spriteAbsolute, pFicha, { zIndex }]}>
        {/* CASO A: PRODUCTO EN EXAMEN GRANDE */}
        {activeExamProduct && carruselIndex === 0 && (
          <View style={styles.examWrapper}>
            <ProductVectors
              product={activeExamProduct}
              size="large"
              width={pFicha.width}
              height={pFicha.height}
              isUvLit={isUvLit}
            />
            {/* Barra de acciones sobre el producto examinado */}
            <View style={styles.productActionBar}>
              <TouchableOpacity style={styles.actionBtn} onPress={onOpenPcForProduct}>
                <Text style={styles.actionBtnText}>[ 💻 COTEJAR EN PC ]</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.returnBtn]} onPress={onReturnProductToPile}>
                <Text style={[styles.actionBtnText, styles.returnBtnText]}>[ ◄ DEVOLVER A PILA ]</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* CASO B: FICHA DE EXPEDIENTE */}
        {((activeExamProduct && carruselIndex === 1) || (!activeExamProduct && carruselIndex === 0)) && (
          <Image
            source={HORIZONTAL_SPRITES.fichaObjeto}
            style={styles.fillImage}
            resizeMode="stretch"
          />
        )}

        {/* CASO C: DNI CIVIL CON SELLO INVISIBLE UV */}
        {((activeExamProduct && carruselIndex === 2) || (!activeExamProduct && carruselIndex === 1)) && (
          <DniCardVectorial
            width={pFicha.width}
            height={pFicha.height}
            fullName="M. ARIS // 0402"
            idNumber="CST-8812-402-B"
            citizenLevel="NIVEL 3 [OPERARIO]"
            status="CONCESIÓN SECTOR 4"
            isUvLit={isUvLit}
          />
        )}

        {/* CASO D: CARTILLA DE RACIONAMIENTO CON SELLO INVISIBLE UV */}
        {((activeExamProduct && carruselIndex === 3) || (!activeExamProduct && carruselIndex === 2)) && (
          <CartillaRacionamientoVectorial
            width={pFicha.width}
            height={pFicha.height}
            citizenName="M. ARIS // 0402"
            rationCode="RAT-1986-B4"
            isUvLit={isUvLit}
          />
        )}
      </View>

      {/* ── CONTROLES DE NAVEGACIÓN EN EL RECUADRO IZQUIERDO ─────────────── */}
      <View style={[styles.carruselNavContainer, pRecuadroIzq]}>
        <View style={styles.carruselControlsRow}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrev} activeOpacity={0.7}>
            <Text style={styles.navBtnText}>&lt;</Text>
          </TouchableOpacity>
          <View style={styles.carruselBadge}>
            <Text style={styles.carruselBadgeText}>{getBadgeTitle()}</Text>
          </View>
          <TouchableOpacity style={styles.navButton} onPress={handleNext} activeOpacity={0.7}>
            <Text style={styles.navBtnText}>&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  spriteAbsolute: {
    position: 'absolute',
  },
  fillImage: {
    width: '100%',
    height: '100%',
  },
  examWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productActionBar: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(7, 12, 20, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#475569',
  },
  actionBtnText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7.5,
    color: '#CBD5E1',
    fontWeight: 'bold',
  },
  returnBtn: {
    borderColor: '#334155',
  },
  returnBtnText: {
    color: '#94A3B8',
  },
  carruselNavContainer: {
    position: 'absolute',
    zIndex: 35,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
    pointerEvents: 'box-none',
  },
  carruselControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(7, 12, 20, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  navButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#0F172A',
  },
  navBtnText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  carruselBadge: {
    paddingHorizontal: 4,
  },
  carruselBadgeText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 8,
    color: '#E0E7EC',
  },
});
