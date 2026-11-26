/**
 * =========================================================================
 * src/components/scene/RightProductPile.tsx
 * =========================================================================
 * Pila física de objetos sobre el mostrador derecho (sin fondo ni borde).
 * 
 * - Los sprites están apilados uno sobre otro (cascada física sobre la mesa).
 * - Deslizar (swipe/drag) el objeto superior hacia la izquierda lo hace pasar
 *   hacia el escáner y aparecer en el recuadro izquierdo en tamaño grande.
 * - Estética sobria y monocromática (sin neones).
 * =========================================================================
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { IProductItem } from '../../models/products';
import { ProductVectors } from './vectors/ProductVectors';
import { TYPOGRAPHY } from '../../theme/typography';

interface Props {
  pRecuadroDer: { left: number; top: number; width: number; height: number };
  scale: number;
  productsPile: IProductItem[];
  activeExamItem: IProductItem | null;
  onSendToExam: (product: IProductItem) => void;
  onReplenishPile: () => void;
}

export const RightProductPile: React.FC<Props> = ({
  pRecuadroDer,
  scale,
  productsPile,
  activeExamItem,
  onSendToExam,
  onReplenishPile,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);

  // El objeto superior de la pila física es el último del array
  const topIndex = productsPile.length - 1;
  const topProduct = topIndex >= 0 ? productsPile[topIndex] : null;

  const triggerSlideToScanner = (item: IProductItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Animated.timing(pan, {
      toValue: { x: -280 * scale, y: -10 * scale },
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      setIsDragging(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onSendToExam(item);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => topProduct !== null,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 6,
      onPanResponderGrant: () => {
        setIsDragging(true);
        Haptics.selectionAsync().catch(() => {});
      },
      onPanResponderMove: (_, gesture) => {
        // Solo permitir deslizar hacia la izquierda (dx < 0) hacia el escáner
        if (gesture.dx < 0) {
          pan.setValue({ x: gesture.dx, y: gesture.dy * 0.3 });
        }
      },
      onPanResponderRelease: (_, gesture) => {
        // Si se deslizó más de 55 px a la izquierda o con velocidad, se pasa al escáner
        if (topProduct && (gesture.dx < -55 || gesture.vx < -0.5)) {
          triggerSlideToScanner(topProduct);
        } else {
          // Vuelve a su lugar en la pila con rebote elástico
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }).start(() => setIsDragging(false));
        }
      },
    })
  ).current;

  return (
    <View style={[styles.container, pRecuadroDer]} pointerEvents="box-none">
      {/* Indicador discreto monocromático */}
      <View style={styles.topLabelRow}>
        <Text style={styles.pileCounterText}>
          {productsPile.length > 0 ? `[ PILA: ${productsPile.length} OBJ ]` : '[ MOSTRADOR LIBRE ]'}
        </Text>
        {productsPile.length === 0 && (
          <TouchableOpacity style={styles.replenishBtn} onPress={onReplenishPile} activeOpacity={0.7}>
            <Text style={styles.replenishText}>[ + SUMINISTRO ]</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ÁREA DE OBJETOS APILADOS FÍSICAMENTE (1 por encima de otro) */}
      <View style={styles.stackStage} pointerEvents="box-none">
        {productsPile.length === 0 ? (
          <View style={styles.emptyNoteBox}>
            <Text style={styles.emptyNoteText}>
              {activeExamItem ? 'OBJETO EN MESA IZQUIERDA' : 'SIN PRODUCTOS EN MOSTRADOR'}
            </Text>
          </View>
        ) : (
          productsPile.map((item, idx) => {
            const isTop = idx === topIndex;
            // Desplazamiento leve para dar sensación física de pila sobre la mesa
            const stackOffsetX = (idx * 5 - (productsPile.length * 2.5)) * scale;
            const stackOffsetY = (idx * 4) * scale;

            if (isTop) {
              // OBJETO SUPERIOR DESLIZABLE HACIA EL ESCÁNER
              return (
                <Animated.View
                  key={item.id}
                  style={[
                    styles.stackedSprite,
                    {
                      zIndex: 20,
                      transform: [
                        { translateX: Animated.add(pan.x, new Animated.Value(stackOffsetX)) },
                        { translateY: Animated.add(pan.y, new Animated.Value(stackOffsetY)) },
                      ],
                    },
                  ]}
                  {...panResponder.panHandlers}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => triggerSlideToScanner(item)}
                    style={styles.spriteTouch}
                  >
                    <ProductVectors
                      product={item}
                      size="small"
                      width={64 * scale}
                      height={64 * scale}
                    />
                    {/* Guía sutil para deslizar al escáner */}
                    <View style={styles.swipeHintBadge}>
                      <Text style={styles.swipeHintText}>◄ DESLIZAR</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            }

            // OBJETOS INFERIORES DE LA PILA (en reposo)
            return (
              <View
                key={item.id}
                style={[
                  styles.stackedSprite,
                  {
                    zIndex: idx + 1,
                    transform: [{ translateX: stackOffsetX }, { translateY: stackOffsetY }],
                    opacity: 0.85 + idx * 0.05,
                  },
                ]}
                pointerEvents="none"
              >
                <ProductVectors
                  product={item}
                  size="small"
                  width={60 * scale}
                  height={60 * scale}
                />
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 22,
    backgroundColor: 'transparent', // Sin color de fondo por petición
    borderWidth: 0,                 // Sin contorno por petición
    padding: 2,
  },
  topLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  pileCounterText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7.5,
    color: '#64748B',
    letterSpacing: 0.5,
  },
  replenishBtn: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  replenishText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7,
    color: '#94A3B8',
  },
  stackStage: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackedSprite: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spriteTouch: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeHintBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  swipeHintText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 6,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  emptyNoteBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyNoteText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 6.5,
    color: '#475569',
    textAlign: 'center',
  },
});
