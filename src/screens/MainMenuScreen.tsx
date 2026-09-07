import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Text, StatusBar } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { TitleSvg } from '../components/menu/TitleSvg';
import { LogoSvg } from '../components/menu/LogoSvg';
import { colors } from '../theme/colors';
import { scale, verticalScale, moderateScale } from '../utils/responsive';
import { TYPOGRAPHY } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, any>;

export const MainMenuScreen = ({ navigation }: Props) => {
  const handleStartStory = () => {
    navigation.navigate('OperatorRegistration');
  };

  const handleOpenSettings = () => {
    (navigation as any).navigate('Settings');
  };

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* BOTÓN SUPERIOR DE APERTURA DEL DRAWER */}
      <TouchableOpacity
        style={styles.drawerButton}
        activeOpacity={0.7}
        onPress={handleOpenDrawer}
      >
        <Text style={styles.drawerButtonText}>[ ☰ PANEL CST ]</Text>
      </TouchableOpacity>

      <View style={styles.mainContainer}>
        {/* COLUMNA IZQUIERDA: LOGO INDUSTRIAL GIRATORIO */}
        <View style={styles.leftColumn}>
          <LogoSvg />
        </View>

        {/* COLUMNA DERECHA: TÍTULO Y OPCIONES */}
        <View style={styles.rightColumn}>
          {/* Título vectorial del juego */}
          <View style={styles.titleSection}>
            <TitleSvg />
          </View>

          {/* Menú de opciones */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.buttonWrapper}
              activeOpacity={0.6}
              onPress={handleStartStory}
            >
              <View style={styles.lineWrapper}>
                <View style={styles.customLine} />
                <Text style={styles.menuOptionText}>[ STORY / ACCESO ]</Text>
                <View style={styles.customLine} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonWrapper}
              activeOpacity={0.6}
              onPress={handleOpenSettings}
            >
              <View style={styles.lineWrapper}>
                <View style={styles.customLine} />
                <Text style={styles.menuOptionText}>[ SETTINGS ]</Text>
                <View style={styles.customLine} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonWrapper}
              activeOpacity={0.6}
              onPress={() => (navigation as any).navigate('ManualDossier')}
            >
              <View style={styles.lineWrapper}>
                <View style={styles.customLine} />
                <Text style={styles.menuOptionText}>[ EXPEDIENTE CST ]</Text>
                <View style={styles.customLine} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Créditos / Pie de terminal */}
          <View style={styles.footerSection}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleOpenDrawer}
            >
              <View style={styles.lineWrapper}>
                <View style={[styles.customLine, styles.dimmedLine]} />
                <Text style={styles.footerButtonText}>ver menú lateral [DRAWER]</Text>
                <View style={[styles.customLine, styles.dimmedLine]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  drawerButton: {
    position: 'absolute',
    top: verticalScale(14),
    left: scale(16),
    zIndex: 20,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
  },
  drawerButtonText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(9),
    color: colors.crtAmber,
    letterSpacing: 0.5,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightColumn: {
    flex: 0.65,
    flexDirection: 'column',
  },
  titleSection: {
    flex: 2.1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: verticalScale(8),
  },
  menuSection: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footerSection: {
    flex: 1.0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    paddingTop: verticalScale(40),
  },
  buttonWrapper: {
    width: '100%',
    paddingVertical: verticalScale(6),
    marginVertical: verticalScale(4),
    alignItems: 'center',
  },
  lineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
  },
  customLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderMedium,
    opacity: 0.5,
    marginHorizontal: scale(8),
  },
  dimmedLine: {
    opacity: 0.2,
  },
  menuOptionText: {
    fontFamily: 'Inconsolata-Light',
    fontSize: moderateScale(17),
    color: colors.textSecondary,
    opacity: 0.9,
    letterSpacing: scale(1.5),
  },
  footerButtonText: {
    fontFamily: 'Inconsolata-Light',
    fontSize: moderateScale(12),
    color: colors.textSubtle,
    letterSpacing: scale(1),
    opacity: 0.7,
  },
});