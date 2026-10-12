// src/components/paper/StayPermitCard.tsx
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
import { ICitizenStayStatus, IPersonIdentity } from '../../models/identity';
import { TYPOGRAPHY } from '../../theme/typography';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

interface StayPermitCardProps {
  stayStatus: ICitizenStayStatus;
  identity: IPersonIdentity;
  /** Sprite gráfico oficial cuando esté disponible (renderizado sobre el colorbox) */
  spriteSource?: ImageSourcePropType;
  /** Estilo o posición personalizada */
  style?: StyleProp<ViewStyle>;
  /** Callback al pulsar */
  onPress?: () => void;
}

export const StayPermitCard: React.FC<StayPermitCardProps> = ({
  stayStatus,
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
      {/* 1. CAPA COLORBOX (Papel verde mate apagado / militar sin brillos) */}
      <View style={styles.colorboxLayer} />

      {/* 2. CAPA DE SPRITE (Si existe textura de papel) */}
      {spriteSource && (
        <Image
          source={spriteSource}
          style={StyleSheet.absoluteFill}
          resizeMode="stretch"
        />
      )}

      {/* 3. CAPA DE CONTENIDO DIEGÉTICO */}
      <View style={styles.contentLayer}>
        {/* Cabecera del documento */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>C.S.T. PERMISO DE RESIDENCIA Y TRABAJO</Text>
          <Text style={styles.headerSub}>SECTOR 4 - FORMULARIO DE ESTADÍA ST-104</Text>
        </View>

        {/* Cuerpo distribuido: datos de estadía a la izquierda, datos personales a la derecha (que el DNI tapará) */}
        <View style={styles.body}>
          {/* Columna Izquierda (Visible): Datos de Estadía y Nivel */}
          <View style={styles.leftColumn}>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>CÓDIGO DE ESTADÍA:</Text>
              <Text style={styles.codeValue}>{stayStatus.stayCode}</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>NIVEL DE CIUDADANO:</Text>
              <Text style={styles.levelValue}>{stayStatus.citizenLevel}</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>SECTOR ASIGNADO:</Text>
              <Text style={styles.sectorValue}>{stayStatus.sectorAssigned}</Text>
            </View>
          </View>

          {/* Columna Derecha: Datos personales que quedarán solapados/tapados por el DNI */}
          <View style={styles.rightColumn}>
            <View style={styles.subFieldBlock}>
              <Text style={styles.fieldLabelMuted}>TITULAR:</Text>
              <Text style={styles.personalValue}>{identity.fullName}</Text>
            </View>

            <View style={styles.subFieldBlock}>
              <Text style={styles.fieldLabelMuted}>ID CIVIL:</Text>
              <Text style={styles.personalValue}>{identity.idNumber}</Text>
            </View>

            <View style={styles.subFieldBlock}>
              <Text style={styles.fieldLabelMuted}>SEXO:</Text>
              <Text style={styles.personalValue}>{identity.sex}</Text>
            </View>

            <View style={styles.stampPlaceholder}>
              <Text style={styles.stampText}>SELLO C.S.T. REGISTRO</Text>
            </View>
          </View>
        </View>

        {/* Banda inferior institucional */}
        <View style={styles.bottomBar}>
          <Text style={styles.authCode}>
            DOCUMENTO OFICIAL // AUT: {stayStatus.workAuthorizationCode}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Más ancho y más alto que el DNI para que asome debajo y a la izquierda
    width: scale(258),
    height: verticalScale(172),
    borderRadius: 3,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 6,
  },
  colorboxLayer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#26332B', // Verde mate apagado / papel militar sin brillos
    borderWidth: 1.5,
    borderColor: '#38483E',
    borderRadius: 3,
  },
  contentLayer: {
    flex: 1,
    padding: scale(8),
    justifyContent: 'space-between',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#38483E',
    paddingBottom: verticalScale(4),
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.stamps,
    fontSize: moderateScale(9),
    color: '#BDC9C1',
    letterSpacing: 0.8,
  },
  headerSub: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(7),
    color: '#7D8E83',
    letterSpacing: 0.4,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    gap: scale(8),
    paddingVertical: verticalScale(4),
  },
  leftColumn: {
    flex: 1.2,
    justifyContent: 'space-around',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'space-around',
    borderLeftWidth: 0.8,
    borderLeftColor: '#35453A',
    paddingLeft: scale(6),
  },
  fieldBlock: {
    marginBottom: verticalScale(2),
  },
  subFieldBlock: {
    marginBottom: verticalScale(2),
  },
  fieldLabel: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(7),
    color: '#8B9E91',
    letterSpacing: 0.2,
  },
  fieldLabelMuted: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(6.5),
    color: '#65776C',
  },
  codeValue: {
    fontFamily: TYPOGRAPHY.menuOptionBold,
    fontSize: moderateScale(10),
    color: '#E0E7E2',
    letterSpacing: 0.6,
  },
  levelValue: {
    fontFamily: TYPOGRAPHY.menuOptionBold,
    fontSize: moderateScale(9),
    color: '#D4DDD7',
  },
  sectorValue: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(7.5),
    color: '#A2B3A8',
  },
  personalValue: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(7.5),
    color: '#8B9E91',
  },
  stampPlaceholder: {
    borderWidth: 0.8,
    borderColor: '#3E5045',
    borderStyle: 'dashed',
    paddingVertical: verticalScale(2),
    alignItems: 'center',
    marginTop: verticalScale(2),
  },
  stampText: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(6),
    color: '#5E7064',
    letterSpacing: 0.5,
  },
  bottomBar: {
    borderTopWidth: 0.5,
    borderTopColor: '#38483E',
    paddingTop: verticalScale(2),
    alignItems: 'center',
  },
  authCode: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(6.5),
    color: '#76877B',
    letterSpacing: 1,
  },
});
