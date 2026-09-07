// src/components/shift/PcAndFaxStation.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { figmaX, figmaY, figmaW, figmaH, moderateScale, scale, verticalScale } from '../../utils/responsive';

/**
 * =========================================================================
 * ESTACIÓN DE TRABAJO: PC TERMINAL (SPRITE OFICIAL)
 * =========================================================================
 * Sprite: pc_station.webp
 * Coordenadas Figma: width: 277, height: 323, left: 135, top: 216
 * 
 * Posicionada en zIndex: 40. Se desborda intencionalmente hacia la izquierda 
 * del teléfono (left: 135 - 327 = -192px), asomando sus 85px derechos en pantalla.
 * Al tocarla, se abre un modal con el arte provisional (sello-cst-2.png).
 */
interface PcAndFaxStationProps {
  disabled?: boolean;
}

export const PcAndFaxStation: React.FC<PcAndFaxStationProps> = ({ disabled = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        onPress={() => setIsModalVisible(true)}
        style={styles.pcTouchable}
      >
        <Image
          source={require('../../assets/sprites/pc_station.webp')}
          style={styles.pcImage}
          resizeMode="stretch"
        />
      </TouchableOpacity>

      {/* MODAL PROVISIONAL DE LA PC (sello-cst-2.png) */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>TERMINAL C.S.T. // SISTEMA OPERATIVO</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>[X]</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/sprites/sello-cst-2.png')}
                style={styles.provisionalImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.modalFooterText}>
              ESTADO: CONEXIÓN REMOTA ACTIVA // TOQUE FUERA PARA CERRAR
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pcTouchable: {
    position: 'absolute',
    left: figmaX(135),
    top: figmaY(216),
    width: figmaW(277),
    height: figmaH(323),
    zIndex: 40,
  },
  pcImage: {
    width: '100%',
    height: '100%',
  },

  // Estilos del Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
  },
  modalContent: {
    width: '90%',
    maxWidth: scale(380),
    backgroundColor: '#0a0f1d',
    borderWidth: 2,
    borderColor: '#38bdf8',
    borderRadius: 8,
    padding: scale(14),
    alignItems: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: verticalScale(8),
    marginBottom: verticalScale(12),
  },
  modalTitle: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: '#38bdf8',
    fontSize: moderateScale(11),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  closeButton: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    backgroundColor: '#991b1b',
    borderRadius: 4,
  },
  closeButtonText: {
    fontFamily: TYPOGRAPHY.systemPC,
    color: '#ffffff',
    fontSize: moderateScale(11),
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(260),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    padding: scale(8),
  },
  provisionalImage: {
    width: '90%',
    height: '90%',
  },
  modalFooterText: {
    fontFamily: TYPOGRAPHY.faxSecondary,
    color: colors.crtGreen,
    fontSize: moderateScale(12),
    marginTop: verticalScale(10),
    textAlign: 'center',
  },
});
