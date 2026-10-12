import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useMenuTheme } from '../../context/MenuThemeContext';

interface ScreenDelayProps {
  children: React.ReactNode;
  delay?: number;
  backgroundColor?: string;
}

export const ScreenDelay = ({
  children,
  delay = 500,
  backgroundColor,
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
            duration: 800, // fade in duration
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
});
