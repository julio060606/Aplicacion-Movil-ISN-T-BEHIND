// src/screens/DossierScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DossierTabParamList } from '../models/types';
import { colors } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

// TAB 1: DIRECTIVAS DE INSPECCIÓN
const DirectivesTab = () => (
  <ScrollView style={styles.tabScroll} contentContainerStyle={styles.tabContent}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardCode}>REF: CST-DIRECTIVA-1986</Text>
      <Text style={styles.cardTitle}>MANUAL DE PROCEDIMIENTOS DEL SECTOR 4</Text>
    </View>
    <View style={styles.ruleItem}>
      <Text style={styles.ruleNumber}>[01]</Text>
      <Text style={styles.ruleBody}>
        COTEJO DE IDENTIDAD: Todo visitante debe presentar su carnet bajo la reja. Compare la fotografía
        con los rasgos reales. Desconfíe de pupilas dilatadas o asimetrías extremas.
      </Text>
    </View>
    <View style={styles.ruleItem}>
      <Text style={styles.ruleNumber}>[02]</Text>
      <Text style={styles.ruleBody}>
        VIGILANCIA PERIMETRAL: Mantenga presionado el marco superior de la ventanilla para inspeccionar
        el pasillo exterior. Verifique que el sujeto no esté siendo manipulado desde las sombras.
      </Text>
    </View>
    <View style={styles.ruleItem}>
      <Text style={styles.ruleNumber}>[03]</Text>
      <Text style={styles.ruleBody}>
        USO DE LA PERSIANA METÁLICA: Ante sospecha inminente de agresión o entidad anómala, baje la persiana
        de inmediato. La persiana actúa como barrera acústica y balística.
      </Text>
    </View>
    <View style={styles.ruleItem}>
      <Text style={styles.ruleNumber}>[04]</Text>
      <Text style={styles.ruleBody}>
        PROTOCOLO LETAL: El arma de servicio en el cajón derecho solo debe ser desenfundada si la reja de
        protección es vulnerada. El Consorcio penaliza el gasto injustificado de munición.
      </Text>
    </View>
  </ScrollView>
);

// TAB 2: CATÁLOGO DE ANOMALÍAS
const AnomaliesTab = () => (
  <ScrollView style={styles.tabScroll} contentContainerStyle={styles.tabContent}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardCode}>REF: EXPEDIENTE-AMENAZAS-V4</Text>
      <Text style={styles.cardTitle}>REGISTRO DE SUJETOS Y RASGOS EXTRAÑOS</Text>
    </View>
    <View style={styles.anomalyCard}>
      <Text style={styles.anomalyTitle}>TIPO A: IMITADORES FACIALES</Text>
      <Text style={styles.anomalyDescription}>
        Sujetos con piel excesivamente tersa o estirada. Sonrisas rígidas que no pestañean. Si la
        fotografía muestra pecas o cicatrices ausentes en la persona física: DENEGAR INMEDIATAMENTE.
      </Text>
      <Text style={styles.threatLevel}>NIVEL DE AMENAZA: MODERADO // COTEJAR EN PC</Text>
    </View>
    <View style={styles.anomalyCard}>
      <Text style={styles.anomalyTitle}>TIPO B: INFILTRADOS CORPORATIVOS</Text>
      <Text style={styles.anomalyDescription}>
        Documentación con sellos borrosos o tinta de color no reglamentario. Usualmente intentarán
        ofrecer sobornos a través de la caja registradora.
      </Text>
      <Text style={styles.threatLevel}>NIVEL DE AMENAZA: ADMINISTRATIVO // CONFISCAR</Text>
    </View>
    <View style={styles.anomalyCard}>
      <Text style={styles.anomalyTitle}>TIPO C: ENTIDADES DE RETAGUARDIA</Text>
      <Text style={styles.anomalyDescription}>
        No aparecen en la ventanilla frontal. Acechan detrás del operador en la oscuridad del cubículo.
        Monitoree el reflejo del espejo retrovisor cada 45 segundos.
      </Text>
      <Text style={styles.threatLevel}>NIVEL DE AMENAZA: CRÍTICO // PREPARAR REVOLVER</Text>
    </View>
  </ScrollView>
);

// TAB 3: REGISTROS Y ESTADO DE RED
const SystemLogsTab = () => (
  <ScrollView style={styles.tabScroll} contentContainerStyle={styles.tabContent}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardCode}>REF: LOGS-CST-NET-ONLINE</Text>
      <Text style={styles.cardTitle}>REGISTRO DE AUDITORÍA Y ESTADO DE RED</Text>
    </View>
    <View style={styles.logItem}>
      <Text style={styles.logTimestamp}>[ 03:14:02 - CST-NODE-4 ]</Text>
      <Text style={styles.logText}>Conexión con terminal de garita establecida exitosamente.</Text>
    </View>
    <View style={styles.logItem}>
      <Text style={styles.logTimestamp}>[ 03:14:28 - CST-NODE-4 ]</Text>
      <Text style={styles.logText}>Filtro cromático #34495E verificado. Sensor óptico activo.</Text>
    </View>
    <View style={styles.logItem}>
      <Text style={styles.logTimestamp}>[ 03:15:10 - CST-SERVER-CENTRAL ]</Text>
      <Text style={styles.logText}>
        Directiva de cuarentena aplicada. Prohibido abandonar el puesto hasta finalizar turno.
      </Text>
    </View>
    <View style={styles.logItem}>
      <Text style={styles.logTimestamp}>[ 03:16:00 - CST-HARDWARE ]</Text>
      <Text style={styles.logText}>Módulo de almacenamiento AsyncStorage operativo (APF1/APF2).</Text>
    </View>
  </ScrollView>
);

const Tab = createBottomTabNavigator<DossierTabParamList>();

export const DossierScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0a0f1d',
          borderBottomWidth: 1,
          borderBottomColor: '#1e293b',
        },
        headerTitleStyle: {
          fontFamily: TYPOGRAPHY.stamps,
          color: colors.crtAmber,
          fontSize: moderateScale(13),
          letterSpacing: 1,
        },
        tabBarStyle: {
          backgroundColor: '#0a0f1d',
          borderTopWidth: 2,
          borderTopColor: '#334155',
          height: verticalScale(56),
          paddingBottom: verticalScale(6),
          paddingTop: verticalScale(6),
        },
        tabBarActiveTintColor: colors.crtGreen,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: TYPOGRAPHY.cleanDoc,
          fontSize: moderateScale(8.5),
          fontWeight: 'bold',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen
        name="DirectivesTab"
        component={DirectivesTab}
        options={{
          title: 'Directivas',
          headerTitle: 'EXPEDIENTE // DIRECTIVAS',
          tabBarLabel: '[ DIRECTIVAS ]',
        }}
      />
      <Tab.Screen
        name="AnomaliesTab"
        component={AnomaliesTab}
        options={{
          title: 'Anomalías',
          headerTitle: 'EXPEDIENTE // ANOMALÍAS',
          tabBarLabel: '[ ANOMALÍAS ]',
        }}
      />
      <Tab.Screen
        name="SystemLogsTab"
        component={SystemLogsTab}
        options={{
          title: 'Logs CST',
          headerTitle: 'TERMINAL // LOGS CST',
          tabBarLabel: '[ LOGS SISTEMA ]',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabScroll: {
    flex: 1,
    backgroundColor: '#060a12',
  },
  tabContent: {
    padding: scale(18),
    paddingBottom: verticalScale(40),
  },
  cardHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#b45309',
    paddingBottom: verticalScale(8),
    marginBottom: verticalScale(16),
  },
  cardCode: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(8),
    color: '#d97706',
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(14),
    color: '#fef3c7',
    marginTop: 2,
  },
  ruleItem: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 4,
    padding: scale(12),
    marginBottom: verticalScale(10),
    gap: scale(10),
  },
  ruleNumber: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(12),
    color: colors.crtAmber,
    fontWeight: 'bold',
  },
  ruleBody: {
    flex: 1,
    fontFamily: TYPOGRAPHY.dirtyDoc,
    fontSize: moderateScale(9),
    color: '#e2e8f0',
    lineHeight: verticalScale(14),
  },
  anomalyCard: {
    backgroundColor: '#0f172a',
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
    borderRadius: 4,
    padding: scale(12),
    marginBottom: verticalScale(12),
  },
  anomalyTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(11),
    color: '#fca5a5',
    marginBottom: 4,
  },
  anomalyDescription: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(8.5),
    color: '#cbd5e1',
    lineHeight: verticalScale(13),
    marginBottom: 6,
  },
  threatLevel: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(8),
    color: '#f87171',
    fontWeight: 'bold',
  },
  logItem: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#0f172a',
    padding: scale(10),
    marginBottom: verticalScale(8),
    borderRadius: 3,
  },
  logTimestamp: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(8),
    color: colors.crtGreen,
    marginBottom: 2,
  },
  logText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(8.5),
    color: '#94a3b8',
    lineHeight: verticalScale(12),
  },
});
