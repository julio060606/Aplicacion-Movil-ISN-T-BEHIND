// src/screens/StorySaveSelectScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../models/types';
import { ISaveGameSchema } from '../models/save';
import { storageService } from '../services/storage/storageService';
import { useMenuTheme } from '../context/MenuThemeContext';
import { MenuOption } from '../components/menu/MenuOption';
import { MenuBackBar } from '../components/menu/MenuBackBar';
import { ScreenDelay } from '../components/ui/ScreenDelay';
import { ScreenDirtOverlay } from '../components/ui/ScreenDirtOverlay';
import { TYPOGRAPHY } from '../theme/typography';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'StorySaveSelect'>;

export const StorySaveSelectScreen = ({ navigation }: Props) => {
  const { theme } = useMenuTheme();
  
  const [saveGame, setSaveGame] = useState<ISaveGameSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>('save-1');

  useEffect(() => {
    const load = async () => {
      const saveData = await storageService.loadGame();
      setSaveGame(saveData);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleDelete = () => {
    Alert.alert(
      'BORRAR PARTIDA',
      '¿Estás seguro de que quieres eliminar esta partida permanentemente?',
      [
        { text: 'CANCELAR', style: 'cancel' },
        {
          text: 'ELIMINAR',
          style: 'destructive',
          onPress: async () => {
            await Promise.all([
              storageService.clearGame(),
              storageService.clearOperatorProfile()
            ]);
            setSaveGame(null);
            setSelectedId(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(()=>{});
          },
        },
      ]
    );
  };

  const handleStart = () => {
    if (selectedId === 'new') {
      // Iniciar nueva partida
      navigation.navigate('OperatorRegistration');
    } else if (selectedId && saveGame) {
      // Continuar partida
      navigation.navigate('WeeklyIntro', { weekNumber: saveGame.currentDay });
    }
  };

  const mockDate = "VIE - 10/11"; // En el futuro vendría de saveGame.date

  return (
    <ScreenDelay>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <StatusBar hidden />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Lista de Partidas */}
          <View style={styles.listContainer}>
            {saveGame && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { setSelectedId('save-1'); Haptics.selectionAsync(); }}
                style={[
                  styles.saveSlot,
                  { borderColor: theme.border },
                  selectedId === 'save-1' && { borderColor: theme.accent, backgroundColor: `${theme.accent}11` }
                ]}
              >
                <Text style={[styles.saveSlotTitle, { color: selectedId === 'save-1' ? theme.accent : theme.text }]}>
                  1. {mockDate} — DÍA {saveGame.currentDay}
                </Text>
                
                {selectedId === 'save-1' && (
                  <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                    <Text style={[styles.deleteIcon, { color: '#ef4444' }]}>[X]</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            )}

            {/* Nueva Partida */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => { setSelectedId('new'); Haptics.selectionAsync(); }}
              style={[
                styles.saveSlot,
                styles.newSlot,
                { borderColor: theme.border },
                selectedId === 'new' && { borderColor: theme.accent, backgroundColor: `${theme.accent}11` }
              ]}
            >
              <Text style={[styles.saveSlotTitle, { color: selectedId === 'new' ? theme.accent : theme.textMuted }]}>
                + NUEVA PARTIDA
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón de Iniciar Abajo */}
          <View style={[styles.startContainer, !selectedId && { opacity: 0.3 }]}>
            <MenuOption
              label="[ INICIAR ]"
              onPress={handleStart}
              disabled={!selectedId}
              style={styles.startOption}
            />
          </View>

        </ScrollView>

        <MenuBackBar onBack={() => navigation.goBack()} />
        <ScreenDirtOverlay />
      </View>
    </ScreenDelay>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: scale(22),
    paddingTop: verticalScale(100),
    paddingBottom: verticalScale(110),
  },
  listContainer: {
    marginBottom: verticalScale(40),
  },
  saveSlot: {
    borderWidth: 1,
    padding: scale(16),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newSlot: {
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  saveSlotTitle: {
    fontFamily: TYPOGRAPHY.menuOption,
    fontSize: moderateScale(16),
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  deleteBtn: {
    padding: scale(8),
  },
  deleteIcon: {
    fontFamily: TYPOGRAPHY.menuOptionBold,
    fontSize: moderateScale(16),
  },
  startContainer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  startOption: {
    alignSelf: 'center',
    width: 'auto',
    paddingHorizontal: scale(40),
  },
});
