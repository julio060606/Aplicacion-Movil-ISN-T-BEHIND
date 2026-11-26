/**
 * =========================================================================
 * src/components/scene/HorizontalStageLayers.tsx
 * =========================================================================
 * Capas base y elementos ambientales del escenario horizontal (1049 × 484 px).
 * =========================================================================
 */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  HORIZONTAL_SPRITES,
  FIGMA_ELEMENTS,
} from '../../config/horizontalSceneConfig';
import { ScannerVectorial } from './vectors/ScannerVectorial';
import { RelojContadorVectorial } from './vectors/RelojContadorVectorial';
import { BolsaVectorial } from './vectors/BolsaVectorial';

interface Props {
  scale: number;
  pos: (figma: { width: number; height: number; left: number; top: number }) => {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  showGuides: boolean;
}

export const HorizontalStageLayers: React.FC<Props> = ({ scale, pos, showGuides }) => {
  const pSuelo = pos(FIGMA_ELEMENTS.suelo);
  const pMesa = pos(FIGMA_ELEMENTS.mesa);
  const pCliente = pos(FIGMA_ELEMENTS.cliente);
  const pTelaMesa = pos(FIGMA_ELEMENTS.telaMesa);
  const pContador = pos(FIGMA_ELEMENTS.contadorDinero);
  const pScanner = pos(FIGMA_ELEMENTS.scanner);
  const pBolsa = pos(FIGMA_ELEMENTS.bolsa);

  return (
    <>
      {/* 1. SUELO */}
      <Image
        source={HORIZONTAL_SPRITES.suelo}
        style={[styles.spriteAbsolute, pSuelo, { zIndex: FIGMA_ELEMENTS.suelo.zIndex }]}
        resizeMode="stretch"
      />

      {/* 2. MESA */}
      <Image
        source={HORIZONTAL_SPRITES.mesa}
        style={[styles.spriteAbsolute, pMesa, { zIndex: FIGMA_ELEMENTS.mesa.zIndex }]}
        resizeMode="stretch"
      />

      {/* 3. CLIENTE (ADELANTE DE LA MESA) */}
      <Image
        source={HORIZONTAL_SPRITES.cliente}
        style={[styles.spriteAbsolute, pCliente, { zIndex: FIGMA_ELEMENTS.cliente.zIndex }]}
        resizeMode="stretch"
      />

      {/* 4. TELA MESA DE TRABAJO */}
      <Image
        source={HORIZONTAL_SPRITES.telaMesa}
        style={[styles.spriteAbsolute, pTelaMesa, { zIndex: FIGMA_ELEMENTS.telaMesa.zIndex }]}
        resizeMode="stretch"
      />

      {/* 5. CONTADOR DINERO / RELOJ VECTORIAL PLANO */}
      <View style={[styles.spriteAbsolute, pContador, { zIndex: FIGMA_ELEMENTS.contadorDinero.zIndex }]}>
        <RelojContadorVectorial width={pContador.width} height={pContador.height} timeText="12:00" amountText="$ 00.00" />
      </View>

      {/* 6. SCANNER VECTORIAL PLANO */}
      <View style={[styles.spriteAbsolute, pScanner, { zIndex: FIGMA_ELEMENTS.scanner.zIndex }]}>
        <ScannerVectorial width={pScanner.width} height={pScanner.height} />
      </View>

      {/* 7. BOLSA VECTORIAL PLANA (Sacar bolsa) */}
      <View style={[styles.spriteAbsolute, pBolsa, { zIndex: FIGMA_ELEMENTS.bolsa.zIndex }]}>
        <BolsaVectorial width={pBolsa.width} height={pBolsa.height} />
      </View>

      {/* 8. RECUADROS DE REFERENCIA (Opcionales por debug) */}
      {showGuides && (
        <>
          <Image
            source={HORIZONTAL_SPRITES.recuadroRefIzquierda}
            style={[styles.spriteAbsolute, pos(FIGMA_ELEMENTS.recuadroRefIzquierda), { zIndex: FIGMA_ELEMENTS.recuadroRefIzquierda.zIndex }]}
            resizeMode="stretch"
          />
          <Image
            source={HORIZONTAL_SPRITES.recuadroRefDerecha}
            style={[styles.spriteAbsolute, pos(FIGMA_ELEMENTS.recuadroRefDerecha), { zIndex: FIGMA_ELEMENTS.recuadroRefDerecha.zIndex }]}
            resizeMode="stretch"
          />
          <Image
            source={HORIZONTAL_SPRITES.div55}
            style={[styles.spriteAbsolute, { left: 0, top: 0, width: 577 * scale, height: 484 * scale, zIndex: 90, opacity: 0.2 }]}
            pointerEvents="none"
            resizeMode="stretch"
          />
          <Image
            source={HORIZONTAL_SPRITES.div45}
            style={[styles.spriteAbsolute, { left: 577 * scale, top: 0, width: 471 * scale, height: 484 * scale, zIndex: 90, opacity: 0.2 }]}
            pointerEvents="none"
            resizeMode="stretch"
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  spriteAbsolute: {
    position: 'absolute',
  },
});
