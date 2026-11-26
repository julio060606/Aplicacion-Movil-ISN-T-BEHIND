/**
 * =========================================================================
 * src/components/scene/CajonDrawerWithSlots.tsx
 * =========================================================================
 * Gestión del Cajón de herramientas, slots superiores y oscurecimiento.
 * =========================================================================
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { TOOLS_CATALOG, ToolDef, ToolIcon } from './vectors/ToolVectors';
import { CajonVectorial } from './vectors/CajonVectorial';
import { CajonInnerTray } from './CajonInnerTray';
import { TYPOGRAPHY } from '../../theme/typography';

interface Props {
  scale: number;
  isOpen: boolean;
  onToggleCajon: () => void;
  pCajon: { left: number; top: number; width: number; height: number };
  pSlot1: { left: number; top: number; width: number; height: number };
  pSlot2: { left: number; top: number; width: number; height: number };
  cajonTranslateX: Animated.AnimatedInterpolation<number>;
  slot1Item: ToolDef | null;
  slot2Item: ToolDef | null;
  activeSlot: 1 | 2 | null;
  onToggleActiveSlot: (slotNumber: 1 | 2) => void;
  onAssignToSlot: (slotNumber: 1 | 2, tool: ToolDef) => void;
}

export const CajonDrawerWithSlots: React.FC<Props> = ({
  scale,
  isOpen,
  onToggleCajon,
  pCajon,
  pSlot1,
  pSlot2,
  cajonTranslateX,
  slot1Item,
  slot2Item,
  activeSlot,
  onToggleActiveSlot,
  onAssignToSlot,
}) => {
  const [selectingTool, setSelectingTool] = useState<ToolDef | null>(null);

  // Las herramientas en slots desaparecen del cajón
  const availableTools = TOOLS_CATALOG.filter(
    (t) => t.id !== slot1Item?.id && t.id !== slot2Item?.id
  );

  const handleSlotPress = (slotNumber: 1 | 2) => {
    if (selectingTool) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onAssignToSlot(slotNumber, selectingTool);
      setSelectingTool(null);
    } else {
      const currentItem = slotNumber === 1 ? slot1Item : slot2Item;
      if (currentItem) {
        Haptics.selectionAsync().catch(() => {});
        onToggleActiveSlot(slotNumber);
      }
    }
  };

  return (
    <>
      {/* 1. OSCURECIMIENTO CUANDO EL CAJÓN ESTÁ ABIERTO */}
      {isOpen && (
        <TouchableOpacity
          activeOpacity={1}
          style={[StyleSheet.absoluteFill, styles.dimOverlay]}
          onPress={onToggleCajon}
        />
      )}

      {/* 2. SLOTS SUPERIORES (FONDO TRANSPARENTE POR DEFECTO) */}
      {/* SLOT 2 */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleSlotPress(2)}
        style={[
          styles.slotContainer,
          pSlot2,
          { zIndex: isOpen ? 120 : 25 },
          selectingTool && styles.slotTargetHighlight,
          activeSlot === 2 && styles.slotActiveGlow,
        ]}
      >
        <View style={styles.slotInner}>
          <Text style={[styles.slotTag, activeSlot === 2 && styles.slotTagActive]}>SLOT 2</Text>
          {slot2Item ? (
            <View style={styles.slotItemPreview}>
              <ToolIcon type={slot2Item.type} width={60 * scale} height={60 * scale} />
              <Text style={[styles.slotItemName, activeSlot === 2 && styles.slotItemNameActive]}>
                {slot2Item.shortName}
              </Text>
            </View>
          ) : (
            <Text style={styles.slotEmptyText}>
              {selectingTool ? '[ CLIC AQUÍ ]' : ''}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* SLOT 1 */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleSlotPress(1)}
        style={[
          styles.slotContainer,
          pSlot1,
          { zIndex: isOpen ? 120 : 25 },
          selectingTool && styles.slotTargetHighlight,
          activeSlot === 1 && styles.slotActiveGlow,
        ]}
      >
        <View style={styles.slotInner}>
          <Text style={[styles.slotTag, activeSlot === 1 && styles.slotTagActive]}>SLOT 1</Text>
          {slot1Item ? (
            <View style={styles.slotItemPreview}>
              <ToolIcon type={slot1Item.type} width={60 * scale} height={60 * scale} />
              <Text style={[styles.slotItemName, activeSlot === 1 && styles.slotItemNameActive]}>
                {slot1Item.shortName}
              </Text>
            </View>
          ) : (
            <Text style={styles.slotEmptyText}>
              {selectingTool ? '[ CLIC AQUÍ ]' : ''}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* 3. CAJÓN ANIMADO (TAMPOCO SE OSCURECE: zIndex 110) */}
      <Animated.View
        style={[
          styles.cajonWrapper,
          pCajon,
          {
            zIndex: isOpen ? 110 : 55,
            transform: [{ translateX: cajonTranslateX }],
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.9} onPress={onToggleCajon} style={styles.fillTouch}>
          <CajonVectorial width={pCajon.width} height={pCajon.height} isOpen={isOpen} />
          {!isOpen && (
            <View style={styles.edgeTab}>
              <Text style={styles.edgeTabText}>CAJÓN ►</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* BANDEJA INTERNA CON CARRUSEL DE HERRAMIENTAS */}
        {isOpen && (
          <CajonInnerTray
            scale={scale}
            availableTools={availableTools}
            selectingTool={selectingTool}
            onSelectTool={setSelectingTool}
          />
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  dimOverlay: {
    backgroundColor: 'rgba(2, 4, 8, 0.72)',
    zIndex: 95,
  },
  slotContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(126, 126, 126, 0.6)',
    backgroundColor: 'transparent',
    padding: 2,
  },
  slotTargetHighlight: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(30, 58, 138, 0.45)',
    borderWidth: 2,
  },
  slotActiveGlow: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.22)',
    borderWidth: 2,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
  slotInner: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  slotTag: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7.5,
    color: '#64748B',
    letterSpacing: 0.5,
  },
  slotTagActive: {
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  slotEmptyText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 8,
    color: '#38BDF8',
    textAlign: 'center',
  },
  slotItemPreview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotItemName: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7,
    color: '#CBD5E1',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slotItemNameActive: {
    color: '#38BDF8',
  },
  cajonWrapper: {
    position: 'absolute',
  },
  fillTouch: {
    width: '100%',
    height: '100%',
  },
  edgeTab: {
    position: 'absolute',
    right: 6,
    top: '40%',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  edgeTabText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 8,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
});
