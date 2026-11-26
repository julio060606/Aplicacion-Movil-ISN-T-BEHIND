/**
 * =========================================================================
 * src/components/scene/PcTerminalOverlay.tsx
 * =========================================================================
 * Terminal CRT de la PC Abierta C.S.T. (Interactiva y Usable)
 * 
 * - Pestañas de navegación AL COSTADO (Cotejo, Facturación, CCTV, Sistema).
 * - Pestañas y acciones de navegación ABAJO (Aprobar, Denegar, Ticket, Cerrar).
 * - Comparación de directivas, cálculo de precios y telemetría de seguridad.
 * =========================================================================
 */

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { HORIZONTAL_SPRITES } from '../../config/horizontalSceneConfig';
import { IProductItem } from '../../models/products';
import { loggerService } from '../../services/logging/loggerService';
import { TYPOGRAPHY } from '../../theme/typography';

type SideTab = 'COTEJO' | 'FACTURA' | 'CAMARAS' | 'SISTEMA';

interface Props {
  visible: boolean;
  onClose: () => void;
  posPcAbierta: { left: number; top: number; width: number; height: number };
  posPantalla: { left: number; top: number; width: number; height: number };
  zIndexBase: number;
  activeExamProduct?: IProductItem | null;
}

export const PcTerminalOverlay: React.FC<Props> = ({
  visible,
  onClose,
  posPcAbierta,
  posPantalla,
  zIndexBase,
  activeExamProduct,
}) => {
  const [activeTab, setActiveTab] = useState<SideTab>('COTEJO');
  const [cctvCam, setCctvCam] = useState<1 | 2>(1);
  const [surcharge, setSurcharge] = useState(0);
  const [terminalMessage, setTerminalMessage] = useState<string | null>(null);

  if (!visible) return null;

  const handleAction = (type: 'APROBAR' | 'DENEGAR' | 'TICKET') => {
    if (type === 'APROBAR') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setTerminalMessage('TRANSMISIÓN ENVIADA: SERVICIO AUTORIZADO // C.S.T.');
      loggerService.log('INFO', 'CORE', 'PC: Transacción aprobada por el operador');
    } else if (type === 'DENEGAR') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      setTerminalMessage('ALERTA: TRÁMITE DENEGADO // INCIDENCIA REGISTRADA');
      loggerService.log('WARN', 'CORE', 'PC: Trámite denegado en mostrador');
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      setTerminalMessage('IMPRESORA FISCAL: TICKET #104-B IMPRESO');
      loggerService.log('INFO', 'CORE', 'PC: Ticket fiscal regulado impreso');
    }
  };

  return (
    <>
      <Image
        source={HORIZONTAL_SPRITES.pcAbierta}
        style={[styles.spriteAbsolute, posPcAbierta, { zIndex: zIndexBase }]}
        resizeMode="stretch"
      />

      <View style={[styles.spriteAbsolute, posPantalla, { zIndex: zIndexBase + 1 }]}>
        <Image source={HORIZONTAL_SPRITES.pantallaPcAbierta} style={styles.fillImage} resizeMode="stretch" />

        {/* ── INTERFAZ USABLE DE LA TERMINAL CRT ───────────────────────── */}
        <View style={styles.crtContainer}>
          {/* BARRA SUPERIOR DE ESTADO */}
          <View style={styles.topStatusRow}>
            <Text style={styles.crtHeaderTitle}>C.S.T. OS v4.2 // SECTOR 4</Text>
            <Text style={styles.crtHeaderStatus}>● EN LÍNEA</Text>
          </View>

          {/* CUERPO CENTRAL (PESTAÑAS AL COSTADO + CONTENIDO) */}
          <View style={styles.mainBodyRow}>
            {/* PESTAÑAS AL COSTADO (LATERAL IZQUIERDO) */}
            <View style={styles.sideNav}>
              {(['COTEJO', 'FACTURA', 'CAMARAS', 'SISTEMA'] as SideTab[]).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.sideTabBtn, activeTab === tab && styles.sideTabBtnActive]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setActiveTab(tab);
                    setTerminalMessage(null);
                  }}
                >
                  <Text style={[styles.sideTabText, activeTab === tab && styles.sideTabTextActive]}>
                    {tab === 'COTEJO' ? '1. COTEJO' : tab === 'FACTURA' ? '2. PRECIO' : tab === 'CAMARAS' ? '3. CCTV' : '4. REGLAS'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
            <View style={styles.contentPane}>
              {/* TAB 1: COTEJO */}
              {activeTab === 'COTEJO' && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.paneTitle}>[ COTEJO DE IDENTIDAD // M. ARIS ]</Text>
                  <Text style={styles.paneLine}>SUJETO: M. ARIS // RESIDENTE SECTOR 4</Text>
                  <Text style={styles.paneLine}>CREDENCIAL: CST-8812-402-B // NIVEL 3</Text>
                  <Text style={styles.paneLine}>REGLA DE HOY: EXIGIR SELLO UV EN CREDENCIAL</Text>
                  <View style={styles.checkCard}>
                    <Text style={styles.checkText}>[✓] FOTO BIOMÉTRICA: CONFORME</Text>
                    <Text style={styles.checkText}>[✓] PERMISO ESTADÍA: VIGENTE</Text>
                    <Text style={styles.checkWarning}>[!] VERIFICAR FLUORESCENCIA BAJO LINTERNA UV</Text>
                  </View>
                </ScrollView>
              )}

              {/* TAB 2: FACTURA */}
              {activeTab === 'FACTURA' && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.paneTitle}>[ FACTURACIÓN Y CONTROL DE PRECIOS ]</Text>
                  {activeExamProduct ? (
                    <View>
                      <Text style={styles.paneLine}>PRODUCTO: {activeExamProduct.name}</Text>
                      <Text style={styles.paneLine}>PRECIO REGULADO: ${activeExamProduct.officialPrice} CST</Text>
                      <Text style={styles.paneLine}>VALOR CALLE: ${activeExamProduct.blackMarketPrice} CST</Text>
                      <View style={styles.surchargeRow}>
                        <Text style={styles.surchargeLabel}>SOBREPRECIO: +${surcharge} CST</Text>
                        <View style={styles.counterBtns}>
                          <TouchableOpacity style={styles.miniBtn} onPress={() => setSurcharge((p) => Math.max(0, p - 5))}>
                            <Text style={styles.miniBtnText}>-5</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.miniBtn} onPress={() => setSurcharge((p) => p + 5)}>
                            <Text style={styles.miniBtnText}>+5</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.noItemNotice}>
                      [ NO HAY PRODUCTO EN MESA. PASE UNO DESDE LA PILA DERECHA ]
                    </Text>
                  )}
                </ScrollView>
              )}

              {/* TAB 3: CÁMARAS CCTV */}
              {activeTab === 'CAMARAS' && (
                <View style={styles.cctvBox}>
                  <View style={styles.cctvHeader}>
                    <Text style={styles.cctvTitle}>CCTV: {cctvCam === 1 ? 'CAM-01 TRAGALUZ CALLE' : 'CAM-02 MOSTRADOR'}</Text>
                    <TouchableOpacity style={styles.miniBtn} onPress={() => setCctvCam(cctvCam === 1 ? 2 : 1)}>
                      <Text style={styles.miniBtnText}>CAMBIAR</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cctvScreen}>
                    <Text style={styles.cctvNoise}>░▒▓ FEED ANÁLOGO 15 FPS ▓▒░</Text>
                    <Text style={styles.cctvSubject}>
                      {cctvCam === 1 ? '[ CALLE PORTWALL: TOQUE DE QUEDA ]' : '[ VISITANTE EN ESPERA // TRANQUILO ]'}
                    </Text>
                  </View>
                </View>
              )}

              {/* TAB 4: SISTEMA */}
              {activeTab === 'SISTEMA' && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.paneTitle}>[ PROTOCOLOS DEL CONSORCIO ]</Text>
                  <Text style={styles.paneLine}>• TOQUE DE QUEDA: 00:00 HRS</Text>
                  <Text style={styles.paneLine}>• PERSIANA METÁLICA DEBE CERRARSE AL CIERRE</Text>
                  <Text style={styles.paneLine}>• TOLERANCIA CERO ANTE SELLOS FALSOS</Text>
                  <Text style={styles.paneLine}>• USO DE ARMA: SÓLO ANTE INTRUSIÓN</Text>
                </ScrollView>
              )}

              {terminalMessage && <Text style={styles.terminalAlert}>{terminalMessage}</Text>}
            </View>
          </View>

          {/* PESTAÑAS Y BOTONES DE NAVEGACIÓN ABAJO */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={[styles.bottomBtn, styles.approveBtn]} onPress={() => handleAction('APROBAR')}>
              <Text style={styles.approveBtnText}>[ PROCEDER ✓ ]</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bottomBtn, styles.denyBtn]} onPress={() => handleAction('DENEGAR')}>
              <Text style={styles.denyBtnText}>[ DENEGAR ✕ ]</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBtn} onPress={() => handleAction('TICKET')}>
              <Text style={styles.bottomBtnText}>[ TICKET ]</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bottomBtn, styles.closeBtn]} onPress={onClose}>
              <Text style={styles.closeBtnText}>[ CERRAR ✕ ]</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  spriteAbsolute: { position: 'absolute' },
  fillImage: { width: '100%', height: '100%' },
  crtContainer: {
    ...StyleSheet.absoluteFillObject,
    padding: 6,
    justifyContent: 'space-between',
    backgroundColor: '#02050A',
  },
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#2F855A',
    paddingBottom: 2,
  },
  crtHeaderTitle: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 7, color: '#48BB78', fontWeight: 'bold' },
  crtHeaderStatus: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 7, color: '#48BB78' },
  mainBodyRow: { flex: 1, flexDirection: 'row', gap: 4, marginVertical: 4 },
  sideNav: { width: 52, borderRightWidth: 1, borderRightColor: '#1C4532', gap: 2 },
  sideTabBtn: { paddingVertical: 3, paddingHorizontal: 2, backgroundColor: '#0A1A12', borderWidth: 0.5, borderColor: '#1F3A2B' },
  sideTabBtnActive: { backgroundColor: '#133322', borderColor: '#48BB78' },
  sideTabText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#2F855A' },
  sideTabTextActive: { color: '#48BB78', fontWeight: 'bold' },
  contentPane: { flex: 1, paddingHorizontal: 3 },
  paneTitle: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 7.5, color: '#48BB78', fontWeight: 'bold', marginBottom: 2 },
  paneLine: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6.5, color: '#9AE6B4', marginVertical: 1 },
  checkCard: { marginTop: 3, backgroundColor: '#07160E', borderWidth: 0.5, borderColor: '#22543D', padding: 3 },
  checkText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#48BB78' },
  checkWarning: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#D69E2E', marginTop: 1 },
  noItemNotice: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6.5, color: '#64748B', marginTop: 8 },
  surchargeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 },
  surchargeLabel: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6.5, color: '#D69E2E' },
  counterBtns: { flexDirection: 'row', gap: 3 },
  miniBtn: { paddingHorizontal: 4, paddingVertical: 1, backgroundColor: '#0C2216', borderWidth: 0.5, borderColor: '#2F855A' },
  miniBtnText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#48BB78' },
  cctvBox: { flex: 1 },
  cctvHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  cctvTitle: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6.5, color: '#90CDF4' },
  cctvScreen: { flex: 1, backgroundColor: '#000000', borderWidth: 0.5, borderColor: '#2D3748', justifyContent: 'center', alignItems: 'center', padding: 2 },
  cctvNoise: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#4A5568' },
  cctvSubject: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6.5, color: '#718096', marginTop: 2 },
  terminalAlert: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#90CDF4', backgroundColor: '#0A1826', padding: 2, marginTop: 2, borderWidth: 0.5, borderColor: '#4299E1' },
  bottomBar: { flexDirection: 'row', gap: 3, borderTopWidth: 1, borderTopColor: '#1C4532', paddingTop: 2 },
  bottomBtn: { flex: 1, paddingVertical: 2, alignItems: 'center', backgroundColor: '#0A1A12', borderWidth: 0.5, borderColor: '#22543D' },
  bottomBtnText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#48BB78' },
  approveBtn: { borderColor: '#2E86C1', backgroundColor: '#0C2030' },
  approveBtnText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#90CDF4', fontWeight: 'bold' },
  denyBtn: { borderColor: '#742A2A', backgroundColor: '#1A0C0C' },
  denyBtnText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#E2E8F0', fontWeight: 'bold' },
  closeBtn: { borderColor: '#4A5568', backgroundColor: '#1A202C' },
  closeBtnText: { fontFamily: TYPOGRAPHY.systemPC, fontSize: 6, color: '#A0AEC0' },
});
