/**
 * =========================================================================
 * src/services/notifications/notificationService.ts
 * =========================================================================
 * Servicio de notificaciones locales y recordatorios diegéticos C.S.T.
 * 
 * Requisito: Unidad 3 / Semana 14 (expo-notifications)
 * - Configuración del NotificationHandler y canales de Android.
 * - Solicitud formal de permisos del sistema operativo.
 * - Alerta diegética por abandono de puesto al pausar o minimizar la app.
 * =========================================================================
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { loggerService } from '../logging/loggerService';

// Configuración global del manejador de notificaciones para primer y segundo plano
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldPresentAlert: true,
    }),
  });
} catch {
  // Ignorar si el entorno no soporta handler
}

class NotificationService {
  private isConfigured = false;
  private hasCustomChannel = false;
  private pendingAlertId: string | null = null;

  /**
   * Solicita permisos del sistema operativo y configura canal de forma defensiva
   */
  async initialize(): Promise<boolean> {
    try {
      // 1. Obtener o solicitar permisos formales PRIMERO
      let finalStatus = 'granted';
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
      } catch (permErr) {
        loggerService.log('WARN', 'NOTIFICATIONS', 'Fallo al consultar permisos nativos', String(permErr));
      }

      this.isConfigured = finalStatus === 'granted';

      // 2. Intentar registrar canales Android de forma aislada (evita NPE en Expo Go)
      if (Platform.OS === 'android') {
        try {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'General',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#2E86C1',
          });
          await Notifications.setNotificationChannelAsync('cst-security-channel', {
            name: 'C.S.T. Alertas de Seguridad',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#2E86C1',
          });
          this.hasCustomChannel = true;
        } catch (channelErr) {
          // Expo Go puede arrojar NullPointerException en NotificationChannelsProvider
          this.hasCustomChannel = false;
          loggerService.log(
            'INFO',
            'NOTIFICATIONS',
            'Canal custom omitido en Expo Go (usando canal predeterminado)',
            String(channelErr)
          );
        }
      }

      loggerService.log(
        this.isConfigured ? 'INFO' : 'WARN',
        'NOTIFICATIONS',
        `Permiso de notificaciones: ${finalStatus}`,
        this.hasCustomChannel ? 'Canal Android registrado' : 'Modo notificación directa activo'
      );

      return true;
    } catch (error) {
      loggerService.log(
        'ERROR',
        'NOTIFICATIONS',
        'Error al inicializar servicio de notificaciones',
        String(error)
      );
      return false;
    }
  }

  /**
   * Programa una advertencia diegética de abandono de puesto si el operario
   * sale del juego durante el turno
   */
  async scheduleAbandonmentAlert(delaySeconds = 5): Promise<string | null> {
    try {
      if (!this.isConfigured) {
        await this.initialize();
      }

      // Cancelar alerta previa si existía
      await this.cancelAbandonmentAlert();

      const content: Notifications.NotificationContentInput = {
        title: '⚠️ CONSORCIO STRATTON-TATE // ALERTA',
        body: 'Operador: Puesto desatendido en Terminal Sector 4. Regrese de inmediato a su puesto de control.',
        data: { type: 'CST_ABANDON_WARNING', timestamp: Date.now() },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      };

      if (this.hasCustomChannel) {
        (content as any).channelId = 'cst-security-channel';
      }

      let notifId: string;
      try {
        notifId = await Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: Math.max(1, delaySeconds),
          },
        });
      } catch {
        // Fallback plano si el tipo enum de trigger no es aceptado por el runtime
        notifId = await Notifications.scheduleNotificationAsync({
          content,
          trigger: { seconds: Math.max(1, delaySeconds) } as any,
        });
      }

      this.pendingAlertId = notifId;
      loggerService.log(
        'HARDWARE',
        'NOTIFICATIONS',
        `Notificación programada en ${delaySeconds}s (ID: ${notifId})`,
        'Disparador de inactividad de puesto'
      );

      return notifId;
    } catch (error) {
      loggerService.log(
        'ERROR',
        'NOTIFICATIONS',
        'Fallo al programar notificación de abandono',
        String(error)
      );
      return null;
    }
  }

  /**
   * Cancela la advertencia cuando el operario regresa a la pantalla activa
   */
  async cancelAbandonmentAlert(): Promise<void> {
    if (this.pendingAlertId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(this.pendingAlertId);
        loggerService.log(
          'INFO',
          'NOTIFICATIONS',
          `Alerta cancelada (ID: ${this.pendingAlertId})`,
          'Operador reanudó su turno a tiempo'
        );
      } catch {
        // Ignorar si ya se disparó
      } finally {
        this.pendingAlertId = null;
      }
    }
  }

  /**
   * Envía una notificación local inmediata
   */
  async sendDirectNotification(title: string, body: string): Promise<string | null> {
    try {
      if (!this.isConfigured) {
        await this.initialize();
      }

      const content: Notifications.NotificationContentInput = {
        title,
        body,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
      };

      if (this.hasCustomChannel) {
        (content as any).channelId = 'cst-security-channel';
      }

      const notifId = await Notifications.scheduleNotificationAsync({
        content,
        trigger: null, // Inmediata
      });

      loggerService.log('HARDWARE', 'NOTIFICATIONS', `Notificación inmediata enviada: ${title}`);
      return notifId;
    } catch (error) {
      // Intento de fallback sin atributos avanzados
      try {
        const fallbackId = await Notifications.scheduleNotificationAsync({
          content: { title, body },
          trigger: null,
        });
        loggerService.log('HARDWARE', 'NOTIFICATIONS', `Notificación fallback enviada: ${title}`);
        return fallbackId;
      } catch (fallbackErr) {
        loggerService.log('ERROR', 'NOTIFICATIONS', 'Error al enviar notificación directa', String(fallbackErr));
        return null;
      }
    }
  }
}

export const notificationService = new NotificationService();
