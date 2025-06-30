import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHealthData } from '@/contexts/HealthDataContext';
import { AccessibleCard } from '@/components/AccessibleCard';
import { HealthMetric } from '@/components/HealthMetric';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Scale, 
  Calendar, 
  Plus, 
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react-native';

export default function HealthScreen() {
  const { fontSize, highContrast } = useAccessibility();
  const { t } = useLanguage();
  const { healthMetrics, recentSymptoms, addHealthMetric } = useHealthData();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const handleAddMetric = (type: string) => {
    Alert.prompt(
      t('addMetric'),
      t(`enter${type.charAt(0).toUpperCase() + type.slice(1)}`),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('add'), 
          onPress: (value) => {
            if (value && !isNaN(Number(value))) {
              addHealthMetric({
                id: Date.now().toString(),
                type,
                value: Number(value),
                date: new Date().toISOString(),
                unit: getUnitForMetric(type),
              });
              Alert.alert(t('success'), t('metricAdded'));
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const getUnitForMetric = (type: string) => {
    switch (type) {
      case 'bloodPressure': return 'mmHg';
      case 'heartRate': return 'bpm';
      case 'temperature': return '°C';
      case 'weight': return 'kg';
      case 'bloodSugar': return 'mg/dL';
      default: return '';
    }
  };

  const getLatestMetric = (type: string) => {
    const metrics = healthMetrics.filter(m => m.type === type);
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  };

  const styles = createStyles(fontSize, highContrast);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('healthRecords')}</Text>
          <Text style={styles.subtitle}>{t('trackYourHealth')}</Text>
        </View>

        <View style={styles.quickMetrics}>
          <Text style={styles.sectionTitle}>{t('vitalSigns')}</Text>
          
          <View style={styles.metricsGrid}>
            <HealthMetric
              title={t('heartRate')}
              value={getLatestMetric('heartRate')?.value || 0}
              unit="bpm"
              icon={<Heart size={24} color={highContrast ? '#ffffff' : '#dc2626'} />}
              trend="stable"
              onPress={() => handleAddMetric('heartRate')}
              normal={[60, 100]}
            />
            
            <HealthMetric
              title={t('bloodPressure')}
              value={getLatestMetric('bloodPressure')?.value || 0}
              unit="mmHg"
              icon={<Activity size={24} color={highContrast ? '#ffffff' : '#2563eb'} />}
              trend="up"
              onPress={() => handleAddMetric('bloodPressure')}
              normal={[80, 120]}
            />
            
            <HealthMetric
              title={t('temperature')}
              value={getLatestMetric('temperature')?.value || 0}
              unit="°C"
              icon={<Thermometer size={24} color={highContrast ? '#ffffff' : '#f59e0b'} />}
              trend="stable"
              onPress={() => handleAddMetric('temperature')}
              normal={[36.1, 37.2]}
            />
            
            <HealthMetric
              title={t('weight')}
              value={getLatestMetric('weight')?.value || 0}
              unit="kg"
              icon={<Scale size={24} color={highContrast ? '#ffffff' : '#059669'} />}
              trend="down"
              onPress={() => handleAddMetric('weight')}
              normal={[50, 100]}
            />
          </View>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
          
          {recentSymptoms.length > 0 ? (
            recentSymptoms.slice(0, 5).map((symptom, index) => (
              <AccessibleCard
                key={index}
                title={symptom.name}
                description={`${symptom.date} • ${symptom.description}`}
                icon={<Clock size={20} color={highContrast ? '#ffffff' : '#6b7280'} />}
                onPress={() => Alert.alert(symptom.name, symptom.description)}
                style={styles.activityCard}
              />
            ))
          ) : (
            <Text style={styles.noData}>{t('noRecentActivity')}</Text>
          )}
        </View>

        <View style={styles.healthInsights}>
          <Text style={styles.sectionTitle}>{t('healthInsights')}</Text>
          
          <AccessibleCard
            title={t('overallHealth')}
            description={t('yourHealthIsGood')}
            icon={<TrendingUp size={24} color={highContrast ? '#ffffff' : '#059669'} />}
            onPress={() => Alert.alert(t('healthInsights'), t('detailedHealthAnalysis'))}
            style={styles.insightCard}
          />
          
          <AccessibleCard
            title={t('recommendations')}
            description={t('stayHydrated')}
            icon={<AlertCircle size={24} color={highContrast ? '#ffffff' : '#2563eb'} />}
            onPress={() => Alert.alert(t('recommendations'), t('healthRecommendationsList'))}
            style={styles.insightCard}
          />
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Alert.alert(t('appointment'), t('scheduleAppointment'))}
              accessibilityLabel={t('scheduleAppointment')}
            >
              <Calendar size={24} color={highContrast ? '#000000' : '#ffffff'} />
              <Text style={styles.actionButtonText}>{t('schedule')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Alert.alert(t('export'), t('exportHealthData'))}
              accessibilityLabel={t('exportData')}
            >
              <TrendingUp size={24} color={highContrast ? '#000000' : '#ffffff'} />
              <Text style={styles.actionButtonText}>{t('export')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('dataPrivacy')}</Text>
          <Text style={styles.footerSubtext}>{t('yourDataIsSecure')}</Text>
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
  quickMetrics: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: fontSize === 'large' ? 20 : 16,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recentActivity: {
    marginBottom: 30,
  },
  activityCard: {
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
  healthInsights: {
    marginBottom: 30,
  },
  insightCard: {
    marginBottom: 12,
  },
  quickActions: {
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: highContrast ? '#ffffff' : '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: fontSize === 'large' ? 16 : 14,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#000000' : '#ffffff',
    marginLeft: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#059669',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: fontSize === 'large' ? 12 : 10,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
});