// src/components/ui/ConfirmationModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

interface ConfirmationModalProps {
  visible: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title = 'ADVERTENCIA C.S.T.',
  message,
  confirmLabel = 'CONFIRMAR',
  cancelLabel = 'CANCELAR',
  onConfirm,
  onCancel,
  danger = false,
}) => {
  const [isConfirmPressed, setIsConfirmPressed] = useState(false);
  const [isCancelPressed, setIsCancelPressed] = useState(false);

  const primaryBorderColor = danger ? colors.danger : colors.menuTheme.dark.accent;

  const handleConfirmPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    setIsConfirmPressed(false);
    onConfirm();
  };

  const handleCancelPress = () => {
    Haptics.selectionAsync().catch(() => {});
    setIsCancelPressed(false);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialogBox, { borderColor: primaryBorderColor }]}>
          {/* Cabecera terminal */}
          <View style={[styles.headerBar, { backgroundColor: primaryBorderColor }]}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>

          {/* Mensaje de texto */}
          <View style={styles.content}>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          {/* Botones de acción centrados y divididos por una raya (sin corchetes) */}
          <View style={styles.actionsBar}>
            <View style={styles.buttonsGroup}>
              {/* Botón Cancelar */}
              <TouchableWithoutFeedback
                onPressIn={() => setIsCancelPressed(true)}
                onPressOut={() => setIsCancelPressed(false)}
                onPress={handleCancelPress}
              >
                <View
                  style={[
                    styles.button,
                    isCancelPressed && { backgroundColor: colors.menuTheme.dark.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isCancelPressed && { color: colors.menuTheme.dark.accentText },
                    ]}
                  >
                    {cancelLabel}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              {/* Raya divisoria */}
              <View style={styles.verticalDivider} />

              {/* Botón Confirmar */}
              <TouchableWithoutFeedback
                onPressIn={() => setIsConfirmPressed(true)}
                onPressOut={() => setIsConfirmPressed(false)}
                onPress={handleConfirmPress}
              >
                <View
                  style={[
                    styles.button,
                    { borderColor: danger ? colors.danger : colors.borderMedium },
                    isConfirmPressed && {
                      backgroundColor: danger ? colors.danger : primaryBorderColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      danger && { color: colors.danger },
                      isConfirmPressed && { color: '#FFFFFF' },
                    ]}
                  >
                    {confirmLabel}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 6, 6, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
  dialogBox: {
    width: '100%',
    maxWidth: scale(380),
    backgroundColor: colors.menuTheme.dark.surface,
    borderWidth: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  headerBar: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(12),
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  content: {
    padding: scale(16),
  },
  messageText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(13),
    color: colors.menuTheme.dark.text,
    lineHeight: verticalScale(19),
    letterSpacing: 0.5,
  },
  actionsBar: {
    borderTopWidth: 1,
    borderTopColor: colors.menuTheme.dark.divider,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(14),
  },
  verticalDivider: {
    width: 1,
    height: verticalScale(18),
    backgroundColor: '#334155',
  },
  button: {
    borderWidth: 1,
    borderColor: colors.menuTheme.dark.border,
    paddingVertical: verticalScale(7),
    paddingHorizontal: scale(16),
    borderRadius: 1,
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(12),
    color: colors.menuTheme.dark.text,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
