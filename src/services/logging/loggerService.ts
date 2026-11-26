/**
 * =========================================================================
 * src/services/logging/loggerService.ts
 * =========================================================================
 * Servicio centralizado de registro de eventos (Logging), diagnóstico de
 * hardware (Cámara, Sensores, Notificaciones) y manejo de errores.
 * 
 * Requisito: Unidad 3 / Semana 15 (Manejo de errores y logging)
 * =========================================================================
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'HARDWARE' | 'SENSOR';
export type LogSubsystem = 'CAMERA' | 'SENSORS' | 'NOTIFICATIONS' | 'STORAGE' | 'NETWORK' | 'CORE';

export interface ISystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  subsystem: LogSubsystem;
  message: string;
  details?: string;
}

const STORAGE_KEY = '@cst_system_logs_v1';
const MAX_LOGS = 120;

type LogListener = (logs: ISystemLog[]) => void;

class LoggerService {
  private logs: ISystemLog[] = [];
  private listeners: Set<LogListener> = new Set();
  private isLoaded = false;

  constructor() {
    this.initDefaultLogs();
    this.loadPersistedLogs().catch(() => {});
  }

  private initDefaultLogs() {
    const now = this.formatTime(new Date());
    this.logs = [
      {
        id: 'boot-1',
        timestamp: now,
        level: 'INFO',
        subsystem: 'CORE',
        message: 'KRNL_INIT: Núcleo C.S.T. iniciado en modo seguro',
      },
      {
        id: 'boot-2',
        timestamp: now,
        level: 'HARDWARE',
        subsystem: 'CAMERA',
        message: 'OPT_HAL: Módulo expo-camera vinculado con éxito',
      },
      {
        id: 'boot-3',
        timestamp: now,
        level: 'HARDWARE',
        subsystem: 'SENSORS',
        message: 'SNS_HAL: Sensor de acelerómetro listo para calibración',
      },
    ];
  }

  private formatTime(d: Date): string {
    return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  }

  private async loadPersistedLogs(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.logs = [...parsed, ...this.logs].slice(-MAX_LOGS);
          this.notify();
        }
      }
    } catch {
      // Ignorar fallback
    } finally {
      this.isLoaded = true;
    }
  }

  private async persist(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs.slice(-60)));
    } catch {
      // Non-blocking
    }
  }

  log(level: LogLevel, subsystem: LogSubsystem, message: string, details?: string): void {
    const newEntry: ISystemLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: this.formatTime(new Date()),
      level,
      subsystem,
      message,
      details,
    };

    this.logs = [...this.logs.slice(-(MAX_LOGS - 1)), newEntry];
    this.notify();
    this.persist().catch(() => {});

    // Imprimir en consola para depuración en desarrollo
    if (level === 'ERROR') {
      console.error(`[${subsystem}] ${message}`, details);
    } else if (level === 'WARN') {
      console.warn(`[${subsystem}] ${message}`, details);
    }
  }

  getLogs(): ISystemLog[] {
    return [...this.logs];
  }

  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener(this.getLogs());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const current = this.getLogs();
    this.listeners.forEach((fn) => {
      try {
        fn(current);
      } catch (err) {
        console.warn('[LoggerService] Error en listener:', err);
      }
    });
  }

  async clear(): Promise<void> {
    this.logs = [];
    this.initDefaultLogs();
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    this.notify();
  }
}

export const loggerService = new LoggerService();
