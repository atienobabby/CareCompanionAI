import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, AlertTriangle } from 'lucide-react-native';

export const EmergencyCard: React.FC = () => {
  const { fontSize, highContrast } = useAccessibility();
  const { t } = useLanguage();

  const handleEmergencyCall = async (number: string) => {
    try {
      const url = `tel:${number}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to make phone call');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const styles = createStyles(fontSize, highContrast);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AlertTriangle size={24} color={highContrast ? '#ffffff' : '#dc2626'} />
        <Text style={styles.title}>Emergency Services</Text>
      </View>
      
      <Text style={styles.subtitle}>
        In case of emergency, contact these services immediately
      </Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => handleEmergencyCall('911')}
          accessibilityLabel="Call 911 for emergency"
        >
          <Phone size={20} color="#ffffff" />
          <Text style={styles.buttonText}>911</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => handleEmergencyCall('988')}
          accessibilityLabel="Call 988 for mental health crisis"
        >
          <Phone size={20} color="#ffffff" />
          <Text style={styles.buttonText}>988</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.note}>
        911: Medical Emergency | 988: Mental Health Crisis
      </Text>
    </View>
  );
};

const createStyles = (fontSize: string, highContrast: boolean) => StyleSheet.create({
  container: {
    backgroundColor: highContrast ? '#330000' : '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: highContrast ? '#666666' : '#fecaca',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#dc2626',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#7f1d1d',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-Bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  note: {
    fontSize: fontSize === 'large' ? 10 : 8,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#7f1d1d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});