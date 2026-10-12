// src/screens/ExtrasScreen.tsx
/**
 * Pantalla de extras y curiosidades.
 * Accedida desde "EXTRAS" en el menú principal.
 *
 * Secciones:
 *   1. Créditos del equipo
 *   2. Estadísticas de campaña (del save activo)
 *   3. Desclasificados (easter eggs a futuro)
 *   4. Versión del sistema
 */
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { ISaveGameSchema } from '../models/save';
import { storageService } from '../services/storage/storageService';
import { useMenuTheme } from '../context/MenuThemeContext';
import { MenuSection } from '../components/menu/MenuSection';
import { MenuBackBar } from '../components/menu/MenuBackBar';
import { ScreenDirtOverlay } from '../components/ui/ScreenDirtOverlay';
import { ScreenDelay } from '../components/ui/ScreenDelay';
import { TYPOGRAPHY } from '../theme/typography';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

// ── Tipos ──────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, 'Extras'>;

// Créditos estáticos del proyecto
const CREDITS: Array<{ role: string; name: string }> = [
  { role: 'DIRECCIÓN & DISEÑO', name: 'EQUIPO ISN\'T BEHIND' },
  { role: 'PROGRAMACIÓN', name: 'JULIO & EQUIPO' },
  { role: 'ARTE & SPRITES', name: 'ARTE PROPIO' },
  { role: 'NARRATIVA', name: 'JULIO' },
  { role: 'ASESOR TÉCNICO', name: 'ANTIGRAVITY / GEMINI' },
  { role: 'MOTOR', name: 'REACT NATIVE 0.86.3 + EXPO SDK 57' },
];

// ── Componente ─────────────────────────────────────────────────────────────

export const ExtrasScreen = ({ navigation }: Props) => {
  const { theme } = useMenuTheme();
  const [saveGame, setSaveGame] = useState<ISaveGameSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storageService.loadGame().then((data) => {
      setSaveGame(data);
      setIsLoading(false);
    });
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <ScreenDelay>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <StatusBar hidden />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <MenuSection title="Créditos" typewriterDelay={0}>
            <StatRow label="Arte y Narrativa" value="JULIO & EQUIPO" theme={theme} />
            <StatRow label="Programación" value="SISTEMA IA" theme={theme} />
            <StatRow label="Motor" value="REACT NATIVE" theme={theme} />
            <StatRow label="Versión" value="v1.0.0-ALPHA" theme={theme} />
          </MenuSection>

          <MenuSection title="Estadísticas" typewriterDelay={200}>
            {isLoading ? (
              <StatusLine text="CARGANDO..." theme={theme} />
            ) : saveGame ? (
              <View>
                <StatRow label="Días Completados" value={String(saveGame.currentDay - 1)} theme={theme} />
                <StatRow label="Visitantes Procesados" value={String(saveGame.statistics.totalVisitorsProcessed)} theme={theme} />
                <StatRow label="Decisiones Correctas" value={String(saveGame.statistics.totalCorrectDecisions)} theme={theme} />
                <StatRow label="Decesos" value={String(saveGame.statistics.deathsCount)} theme={theme} />
              </View>
            ) : (
              <StatusLine text="SIN DATOS" theme={theme} />
            )}
          </MenuSection>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <MenuBackBar onBack={() => navigation.goBack()} />
        <ScreenDirtOverlay />
      </View>
    </ScreenDelay>
  );
};

// ── Sub-componentes locales ────────────────────────────────────────────────

type ThemeRef = ReturnType<typeof useMenuTheme>['theme'];

const CreditRow = ({
  role,
  name,
  theme,
}: {
  role: string;
  name: string;
  theme: ThemeRef;
}) => (
  <View style={creditStyles.row}>
    <Text style={[creditStyles.role, { color: theme.textMuted }]}>{role}</Text>
    <Text style={[creditStyles.name, { color: theme.text }]}>{name}</Text>
  </View>
);

const creditStyles = StyleSheet.create({
  row: {
    paddingVertical: verticalScale(5),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  role: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(8),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  name: {
    fontFamily: TYPOGRAPHY.menuOptionBold,
    fontSize: moderateScale(11),
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

const StatRow = ({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ThemeRef;
}) => (
  <View style={statStyles.row}>
    <Text style={[statStyles.label, { color: theme.textMuted }]}>
      {label.toUpperCase()}
    </Text>
    <Text style={[statStyles.value, { color: theme.text }]}>{value}</Text>
  </View>
);

const statStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(5),
  },
  label: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(10),
    letterSpacing: 1,
  },
  value: {
    fontFamily: TYPOGRAPHY.menuOptionBold,
    fontSize: moderateScale(10),
    textAlign: 'right',
    flex: 1,
    paddingLeft: scale(8),
    letterSpacing: 0.5,
  },
});

const StatusLine = ({
  text,
  theme,
}: {
  text: string;
  theme: ThemeRef;
}) => (
  <Text style={[statusStyles.text, { color: theme.textMuted }]}>{text}</Text>
);

const statusStyles = StyleSheet.create({
  text: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(9.5),
    letterSpacing: 0.8,
    lineHeight: verticalScale(16),
    textTransform: 'uppercase',
    marginBottom: verticalScale(4),
  },
});

// ── Estilos principales ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: scale(22),
    paddingTop: verticalScale(70),
    paddingBottom: verticalScale(110),
  },
  header: {
    marginBottom: verticalScale(32),
  },
  screenLabel: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(11),
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: verticalScale(6),
  },
  screenTitle: {
    fontFamily: TYPOGRAPHY.menuTitle,
    fontSize: moderateScale(44),
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  bottomSpacer: {
    height: verticalScale(20),
  },
});
