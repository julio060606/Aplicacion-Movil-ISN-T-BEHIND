/**
 * =========================================================================
 * src/hooks/useDeviceTilt.ts
 * =========================================================================
 * Hook de acelerómetro para interacción de herramientas en mano.
 * 
 * Requisitos: Unidad 3 / Semana 12 (Sensores) & Semana 15 (Logging)
 * =========================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import { loggerService } from '../services/logging/loggerService';

interface UseDeviceTiltOptions {
  enabled: boolean;
  updateIntervalMs?: number;
  sensitivity?: number;
}

export interface DeviceTiltState {
  tiltX: number;
  tiltY: number;
  rawX: number;
  rawY: number;
  rawZ: number;
  isAvailable: boolean;
}

export function useDeviceTilt({
  enabled,
  updateIntervalMs = 32,
  sensitivity = 1.4,
}: UseDeviceTiltOptions): DeviceTiltState {
  const [tilt, setTilt] = useState<DeviceTiltState>({
    tiltX: 0,
    tiltY: 0,
    rawX: 0,
    rawY: 0,
    rawZ: 0,
    isAvailable: true,
  });

  const smoothedX = useRef(0);
  const smoothedY = useRef(0);
  const ALPHA = 0.22;

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let isMounted = true;

    if (!enabled) {
      smoothedX.current = 0;
      smoothedY.current = 0;
      setTilt({
        tiltX: 0,
        tiltY: 0,
        rawX: 0,
        rawY: 0,
        rawZ: 0,
        isAvailable: true,
      });
      return;
    }

    const startAccelerometer = async () => {
      try {
        const available = await Accelerometer.isAvailableAsync();
        if (!isMounted) return;

        if (!available) {
          loggerService.log('WARN', 'SENSORS', 'Acelerómetro no disponible en este hardware');
          setTilt((prev) => ({ ...prev, isAvailable: false }));
          return;
        }

        Accelerometer.setUpdateInterval(updateIntervalMs);
        loggerService.log(
          'SENSOR',
          'SENSORS',
          `Acelerómetro activado (${updateIntervalMs}ms)`,
          'Herramienta en mano desplegada'
        );

        subscription = Accelerometer.addListener(({ x, y, z }) => {
          if (!isMounted) return;

          const targetX = Math.max(-1, Math.min(1, -y * sensitivity));
          const targetY = Math.max(-1, Math.min(1, (x - 0.35) * sensitivity));

          smoothedX.current = smoothedX.current + ALPHA * (targetX - smoothedX.current);
          smoothedY.current = smoothedY.current + ALPHA * (targetY - smoothedY.current);

          setTilt({
            tiltX: Number(smoothedX.current.toFixed(3)),
            tiltY: Number(smoothedY.current.toFixed(3)),
            rawX: x,
            rawY: y,
            rawZ: z,
            isAvailable: true,
          });
        });
      } catch (err) {
        loggerService.log('ERROR', 'SENSORS', 'Error al suscribir acelerómetro', String(err));
      }
    };

    startAccelerometer();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.remove();
        subscription = null;
        loggerService.log('INFO', 'SENSORS', 'Acelerómetro desactivado (Suscripción liberada)');
      }
    };
  }, [enabled, updateIntervalMs, sensitivity]);

  return tilt;
}
