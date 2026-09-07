// src/screens/OperatorRegistrationScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/types';
import { colors } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { scale, verticalScale, moderateScale } from '../utils/responsive';
import { storageService } from '../services/storage/storageService';

type Props = NativeStackScreenProps<RootStackParamList, 'OperatorRegistration'>;

export const OperatorRegistrationScreen: React.FC<Props> = ({ navigation }) => {
  // Estados de los campos del formulario
  const [fullName, setFullName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Estados de errores de validación
  const [nameError, setNameError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [agreementError, setAgreementError] = useState<string | null>(null);

  // Validaciones en tiempo real
  const validateName = (val: string): boolean => {
    const trimmed = val.trim();
    if (trimmed.length < 3) {
      setNameError('ERROR: El nombre debe tener al menos 3 caracteres.');
      return false;
    }
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(trimmed)) {
      setNameError('ERROR: Caracteres inválidos. Solo letras y espacios.');
      return false;
    }
    setNameError(null);
    return true;
  };

  const validateCode = (val: string): boolean => {
    const trimmed = val.trim().toUpperCase();
    const codeRegex = /^CST-\d{4}$/;
    if (!codeRegex.test(trimmed)) {
      setCodeError('ERROR: El código debe cumplir el formato exacto CST-XXXX (ej. CST-4092).');
      return false;
    }
    setCodeError(null);
    return true;
  };

  const validateContact = (val: string): boolean => {
    const trimmed = val.trim();
    if (trimmed.length < 6) {
      setContactError('ERROR: Contacto requerido (correo electrónico o teléfono).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s]{8,}$/;
    if (!emailRegex.test(trimmed) && !phoneRegex.test(trimmed)) {
      setContactError('ERROR: Ingrese un correo válido (usuario@dominio) o teléfono (mín. 8 dígitos).');
      return false;
    }
    setContactError(null);
    return true;
  };

  const handleSubmit = async () => {
    const isNameValid = validateName(fullName);
    const isCodeValid = validateCode(employeeCode);
    const isContactValid = validateContact(emergencyContact);

    let isAgreementValid = true;
    if (!isAgreed) {
      setAgreementError('ERROR OBLIGATORIO: Debe certificar y aceptar la cláusula de riesgo C.S.T.');
      isAgreementValid = false;
    } else {
      setAgreementError(null);
    }

    if (!isNameValid || !isCodeValid || !isContactValid || !isAgreementValid) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {}
      return;
    }

    // Datos válidos: Guardar en AsyncStorage
    try {
      await storageService.saveOperatorProfile({
        fullName: fullName.trim(),
        employeeCode: employeeCode.trim().toUpperCase(),
        emergencyContact: emergencyContact.trim(),
        sectorAssigned: 'SECTOR 4 - GARITA SUR',
        registeredAt: Date.now(),
      });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {
      console.error('[OperatorRegistration] Error al persistir datos:', e);
    }

    // Continuar al flujo de la historia
    navigation.navigate('WeeklyIntro', { weekNumber: 1 });
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ENCABEZADO OFICIAL CST */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerSub}>CONSORCIO INDUSTRIAL DE SUMINISTROS Y COMERCIO</Text>
          <Text style={styles.headerTitle}>REGISTRO DE OPERADOR // SECTOR 4</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.headerNotice}>
            DECLARACIÓN JURADA DE ACCESO Y PROTOCOLO DE INSPECCIÓN FRONTERIZA
          </Text>
        </View>

        {/* CAMPO 1: NOMBRE COMPLETO */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            01. NOMBRE Y APELLIDO DEL OPERARIO <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.textInput, nameError ? styles.inputError : null]}
            placeholder="Ej. Miller, John"
            placeholderTextColor={colors.textSubtle}
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (nameError) validateName(text);
            }}
            onBlur={() => validateName(fullName)}
            autoCapitalize="words"
            autoCorrect={false}
          />
          {nameError && <Text style={styles.errorText}>{nameError}</Text>}
        </View>

        {/* CAMPO 2: CÓDIGO DE CREDENCIAL */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            02. CÓDIGO DE CREDENCIAL OFICIAL <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.textInput, codeError ? styles.inputError : null]}
            placeholder="Formato: CST-XXXX (Ej. CST-8041)"
            placeholderTextColor={colors.textSubtle}
            value={employeeCode}
            onChangeText={(text) => {
              setEmployeeCode(text.toUpperCase());
              if (codeError) validateCode(text);
            }}
            onBlur={() => validateCode(employeeCode)}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
          />
          {codeError && <Text style={styles.errorText}>{codeError}</Text>}
        </View>

        {/* CAMPO 3: CONTACTO DE EMERGENCIA */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            03. CONTACTO DE EMERGENCIA / DEFUNCIÓN <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.textInput, contactError ? styles.inputError : null]}
            placeholder="correo@ejemplo.com o teléfono directo"
            placeholderTextColor={colors.textSubtle}
            value={emergencyContact}
            onChangeText={(text) => {
              setEmergencyContact(text);
              if (contactError) validateContact(text);
            }}
            onBlur={() => validateContact(emergencyContact)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {contactError && <Text style={styles.errorText}>{contactError}</Text>}
        </View>

        {/* CAMPO 4: CHECKBOX CLÁUSULA DE RESPONSABILIDAD */}
        <TouchableOpacity
          style={styles.agreementRow}
          activeOpacity={0.7}
          onPress={() => {
            const nextVal = !isAgreed;
            setIsAgreed(nextVal);
            if (nextVal) setAgreementError(null);
          }}
        >
          <View style={[styles.checkboxBox, isAgreed && styles.checkboxBoxChecked]}>
            {isAgreed && <Text style={styles.checkmarkText}>✓</Text>}
          </View>
          <Text style={styles.agreementText}>
            Certifico que he leído las directivas de seguridad. Exonero al Consorcio C.S.T.
            de cualquier daño psicológico, paranoico o agresión física por entidades del exterior.
          </Text>
        </TouchableOpacity>
        {agreementError && <Text style={styles.errorText}>{agreementError}</Text>}

        {/* BOTÓN DE ENVÍO / FIRMA */}
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>[ SELLAR Y ACCEDER AL SECTOR 4 ]</Text>
        </TouchableOpacity>

        {/* BOTÓN CANCELAR */}
        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>&lt;&lt; CANCELAR Y RETORNAR AL MENÚ</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(40),
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: verticalScale(28),
    alignItems: 'center',
  },
  headerSub: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(9),
    color: colors.textSubtle,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(16),
    color: colors.crtAmber,
    letterSpacing: 2,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerDivider: {
    width: '100%',
    height: 2,
    backgroundColor: colors.stampRed,
    marginVertical: verticalScale(8),
  },
  headerNotice: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(8),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: verticalScale(12),
  },
  fieldContainer: {
    marginBottom: verticalScale(16),
  },
  fieldLabel: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(10),
    color: '#e2e8f0',
    marginBottom: verticalScale(6),
    letterSpacing: 0.5,
  },
  requiredStar: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 4,
    color: colors.textPrimary,
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(12),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
  },
  errorText: {
    fontFamily: TYPOGRAPHY.systemPC,
    fontSize: moderateScale(8.5),
    color: '#f87171',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(8),
    gap: scale(10),
  },
  checkboxBox: {
    width: scale(22),
    height: scale(22),
    borderWidth: 2,
    borderColor: colors.borderMedium,
    borderRadius: 3,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxBoxChecked: {
    borderColor: colors.crtGreen,
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
  },
  checkmarkText: {
    color: colors.crtGreen,
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    lineHeight: moderateScale(16),
  },
  agreementText: {
    flex: 1,
    fontFamily: TYPOGRAPHY.dirtyDoc,
    fontSize: moderateScale(8.5),
    color: '#cbd5e1',
    lineHeight: verticalScale(13),
  },
  submitButton: {
    backgroundColor: '#991b1b',
    borderWidth: 2,
    borderColor: '#ef4444',
    borderRadius: 6,
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    marginTop: verticalScale(20),
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  submitButtonText: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(12),
    color: '#ffffff',
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: verticalScale(16),
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  cancelButtonText: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(9),
    color: colors.textMuted,
    letterSpacing: 1,
  },
});
