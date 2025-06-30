import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHealthData } from '@/contexts/HealthDataContext';
import { VoiceButton } from '@/components/VoiceButton';
import { AccessibleCard } from '@/components/AccessibleCard';
import { SymptomChecker } from '@/components/SymptomChecker';
import { Search, AlertTriangle, Clock, Thermometer, Heart } from 'lucide-react-native';

export default function SymptomsScreen() {
  const { fontSize, highContrast } = useAccessibility();
  const { t, speak } = useLanguage();
  const { addSymptom } = useHealthData();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showChecker, setShowChecker] = useState(false);

  const commonSymptoms = [
    { id: 'headache', name: t('headache'), severity: 'mild', icon: '🤕' },
    { id: 'fever', name: t('fever'), severity: 'moderate', icon: '🤒' },
    { id: 'cough', name: t('cough'), severity: 'mild', icon: '😷' },
    { id: 'fatigue', name: t('fatigue'), severity: 'mild', icon: '😴' },
    { id: 'nausea', name: t('nausea'), severity: 'moderate', icon: '🤢' },
    { id: 'dizziness', name: t('dizziness'), severity: 'moderate', icon: '😵' },
    { id: 'chest_pain', name: t('chestPain'), severity: 'severe', icon: '💔' },
    { id: 'breathing', name: t('breathingDifficulty'), severity: 'severe', icon: '😤' },
  ];

  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Check if user mentions any common symptoms
    const mentionedSymptoms = commonSymptoms.filter(symptom =>
      lowerCommand.includes(symptom.name.toLowerCase()) ||
      lowerCommand.includes(symptom.id.toLowerCase())
    );

    if (mentionedSymptoms.length > 0) {
      const symptomNames = mentionedSymptoms.map(s => s.name).join(', ');
      speak(`${t('youMentioned')} ${symptomNames}. ${t('addingToChecker')}`);
      
      const newSymptoms = mentionedSymptoms.map(s => s.id);
      setSelectedSymptoms(prev => [...prev, ...newSymptoms]);
    } else if (lowerCommand.includes('check') || lowerCommand.includes('analyze')) {
      setShowChecker(true);
      speak(t('startingSymptomChecker'));
    } else {
      speak(t('pleaseDescribeSymptoms'));
    }
  };

  const handleSymptomSelect = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  const getSeverityColor = (severity: string) => {
    if (highContrast) return '#ffffff';
    switch (severity) {
      case 'mild': return '#059669';
      case 'moderate': return '#d97706';
      case 'severe': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const styles = createStyles(fontSize, highContrast);

  if (showChecker) {
    return (
      <SymptomChecker
        selectedSymptoms={selectedSymptoms}
        onBack={() => setShowChecker(false)}
        onComplete={(results) => {
          addSymptom({
            id: Date.now().toString(),
            name: t('symptomCheck'),
            date: new Date().toLocaleDateString(),
            symptoms: selectedSymptoms,
            results: results,
            description: results.summary || t('symptomCheckCompleted'),
          });
          setShowChecker(false);
          setSelectedSymptoms([]);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('symptomChecker')}</Text>
          <Text style={styles.subtitle}>{t('selectSymptoms')}</Text>
        </View>

        <VoiceButton
          onCommand={handleVoiceCommand}
          style={styles.voiceButton}
          accessibilityLabel={t('voiceSymptomInput')}
          prompt={t('describeYourSymptoms')}
        />

        <View style={styles.symptomsContainer}>
          <Text style={styles.sectionTitle}>{t('commonSymptoms')}</Text>
          
          <View style={styles.symptomsGrid}>
            {commonSymptoms.map((symptom) => (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomCard,
                  selectedSymptoms.includes(symptom.id) && styles.selectedSymptom,
                ]}
                onPress={() => handleSymptomSelect(symptom.id)}
                accessibilityLabel={`${symptom.name}, ${symptom.severity} severity`}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedSymptoms.includes(symptom.id) }}
              >
                <Text style={styles.symptomIcon}>{symptom.icon}</Text>
                <Text style={styles.symptomName}>{symptom.name}</Text>
                <View style={styles.severityBadge}>
                  <Text style={[styles.severityText, { color: getSeverityColor(symptom.severity) }]}>
                    {t(symptom.severity)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedSymptoms.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>
              {t('selectedSymptoms')} ({selectedSymptoms.length})
            </Text>
            <View style={styles.selectedList}>
              {selectedSymptoms.map((symptomId) => {
                const symptom = commonSymptoms.find(s => s.id === symptomId);
                return symptom ? (
                  <View key={symptomId} style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{symptom.name}</Text>
                    <TouchableOpacity
                      onPress={() => handleSymptomSelect(symptomId)}
                      accessibilityLabel={`Remove ${symptom.name}`}
                    >
                      <Text style={styles.removeButton}>×</Text>
                    </TouchableOpacity>
                  </View>
                ) : null;
              })}
            </View>
            
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={() => setShowChecker(true)}
              accessibilityLabel={t('analyzeSymptoms')}
            >
              <Search size={20} color="#ffffff" />
              <Text style={styles.analyzeButtonText}>{t('analyzeSymptoms')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.emergencyNotice}>
          <AlertTriangle size={24} color={highContrast ? '#ffffff' : '#dc2626'} />
          <Text style={styles.emergencyText}>{t('emergencyNotice')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (fontSize: string, highContrast: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: highContrast ? '#000000' : '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize === 'large' ? 28 : 22,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize === 'large' ? 16 : 14,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    textAlign: 'center',
  },
  voiceButton: {
    marginBottom: 30,
  },
  symptomsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: fontSize === 'large' ? 20 : 16,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 16,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomCard: {
    width: '48%',
    backgroundColor: highContrast ? '#333333' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: highContrast ? 0 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedSymptom: {
    borderColor: highContrast ? '#ffffff' : '#2563eb',
    backgroundColor: highContrast ? '#555555' : '#eff6ff',
  },
  symptomIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  symptomName: {
    fontSize: fontSize === 'large' ? 16 : 14,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: highContrast ? '#666666' : '#f3f4f6',
  },
  severityText: {
    fontSize: fontSize === 'large' ? 12 : 10,
    fontFamily: 'OpenSans-SemiBold',
    textTransform: 'uppercase',
  },
  selectedContainer: {
    backgroundColor: highContrast ? '#333333' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: highContrast ? 0 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTitle: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 12,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: highContrast ? '#555555' : '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginRight: 8,
  },
  removeButton: {
    fontSize: 18,
    color: highContrast ? '#ffffff' : '#6b7280',
    fontWeight: 'bold',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: highContrast ? '#ffffff' : '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  analyzeButtonText: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#000000' : '#ffffff',
    marginLeft: 8,
  },
  emergencyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: highContrast ? '#330000' : '#fef2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
  },
  emergencyText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#ffffff' : '#dc2626',
    marginLeft: 12,
    flex: 1,
  },
});