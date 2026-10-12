// src/screens/MainMenuScreen.tsx
/**
 * Menú principal de ISN'T BEHIND.
 *
 * Diseño:
 *   - Logo industrial giratorio (lento, 40s por vuelta) a la izquierda.
 *   - Título "ISN'T BEHIND" en Bebas Neue (grande) con micro-temblor analógico
 *     + efecto typewriter al montar la pantalla.
 *   - Línea decorativa azul CST bajo el título.
 *   - Tres opciones con efecto "selección DOS" al presionar:
 *       [ STORY ]    → StorySaveSelect
 *       [ SETTINGS ] → Settings
 *       [ EXTRAS ]   → Extras
 *   - Versión de sistema en el pie.
 *   - Overlay de suciedad/scanlines CRT sobre todo.
 *
 * Sprites futuros:
 *   - Fondo de escritorio (mesa): src/assets/sprites/menu/desk.webp
 *   - Lluvia de colillas:         src/assets/sprites/menu/cigarette.webp
 *     (Múltiples instancias posicionadas absolutamente con animación de caída)
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../models/types';
import { useMenuTheme } from '../context/MenuThemeContext';
import { MenuOption } from '../components/menu/MenuOption';
import { TypewriterText } from '../components/menu/TypewriterText';
import { ScreenDirtOverlay } from '../components/ui/ScreenDirtOverlay';
import { ScreenDelay } from '../components/ui/ScreenDelay';
import { LogoSvg } from '../components/menu/LogoSvg';
import { TYPOGRAPHY } from '../theme/typography';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

// ── Constantes de animación ────────────────────────────────────────────────

/**
 * Micro-temblor del título — amplitudes en px, duraciones desfasadas.
 * Casi imperceptible, solo transmite inquietud inconsciente.
 */
const SHAKE = {
  AMPLITUDE_X: 0.6,
  AMPLITUDE_Y: 0.4,
  DURATION_X: 1800,
  DURATION_Y: 2500,
} as const;

// ── Componente ─────────────────────────────────────────────────────────────

export const MainMenuScreen = () => {
  const { theme } = useMenuTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const shakeX = useRef(new Animated.Value(0)).current;
  const shakeY = useRef(new Animated.Value(0)).current;

  // ── Micro-temblor del título ───────────────────────────────────────────

  useEffect(() => {
    const loopX = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeX, {
          toValue: SHAKE.AMPLITUDE_X,
          duration: SHAKE.DURATION_X / 2,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(shakeX, {
          toValue: -SHAKE.AMPLITUDE_X,
          duration: SHAKE.DURATION_X / 2,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ]),
    );

    const loopY = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeY, {
          toValue: SHAKE.AMPLITUDE_Y,
          duration: SHAKE.DURATION_Y / 2,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(shakeY, {
          toValue: -SHAKE.AMPLITUDE_Y,
          duration: SHAKE.DURATION_Y / 2,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ]),
    );

    loopX.start();
    loopY.start();

    return () => {
      loopX.stop();
      loopY.stop();
    };
  }, [shakeX, shakeY]);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleStory    = () => navigation.navigate('StorySaveSelect');
  const handleSettings = () => navigation.navigate('Settings');
  const handleExtras   = () => navigation.navigate('Extras');

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <ScreenDelay>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <StatusBar hidden />

        {/*
          ── FONDO FUTURO ──────────────────────────────────────────────────────
          Cuando tengas los sprites del escritorio y las colillas:

          1. Fondo de la mesa (imagen estática 2.5D):
             <Image
               source={require('../assets/sprites/menu/desk.webp')}
               style={StyleSheet.absoluteFillObject}
               resizeMode="cover"
             />

          2. Colillas cayendo (instanciar varias con posición y animación random):
             <CigaretteRain />   ← componente a crear en components/menu/
          ──────────────────────────────────────────────────────────────────── */}

        <View style={styles.mainContainer}>
          {/* LOGO de fondo giratorio */}
          <LogoSvg />

          {/* COLUMNA IZQUIERDA: Vacía o con elementos secundarios */}
          <View style={styles.leftColumn}>
          </View>

          {/* COLUMNA DERECHA: Título + opciones + pie */}
          <View style={styles.rightColumn}>

            {/* Título con micro-temblor + efecto typewriter */}
            <View style={styles.titleSection}>
              <Animated.View
                style={{
                  transform: [
                    { translateX: shakeX },
                    { translateY: shakeY },
                  ],
                }}
              >
                <View style={styles.titleWrapper}>
                  <TypewriterText
                    text="ISN'T"
                    speed={55}
                    startDelay={200}
                    style={[styles.titleTextSmall, { color: theme.text }]}
                  />
                  <TypewriterText
                    text="BEHIND"
                    speed={55}
                    startDelay={500}
                    style={[styles.titleTextLarge, { color: theme.text }]}
                  />
                </View>
              </Animated.View>

              {/* Línea azul CST decorativa */}
              <View style={[styles.titleDivider, { backgroundColor: theme.accent }]} />
            </View>

            {/* Opciones del menú */}
            <View style={styles.menuSection}>
              <MenuOption label="[ STORY ]"    onPress={handleStory} />
              <MenuOption label="[ SETTINGS ]" onPress={handleSettings} />
              <MenuOption label="[ EXTRAS ]"   onPress={handleExtras} />
            </View>

            {/* Pie de terminal */}
            <View style={styles.footerSection}>
              <Text style={[styles.footerText, { color: theme.textMuted }]}>
                CONSORCIO S.T. // v1.0.0-ALPHA
              </Text>
            </View>

          </View>
        </View>

        {/* Overlay de scanlines + viñeta (siempre al final, sobre todo) */}
        <ScreenDirtOverlay />

      </SafeAreaView>
    </ScreenDelay>
  );
};

// ── Estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  // Columna izquierda: Vacía o con elementos secundarios
  leftColumn: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Columna derecha: título + menú
  rightColumn: {
    flex: 0.9,
    paddingRight: scale(20),
    flexDirection: 'column',
  },

  // Sección del título — ocupa la mitad superior
  titleSection: {
    flex: 2.2,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(14),
  },
  titleWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  titleTextSmall: {
    fontFamily: TYPOGRAPHY.menuTitle,
    fontSize: moderateScale(54),
    lineHeight: moderateScale(54),
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  titleTextLarge: {
    fontFamily: TYPOGRAPHY.menuTitle,
    fontSize: moderateScale(72),
    lineHeight: moderateScale(72),
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: moderateScale(-18), // ← acerca BEHIND a ISN'T
  },
  titleDivider: {
    height: 3,
    width: '85%',
    marginTop: verticalScale(12),
  },

  // Sección de opciones
  menuSection: {
    flex: 1.3,
        justifyContent: 'flex-start',         // ← Las mueve arriba
    paddingTop: verticalScale(10), 
  },

  // Pie de página
  footerSection: {
    flex: 0.5,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(20),
  },
  footerText: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(10),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});