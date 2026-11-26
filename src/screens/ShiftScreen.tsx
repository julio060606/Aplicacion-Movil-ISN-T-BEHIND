/**
 * =========================================================================
 * src/screens/ShiftScreen.tsx
 * =========================================================================
 * PANTALLA PRINCIPAL DE JUEGO // ORIENTACIÓN HORIZONTAL (1049 × 484 px)
 * 
 * - Sensor de inclinación (Acelerómetro) activado únicamente con herramienta en mano.
 * - Linterna UV con revelado dinámico de sellos antifraude en DNI y Cartilla C.S.T.
 * - Pila de productos derecha (en pequeño) transferibles a la mesa izquierda (en grande).
 * - Terminal PC abierta interactiva con pestañas al costado y abajo.
 * =========================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
  Animated,
  AppState,
  AppStateStatus,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../models/types';
import {
  HORIZONTAL_VIEWPORT,
  HORIZONTAL_SPRITES,
  FIGMA_ELEMENTS,
  toScreenCoords,
} from '../config/horizontalSceneConfig';
import { ShiftPauseModal, ScaleMode } from '../components/scene/ShiftPauseModal';
import { HorizontalStageLayers } from '../components/scene/HorizontalStageLayers';
import { PcTerminalOverlay } from '../components/scene/PcTerminalOverlay';
import { CajonDrawerWithSlots } from '../components/scene/CajonDrawerWithSlots';
import { DualInspectionCarousel } from '../components/scene/DualInspectionCarousel';
import { RightProductPile } from '../components/scene/RightProductPile';
import { InHandToolOverlay } from '../components/scene/InHandToolOverlay';
import { ToolDef } from '../components/scene/vectors/ToolVectors';
import { CajaVectorial } from '../components/scene/vectors/CajaVectorial';
import { IProductItem, INITIAL_PRODUCTS_PILE } from '../models/products';
import { useDeviceTilt } from '../hooks/useDeviceTilt';
import { notificationService } from '../services/notifications/notificationService';
import { loggerService } from '../services/logging/loggerService';
import { TYPOGRAPHY } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'GameInterface' | 'Shift'>;

export const ShiftScreen: React.FC<Props> = ({ navigation }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [isLoading, setIsLoading] = useState(true);
  const [pauseVisible, setPauseVisible] = useState(false);
  const [scaleMode, setScaleMode] = useState<ScaleMode>('FILL_HEIGHT');
  const [showGuides, setShowGuides] = useState(false);

  // Estados interactivos
  const [pcAbiertaVisible, setPcAbiertaVisible] = useState(false);
  const [cajonAbierto, setCajonAbierto] = useState(false);
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [carruselIndex, setCarruselIndex] = useState(0);

  // Pila de productos (Derecha en pequeño -> Izquierda en grande)
  const [productsPile, setProductsPile] = useState<IProductItem[]>(INITIAL_PRODUCTS_PILE);
  const [activeExamProduct, setActiveExamProduct] = useState<IProductItem | null>(null);

  // Slots equipados y slot activo en mano
  const [slot1Item, setSlot1Item] = useState<ToolDef | null>(null);
  const [slot2Item, setSlot2Item] = useState<ToolDef | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2 | null>(null);
  const [isDniUvLit, setIsDniUvLit] = useState(false);

  const cajaSlide = useRef(new Animated.Value(0)).current;
  const cajonSlide = useRef(new Animated.Value(0)).current;

  const activeTool = activeSlot === 1 ? slot1Item : activeSlot === 2 ? slot2Item : null;
  const isSensorActive = activeTool !== null && !pauseVisible;
  const { tiltX, tiltY } = useDeviceTilt({ enabled: isSensorActive });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    notificationService.initialize().catch(() => {});
    loggerService.log('INFO', 'CORE', 'ShiftScreen: Turno activo en terminal Sector 4');

    const appStateSub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'background') notificationService.scheduleAbandonmentAlert(5);
      else if (next === 'active') notificationService.cancelAbandonmentAlert();
    });

    return () => {
      clearTimeout(timer);
      appStateSub.remove();
      notificationService.cancelAbandonmentAlert();
    };
  }, []);

  const scaleFit = Math.min(windowWidth / HORIZONTAL_VIEWPORT.width, windowHeight / HORIZONTAL_VIEWPORT.height);
  const scaleHeight = windowHeight / HORIZONTAL_VIEWPORT.height;
  let scale = scaleMode === 'FILL_HEIGHT' ? scaleHeight : scaleFit;
  let stageWidth = scaleMode === 'STRETCH' ? windowWidth : HORIZONTAL_VIEWPORT.width * scale;
  let stageHeight = scaleMode === 'FIT' ? HORIZONTAL_VIEWPORT.height * scale : windowHeight;

  const pos = (f: { width: number; height: number; left: number; top: number }) => toScreenCoords(f, scale);
  const pFicha = pos(FIGMA_ELEMENTS.fichaObjeto);
  const pRecuadroIzq = pos(FIGMA_ELEMENTS.recuadroRefIzquierda);
  const pRecuadroDer = pos(FIGMA_ELEMENTS.recuadroRefDerecha);
  const pCaja = pos(FIGMA_ELEMENTS.caja);
  const pCajon = pos(FIGMA_ELEMENTS.cajon);
  const pPc = pos(FIGMA_ELEMENTS.pc);
  const pScanner = pos(FIGMA_ELEMENTS.scanner);
  const pSlot1 = pos(FIGMA_ELEMENTS.slot1);
  const pSlot2 = pos(FIGMA_ELEMENTS.slot2);

  const togglePc = () => { Haptics.selectionAsync().catch(() => {}); setPcAbiertaVisible((v) => !v); };

  const toggleCaja = () => {
    Haptics.selectionAsync().catch(() => {});
    const next = !cajaAbierta;
    setCajaAbierta(next);
    Animated.spring(cajaSlide, { toValue: next ? 1 : 0, friction: 8, tension: 40, useNativeDriver: true }).start();
  };

  const toggleCajon = () => {
    Haptics.selectionAsync().catch(() => {});
    const next = !cajonAbierto;
    setCajonAbierto(next);
    Animated.spring(cajonSlide, { toValue: next ? 1 : 0, friction: 8, tension: 40, useNativeDriver: true }).start();
  };

  const handleAssignToSlot = (slotNumber: 1 | 2, tool: ToolDef) => {
    if (slotNumber === 1) {
      if (slot2Item?.id === tool.id) setSlot2Item(null);
      setSlot1Item(tool);
    } else {
      if (slot1Item?.id === tool.id) setSlot1Item(null);
      setSlot2Item(tool);
    }
  };

  // Mecánica de traslado de productos de la derecha a la izquierda
  const handleSendToExam = (prod: IProductItem) => {
    setActiveExamProduct(prod);
    setProductsPile((prev) => prev.filter((p) => p.id !== prod.id));
    setCarruselIndex(0);
    loggerService.log('INFO', 'CORE', `Producto trasladado a examen: ${prod.name}`);
  };

  const handleReturnProduct = () => {
    if (activeExamProduct) {
      setProductsPile((prev) => [activeExamProduct, ...prev]);
      setActiveExamProduct(null);
      setCarruselIndex(0);
    }
  };

  const cajaTranslateX = cajaSlide.interpolate({ inputRange: [0, 1], outputRange: [0, 315 * scale] });
  const cajonTranslateX = cajonSlide.interpolate({ inputRange: [0, 1], outputRange: [0, 315 * scale] });

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar hidden />
        <ActivityIndicator size="large" color="#2E86C1" />
        <Text style={styles.loadingText}>[ SINCRONIZANDO SISTEMAS // PORTWALL ]</Text>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <StatusBar hidden />

      <ShiftPauseModal
        visible={pauseVisible}
        onClose={() => setPauseVisible(false)}
        onExitShift={() => { setPauseVisible(false); navigation.navigate('MenuDrawer'); }}
        scaleMode={scaleMode}
        onChangeScaleMode={setScaleMode}
        showGuides={showGuides}
        onToggleGuides={() => setShowGuides((prev) => !prev)}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        scale={scale}
      />

      <View style={styles.centerStageWrapper}>
        <View style={[styles.stageViewport, { width: stageWidth, height: stageHeight }]}>
          {/* BOTÓN PAUSA */}
          <TouchableOpacity
            style={[styles.pauseAboveScanner, { left: pScanner.left + (pScanner.width - 76 * scale) / 2, top: Math.max(4, pScanner.top - 24 * scale), width: 76 * scale, height: 20 * scale, zIndex: 150 }]}
            onPress={() => setPauseVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pauseBtnText, { fontSize: Math.max(7.5, 8.5 * scale) }]}>[ || PAUSA ]</Text>
          </TouchableOpacity>

          {/* CAPAS BASE */}
          <HorizontalStageLayers scale={scale} pos={pos} showGuides={showGuides} />

          {/* CUADRADO GRANDE DE EXAMEN A LA IZQUIERDA (Carrusel + Producto en Grande) */}
          <DualInspectionCarousel
            pFicha={pFicha}
            pRecuadroIzq={pRecuadroIzq}
            carruselIndex={carruselIndex}
            onChangeIndex={setCarruselIndex}
            activeExamProduct={activeExamProduct}
            onReturnProductToPile={handleReturnProduct}
            onOpenPcForProduct={() => setPcAbiertaVisible(true)}
            isUvLit={isDniUvLit}
            zIndex={FIGMA_ELEMENTS.fichaObjeto.zIndex}
          />

          {/* PILA DE PRODUCTOS A LA DERECHA (Ventanilla en Pequeño) */}
          <RightProductPile
            pRecuadroDer={pRecuadroDer}
            scale={scale}
            productsPile={productsPile}
            activeExamItem={activeExamProduct}
            onSendToExam={handleSendToExam}
            onReplenishPile={() => setProductsPile(INITIAL_PRODUCTS_PILE)}
          />

          {/* CAJA VECTORIAL */}
          <Animated.View style={[styles.spriteAbsolute, pCaja, { zIndex: FIGMA_ELEMENTS.caja.zIndex, transform: [{ translateX: cajaTranslateX }] }]}>
            <TouchableOpacity activeOpacity={0.85} onPress={toggleCaja} style={styles.fillTouch}>
              <CajaVectorial width={pCaja.width} height={pCaja.height} isOpen={cajaAbierta} />
              <View style={styles.edgeTab}><Text style={styles.edgeTabText}>{cajaAbierta ? '◄ CERRAR' : 'CAJA ►'}</Text></View>
            </TouchableOpacity>
          </Animated.View>

          {/* CAJÓN CON HERRAMIENTAS Y SLOTS */}
          <CajonDrawerWithSlots
            scale={scale}
            isOpen={cajonAbierto}
            onToggleCajon={toggleCajon}
            pCajon={pCajon}
            pSlot1={pSlot1}
            pSlot2={pSlot2}
            cajonTranslateX={cajonTranslateX}
            slot1Item={slot1Item}
            slot2Item={slot2Item}
            activeSlot={activeSlot}
            onToggleActiveSlot={(s) => setActiveSlot((prev) => (prev === s ? null : s))}
            onAssignToSlot={handleAssignToSlot}
          />

          {/* HERRAMIENTA EN MANO (Sensor de inclinación) */}
          <InHandToolOverlay
            activeTool={activeTool}
            scale={scale}
            stageWidth={stageWidth}
            stageHeight={stageHeight}
            tiltX={tiltX}
            tiltY={tiltY}
            onDeactivate={() => setActiveSlot(null)}
            onUvTargetStateChange={setIsDniUvLit}
          />

          {/* PC CERRADA */}
          <TouchableOpacity activeOpacity={0.85} onPress={togglePc} style={[styles.spriteAbsolute, pPc, { zIndex: FIGMA_ELEMENTS.pc.zIndex }]}>
            <Image source={HORIZONTAL_SPRITES.pc} style={styles.fillImage} resizeMode="stretch" />
          </TouchableOpacity>

          {/* OVERLAY PC ABIERTA (Interactiva y Usable) */}
          <PcTerminalOverlay
            visible={pcAbiertaVisible}
            onClose={togglePc}
            posPcAbierta={pos(FIGMA_ELEMENTS.pcAbierta)}
            posPantalla={pos(FIGMA_ELEMENTS.pantallaPcAbierta)}
            zIndexBase={FIGMA_ELEMENTS.pcAbierta.zIndex}
            activeExamProduct={activeExamProduct}
          />
        </View>
      </View>

      {/* EFECTOS AMBIENTALES GLOBALES */}
      <View style={styles.fullScreenEffects} pointerEvents="none">
        <Image source={HORIZONTAL_SPRITES.efecto2} style={[StyleSheet.absoluteFill, { opacity: 0.45 }]} resizeMode="cover" />
        <Image source={HORIZONTAL_SPRITES.efecto1} style={[StyleSheet.absoluteFill, { opacity: 0.35 }]} resizeMode="cover" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#020408' },
  fullScreenEffects: { ...StyleSheet.absoluteFillObject, zIndex: 990 },
  loadingScreen: { flex: 1, backgroundColor: '#05070A', justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 12, color: '#2E86C1', letterSpacing: 1.5 },
  pauseAboveScanner: { position: 'absolute', backgroundColor: '#0A121D', borderWidth: 1, borderColor: '#2E86C1', justifyContent: 'center', alignItems: 'center' },
  pauseBtnText: { fontFamily: TYPOGRAPHY.systemPC, color: '#38BDF8', letterSpacing: 0.8, fontWeight: 'bold' },
  centerStageWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020408' },
  stageViewport: { backgroundColor: '#04070C', position: 'relative', overflow: 'visible' },
  spriteAbsolute: { position: 'absolute' },
  fillImage: { width: '100%', height: '100%' },
  fillTouch: { width: '100%', height: '100%', position: 'relative' },
  edgeTab: { position: 'absolute', right: 6, top: '40%', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderWidth: 1, borderColor: '#38BDF8', paddingHorizontal: 4, paddingVertical: 2 },
  edgeTabText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 8, color: '#38BDF8', fontWeight: 'bold' },
});
