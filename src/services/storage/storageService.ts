import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISaveGameSchema, IOperatorProfile } from '../../models/save';

const SAVE_KEY = '@isnt_behind_save_data';
const OPERATOR_KEY = '@isnt_behind_operator_profile';

export const storageService = {
  async saveGame(data: ISaveGameSchema): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(SAVE_KEY, jsonValue);
    } catch (e) {
      console.error('[StorageService] Error saving game data', e);
      throw e;
    }
  },

  async loadGame(): Promise<ISaveGameSchema | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(SAVE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('[StorageService] Error loading game data', e);
      return null;
    }
  },

  async clearGame(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('[StorageService] Error clearing game data', e);
    }
  },

  async saveOperatorProfile(profile: IOperatorProfile): Promise<void> {
    try {
      const jsonValue = JSON.stringify(profile);
      await AsyncStorage.setItem(OPERATOR_KEY, jsonValue);
    } catch (e) {
      console.error('[StorageService] Error saving operator profile', e);
      throw e;
    }
  },

  async loadOperatorProfile(): Promise<IOperatorProfile | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(OPERATOR_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('[StorageService] Error loading operator profile', e);
      return null;
    }
  },
};
