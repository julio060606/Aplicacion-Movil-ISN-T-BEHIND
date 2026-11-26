/**
 * =========================================================================
 * src/components/camera/OperatorCameraModal.tsx
 * =========================================================================
 * VISOR DE CÁMARA FRONTAL PARA REGISTRO BIOMÉTRICO DIEGÉTICO C.S.T.
 * 
 * Requisitos: Unidad 3 / Semana 11 (Cámara) & Semana 13 (Permisos)
 * =========================================================================
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { loggerService } from '../../services/logging/loggerService';
import { TYPOGRAPHY } from '../../theme/typography';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPhotoCaptured: (uri: string) => void;
}

export const OperatorCameraModal: React.FC<Props> = ({
  visible,
  onClose,
  onPhotoCaptured,
}) => {
  const cameraRef = useRef<any>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleRequestPermission = async () => {
    Haptics.selectionAsync().catch(() => {});
    loggerService.log('HARDWARE', 'CAMERA', 'Solicitando permisos de cámara al usuario...');
    if (requestPermission) {
      const res = await requestPermission();
      loggerService.log(
        res.granted ? 'INFO' : 'WARN',
        'CAMERA',
        `Respuesta de permiso de cámara: ${res.status}`
      );
    }
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.75,
        skipProcessing: true,
      });

      if (photo?.uri) {
        loggerService.log(
          'INFO',
          'CAMERA',
          'Fotografía biométrica capturada con éxito',
          `URI: ${photo.uri.slice(-25)}`
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        onPhotoCaptured(photo.uri);
        onClose();
      }
    } catch (error) {
      loggerService.log('ERROR', 'CAMERA', 'Fallo al capturar fotografía con CameraView', String(error));
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <View style={styles.screen}>
        {/* CABECERA DIEGÉTICA */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.topBarTitle}>REGISTRO BIOMÉTRICO CIVIL</Text>
            <Text style={styles.topBarSub}>C.S.T. OPTICAL CAPTURE // SECTOR 4</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>[ CANCELAR X ]</Text>
          </TouchableOpacity>
        </View>

        {/* CASO A: PERMISO PENDIENTE O DENEGADO */}
        {!permission?.granted ? (
          <View style={styles.permissionBox}>
            <Text style={styles.permIcon}>[ 📷 ]</Text>
            <Text style={styles.permTitle}>
              {permission?.status === 'denied'
                ? 'ACCESO A CÁMARA DENEGADO'
                : 'AUTORIZACIÓN REQUERIDA'}
            </Text>
            <Text style={styles.permBody}>
              El Consorcio exige registrar fotográficamente su rostro para emitir su credencial
              de operador. Por favor autorice el uso del sensor óptico frontal.
            </Text>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleRequestPermission}>
              <Text style={styles.btnPrimaryText}>
                {permission?.status === 'denied' ? '[ REINTENTAR PERMISO ]' : '[ CONCEDER PERMISO ]'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* CASO B: CÁMARA FRONTAL ACTIVA CON RETÍCULA */
          <View style={styles.cameraWrapper}>
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing="front"
            />

            {/* RETÍCULA DE ENCUADRE BIOMÉTRICO */}
            <View style={styles.overlayGrid} pointerEvents="none">
              <View style={styles.bracketTopLeft} />
              <View style={styles.bracketTopRight} />
              <View style={styles.bracketBottomLeft} />
              <View style={styles.bracketBottomRight} />

              <View style={styles.crosshairH} />
              <View style={styles.crosshairV} />

              <Text style={styles.guidelineText}>ALINEE SU ROSTRO DENTRO DEL RECUADRO</Text>
              <Text style={styles.telemetryTag}>FACING: FRONT // RES: 104-B</Text>
            </View>

            {/* BARRA INFERIOR DE CAPTURA */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={[styles.captureBtn, isCapturing && styles.captureBtnDisabled]}
                onPress={handleTakePicture}
                disabled={isCapturing}
                activeOpacity={0.8}
              >
                {isCapturing ? (
                  <ActivityIndicator color="#0C0C0C" size="small" />
                ) : (
                  <Text style={styles.captureBtnText}>[ FOTOGRAFIAR ROSTRO ]</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#070C14' },
  topBar: {
    height: 56,
    backgroundColor: '#070C14',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topBarTitle: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 11.5,
    color: '#38BDF8',
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  topBarSub: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 8.5, color: '#64748B' },
  cancelBtn: { paddingVertical: 4, paddingHorizontal: 8, borderWidth: 1, borderColor: '#475569' },
  cancelBtnText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 9.5, color: '#E0E7EC' },
  permissionBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  permIcon: { fontSize: 36, color: '#38BDF8', marginBottom: 12 },
  permTitle: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 13,
    color: '#F1F5F9',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  permBody: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 18,
    maxWidth: 320,
  },
  btnPrimary: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#1E3A8A', borderWidth: 1.5, borderColor: '#38BDF8' },
  btnPrimaryText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 10.5, color: '#F8FAFC', fontWeight: 'bold', letterSpacing: 0.8 },
  cameraWrapper: { flex: 1, position: 'relative' },
  overlayGrid: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  bracketTopLeft: { position: 'absolute', top: 60, left: 40, width: 30, height: 30, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#38BDF8' },
  bracketTopRight: { position: 'absolute', top: 60, right: 40, width: 30, height: 30, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#38BDF8' },
  bracketBottomLeft: { position: 'absolute', bottom: 120, left: 40, width: 30, height: 30, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#38BDF8' },
  bracketBottomRight: { position: 'absolute', bottom: 120, right: 40, width: 30, height: 30, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#38BDF8' },
  crosshairH: { position: 'absolute', width: 20, height: 1, backgroundColor: 'rgba(56, 189, 248, 0.4)' },
  crosshairV: { position: 'absolute', width: 1, height: 20, backgroundColor: 'rgba(56, 189, 248, 0.4)' },
  guidelineText: {
    position: 'absolute',
    top: 30,
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 9,
    color: '#38BDF8',
    letterSpacing: 0.8,
    backgroundColor: 'rgba(7, 12, 20, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  telemetryTag: { position: 'absolute', bottom: 95, fontFamily: TYPOGRAPHY.systemPC, fontSize: 8, color: '#64748B' },
  bottomBar: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
  captureBtn: { paddingVertical: 12, paddingHorizontal: 28, backgroundColor: '#38BDF8', borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 2 },
  captureBtnDisabled: { opacity: 0.6 },
  captureBtnText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 12, color: '#070C14', fontWeight: 'bold', letterSpacing: 1 },
});
