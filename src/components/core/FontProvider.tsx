// src/components/core/FontProvider.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { colors } from '../../theme/colors';

// =========================================================================
// IMPORTACIÓN DE TODAS LAS FAMILIAS TIPOGRÁFICAS (AÑOS 2000 / CORPORATIVO)
// =========================================================================
import { useFonts, Inconsolata_300Light } from '@expo-google-fonts/inconsolata';
import { SyneMono_400Regular } from '@expo-google-fonts/syne-mono';
import { ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { ChakraPetch_400Regular, ChakraPetch_700Bold } from '@expo-google-fonts/chakra-petch';
import { Orbitron_400Regular, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import { CourierPrime_400Regular, CourierPrime_700Bold } from '@expo-google-fonts/courier-prime';
import { Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';
import { CutiveMono_400Regular } from '@expo-google-fonts/cutive-mono';

// Evita que el splash screen nativo desaparezca antes de la carga de recursos
SplashScreen.preventAutoHideAsync().catch(() => {});

type FontProviderProps = {
  children: React.ReactNode;
};

export const FontProvider = ({ children }: FontProviderProps) => {
  const [appIsReady, setAppIsReady] = useState(false);

  // 1. Carga centralizada y asíncrona del ecosistema tipográfico completo
  const [fontsLoaded, fontError] = useFonts({
    // System PC / CRT
    'Inconsolata-Light': Inconsolata_300Light,

    // Sellos Oficiales y Día
    'Syne-Mono': SyneMono_400Regular,

    // Fax / Multas
    'ShareTechMono-Regular': ShareTechMono_400Regular,
    'VT323-Regular': VT323_400Regular,

    // Pantallas Digitales
    'ChakraPetch-Regular': ChakraPetch_400Regular,
    'ChakraPetch-Bold': ChakraPetch_700Bold,
    'Orbitron-Regular': Orbitron_400Regular,
    'Orbitron-Bold': Orbitron_700Bold,

    // Documentos & Cuaderno
    'SpecialElite-Regular': SpecialElite_400Regular,
    'CourierPrime-Regular': CourierPrime_400Regular,
    'CourierPrime-Bold': CourierPrime_700Bold,

    // Manuscrito & Fechas Adulteradas
    'Caveat-Regular': Caveat_400Regular,
    'Caveat-Bold': Caveat_700Bold,
    'NanumPenScript-Regular': NanumPenScript_400Regular,

    // Retrocompatibilidad
    'Cutive-Mono': CutiveMono_400Regular,
  });

  // 2. Activación del Modo Inmersivo Real (Ocultar Navigation Bar en Android)
  useEffect(() => {
    async function configureImmersiveMode() {
      if (Platform.OS === 'android') {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
        } catch (err) {
          console.warn('[FontProvider] Error configurando NavigationBar:', err);
        }
      }
    }
    configureImmersiveMode();
  }, []);

  // 3. Preparación de terminal y recursos
  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded || fontError) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn('[FontProvider] Error en la inicialización de recursos:', e);
        setAppIsReady(true);
      }
    }
    prepare();
  }, [fontsLoaded, fontError]);

  // 4. Ocultamiento seguro del SplashScreen
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appIsReady]);

  // Pantalla de carga con estética CRT
  if (!appIsReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar hidden={true} />
        <ActivityIndicator size="small" color={colors.crtGreen} style={styles.indicator} />
        <Text style={styles.loadingText}>INICIALIZANDO TERMINAL C.S.T....</Text>
        <Text style={styles.subLoadingText}>SISTEMA TIPOGRÁFICO Y ENLACE SEGURO CARGADO</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden={true} />
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    marginBottom: 16,
  },
  loadingText: {
    fontFamily: 'Inconsolata-Light',
    color: colors.crtGreen,
    fontSize: 14,
    letterSpacing: 2.5,
  },
  subLoadingText: {
    fontFamily: 'Inconsolata-Light',
    color: colors.crtGreenDim,
    fontSize: 10,
    marginTop: 8,
    letterSpacing: 1.5,
  },
});