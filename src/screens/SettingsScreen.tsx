// src/screens/SettingsScreen.tsx
import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { useMenuTheme } from '../context/MenuThemeContext';
import { MenuSection } from '../components/menu/MenuSection';
import { MenuCheckbox } from '../components/menu/MenuCheckbox';
import { MenuOption } from '../components/menu/MenuOption';
import { MenuBackBar } from '../components/menu/MenuBackBar';
import { ScreenDirtOverlay } from '../components/ui/ScreenDirtOverlay';
import { ScreenDelay } from '../components/ui/ScreenDelay';
import { TYPOGRAPHY } from '../theme/typography';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen = ({ navigation }: Props) => {
  const { theme, variant, toggleTheme } = useMenuTheme();

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [screenShakeEnabled, setScreenShakeEnabled] = useState(true);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggleLang = () => {
    setLanguage(language === 'ES' ? 'EN' : 'ES');
  };

  const handleSync = useCallback(async (action: string) => {
    if (isSyncing) return;
    setIsSyncing(true);
    if (hapticsEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert(
        'RED C.S.T.',
        `Acción [${action}] pendiente de integración REST (Semana 8).`,
      );
    }, 1000);
  }, [isSyncing, hapticsEnabled]);

  return (
    <ScreenDelay>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <StatusBar hidden />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Apariencia */}
          <MenuSection title="Apariencia" typewriterDelay={0}>
            <MenuOption
              label={variant === 'dark' ? '[ TEMA: OSCURO ]' : '[ TEMA: CLARO ]'}
              onPress={toggleTheme}
            />
          </MenuSection>

          {/* Audio */}
          <MenuSection title="Audio" typewriterDelay={100}>
            <View style={styles.rowWrapper}>
              <MenuCheckbox label="Música" value={musicEnabled} onChange={setMusicEnabled} style={styles.halfWidth} />
              <MenuCheckbox label="Efectos" value={sfxEnabled} onChange={setSfxEnabled} style={styles.halfWidth} />
            </View>
          </MenuSection>

          {/* Dispositivo */}
          <MenuSection title="Dispositivo" typewriterDelay={200}>
            <View style={styles.rowWrapper}>
              <MenuCheckbox label="Háptica" value={hapticsEnabled} onChange={(val) => { setHapticsEnabled(val); if (val) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(()=>{}); }} style={styles.halfWidth} />
              <MenuCheckbox label="Temblor" value={screenShakeEnabled} onChange={setScreenShakeEnabled} style={styles.halfWidth} />
            </View>
          </MenuSection>

          {/* Idioma */}
          <MenuSection title="Idioma" typewriterDelay={300}>
            <View style={styles.rowWrapper}>
              <MenuOption label={`[ IDIOMA: ${language === 'ES' ? 'ESPAÑOL' : 'INGLÉS'} ]`} onPress={handleToggleLang} />
            </View>
          </MenuSection>

          {/* Protocolo REST */}
          <MenuSection title="Protocolo REST" typewriterDelay={400}>
            <MenuOption label="[ CARGAR PERFIL ]" onPress={() => handleSync('CARGAR')} />
            <MenuOption label="[ INGRESAR PERFIL ]" onPress={() => handleSync('INGRESAR')} />
          </MenuSection>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <MenuBackBar onBack={() => navigation.goBack()} />
        <ScreenDirtOverlay />
      </View>
    </ScreenDelay>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: scale(22),
    paddingTop: verticalScale(70),
    paddingBottom: verticalScale(110),
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 0.48,
    borderBottomWidth: 0,
  },
  bottomSpacer: {
    height: verticalScale(20),
  },
});
