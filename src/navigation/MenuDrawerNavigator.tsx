// src/navigation/MenuDrawerNavigator.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { MenuDrawerParamList } from '../models/types';
import { MainMenuScreen } from '../screens/MainMenuScreen';
import { DossierScreen } from '../screens/DossierScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const Drawer = createDrawerNavigator<MenuDrawerParamList>();

// CONTENIDO PERSONALIZADO DEL MENÚ LATERAL (DRAWER DIEGÉTICO)
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { navigation, state } = props;
  const currentRoute = state.routes[state.index]?.name;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* CABECERA CORPORATIVA CST */}
      <View style={styles.drawerHeader}>
        <Text style={styles.headerCompany}>CONSORCIO INDUSTRIAL S.T.</Text>
        <Text style={styles.headerMenuTitle}>TERMINAL DE CONTROL // NAVEGACIÓN</Text>
        <View style={styles.headerDivider} />
      </View>

      {/* ITEMS DE NAVEGACIÓN */}
      <View style={styles.itemsContainer}>
        {/* ITEM 1: MENÚ PRINCIPAL */}
        <TouchableOpacity
          style={[styles.drawerItem, currentRoute === 'HomeMenu' && styles.drawerItemActive]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('HomeMenu')}
        >
          <Text style={[styles.itemText, currentRoute === 'HomeMenu' && styles.itemTextActive]}>
            [ 01. PUESTO DE INICIO / STORY ]
          </Text>
        </TouchableOpacity>

        {/* ITEM 2: EXPEDIENTE Y REGLAS (TABS) */}
        <TouchableOpacity
          style={[styles.drawerItem, currentRoute === 'ManualDossier' && styles.drawerItemActive]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ManualDossier')}
        >
          <Text style={[styles.itemText, currentRoute === 'ManualDossier' && styles.itemTextActive]}>
            [ 02. ARCHIVO Y REGLAS (TABS) ]
          </Text>
        </TouchableOpacity>

        {/* ITEM 3: AJUSTES Y CONFIGURACIÓN */}
        <TouchableOpacity
          style={[styles.drawerItem, currentRoute === 'Settings' && styles.drawerItemActive]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.itemText, currentRoute === 'Settings' && styles.itemTextActive]}>
            [ 03. CONFIGURACIÓN Y RED ]
          </Text>
        </TouchableOpacity>
      </View>

      {/* PIE DE PÁGINA DEL DRAWER */}
      <View style={styles.drawerFooter}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>SISTEMA CST OS v2.0 // SECTOR 4</Text>
        <Text style={styles.footerSubText}>EVALUACIÓN APF1 (STACK + TAB + DRAWER)</Text>
      </View>
    </DrawerContentScrollView>
  );
};

export const MenuDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeMenu"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#040711',
          width: scale(270),
          borderRightWidth: 1.5,
          borderRightColor: '#1e293b',
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.75)',
      }}
    >
      <Drawer.Screen name="HomeMenu" component={MainMenuScreen} />
      <Drawer.Screen name="ManualDossier" component={DossierScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
    justifyContent: 'space-between',
  },
  drawerHeader: {
    marginBottom: verticalScale(20),
  },
  headerCompany: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(8),
    color: '#d97706',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerMenuTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(11),
    color: '#f8fafc',
    fontWeight: 'bold',
  },
  headerDivider: {
    height: 2,
    backgroundColor: '#334155',
    marginTop: verticalScale(8),
  },
  itemsContainer: {
    gap: verticalScale(12),
  },
  drawerItem: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 4,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(10),
  },
  drawerItemActive: {
    borderColor: colors.crtGreen,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
  },
  itemText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(9),
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  itemTextActive: {
    color: colors.crtGreen,
    fontWeight: 'bold',
  },
  drawerFooter: {
    marginTop: verticalScale(30),
  },
  footerLine: {
    height: 1,
    backgroundColor: '#1e293b',
    marginBottom: verticalScale(8),
  },
  footerText: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(7.5),
    color: colors.textMuted,
    textAlign: 'center',
  },
  footerSubText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(7),
    color: '#475569',
    textAlign: 'center',
    marginTop: 2,
  },
});
