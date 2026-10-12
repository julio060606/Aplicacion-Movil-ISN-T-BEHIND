// src/components/terminal/TerminalMailView.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { GameBottomBar } from '../ui/GameBottomBar';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

// =============================================================================
// CONFIGURACIÓN DE FUENTES DEL TERMINAL
// (Para cambiar la fuente fácilmente en el futuro, edita estas constantes)
// =============================================================================
const FONT_TERMINAL = TYPOGRAPHY.faxSecondary; // 'VT323-Regular'

interface TerminalMailViewProps {
  from: string;
  to: string;
  subject: string;
  date?: string;
  refCode?: string;
  pages: string[];
  /** Sprite o ilustración adjunta inferior opcional (no se renderiza nada si no existe) */
  attachmentSprite?: ImageSourcePropType;
  /** Callback al pulsar el botón CONTINUAR */
  onComplete: () => void;
}

export const TerminalMailView: React.FC<TerminalMailViewProps> = ({
  from,
  to,
  subject,
  date = '10/11/2004 - 08:30:14',
  refCode = 'CST-DISPATCH-SECT4',
  pages,
  attachmentSprite,
  onComplete,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);


  const currentPageText = pages[pageIndex] || '';
  const textTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Barrido de caracteres estilo máquina / terminal
  useEffect(() => {
    let charIdx = 0;
    setIsTyping(true);
    setDisplayedText('');

    if (textTimerRef.current) clearInterval(textTimerRef.current);

    textTimerRef.current = setInterval(() => {
      if (charIdx <= currentPageText.length) {
        setDisplayedText(currentPageText.substring(0, charIdx));
        charIdx++;
      } else {
        setIsTyping(false);
        if (textTimerRef.current) clearInterval(textTimerRef.current);
      }
    }, 18);

    return () => {
      if (textTimerRef.current) clearInterval(textTimerRef.current);
    };
  }, [pageIndex, currentPageText]);

  // Tocar la pantalla completa el texto inmediatamente
  const handleSkipTyping = () => {
    if (isTyping) {
      if (textTimerRef.current) clearInterval(textTimerRef.current);
      setDisplayedText(currentPageText);
      setIsTyping(false);
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const handleNextPage = () => {
    if (pageIndex < pages.length - 1) {
      Haptics.selectionAsync().catch(() => {});
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      Haptics.selectionAsync().catch(() => {});
      setPageIndex((prev) => prev - 1);
    }
  };

  const isLastPage = pageIndex === pages.length - 1;
  // Solo se puede continuar si se está en la última página y se terminó de leer
  const canContinue = isLastPage && !isTyping;

  return (
    <TouchableWithoutFeedback onPress={handleSkipTyping}>
      <View style={styles.container}>
        <View style={styles.terminalContent}>
          {/* 1. CABECERA TIPO CORREO DOS REAL (Sin cajas ni recuadros) */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              <Text style={styles.headerLabel}>FROM:    </Text>
              {from}
            </Text>
            <Text style={styles.headerText}>
              <Text style={styles.headerLabel}>TO:      </Text>
              {to}
            </Text>
            <Text style={styles.headerText}>
              <Text style={styles.headerLabel}>DATE:    </Text>
              {date}
            </Text>
            <Text style={styles.headerText}>
              <Text style={styles.headerLabel}>SUBJ:    </Text>
              {subject}
            </Text>
            <Text style={styles.headerText}>
              <Text style={styles.headerLabel}>REF:     </Text>
              <Text style={styles.refCodeText}>{refCode}</Text>
            </Text>
          </View>

          {/* Separador de caracteres ASCII */}
          <Text style={styles.asciiDivider}>
            --------------------------------------------------------
          </Text>

          {/* 2. CUERPO DEL CORREO (Contenido más medido para no saturar) */}
          <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>
              {displayedText}
              {isTyping && <Text style={styles.cursor}>█</Text>}
            </Text>
          </View>

          {/* 3. FLECHAS DE PAGINACIÓN DISCRETAS (< PAG X/Y >) */}
          <View style={styles.paginationRow}>
            {pageIndex > 0 ? (
              <TouchableOpacity
                onPress={handlePrevPage}
                hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              >
                <Text style={styles.navArrow}>&lt; ANTERIOR</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.navPlaceholder} />
            )}

            <Text style={styles.pageCounter}>
              [ PAG {pageIndex + 1}/{pages.length} ]
            </Text>

            {!isLastPage ? (
              <TouchableOpacity
                onPress={handleNextPage}
                disabled={isTyping}
                hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              >
                <Text style={[styles.navArrow, isTyping && styles.navArrowDisabled]}>
                  SIGUIENTE &gt;
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.navPlaceholder} />
            )}
          </View>

          {/* 4. ÁREA INFERIOR DISPONIBLE PARA IMAGEN/SPRITE (Limpia si no hay imagen) */}
          {attachmentSprite && (
            <View style={styles.attachmentWrapper}>
              <Image
                source={attachmentSprite}
                style={styles.attachmentImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        {/* 5. TAB INFERIOR SIEMPRE VISIBLE (CONTINUAR opaco hasta terminar de leer) */}
        <GameBottomBar
          action={{
            label: '[ CONTINUAR ]',
            onPress: onComplete,
            disabled: !canContinue,
            textAlign: 'left',
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C', // Fondo 0C0C0C solicitado
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(170), // Subido moderadamente para dejar espacio abajo
    paddingBottom: verticalScale(60),
    justifyContent: 'space-between',
  },
  terminalContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    gap: verticalScale(2),
  },
  headerText: {
    fontFamily: FONT_TERMINAL,
    fontSize: moderateScale(16.5),
    color: '#D4D4D4',
    letterSpacing: 0.5,
    lineHeight: verticalScale(19),
  },
  headerLabel: {
    color: '#707070',
  },
  refCodeText: {
    color: '#2E86C1', // Azul C.S.T.
  },
  asciiDivider: {
    fontFamily: FONT_TERMINAL,
    fontSize: moderateScale(15),
    color: '#333333',
    letterSpacing: -0.5,
    marginVertical: verticalScale(4),
  },
  bodyContainer: {
    paddingVertical: verticalScale(4),
    minHeight: verticalScale(110),
  },
  bodyText: {
    fontFamily: FONT_TERMINAL,
    fontSize: moderateScale(17.5),
    color: '#E0E0E0',
    lineHeight: verticalScale(22),
    letterSpacing: 0.6,
  },
  cursor: {
    color: '#00FF66', // Fósforo verde terminal
    fontSize: moderateScale(16),
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(8),
    paddingTop: verticalScale(4),
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  navArrow: {
    fontFamily: FONT_TERMINAL,
    fontSize: moderateScale(16),
    color: '#94A3B8',
    letterSpacing: 1,
  },
  navArrowDisabled: {
    color: '#3A3A3A',
  },
  pageCounter: {
    fontFamily: FONT_TERMINAL,
    fontSize: moderateScale(14),
    color: '#666666',
    letterSpacing: 1,
  },
  navPlaceholder: {
    width: scale(70),
  },
  attachmentWrapper: {
    position: 'absolute',
    bottom: verticalScale(60),
    left: scale(18),
    right: scale(18),
    height: verticalScale(160),
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
});
