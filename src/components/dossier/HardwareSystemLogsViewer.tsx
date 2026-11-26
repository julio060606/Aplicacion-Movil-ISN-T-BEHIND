/**
 * =========================================================================
 * src/components/dossier/HardwareSystemLogsViewer.tsx
 * =========================================================================
 * Visor de diagnósticos en tiempo real, eventos de hardware y errores.
 * 
 * Requisitos: Unidad 3 / Semana 15 (Manejo de errores, optimización y logging).
 * =========================================================================
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import { loggerService, ISystemLog, LogSubsystem } from '../../services/logging/loggerService';
import { notificationService } from '../../services/notifications/notificationService';
import { TYPOGRAPHY } from '../../theme/typography';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

type Filter = 'ALL' | LogSubsystem | 'ERROR';

export const HardwareSystemLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<ISystemLog[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL');

  useEffect(() => {
    const unsubscribe = loggerService.subscribe((updatedLogs) => {
      setLogs([...updatedLogs].reverse());
    });
    return () => unsubscribe();
  }, []);

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    loggerService.clear();
  };

  const handleGenerateTest = () => {
    Haptics.selectionAsync().catch(() => {});
    loggerService.log('INFO', 'CORE', 'Test de diagnóstico ejecutado manualmente', 'Memoria nominal // Sin desbordamiento');
  };

  const handleTestNotification = async () => {
    Haptics.selectionAsync().catch(() => {});
    await notificationService.sendDirectNotification(
      '⚠️ CONSORCIO STRATTON-TATE // TELEMETRÍA',
      'Protocolo C.S.T. 1986: Canal verificado.'
    );
  };

  const handleSimulateControlledError = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    try {
      // 1. Provocamos una excepción controlada de hardware
      throw new Error('ERR_HW_CALIBRATION_TIMEOUT: Acelerómetro no responde en 500ms');
    } catch (err: any) {
      // 2. Registro técnico en el bus de auditoría con persistencia
      loggerService.log(
        'ERROR',
        'SENSORS',
        'Fallo crítico en subsistema de inclinación',
        err?.message || String(err)
      );
      // 3. Informamos visualmente al usuario conmutando al filtro de errores
      setActiveFilter('ERROR');
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ERROR') return l.level === 'ERROR';
    return l.subsystem === activeFilter;
  });

  const getBadgeColor = (level: ISystemLog['level'], subsystem: ISystemLog['subsystem']) => {
    if (level === 'ERROR') return '#EF4444';
    if (level === 'WARN') return '#F59E0B';
    if (subsystem === 'CAMERA') return '#38BDF8';
    if (subsystem === 'SENSORS') return '#A855F7';
    if (subsystem === 'NOTIFICATIONS') return '#FBBF24';
    return '#10B981';
  };

  return (
    <View style={styles.container}>
      {/* Cabecera del visualizador */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>REGISTRO DE SISTEMA Y HARDWARE (UNIDAD 3)</Text>
          <Text style={styles.subTitle}>TELEMETRÍA DE CÁMARA, ACELERÓMETRO Y NOTIFICACIONES</Text>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleGenerateTest}>
            <Text style={styles.actionBtnText}>[ 🧪 TEST ]</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.errBtn]} onPress={handleSimulateControlledError}>
            <Text style={[styles.actionBtnText, styles.errBtnText]}>[ 💥 ERROR ]</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleTestNotification}>
            <Text style={styles.actionBtnText}>[ 🔔 NOTIF ]</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={handleClear}>
            <Text style={[styles.actionBtnText, styles.clearBtnText]}>[ 🗑 LIMPIAR ]</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filterBar}>
        {(['ALL', 'CAMERA', 'SENSORS', 'NOTIFICATIONS', 'ERROR'] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
              {f === 'ALL' ? 'TODOS' : f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de logs */}
      {filteredLogs.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>[ NO HAY EVENTOS REGISTRADOS PARA ESTE FILTRO ]</Text>
        </View>
      ) : (
        <View style={styles.logsList}>
          {filteredLogs.slice(0, 30).map((item) => {
            const badgeColor = getBadgeColor(item.level, item.subsystem);
            return (
              <View key={item.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <View style={styles.badgeWrapper}>
                    <Text style={[styles.subsystemBadge, { borderColor: badgeColor, color: badgeColor }]}>
                      {item.subsystem}
                    </Text>
                    <Text style={[styles.levelBadge, { color: badgeColor }]}>
                      [{item.level}]
                    </Text>
                  </View>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.message}>{item.message}</Text>
                {item.details ? <Text style={styles.details}>{item.details}</Text> : null}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#070C14',
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: scale(10),
    marginVertical: verticalScale(10),
    borderRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  title: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(9.5),
    color: '#38BDF8',
  },
  subTitle: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(7),
    color: '#64748B',
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: scale(4),
  },
  actionBtn: {
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(6),
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionBtnText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(7.5),
    color: '#38BDF8',
  },
  errBtn: {
    borderColor: '#DC2626',
    backgroundColor: '#2A0C0C',
  },
  errBtnText: {
    color: '#EF4444',
  },
  clearBtn: {
    borderColor: '#7F1D1D',
    backgroundColor: '#1E1212',
  },
  clearBtnText: {
    color: '#F87171',
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(4),
    marginBottom: verticalScale(8),
  },
  filterChip: {
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(6),
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    borderColor: '#38BDF8',
    backgroundColor: '#1E3A8A',
  },
  filterChipText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(7),
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
  logsList: {
    gap: verticalScale(4),
  },
  logCard: {
    backgroundColor: '#04070C',
    borderLeftWidth: 2,
    borderLeftColor: '#2E86C1',
    padding: scale(6),
    marginBottom: verticalScale(4),
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subsystemBadge: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(6.5),
    borderWidth: 1,
    paddingHorizontal: 3,
    paddingVertical: 1,
    fontWeight: 'bold',
  },
  levelBadge: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(6.5),
    fontWeight: 'bold',
  },
  timestamp: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(6.5),
    color: '#64748B',
  },
  message: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(8),
    color: '#E2E8F0',
  },
  details: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(7),
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyBox: {
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(8),
    color: '#475569',
  },
});
