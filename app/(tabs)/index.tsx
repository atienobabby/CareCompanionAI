import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHealthData } from '@/contexts/HealthDataContext';
import { VoiceButton } from '@/components/VoiceButton';
import { AccessibleCard } from '@/components/AccessibleCard';
import { EmergencyCard } from '@/components/EmergencyCard';
import { Heart, AlertTriangle, Clock, Phone, Mic, Volume2 } from 'lucide-react-native';
import { useSpeech } from '@/hooks/useSpeech';
import { Platform } from 'react-native';

export default function HomeScreen() {
  const { fontSize, highContrast, screenReader } = useAccessibility();
  const { t, speak } = useLanguage();
  const { recentSymptoms, lastCheckup } = useHealthData();
  const { isListening, isSupported } = useSpeech();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('goodMorning'));
    else if (hour < 17) setGreeting(t('goodAfternoon'));
    else setGreeting(t('goodEvening'));
  }, [t]);

  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('symptom') || lowerCommand.includes('pain') || lowerCommand.includes('hurt')) {
      // Navigate to symptoms checker
      Alert.alert(t('understood'), t('takingToSymptoms'));
    } else if (lowerCommand.includes('emergency') || lowerCommand.includes('help')) {
      // Show emergency contacts
      Alert.alert(t('emergency'), t('showingEmergencyContacts'));
    } else if (lowerCommand.includes('health') || lowerCommand.includes('record')) {
      // Navigate to health records
      Alert.alert(t('understood'), t('showingHealthRecords'));
    } else {
      speak(t('didNotUnderstand'));
    }
  };

  const styles = createStyles(fontSize, highContrast);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.welcome}>{t('welcomeToCareCompanion')}</Text>
          <Text style={styles.subtitle}>{t('howCanIHelpToday')}</Text>
        </View>

        <VoiceButton
          onCommand={handleVoiceCommand}
          style={styles.voiceButton}
          accessibilityLabel={t('voiceCommandButton')}
        />

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
          
          <AccessibleCard
            title={t('checkSymptoms')}
            description={t('describeSymptoms')}
            icon={<AlertTriangle size={24} color={highContrast ? '#ffffff' : '#dc2626'} />}
            onPress={() => Alert.alert(t('symptoms'), t('openingSymptomChecker'))}
            style={styles.actionCard}
          />

          <AccessibleCard
            title={t('healthAssistant')}
            description={t('askHealthQuestions')}
            icon={<Heart size={24} color={highContrast ? '#ffffff' : '#dc2626'} />}
            onPress={() => Alert.alert(t('assistant'), t('openingHealthAssistant'))}
            style={styles.actionCard}
          />

          <AccessibleCard
            title={t('emergencyContacts')}
            description={t('quickAccessEmergency')}
            icon={<Phone size={24} color={highContrast ? '#ffffff' : '#dc2626'} />}
            onPress={() => Alert.alert(t('emergency'), t('showingEmergencyContacts'))}
            style={styles.actionCard}
          />
        </View>

        <EmergencyCard />

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
          
          {recentSymptoms.length > 0 ? (
            recentSymptoms.slice(0, 3).map((symptom, index) => (
              <AccessibleCard
                key={index}
                title={symptom.name}
                description={`${t('recorded')}: ${symptom.date}`}
                icon={<Clock size={20} color={highContrast ? '#ffffff' : '#6b7280'} />}
                onPress={() => Alert.alert(symptom.name, symptom.description)}
                style={styles.historyCard}
              />
            ))
          ) : (
            <Text style={styles.noData}>{t('noRecentActivity')}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('offlineMode')}</Text>
          <Text style={styles.footerSubtext}>{t('dataStoredLocally')}</Text>
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
    paddingBottom: 30,
    alignItems: 'center',
  },
  greeting: {
    fontSize: fontSize === 'large' ? 32 : 24,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcome: {
    fontSize: fontSize === 'large' ? 24 : 18,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#2563eb',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    textAlign: 'center',
  },
  voiceButton: {
    marginBottom: 30,
  },
  quickActions: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: fontSize === 'large' ? 22 : 18,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 12,
  },
  recentActivity: {
    marginBottom: 30,
  },
  historyCard: {
    marginBottom: 8,
  },
  noData: {
    fontSize: fontSize === 'large' ? 16 : 14,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize === 'large' ? 16 : 14,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#059669',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
});