// src/components/ui/GameBottomBar.tsx
/**
 * Barra de acciones inferior unificada para interfaces de pre-juego.
 *
 * Características:
 *  - Altura, borde y márgenes estandarizados e idénticos en todas las interfaces.
 *  - Reutiliza directamente el componente `MenuOption` del menú principal:
 *      - Mismo tamaño de fuente (moderateScale(18)).
 *      - Mismo tipo de letra (TYPOGRAPHY.menuOption / Inconsolata-Light).
 *      - Estado deshabilitado: texto gris apagado (#555555).
 *      - Estado disponible: color activo (theme.text / #D9C89A).
 *      - Al seleccionarlo: el fondo #2E86C1 se pinta a todo lo largo (width: 100%)
 *        como en el menú principal, con texto blanco e inversión instantánea.
 */
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MenuOption } from '../menu/MenuOption';
import { scale, verticalScale } from '../../utils/responsive';

export interface BottomBarAction {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  activeColor?: string;
  disabledColor?: string;
}

export interface GameBottomBarProps {
  /** Color de fondo de la barra (por defecto #0C0C0C) */
  backgroundColor?: string;
  /** Color del borde superior (por defecto #1A2028) */
  borderTopColor?: string;
  /** Acción principal que ocupa todo el largo de la barra */
  action?: BottomBarAction;
  /** Alineación general del texto (por defecto 'left') */
  textAlign?: 'left' | 'center' | 'right';
  /** Soporte dual opcional para pantallas con dos botones */
  leftAction?: BottomBarAction;
  rightAction?: BottomBarAction;
  /** Estilo opcional para el contenedor exterior */
  style?: ViewStyle;
}

export const GameBottomBar: React.FC<GameBottomBarProps> = ({
  backgroundColor = '#0C0C0C',
  borderTopColor = '#1A2028',
  action,
  textAlign = 'left',
  leftAction,
  rightAction,
  style,
}) => {
  const isDual = Boolean(leftAction && rightAction);

  return (
    <View style={[styles.container, { backgroundColor, borderTopColor }, style]}>
      {isDual && leftAction && rightAction ? (
        <View style={styles.dualRow}>
          <View style={styles.halfColumn}>
            <MenuOption
              label={leftAction.label}
              onPress={leftAction.onPress}
              disabled={leftAction.disabled}
              textAlign={leftAction.textAlign || 'left'}
              paddingHorizontal={scale(20)}
              style={styles.fullCell}
            />
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.halfColumn}>
            <MenuOption
              label={rightAction.label}
              onPress={rightAction.onPress}
              disabled={rightAction.disabled}
              textAlign={rightAction.textAlign || 'left'}
              paddingHorizontal={scale(20)}
              style={styles.fullCell}
            />
          </View>
        </View>
      ) : action ? (
        <MenuOption
          label={action.label}
          onPress={action.onPress}
          disabled={action.disabled}
          textAlign={action.textAlign || textAlign}
          paddingHorizontal={scale(20)}
          activeColor={action.activeColor}
          disabledColor={action.disabledColor}
          style={styles.fullWidthOption}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    height: verticalScale(50),
    justifyContent: 'center',
    zIndex: 999,
  },
  fullWidthOption: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    marginVertical: 0,
    paddingVertical: 0,
  },
  dualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  halfColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  fullCell: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    marginVertical: 0,
    paddingVertical: 0,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#2A3540',
  },
});
