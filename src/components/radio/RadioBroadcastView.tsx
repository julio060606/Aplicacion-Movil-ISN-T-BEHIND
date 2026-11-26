// src/components/radio/RadioBroadcastView.tsx
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

// Tipografía: Inconsolata limpia
const FONT_BASE = TYPOGRAPHY.systemPC;            // 'Inconsolata-Light'
const FONT_HIGHLIGHT = TYPOGRAPHY.menuOptionBold; // 'Inconsolata-Bold'

interface RadioBroadcastViewProps {
  pages: string[];
  dayNumber: number;
  /** Imagen a lo largo opcional; si no se envía, el espacio queda vacío */
  imageSource?: ImageSourcePropType;
  onStartShift: () => void;
}

export const RadioBroadcastView: React.FC<RadioBroadcastViewProps> = ({
  pages,
  dayNumber,
  imageSource,
  onStartShift,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentPageText = pages[pageIndex] || '';
  const textTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Barrido tipo máquina de escribir
  useEffect(() => {
    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText('');

    if (textTimerRef.current) clearInterval(textTimerRef.current);

    textTimerRef.current = setInterval(() => {
      if (charIndex <= currentPageText.length) {
        setDisplayedText(currentPageText.substring(0, charIndex));
        charIndex++;
      } else {
        setIsTyping(false);
        if (textTimerRef.current) clearInterval(textTimerRef.current);
      }
    }, 20);

    return () => {
      if (textTimerRef.current) clearInterval(textTimerRef.current);
    };
  }, [pageIndex, currentPageText]);

  const handleSkip = () => {
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
  const canStart = isLastPage && !isTyping;

  const handleStart = () => {
    if (!canStart) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onStartShift();
  };

  return (
    <TouchableWithoutFeedback onPress={handleSkip}>
      <View style={styles.container}>
        {/* FILA PRINCIPAL: Imagen vertical a la izquierda + Texto a la derecha */}
        <View style={styles.contentRow}>
          {/* 1. IMAGEN A LO LARGO (Izquierda, vacía si no hay imagen provista) */}
          <View style={styles.imageColumn}>
            {imageSource ? (
              <Image
                source={imageSource}
                style={styles.tallImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.emptyImageSlot} />
            )}
          </View>

          {/* 2. TEXTO Y PAGINACIÓN (Derecha) */}
          <View style={styles.textColumn}>
            <View style={styles.textContainer}>
              <Text style={styles.bodyText}>
                {displayedText}
                {isTyping && <Text style={styles.cursor}>_</Text>}
              </Text>
            </View>

            {/* Paginación (< PAG X/Y >) */}
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
          </View>
        </View>

        {/* 3. BARRA INFERIOR DE ACCIÓN: TRABAJAR */}
        <GameBottomBar
          action={{
            label: '[ TRABAJAR ]',
            onPress: handleStart,
            disabled: !canStart,
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
    backgroundColor: '#0C0C0C',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(60),
    justifyContent: 'center',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    gap: scale(14),
    alignItems: 'center',
    paddingBottom: verticalScale(45),
    paddingTop: verticalScale(16),
  },
  imageColumn: {
    flex: 0.9,
    height: '80%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tallImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  emptyImageSlot: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F1318',
    borderWidth: 1,
    borderColor: '#1E2631',
    borderStyle: 'dashed',
  },
  textColumn: {
    flex: 1.1,
    justifyContent: 'center',
  },
  textContainer: {
    minHeight: verticalScale(120),
    justifyContent: 'center',
  },
  bodyText: {
    fontFamily: FONT_BASE,
    fontSize: moderateScale(13.5),
    color: '#E0E7EC',
    lineHeight: verticalScale(21),
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cursor: {
    color: colors.menuTheme.dark.accent,
    fontWeight: 'bold',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(14),
    paddingTop: verticalScale(6),
    borderTopWidth: 1,
    borderTopColor: '#202020',
  },
  navArrow: {
    fontFamily: FONT_HIGHLIGHT,
    fontSize: moderateScale(11.5),
    color: '#94A3B8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  navArrowDisabled: {
    color: '#3A3A3A',
  },
  pageCounter: {
    fontFamily: FONT_BASE,
    fontSize: moderateScale(11),
    color: '#666666',
    letterSpacing: 1,
  },
  navPlaceholder: {
    width: scale(60),
  },
});
