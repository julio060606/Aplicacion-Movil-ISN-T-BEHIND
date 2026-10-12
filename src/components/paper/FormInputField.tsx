// src/components/paper/FormInputField.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TYPOGRAPHY } from '../../theme/typography';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

interface FormInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isValid?: boolean;
  autoCapitalize?: 'none' | 'characters' | 'words' | 'sentences';
}

export const FormInputField: React.FC<FormInputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  isValid = false,
  autoCapitalize = 'characters',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {isValid && <Text style={styles.validBadge}>[✓ VERIFICADO]</Text>}
      </View>
      <TextInput
        style={[styles.input, isValid && styles.inputValid]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8A7A60"
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        selectionColor="#2E86C1"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(10),
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: verticalScale(2),
  },
  label: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(9),
    color: '#3B3322',
    letterSpacing: 0.8,
  },
  validBadge: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(8),
    color: '#15803D',
    fontWeight: 'bold',
  },
  input: {
    fontFamily: TYPOGRAPHY.cleanDoc,
    fontSize: moderateScale(11.5),
    color: '#1C1917',
    borderBottomWidth: 1,
    borderBottomColor: '#8A7A60',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  inputValid: {
    borderBottomColor: '#2E86C1', // Azul C.S.T.
    backgroundColor: 'rgba(46, 134, 193, 0.08)',
  },
});
