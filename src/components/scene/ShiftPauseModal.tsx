/**
 * =========================================================================
 * src/components/scene/ShiftPauseModal.tsx
 * =========================================================================
 * MENÚ DE PAUSA DIEGÉTICO C.S.T.
 * 
 * Contiene la telemetría del dispositivo, modos de escala, prueba de
 * notificaciones push y controles de depuración.
 * =========================================================================
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { notificationService } from '../../services/notifications/notificationService';
import { TYPOGRAPHY } from '../../theme/typography';

export type ScaleMode = 'FIT' | 'FILL_HEIGHT' | 'STRETCH';

interface ShiftPauseModalProps {
  visible: boolean;
  onClose: () => void;
  onExitShift: () => void;
  scaleMode: ScaleMode;
  onChangeScaleMode: (mode: ScaleMode) => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  windowWidth: number;
  windowHeight: number;
  scale: number;
}

export const ShiftPauseModal: React.FC<ShiftPauseModalProps> = ({
  visible,
  onClose,
  onExitShift,
  scaleMode,
  onChangeScaleMode,
  showGuides,
  onToggleGuides,
  windowWidth,
  windowHeight,
  scale,
}) => {
  const handleTestNotification = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await notificationService.sendDirectNotification(
      '⚠️ CONSORCIO STRATTON-TATE // TELEMETRÍA',
      'Protocolo C.S.T. 1986: Canal de comunicación con el terminal verificado.'
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalBox}>
          {/* CABECERA DIEGÉTICA */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>PAUSA // TERMINAL C.S.T. SECTOR 4</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>[ REANUDAR X ]</Text>
            </TouchableOpacity>
          </View>

          {/* TELEMETRÍA DE PANTALLA */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TELEMETRÍA DE RESOLUCIÓN</Text>
            <Text style={styles.infoRow}>DISPOSITIVO: {Math.round(windowWidth)} × {Math.round(windowHeight)} px</Text>
            <Text style={styles.infoRow}>LIENZO CANÓNICO: 1049 × 484 px (Figma)</Text>
            <Text style={styles.infoRow}>FACTOR DE ESCALA: {scale.toFixed(4)}x</Text>
          </View>

          {/* CONFIGURACIÓN DE ESCALA */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>MODO DE COBERTURA EN PANTALLA</Text>
            <View style={styles.buttonsRow}>
              {(['FILL_HEIGHT', 'FIT', 'STRETCH'] as ScaleMode[]).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.modeButton, scaleMode === mode && styles.modeButtonActive]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    onChangeScaleMode(mode);
                  }}
                >
                  <Text style={[styles.modeBtnText, scaleMode === mode && styles.modeBtnTextActive]}>
                    {mode === 'FILL_HEIGHT' ? 'ALTO (100%)' : mode === 'FIT' ? 'PROPORCIONAL' : 'ESTIRAR'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* GUÍAS VISUALES Y TEST DE NOTIFICACIÓN */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.toggleRow} onPress={onToggleGuides}>
              <Text style={styles.infoRow}>GUÍAS Y RECUADROS DE REFERENCIA:</Text>
              <Text style={[styles.toggleState, showGuides && styles.toggleStateOn]}>
                {showGuides ? '[ VISIBLES ]' : '[ OCULTOS ]'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notifTestBtn} onPress={handleTestNotification}>
              <Text style={styles.notifTestText}>[ 🔔 PROBAR NOTIFICACIÓN C.S.T. (EXPO-NOTIFICATIONS) ]</Text>
            </TouchableOpacity>
          </View>

          {/* SALIR */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.exitButton} onPress={onExitShift}>
              <Text style={styles.exitBtnText}>[ SALIR AL MENÚ PRINCIPAL ]</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 4, 8, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 480,
    maxWidth: '90%',
    backgroundColor: '#070C14',
    borderWidth: 2,
    borderColor: '#2E86C1',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 12,
    color: '#38BDF8',
    letterSpacing: 1,
  },
  closeBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  closeBtnText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 10,
    color: '#E0E7EC',
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 9.5,
    color: '#64748B',
    marginBottom: 4,
  },
  infoRow: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 10,
    color: '#CBD5E1',
    marginVertical: 1,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modeButtonActive: {
    borderColor: '#2E86C1',
    backgroundColor: '#1E3A8A',
  },
  modeBtnText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 9.5,
    color: '#94A3B8',
  },
  modeBtnTextActive: {
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  toggleState: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 10,
    color: '#64748B',
  },
  toggleStateOn: {
    color: '#38BDF8',
  },
  notifTestBtn: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#0A121D',
    borderWidth: 1,
    borderColor: '#2E86C1',
    alignItems: 'center',
  },
  notifTestText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 9,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 8,
    marginTop: 4,
  },
  exitButton: {
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#180B0B',
    borderWidth: 1,
    borderColor: '#7F1D1D',
  },
  exitBtnText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 10.5,
    color: '#FCA5A5',
    letterSpacing: 0.8,
  },
});
