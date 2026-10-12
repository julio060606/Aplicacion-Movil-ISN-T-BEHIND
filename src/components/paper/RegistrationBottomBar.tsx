// src/components/paper/RegistrationBottomBar.tsx
/**
 * Adaptador de compatibilidad para la barra de registro de operador.
 * Delega toda la lógica y presentación a GameBottomBar.
 */
import React from 'react';
import { GameBottomBar } from '../ui/GameBottomBar';

interface RegistrationBottomBarProps {
  onCancel: () => void;
  onConfirm: () => void;
  isConfirmEnabled: boolean;
}

export const RegistrationBottomBar: React.FC<RegistrationBottomBarProps> = ({
  onConfirm,
  isConfirmEnabled,
}) => {
  return (
    <GameBottomBar
      action={{
        label: '[ VALIDAR Y FIRMAR ]',
        onPress: onConfirm,
        disabled: !isConfirmEnabled,
        textAlign: 'left',
      }}
    />
  );
};
