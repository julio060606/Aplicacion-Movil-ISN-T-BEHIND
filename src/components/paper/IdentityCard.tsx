// src/components/paper/IdentityCard.tsx
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { IPersonIdentity } from '../../models/identity';
import { TYPOGRAPHY } from '../../theme/typography';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

interface IdentityCardProps {
  identity: IPersonIdentity;
  /** Sprite gráfico oficial cuando esté disponible (renderizado sobre el colorbox) */
  spriteSource?: ImageSourcePropType;
  /** Estilo o posición personalizada */
  style?: StyleProp<ViewStyle>;
  /** Callback al pulsar la credencial */
  onPress?: () => void;
}

export const IdentityCard: React.FC<IdentityCardProps> = ({
  identity,
  spriteSource,
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.container, style]}
    >
      {/* 1. CAPA COLORBOX (Referencia visual y fallback permanente) */}
      <View style={styles.colorboxLayer} />

      {/* 2. CAPA DE SPRITE (Si existe un archivo gráfico conectado) */}
      {spriteSource && (
        <Image
          source={spriteSource}
          style={StyleSheet.absoluteFill}
          resizeMode="stretch"
        />
      )}

      {/* 3. CAPA DE CONTENIDO DIEGÉTICO */}
      <View style={styles.contentLayer}>
        {/* Cabecera del carnet (Estilo Federal / State ID) */}
        <View style={styles.header}>
          <Text style={styles.headerState}>PORTWALL CIVIL JURISDICTION</Text>
          <Text style={styles.headerSub}>IDENTIFICATION CARD // C.S.T. COMPLIANT</Text>
        </View>

        <View style={styles.body}>
          {/* Columna Izquierda: Espacio de Foto */}
          <View style={styles.photoContainer}>
            {identity.photoUri ? (
              <Image source={{ uri: identity.photoUri }} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoIcon}>[👤]</Text>
                <Text style={styles.photoText}>PHOTO</Text>
              </View>
            )}
            <Text style={styles.photoCaption}>CIVIL ID</Text>
          </View>

          {/* Columna Derecha: Datos Tipográficos */}
          <View style={styles.fieldsContainer}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>NAME:</Text>
              <Text style={styles.fieldValueBold}>{identity.fullName}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>ID NO:</Text>
              <Text style={[styles.fieldValueCode, { color: '#2E86C1' }]}>
                {identity.idNumber}
              </Text>
            </View>

            <View style={styles.subFieldsRow}>
              <View style={styles.subFieldItem}>
                <Text style={styles.fieldLabel}>DOB:</Text>
                <Text style={styles.fieldValue}>{identity.birthDate}</Text>
              </View>

              <View style={styles.subFieldItem}>
                <Text style={styles.fieldLabel}>SEX:</Text>
                <Text style={styles.fieldValue}>{identity.sex}</Text>
              </View>
            </View>

            <View style={styles.subFieldsRow}>
              <View style={styles.subFieldItem}>
                <Text style={styles.fieldLabel}>EXP:</Text>
                <Text style={styles.fieldValue}>{identity.expiryDate}</Text>
              </View>

              <View style={styles.subFieldItem}>
                <Text style={styles.fieldLabel}>DIST:</Text>
                <Text style={styles.fieldValue}>{identity.nationality}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Banda inferior / Código de barras burocrático */}
        <View style={styles.bottomBar}>
          <Text style={styles.barcodeText}>||| | ||||| || |||| ||| ||||||| | || |||||</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(230),
    height: verticalScale(142),
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
  },
  colorboxLayer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#1E293B', // Azul acero oscuro burocrático
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 6,
  },
  contentLayer: {
    flex: 1,
    padding: scale(6),
    justifyContent: 'space-between',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#2E86C1', // Azul C.S.T.
    paddingBottom: verticalScale(2),
  },
  headerState: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(9),
    color: '#F8FAFC',
    letterSpacing: 0.8,
  },
  headerSub: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(7),
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  body: {
    flexDirection: 'row',
    marginTop: verticalScale(4),
    gap: scale(8),
  },
  photoContainer: {
    width: scale(54),
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: scale(52),
    height: verticalScale(62),
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImage: {
    width: scale(52),
    height: verticalScale(62),
    resizeMode: 'cover',
  },
  photoIcon: {
    fontSize: moderateScale(16),
    color: '#64748B',
  },
  photoText: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(7),
    color: '#64748B',
  },
  photoCaption: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(6.5),
    color: '#64748B',
    marginTop: verticalScale(2),
  },
  fieldsContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: scale(4),
  },
  subFieldsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subFieldItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: scale(2),
  },
  fieldLabel: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(7),
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  fieldValueBold: {
    fontFamily: TYPOGRAPHY.menuOptionBold,
    fontSize: moderateScale(9),
    color: '#F1F5F9',
  },
  fieldValueCode: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(8.5),
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(7.5),
    color: '#CBD5E1',
  },
  bottomBar: {
    borderTopWidth: 0.5,
    borderTopColor: '#334155',
    paddingTop: verticalScale(2),
    alignItems: 'center',
  },
  barcodeText: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(8),
    color: '#64748B',
    letterSpacing: 2,
  },
});
