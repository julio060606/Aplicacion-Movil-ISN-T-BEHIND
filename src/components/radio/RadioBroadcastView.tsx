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
  radioSprite?: ImageSourcePropType;
  onStartShift: () => void;
}

export const RadioBroadcastView: React.FC<RadioBroadcastViewProps> = ({
  pages,
  dayNumber,
  radioSprite,
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
        {/* 1. BLOQUE DE TEXTO EN EL CENTRO (Espacio superior e inferior libres) */}
        <View style={styles.centerBlock}>
          <View style={styles.textContainer}>
            <Text style={styles.bodyText}>
              {displayedText}
              {isTyping && <Text style={styles.cursor}>_</Text>}
            </Text>
          </View>

          {/* Paginación discreta (< PAG X/Y >) */}
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

        {/* 2. RADIO ESTÁTICA (Sin animación, fijada más abajo a la derecha) */}
        <View style={styles.radioStaticArea} pointerEvents="none">
          <View style={styles.radioBox}>
            {/* Colorbox de respaldo */}
            <View style={styles.radioColorbox}>
              <View style={styles.speakerGrill}>
                <View style={styles.grillLine} />
                <View style={styles.grillLine} />
                <View style={styles.grillLine} />
              </View>
              <View style={styles.dialKnob} />
            </View>

            {/* Sprite oficial si está disponible */}
            {radioSprite && (
              <Image
                source={radioSprite}
                style={StyleSheet.absoluteFill}
                resizeMode="contain"
              />
            )}
          </View>
        </View>

        {/* 3. TAB INFERIOR: TRABAJAR */}
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
    backgroundColor: '#0C0C0C', // Fondo permanente 0C0C0C
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(60),
    justifyContent: 'center', // Centrado verticalmente
  },
  centerBlock: {
    justifyContent: 'center',
    paddingBottom: verticalScale(90), // Deja espacio libre para la radio abajo
  },
  textContainer: {
    minHeight: verticalScale(130),
  },
  bodyText: {
    fontFamily: FONT_BASE,
    fontSize: moderateScale(15),
    color: '#E0E7EC', // Blanco sutil legible
    lineHeight: verticalScale(23),
    letterSpacing: 0.8,
    textTransform: 'uppercase', // Formato mayúsculas como en el formulario
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
    fontSize: moderateScale(13),
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  navArrowDisabled: {
    color: '#3A3A3A',
  },
  pageCounter: {
    fontFamily: FONT_BASE,
    fontSize: moderateScale(12),
    color: '#666666',
    letterSpacing: 1,
  },
  navPlaceholder: {
    width: scale(70),
  },
  // Radio estática anclada a la derecha, más abajo pero despegada del tab
  radioStaticArea: {
    position: 'absolute',
    bottom: verticalScale(95),
    right: scale(20),
  },
  radioBox: {
    width: scale(155),
    height: verticalScale(105),
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioColorbox: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#1E242B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 5,
    padding: scale(10),
    justifyContent: 'space-between',
  },
  speakerGrill: {
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: verticalScale(4),
  },
  grillLine: {
    height: 2.5,
    backgroundColor: '#0F172A',
    borderRadius: 2,
  },
  dialKnob: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#64748B',
    alignSelf: 'flex-end',
  },
});
