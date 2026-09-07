// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { scale, verticalScale, moderateScale } from '../utils/responsive';
import { storageService } from '../services/storage/storageService';
import { IOperatorProfile } from '../models/save';

export const SettingsScreen = () => {
  const [operator, setOperator] = useState<IOperatorProfile | null>(null);
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    // Cargar perfil del operador desde AsyncStorage
    storageService.loadOperatorProfile().then((data) => {
      if (data) setOperator(data);
    });
  }, []);

  const handleSyncAPI = async () => {
    setIsSyncing(true);
    setSyncStatus('CONECTANDO CON SERVIDOR CENTRAL CST...');
    try {
      if (hapticsEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      // Simulación de pre-conexión de API REST (Semana 8 del Sílabo)
      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatus('SINCRONIZACIÓN EXITOSA // NODO 84.2 EN LÍNEA (APF2 READY)');
        Alert.alert(
          'RED C.S.T. CONECTADA',
          'El nodo de red externa ha respondido correctamente. Preparado para consumo de endpoints REST en la Unidad 2.'
        );
      }, 1500);
    } catch {
      setIsSyncing(false);
      setSyncStatus('ERROR DE PROTOCOLO // REINTENTE LUEGO');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ENCABEZADO */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>CONSORCIO S.T. // CONFIGURACIÓN</Text>
        <Text style={styles.headerTitle}>AJUSTES DE SISTEMA Y RED</Text>
        <View style={styles.divider} />
      </View>

      {/* SECCIÓN 1: PERFIL DEL OPERADOR ACTIVO */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>[ 01. EXPEDIENTE DE OPERADOR ACTIVO ]</Text>
        {operator ? (
          <View style={styles.profileInfo}>
            <Text style={styles.profileLine}>
              <Text style={styles.profileLabel}>NOMBRE: </Text>
              {operator.fullName}
            </Text>
            <Text style={styles.profileLine}>
              <Text style={styles.profileLabel}>CÓDIGO: </Text>
              {operator.employeeCode}
            </Text>
            <Text style={styles.profileLine}>
              <Text style={styles.profileLabel}>DESTINO: </Text>
              {operator.sectorAssigned}
            </Text>
            <Text style={styles.profileLine}>
              <Text style={styles.profileLabel}>CONTACTO: </Text>
              {operator.emergencyContact}
            </Text>
            <Text style={styles.profileSavedBadge}>
              ✓ ALMACENADO LOCALMENTE VÍA ASYNCSTORAGE
            </Text>
          </View>
        ) : (
          <Text style={styles.noProfileText}>
            NO HAY PERFIL REGISTRADO. INICIE [ STORY ] PARA REGISTRAR SU FICHA DE OPERARIO.
          </Text>
        )}
      </View>

      {/* SECCIÓN 2: AJUSTES VISUALES Y FÍSICOS */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>[ 02. PARÁMETROS DE CABINA ]</Text>

        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchLabel}>FILTRO CROMÁTICO #34495E (53%)</Text>
            <Text style={styles.switchDescription}>
              Tonalidad atmosférica CCTV y reducción de fatiga óptica en garita.
            </Text>
          </View>
          <Switch
            value={filterEnabled}
            onValueChange={(val) => {
              setFilterEnabled(val);
              if (hapticsEnabled) Haptics.selectionAsync();
            }}
            thumbColor={filterEnabled ? colors.crtGreen : '#64748b'}
            trackColor={{ false: '#334155', true: 'rgba(0, 255, 102, 0.4)' }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchLabel}>RESPUESTA HÁPTICA MECÁNICA</Text>
            <Text style={styles.switchDescription}>
              Vibraciones táctiles para persiana, cajones y gatillo del revólver.
            </Text>
          </View>
          <Switch
            value={hapticsEnabled}
            onValueChange={(val) => {
              setHapticsEnabled(val);
              if (val) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            thumbColor={hapticsEnabled ? colors.crtGreen : '#64748b'}
            trackColor={{ false: '#334155', true: 'rgba(0, 255, 102, 0.4)' }}
          />
        </View>
      </View>

      {/* SECCIÓN 3: CONEXIÓN CON API EXTERNA (AVANCE 2) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>[ 03. ENLACE CON BASE DE DATOS EXTERNA ]</Text>
        <Text style={styles.apiDesc}>
          Protocolo REST para sincronizar datos de inspectores con el servidor central CST.
          Requisito de la Semana 8 del sílabo.
        </Text>

        <TouchableOpacity
          style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleSyncAPI}
          disabled={isSyncing}
        >
          <Text style={styles.syncButtonText}>
            {isSyncing ? '[ CONSULTANDO NODO CENTRAL... ]' : '[ PROBAR CONEXIÓN CON API REST ]'}
          </Text>
        </TouchableOpacity>

        {syncStatus && <Text style={styles.syncStatusText}>{syncStatus}</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060a12',
  },
  content: {
    padding: scale(20),
    paddingBottom: verticalScale(40),
  },
  header: {
    marginBottom: verticalScale(20),
  },
  headerSubtitle: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(9),
    color: '#d97706',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(16),
    color: '#f8fafc',
    marginTop: 2,
    fontWeight: 'bold',
  },
  divider: {
    height: 2,
    backgroundColor: '#1e293b',
    marginTop: verticalScale(8),
  },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 6,
    padding: scale(14),
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(11),
    color: colors.crtAmber,
    marginBottom: verticalScale(10),
    fontWeight: 'bold',
  },
  profileInfo: {
    gap: verticalScale(4),
  },
  profileLine: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(9.5),
    color: '#e2e8f0',
  },
  profileLabel: {
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  profileSavedBadge: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(8),
    color: colors.crtGreen,
    marginTop: verticalScale(6),
  },
  noProfileText: {
    fontFamily: TYPOGRAPHY.dirtyDoc,
    fontSize: moderateScale(8.5),
    color: colors.textMuted,
    lineHeight: verticalScale(13),
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: scale(12),
  },
  switchLabel: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(9.5),
    color: '#f1f5f9',
    marginBottom: 2,
  },
  switchDescription: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(7.5),
    color: '#64748b',
    lineHeight: verticalScale(11),
  },
  apiDesc: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(8.5),
    color: '#94a3b8',
    lineHeight: verticalScale(13),
    marginBottom: verticalScale(10),
  },
  syncButton: {
    backgroundColor: '#1e3a8a',
    borderWidth: 1.5,
    borderColor: '#3b82f6',
    borderRadius: 4,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(9.5),
    color: '#ffffff',
    letterSpacing: 1,
  },
  syncStatusText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(8.5),
    color: colors.crtGreen,
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
});
