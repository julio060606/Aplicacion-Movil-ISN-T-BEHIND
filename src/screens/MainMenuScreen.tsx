// src/screens/MainMenuScreen.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Text, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { TitleSvg } from '../components/menu/TitleSvg';
import { LogoSvg } from '../components/menu/LogoSvg';
import { colors } from '../theme/colors';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

export const MainMenuScreen = ({ navigation }: Props) => {
  const handleStartStory = () => {
    navigation.navigate('WeeklyIntro', { weekNumber: 1 });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

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
                <Text style={styles.menuOptionText}>[ STORY ]</Text>
                <View style={styles.customLine} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.6}>
              <View style={styles.lineWrapper}>
                <View style={styles.customLine} />
                <Text style={styles.menuOptionText}>[ SETTINGS ]</Text>
                <View style={styles.customLine} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.6}>
              <View style={styles.lineWrapper}>
                <View style={styles.customLine} />
                <Text style={styles.menuOptionText}>[ EXIT ]</Text>
                <View style={styles.customLine} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Créditos / Pie de terminal */}
          <View style={styles.footerSection}>
            <TouchableOpacity activeOpacity={0.6}>
              <View style={styles.lineWrapper}>
                <View style={[styles.customLine, styles.dimmedLine]} />
                <Text style={styles.footerButtonText}>credits</Text>
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