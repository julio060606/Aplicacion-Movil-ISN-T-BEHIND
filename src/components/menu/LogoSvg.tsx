// src/components/menu/LogoSvg.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { scale, screenDimensions } from '../../utils/responsive';

const LOGO_SIZE = scale(320);

export const LogoSvg = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const startSpinning = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && isMounted) {
          startSpinning();
        }
      });
    };

    startSpinning();

    return () => {
      isMounted = false;
      rotateAnim.stopAnimation();
    };
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.clipperContainer}>
      <Animated.Image
        source={require('../../assets/sprites/sello-cst-2.png')}
        style={[styles.logoImage, { transform: [{ rotate: spin }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  clipperContainer: {
    width: screenDimensions.width,
    height: LOGO_SIZE,
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    left: scale(-20),
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: 'contain',
    marginLeft: -(LOGO_SIZE / 2),
  },
});
