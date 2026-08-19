// src/components/shift/DraggableNotebook.tsx
import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { scale, verticalScale, moderateScale, screenDimensions } from '../../utils/responsive';

// DIMENSIONES MASIVAS DEL CUADERNO (85% ANCHO, 65% ALTO)
const NOTEBOOK_WIDTH = screenDimensions.width * 0.85;
const NOTEBOOK_HEIGHT = screenDimensions.height * 0.65;

// LÍMITES MATEMÁTICOS DE ARRASTRE
const MIN_X = scale(6);
const MAX_X = screenDimensions.width - NOTEBOOK_WIDTH - scale(6);
const MIN_Y = screenDimensions.counterHeight * 0.25;
const MAX_Y = screenDimensions.height - verticalScale(70);

const INITIAL_X = scale(12);
const INITIAL_Y = screenDimensions.height - verticalScale(110);

export const DraggableNotebook = () => {
  const pan = useRef(new Animated.ValueXY({ x: INITIAL_X, y: INITIAL_Y })).current;
  const currentPos = useRef({ x: INITIAL_X, y: INITIAL_Y });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.setOffset({
          x: currentPos.current.x,
          y: currentPos.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: (_, gestureState) => {
        const targetX = currentPos.current.x + gestureState.dx;
        const targetY = currentPos.current.y + gestureState.dy;

        const clampedX = Math.min(Math.max(targetX, MIN_X), MAX_X);
        const clampedY = Math.min(Math.max(targetY, MIN_Y), MAX_Y);

        pan.setValue({
          x: clampedX - currentPos.current.x,
          y: clampedY - currentPos.current.y,
        });
      },

      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        const finalX = Math.min(Math.max(currentPos.current.x + gestureState.dx, MIN_X), MAX_X);
        const finalY = Math.min(Math.max(currentPos.current.y + gestureState.dy, MIN_Y), MAX_Y);

        currentPos.current = { x: finalX, y: finalY };
        pan.setValue({ x: finalX, y: finalY });
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.notebookContainer,
        {
          transform: pan.getTranslateTransform(),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.leatherCover}>
        {/* Pestaña superior del cuaderno para agarre táctil */}
        <View style={styles.grabHeader}>
          <View style={styles.bookmarkRibbon} />
          <Text style={styles.grabHeaderText}>
            CUADERNO DE NOTAS Y DIRECTIVAS C.S.T. ↕ [ ARRASTRAR PARA INSPECCIÓN ]
          </Text>
        </View>

        {/* Páginas interiores con fuentes Special Elite (dirtyDoc) y Courier Prime (cleanDoc) */}
        <View style={styles.pagesContainer}>
          <View style={styles.pageHeader}>
            <Text style={styles.notebookTitle}>MANUAL DE PROCEDIMIENTOS // SECTOR 4</Text>
            <Text style={styles.notebookCode}>REF: DIRECTIVAS-1986-CST</Text>
          </View>

          <View style={styles.rulesList}>
            <Text style={styles.ruleItem}>1. VERIFICACIÓN DE VIGENCIA DE IDENTIFICACIÓN.</Text>
            <Text style={styles.ruleItem}>2. COTEJO DE NOMBRES Y FOTOGRAFÍAS ANÓMALAS.</Text>
            <Text style={styles.ruleItem}>3. SELLADO OBLIGATORIO CON TINTA OFICIAL.</Text>
            <Text style={styles.ruleItem}>4. MONITOREO DE ESPEJO RETROVISOR Y CABLE CCTV.</Text>
            <Text style={styles.ruleItem}>5. PROHIBIDO IGNORAR ANOMALÍAS DE RETAGUARDIA.</Text>
          </View>

          {/* Sección de notas manuscritas con Caveat & Nanum Pen Script */}
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>[ APUNTES DEL OPERADOR ANTERIOR ]</Text>
            <Text style={styles.notesBody}>
              "Si las luces parpadean más de 3 veces seguidas, no abras la registradora.
              Mira fijamente el espejo antes de firmar cualquier pase."
            </Text>
            <View style={styles.signatureRow}>
              <Text style={styles.signatureText}>Firma: J. Miller</Text>
              <Text style={styles.handwrittenDate}>Fecha: 14/09/2004</Text>
            </View>
          </View>

          <View style={styles.pageFooter}>
            <Text style={styles.footerInstruction}>
              ↕ DESLIZAR HACIA ABAJO PARA GUARDAR EN CAJÓN
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notebookContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: NOTEBOOK_WIDTH,
    height: NOTEBOOK_HEIGHT,
    zIndex: 48,
  },
  leatherCover: {
    flex: 1,
    backgroundColor: colors.colorbox.draggableNotebook,
    borderWidth: 3,
    borderColor: '#7c2d12',
    borderRadius: 8,
    padding: scale(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 8,
    elevation: 12,
  },
  grabHeader: {
    height: verticalScale(26),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b1502',
    borderRadius: 4,
    marginBottom: verticalScale(4),
    paddingHorizontal: scale(8),
  },
  bookmarkRibbon: {
    position: 'absolute',
    left: scale(10),
    top: 0,
    width: scale(10),
    height: verticalScale(20),
    backgroundColor: colors.stampRedBright,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  grabHeaderText: {
    fontFamily: TYPOGRAPHY.stamps,
    color: '#fef3c7',
    fontSize: moderateScale(8),
    fontWeight: 'bold',
  },
  pagesContainer: {
    flex: 1,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#d97706',
    borderRadius: 4,
    padding: scale(10),
    justifyContent: 'space-between',
  },
  pageHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#b45309',
    paddingBottom: verticalScale(4),
  },
  notebookTitle: {
    fontFamily: TYPOGRAPHY.dirtyDoc,
    color: '#451a03',
    fontSize: moderateScale(10),
    textAlign: 'center',
  },
  notebookCode: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    color: '#78350f',
    fontSize: moderateScale(8),
    textAlign: 'center',
    marginTop: 2,
  },
  rulesList: {
    gap: verticalScale(4),
    paddingVertical: verticalScale(2),
  },
  ruleItem: {
    fontFamily: TYPOGRAPHY.dirtyDoc,
    color: '#451a03',
    fontSize: moderateScale(8.5),
    lineHeight: verticalScale(12),
  },
  notesSection: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 4,
    padding: scale(6),
  },
  notesTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    color: '#78350f',
    fontSize: moderateScale(8),
    fontWeight: 'bold',
    marginBottom: 2,
  },
  notesBody: {
    fontFamily: TYPOGRAPHY.handwriting,
    color: '#1e3a8a',
    fontSize: moderateScale(13),
    lineHeight: verticalScale(15),
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(3),
  },
  signatureText: {
    fontFamily: TYPOGRAPHY.handwriting,
    color: '#1e3a8a',
    fontSize: moderateScale(14),
  },
  handwrittenDate: {
    fontFamily: TYPOGRAPHY.handwritingNumbers,
    color: '#991b1b',
    fontSize: moderateScale(16),
  },
  pageFooter: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#d97706',
    paddingTop: verticalScale(4),
  },
  footerInstruction: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    color: '#b45309',
    fontSize: moderateScale(8),
    fontWeight: 'bold',
  },
});
