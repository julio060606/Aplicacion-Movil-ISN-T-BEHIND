// src/screens/PrototypeIntroScreen.tsx
/**
 * =========================================================================
 * Pantalla Inicial de Aviso Académico — Prototipo de Concepto e Interfaces
 * =========================================================================
 * Se muestra al iniciar la aplicación antes del menú principal, informando
 * que el software constituye un prototipo funcional desarrollado para el
 * curso de Desarrollo de Aplicaciones Móviles, cumpliendo los requisitos
 * de interfaces, navegación y hardware nativo.
 * =========================================================================
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../models/types';
import { useMenuTheme } from '../context/MenuThemeContext';
import { ScreenDirtOverlay } from '../components/ui/ScreenDirtOverlay';
import { TYPOGRAPHY } from '../theme/typography';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'PrototypeIntro'>;

const PROTOTYPE_FEATURES: readonly string[] = [
  'Arquitectura de navegación multipatrón (Stack, Drawer y Tabs).',
  'Interfaces adaptativas y escena interactiva con gestos táctiles.',
  'Integración de hardware nativo: cámara frontal, acelerómetro y notificaciones.',
  'Consumo de APIs REST, persistencia local y consola de auditoría en vivo.',
];

export const PrototypeIntroScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useMenuTheme();

  const handleContinue = () => {
    Haptics.selectionAsync().catch(() => {});
    navigation.replace('MenuDrawer');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C0C" />
      <ScreenDirtOverlay />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Cabecera institucional C.S.T. / Académica */}
          <View style={styles.headerRow}>
            <View style={styles.cstEmblem}>
              <Text style={styles.cstEmblemText}>CST</Text>
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.tag}>PROTOTIPO ACADÉMICO // UNIDAD 1 - 4</Text>
              <Text style={styles.title}>ISN&apos;T BEHIND</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Declaración de Prototipo de Concepto e Interfaces */}
          <Text style={styles.sectionTitle}>PROTOTIPO DE CONCEPTO E INTERFACES</Text>
          <Text style={styles.bodyText}>
            Esta aplicación es un prototipo funcional desarrollado como avance del curso{' '}
            <Text style={styles.highlight}>Desarrollo de Aplicaciones Móviles</Text>. Su propósito es
            validar la experiencia de usuario, la arquitectura modular y el cumplimiento de los
            requerimientos base de interfaces móviles.
          </Text>

          {/* Lista de requerimientos cubiertos */}
          <View style={styles.checklistBox}>
            <Text style={styles.checklistHeader}>REQUERIMIENTOS DE INTERFAZ IMPLEMENTADOS:</Text>
            {PROTOTYPE_FEATURES.map((item) => (
              <View key={item} style={styles.checkRow}>
                <Text style={styles.checkBullet}>■</Text>
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Pie técnico */}
          <Text style={styles.metaText}>
            STACK: EXPO SDK 57 • REACT NATIVE 0.86.3 • TYPESCRIPT STRICT
          </Text>

          {/* Botón de entrada al menú principal */}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueBtnText}>[ INICIAR PROTOTIPO → ]</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(24),
  },
  card: {
    backgroundColor: '#12161C',
    borderWidth: 1.5,
    borderColor: '#2E86C1',
    borderRadius: 4,
    padding: scale(18),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  cstEmblem: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderWidth: 2,
    borderColor: '#2E86C1',
    backgroundColor: '#0A1929',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  cstEmblemText: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(13),
    color: '#5DADE2',
    letterSpacing: 1,
  },
  headerTextWrap: {
    flex: 1,
  },
  tag: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(9.5),
    color: '#2E86C1',
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: TYPOGRAPHY.menuTitle,
    fontSize: moderateScale(28),
    color: '#F1F5F9',
    letterSpacing: 2,
    marginTop: verticalScale(2),
  },
  divider: {
    height: 1.5,
    backgroundColor: '#2E86C1',
    opacity: 0.65,
    marginVertical: verticalScale(12),
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(12),
    color: '#E2E8F0',
    letterSpacing: 1,
    marginBottom: verticalScale(6),
  },
  bodyText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(11.5),
    color: '#CBD5E1',
    lineHeight: moderateScale(17),
    marginBottom: verticalScale(14),
  },
  highlight: {
    color: '#5DADE2',
  },
  checklistBox: {
    backgroundColor: '#0B0E13',
    borderWidth: 1,
    borderColor: '#243040',
    padding: scale(12),
    marginBottom: verticalScale(14),
    gap: verticalScale(6),
  },
  checklistHeader: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(10),
    color: '#5DADE2',
    marginBottom: verticalScale(4),
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(8),
  },
  checkBullet: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(9),
    color: '#2E86C1',
    marginTop: verticalScale(2),
  },
  checkText: {
    flex: 1,
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(10.5),
    color: '#94A3B8',
    lineHeight: moderateScale(15),
  },
  metaText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(9),
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 0.8,
    marginBottom: verticalScale(14),
  },
  continueBtn: {
    backgroundColor: '#1A365D',
    borderWidth: 1.5,
    borderColor: '#2E86C1',
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    borderRadius: 2,
  },
  continueBtnText: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(13),
    color: '#F8FAFC',
    letterSpacing: 1.4,
  },
});
