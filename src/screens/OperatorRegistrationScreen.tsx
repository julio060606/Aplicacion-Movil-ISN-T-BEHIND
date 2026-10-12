// src/screens/OperatorRegistrationScreen.tsx
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import {
  PROTAGONIST_IDENTITY,
  PROTAGONIST_STAY_STATUS,
} from '../models/identity';
import { storageService } from '../services/storage/storageService';
import { ScreenDelay } from '../components/ui/ScreenDelay';
import { PaperDocument } from '../components/paper/PaperDocument';
import { FormInputField } from '../components/paper/FormInputField';
import { IdentityCard } from '../components/paper/IdentityCard';
import { StayPermitCard } from '../components/paper/StayPermitCard';
import { GameBottomBar } from '../components/ui/GameBottomBar';
import { TYPOGRAPHY } from '../theme/typography';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'OperatorRegistration'>;

export const OperatorRegistrationScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [stayCode, setStayCode] = useState('');
  const [citizenLevel, setCitizenLevel] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handleAutoFill = () => {
    setFullName(PROTAGONIST_IDENTITY.fullName);
    setIdNumber(PROTAGONIST_IDENTITY.idNumber);
    setStayCode(PROTAGONIST_STAY_STATUS.stayCode);
    setCitizenLevel(PROTAGONIST_STAY_STATUS.citizenLevel);
    Haptics.selectionAsync().catch(() => {});
  };

  // Validación diegética contra los documentos de la mesa
  const isNameValid =
    fullName.trim().toUpperCase() === PROTAGONIST_IDENTITY.fullName.toUpperCase();
  const isIdValid =
    idNumber.trim().toUpperCase() === PROTAGONIST_IDENTITY.idNumber.toUpperCase();
  const isStayValid =
    stayCode.trim().toUpperCase() === PROTAGONIST_STAY_STATUS.stayCode.toUpperCase();

  // Validación flexible: acepta "3", "NIVEL 3", "NIVEL 3 [RESIDENTE]", etc.
  const cleanLevel = citizenLevel.trim().toUpperCase();
  const isLevelValid =
    ['3', 'NIVEL 3', 'NIVEL 3 [RESIDENTE]', 'NIVEL 3 RESIDENTE'].includes(cleanLevel) ||
    cleanLevel.replace(/[^0-9]/g, '') === '3';

  const isFormComplete = isNameValid && isIdValid && isStayValid && isLevelValid;

  /**
   * TODO: Integrar expo-camera para capturar fotografía frontal del jugador
   */
  const handleCapturePhoto = async () => {
    Haptics.selectionAsync().catch(() => {});
  };

  const handleConfirmRegistration = async () => {
    if (!isFormComplete) return;

    try {
      await storageService.saveOperatorProfile({
        identity: {
          ...PROTAGONIST_IDENTITY,
          fullName: fullName.trim(),
          idNumber: idNumber.trim(),
          photoUri,
        },
        stayStatus: {
          ...PROTAGONIST_STAY_STATUS,
          stayCode: stayCode.trim(),
          citizenLevel: citizenLevel.trim(),
        },
        fullName: fullName.trim(),
        registeredAt: Date.now(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      navigation.navigate('WeeklyIntro', { weekNumber: 1 });
    } catch (error) {
      console.error('[Registration] Error al guardar perfil:', error);
    }
  };

  return (
    <ScreenDelay delay={500} backgroundColor="#0C0C0C">
      <View style={styles.screen}>
        <StatusBar hidden />

        {/* 1. MESA OSCURA: Colorbox de respaldo */}
        <View style={styles.deskColorbox} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 2. HOJA DE REGISTRO C.S.T. (Deslizamiento frío sin rebote) */}
            <PaperDocument style={styles.documentWrapper}>
              <View style={styles.docHeader}>
                <View style={styles.docHeaderRow}>
                  <Text style={styles.docCompany}>CONSORCIO STRATTON-TATE // C.S.T.</Text>
                  <TouchableOpacity
                    onPress={handleAutoFill}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.autoFillBtn}>[ AUTO-RELLENAR ]</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.docTitle}>FORMULARIO 104-B: REGISTRO DE OPERARIO</Text>
              </View>

              {/* Fila superior: Slot para foto + Cláusula inicial */}
              <View style={styles.photoClauseRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCapturePhoto}
                  style={styles.photoBox}
                >
                  <Text style={styles.photoPlaceholderText}>[ FOTO 2x2 ]</Text>
                  <Text style={styles.photoSubText}>TOCAR PARA CAPTURAR</Text>
                </TouchableOpacity>

                <View style={styles.clauseContainer}>
                  <Text style={styles.clauseText}>
                    COPIE CON EXACTITUD LOS DATOS REGISTRADOS EN SU CREDENCIAL CIVIL.
                    CUALQUIER DISCREPANCIA CONSTITUYE INFRACCIÓN CLASE B.
                  </Text>
                </View>
              </View>

              {/* Campos interactivos del formulario */}
              <FormInputField
                label="1. NOMBRE COMPLETO:"
                value={fullName}
                onChangeText={setFullName}
                placeholder="EJ: VANCE, JOHN E."
                isValid={isNameValid}
              />

              <FormInputField
                label="2. CÓDIGO DE IDENTIDAD CIVIL:"
                value={idNumber}
                onChangeText={setIdNumber}
                placeholder="EJ: 941-20-8841"
                isValid={isIdValid}
              />

              <FormInputField
                label="3. CÓDIGO DE ESTADÍA AUTORIZADA:"
                value={stayCode}
                onChangeText={setStayCode}
                placeholder="EJ: ST-4092-B"
                isValid={isStayValid}
              />

              <FormInputField
                label="4. NIVEL DE CIUDADANO (NIVEL O NÚMERO):"
                value={citizenLevel}
                onChangeText={setCitizenLevel}
                placeholder="EJ: 3 O NIVEL 3"
                isValid={isLevelValid}
              />

              <Text style={styles.docDisclaimer}>
                CERTIFICO BAJO PENA DE RECLUSIÓN QUE LA INFORMACIÓN PROVISTA ES VERÍDICA.
              </Text>
            </PaperDocument>

            {/* 3. DOCUMENTOS DE CONSULTA EN LA MESA (SUPERPUESTOS DIEGÉTICAMENTE) */}
            <View style={styles.deskDocumentsArea}>
              {/* Permiso de residencia y trabajo (a la izquierda y por debajo, zIndex: 1) */}
              <View style={styles.permitLayer}>
                <StayPermitCard
                  stayStatus={PROTAGONIST_STAY_STATUS}
                  identity={PROTAGONIST_IDENTITY}
                />
              </View>

              {/* DNI (a la derecha y por encima, zIndex: 2, tapando datos repetidos) */}
              <View style={styles.dniLayer}>
                <IdentityCard identity={PROTAGONIST_IDENTITY} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* 4. BARRA INFERIOR DE ACCIÓN (A la izquierda, ocupa todo el ancho) */}
        <GameBottomBar
          action={{
            label: '[ VALIDAR Y FIRMAR ]',
            onPress: handleConfirmRegistration,
            disabled: !isFormComplete,
            textAlign: 'left',
          }}
        />
      </View>
    </ScreenDelay>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0C0C0C' },
  deskColorbox: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0C0C0C' },
  keyboardContainer: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(90),
    paddingBottom: verticalScale(120),
  },
  documentWrapper: { marginBottom: verticalScale(28) },
  docHeader: { borderBottomWidth: 1.5, borderBottomColor: '#2E86C1', paddingBottom: verticalScale(6), marginBottom: verticalScale(10) },
  docHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  autoFillBtn: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(9), color: '#2E86C1', letterSpacing: 0.5 },
  docCompany: { fontFamily: TYPOGRAPHY.stamps, fontSize: moderateScale(11), color: '#2E86C1', letterSpacing: 1 },
  docTitle: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(9), color: '#3B3322', letterSpacing: 0.5, marginTop: verticalScale(2) },
  photoClauseRow: { flexDirection: 'row', gap: scale(10), marginBottom: verticalScale(10), alignItems: 'center' },
  photoBox: { width: scale(72), height: verticalScale(86), borderWidth: 1.5, borderColor: '#8A7A60', borderStyle: 'dashed', backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', padding: scale(4) },
  photoPlaceholderText: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(8), color: '#5C5346', textAlign: 'center' },
  photoSubText: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(6.5), color: '#786E5E', textAlign: 'center', marginTop: verticalScale(4) },
  clauseContainer: { flex: 1 },
  clauseText: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(8.5), color: '#443E33', lineHeight: verticalScale(13) },
  docDisclaimer: { fontFamily: TYPOGRAPHY.cleanDoc, fontSize: moderateScale(7.5), color: '#6E6454', textAlign: 'center', marginTop: verticalScale(6), letterSpacing: 0.3 },
  deskDocumentsArea: { position: 'relative', height: verticalScale(195), marginTop: verticalScale(8), marginBottom: verticalScale(20) },
  permitLayer: { position: 'absolute', left: scale(2), top: 0, zIndex: 1, transform: [{ rotate: '-2.8deg' }] },
  dniLayer: { position: 'absolute', right: scale(2), top: verticalScale(32), zIndex: 2, transform: [{ rotate: '2.2deg' }] },
});
