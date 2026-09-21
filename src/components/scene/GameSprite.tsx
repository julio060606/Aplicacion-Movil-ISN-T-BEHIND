/**
 * =========================================================================
 * src/components/scene/GameSprite.tsx
 * =========================================================================
 * Componente atómico y "tonto" para renderizar UN sprite de la escena.
 *
 * RESPONSABILIDAD ÚNICA:
 *   Recibir un ISceneElement + la escala de la pantalla, y pintar el sprite
 *   en la posición correcta. NO contiene ningún estado de juego.
 *
 * FÓRMULA INTERNA (aplicada aquí, nunca en ShiftScreen ni en sceneConfig):
 *   screenLeft   = (figmaLeft - FIGMA_OFFSET_X) * scale
 *   screenTop    = (figmaTop  - FIGMA_OFFSET_Y) * scale
 *   screenWidth  = figmaWidth  * scale
 *   screenHeight = figmaHeight * scale
 *
 * USO EN ShiftScreen:
 *   <GameSprite element={ADAPTED_ELEMENTS.find(e => e.id === 'pc')!} scale={scale} />
 * =========================================================================
 */

import React from 'react';
import { View, Image, Text, Animated, StyleSheet, ViewStyle } from 'react-native';
import {
  ISceneElement,
  SPRITE_ASSETS,
  FIGMA_OFFSET_X,
  FIGMA_OFFSET_Y,
  FORCE_COLOR_BOXES,
} from '../../config/sceneConfig';

// ── Tipo estricto para transforms animados ────────────────────────────────────
// React Native exige un array tipado, no object[]
type AnimatedTransform =
  | { rotate: string }
  | { translateX: Animated.Value }
  | { translateY: Animated.Value };

// ── Props ─────────────────────────────────────────────────────────────────────
interface GameSpriteProps {
  element: ISceneElement;
  /** scale = windowHeight / 1456. Viene de ShiftScreen. */
  scale: number;
  /** Animación horizontal para elementos arrastrables (ej: lámpara) */
  translateX?: Animated.Value;
  /** Animación vertical para elementos arrastrables (ej: roll-up door, lámpara) */
  translateY?: Animated.Value;
  /** Opacidad animada para la rejilla durante la inspección táctil */
  inspectOpacity?: Animated.Value;
}

// ── Componente ────────────────────────────────────────────────────────────────
export const GameSprite: React.FC<GameSpriteProps> = ({
  element,
  scale,
  translateX,
  translateY,
  inspectOpacity,
}) => {
  // ── 1. Calcular posición en pantalla ───────────────────────────────────────
  const screenLeft   = Math.round((element.figmaLeft  - FIGMA_OFFSET_X) * scale);
  const screenTop    = Math.round((element.figmaTop   - FIGMA_OFFSET_Y) * scale);
  const screenWidth  = Math.round(element.figmaWidth  * scale);
  const screenHeight = Math.round(element.figmaHeight * scale);

  // ── 2. Seleccionar fuente del sprite ──────────────────────────────────────
  const spriteSource = element.spriteKey ? SPRITE_ASSETS[element.spriteKey] : null;
  const showFallback = FORCE_COLOR_BOXES || !spriteSource;

  // ── 3. Construir transforms tipados ──────────────────────────────────────
  const transforms: AnimatedTransform[] = [];
  if (element.rotate) transforms.push({ rotate: element.rotate });
  if (translateX)     transforms.push({ translateX });
  if (translateY)     transforms.push({ translateY });

  // ── 4. Estilo base (posición fija, sin animación) ─────────────────────────
  const baseStyle: ViewStyle = {
    position: 'absolute',
    left:   screenLeft,
    top:    screenTop,
    width:  screenWidth,
    height: screenHeight,
    zIndex: element.zIndex,
  };

  // ── 5. Contenido interno ──────────────────────────────────────────────────
  const content = (
    <>
      {/* Elemento de tipo 'shadow' → solo un View con color, sin imagen */}
      {element.behavior === 'shadow' && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: element.shadowColor ?? 'transparent' }]} />
      )}

      {/* Sprite real desde assets */}
      {element.behavior !== 'shadow' && spriteSource && !FORCE_COLOR_BOXES && (
        <Image
          source={spriteSource}
          style={styles.fillImage}
          resizeMode="stretch"
        />
      )}

      {/* Fallback de color (modo debug o sprite faltante) */}
      {element.behavior !== 'shadow' && showFallback && (
        <View style={[styles.fallbackBox, {
          backgroundColor: element.fallbackColor,
          borderColor: element.fallbackBorderColor ?? 'rgba(255,255,255,0.4)',
        }]}>
          <Text style={styles.fallbackLabel} numberOfLines={2}>{element.label}</Text>
          <Text style={styles.fallbackDims} numberOfLines={1}>
            {`${element.figmaWidth} × ${element.figmaHeight} px`}
          </Text>
        </View>
      )}
    </>
  );

  // ── 6. Renderizado: Animated si tiene animaciones, View si no ─────────────
  const needsAnimated = translateX !== undefined
    || translateY !== undefined
    || (element.hasInspectOpacity && inspectOpacity !== undefined);

  if (needsAnimated) {
    // Usamos array de estilos: patrón idiomático de RN para combinar
    // ViewStyle estático con valores Animated sin errores de TypeScript
    return (
      <Animated.View
        style={[
          baseStyle,
          transforms.length > 0 && { transform: transforms },
          element.hasInspectOpacity && inspectOpacity && { opacity: inspectOpacity },
        ]}
        pointerEvents="box-none"
      >
        {content}
      </Animated.View>
    );
  }

  return (
    <View
      style={[baseStyle, transforms.length > 0 && { transform: transforms }]}
      pointerEvents="box-none"
    >
      {content}
    </View>
  );
};

// ── Estilos internos del componente ──────────────────────────────────────────
const styles = StyleSheet.create({
  fillImage: {
    width: '100%',
    height: '100%',
  },
  fallbackBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackLabel: {
    fontSize: 7.5,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fallbackDims: {
    fontSize: 6.5,
    color: '#cbd5e1',
    textAlign: 'center',
    marginTop: 1,
    opacity: 0.85,
  },
});
