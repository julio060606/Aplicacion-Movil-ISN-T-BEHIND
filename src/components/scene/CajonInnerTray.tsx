/**
 * =========================================================================
 * src/components/scene/CajonInnerTray.tsx
 * =========================================================================
 * Bandeja interna interactiva del cajón abierto.
 * 
 * Contiene el carrusel de herramientas disponibles con soporte para
 * pulsación prolongada (long-press) para equipar en los slots.
 * =========================================================================
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TOOLS_CATALOG, ToolDef, ToolIcon } from './vectors/ToolVectors';
import { TYPOGRAPHY } from '../../theme/typography';

interface Props {
  scale: number;
  availableTools: ToolDef[];
  selectingTool: ToolDef | null;
  onSelectTool: (tool: ToolDef) => void;
}

export const CajonInnerTray: React.FC<Props> = ({
  scale,
  availableTools,
  selectingTool,
  onSelectTool,
}) => {
  const [toolIndex, setToolIndex] = useState(0);

  const safeIndex = availableTools.length > 0 ? toolIndex % availableTools.length : 0;
  const currentTool = availableTools[safeIndex] || null;

  const handlePrevTool = () => {
    if (availableTools.length <= 1) return;
    Haptics.selectionAsync().catch(() => {});
    setToolIndex((prev) => (prev > 0 ? prev - 1 : availableTools.length - 1));
  };

  const handleNextTool = () => {
    if (availableTools.length <= 1) return;
    Haptics.selectionAsync().catch(() => {});
    setToolIndex((prev) => (prev < availableTools.length - 1 ? prev + 1 : 0));
  };

  const handleLongPress = (tool: ToolDef) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    onSelectTool(tool);
  };

  return (
    <View style={styles.drawerInnerTray} pointerEvents="box-none">
      {/* Banner de instrucciones */}
      <View style={styles.instructionBanner}>
        <Text style={styles.instructionText}>
          {selectingTool
            ? `[ SELECCIONADO: ${selectingTool.shortName} ] CLIC EN SLOT 1 O 2`
            : availableTools.length > 0
            ? 'MANTÉN PRESIONADO UN OBJETO PARA ASIGNARLO'
            : 'HERRAMIENTAS EN USO'}
        </Text>
      </View>

      {/* Carrusel de herramientas disponibles */}
      {availableTools.length > 0 && currentTool ? (
        <View style={styles.carouselRow}>
          <TouchableOpacity style={styles.navBtn} onPress={handlePrevTool}>
            <Text style={styles.navBtnText}>&lt;</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCard, selectingTool?.id === currentTool.id && styles.toolCardSelected]}
            activeOpacity={0.8}
            onLongPress={() => handleLongPress(currentTool)}
            delayLongPress={280}
          >
            <ToolIcon type={currentTool.type} width={70 * scale} height={70 * scale} />
            <Text style={styles.toolTitle}>{currentTool.name}</Text>
            <Text style={styles.toolCode}>{currentTool.code}</Text>
            <Text style={styles.toolHintText}>[ MANTENER PRESIONADO ]</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navBtn} onPress={handleNextTool}>
            <Text style={styles.navBtnText}>&gt;</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyTrayBox}>
          <Text style={styles.emptyTrayText}>[ TODAS LAS HERRAMIENTAS ESTÁN EQUIPADAS EN SLOTS ]</Text>
        </View>
      )}

      <Text style={styles.trayCounter}>
        [ HERRAMIENTAS DISPONIBLES EN CAJÓN: {availableTools.length}/{TOOLS_CATALOG.length} ]
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerInnerTray: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 25,
    bottom: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionBanner: {
    backgroundColor: 'rgba(7, 12, 20, 0.85)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  instructionText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7.5,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  carouselRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  navBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  navBtnText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 14,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  toolCard: {
    width: 170,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: '#475569',
    padding: 6,
    alignItems: 'center',
  },
  toolCardSelected: {
    borderColor: '#38BDF8',
    backgroundColor: '#1E3A8A',
  },
  toolTitle: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 8,
    color: '#F8FAFC',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
  toolCode: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 6.5,
    color: '#94A3B8',
    textAlign: 'center',
  },
  toolHintText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 6,
    color: '#38BDF8',
    marginTop: 2,
  },
  emptyTrayBox: {
    paddingVertical: 20,
  },
  emptyTrayText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 8,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  trayCounter: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: 7.5,
    color: '#64748B',
  },
});
