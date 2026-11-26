import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useMenuTheme } from '../../context/MenuThemeContext';
import { TYPOGRAPHY } from '../../theme/typography';

interface ScreenDelayProps {
  children: React.ReactNode;
  delay?: number;
  backgroundColor?: string;
  loadingText?: string;
}

export const ScreenDelay = ({
  children,
  delay = 1500, // 1.5 segundos por defecto iniciada la partida
  backgroundColor,
  loadingText,
}: ScreenDelayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useMenuTheme();

  const effectiveBg = backgroundColor ?? theme.background;

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setIsVisible(false);
      fadeAnim.setValue(0);

      const timer = setTimeout(() => {
        if (isMounted) {
          setIsVisible(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }
      }, delay);

      return () => {
        isMounted = false;
        setIsVisible(false);
        fadeAnim.setValue(0);
        clearTimeout(timer);
      };
    }, [delay, fadeAnim])
  );

  return (
    <View style={[styles.container, { backgroundColor: effectiveBg }]}>
      {!isVisible && loadingText && (
        <View style={styles.loadingWrapper}>
          <Text style={styles.loadingLabel}>{loadingText}</Text>
        </View>
      )}
      {isVisible && (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {children}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingLabel: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 12,
    color: '#2E86C1', // Azul C.S.T.
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
