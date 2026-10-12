// src/services/api/cstNetworkService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ICstDispatch, LOCAL_CST_DISPATCHES } from '../../constants/localDispatches';

const CACHE_STORAGE_KEY = '@cst_cached_dispatches';
const API_POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=6';
const API_WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=-12.04&longitude=-77.03&current_weather=true';

export interface IPortwallWeather {
  temperature: number;
  windspeed: number;
  condition: string;
  timestamp: string;
  isOnline: boolean;
}

interface IRawPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface IRawWeatherResponse {
  current_weather?: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
}

/** Interpreta el código meteorológico WMO en la atmósfera del C.S.T. */
const resolveWeatherCondition = (code: number): string => {
  if (code === 0) return 'DESPEJADO // NIEBLA DISPERSA';
  if (code >= 1 && code <= 3) return 'PARCIALMENTE NUBLADO // HUMEDAD 88%';
  if (code >= 45 && code <= 48) return 'NIEBLA TÓXICA CONDENSADA // VISIBILIDAD REDUCIDA';
  if (code >= 51 && code <= 65) return 'PRECIPITACIÓN ÁCIDA LIGERA';
  if (code >= 71) return 'HELADA ANÓMALA PERIMETRAL';
  return 'CONDICIÓN AMBIENTAL NO IDENTIFICADA';
};

export const cstNetworkService = {
  /**
   * Consume comunicados oficiales desde el endpoint público REST (JSONPlaceholder).
   * Mapea los resultados a la estructura diegética ICstDispatch con origen CLOUD_REST.
   */
  async fetchCloudDispatches(): Promise<ICstDispatch[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(API_POSTS_URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}: Error al sincronizar con servidor C.S.T.`);
      }

      const rawData = (await response.json()) as IRawPost[];

      return rawData.map((post) => ({
        id: post.id,
        title: post.title.toUpperCase(),
        body: post.body.replace(/\n/g, ' '),
        sector: `RED-EXT-0${(post.id % 4) + 1}`,
        timestamp: 'REST // CLOUD-SYNC',
        source: 'CLOUD_REST',
      }));
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * Obtiene la telemetría climática en tiempo real desde la API pública de Open-Meteo.
   */
  async fetchPortwallWeather(): Promise<IPortwallWeather> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(API_WEATHER_URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      const data = (await response.json()) as IRawWeatherResponse;
      const current = data.current_weather;

      if (!current) {
        throw new Error('Respuesta meteorológica vacía');
      }

      return {
        temperature: current.temperature,
        windspeed: current.windspeed,
        condition: resolveWeatherCondition(current.weathercode),
        timestamp: current.time,
        isOnline: true,
      };
    } catch {
      return {
        temperature: 14.2,
        windspeed: 12.0,
        condition: 'TELEMETRÍA LOCAL // FALLA DE SATÉLITE',
        timestamp: 'OFFLINE',
        isOnline: false,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * Almacena comunicados en AsyncStorage local como capa de caché offline.
   */
  async saveDispatchesToCache(dispatches: ICstDispatch[]): Promise<void> {
    const cachedItems: ICstDispatch[] = dispatches.map((item) => ({
      ...item,
      source: 'CACHE_STORAGE',
      timestamp: `CACHED // ${new Date().toLocaleTimeString()}`,
    }));
    await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cachedItems));
  },

  /**
   * Recupera comunicados almacenados en la caché de AsyncStorage.
   */
  async loadDispatchesFromCache(): Promise<ICstDispatch[]> {
    const data = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as ICstDispatch[];
    } catch {
      return [];
    }
  },

  /**
   * Limpia la partición de caché en AsyncStorage.
   */
  async clearCachedDispatches(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_STORAGE_KEY);
  },

  /**
   * Retorna los comunicados de respaldo embebidos en el cliente móvil.
   */
  getLocalFallbackDispatches(): ICstDispatch[] {
    return [...LOCAL_CST_DISPATCHES];
  },
};
