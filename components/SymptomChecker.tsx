import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, AlertTriangle, CheckCircle, Info } from 'lucide-react-native';
import { HealthAI } from '@/utils/HealthAI';

interface SymptomCheckerProps {
  selectedSymptoms: string[];
  onBack: () => void;
  onComplete: (results: any) => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({
  selectedSymptoms,
  onBack,
  onComplete,
}) => {
  const { fontSize, highContrast } = useAccessibility();
  const { t } = useLanguage();
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);
    
    try {
      const healthAI = new HealthAI();
      const analysis = await healthAI.analyzeSymptoms(selectedSymptoms);
      setResults(analysis);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setResults({
        severity: 'mild',
        recommendations: ['Please consult with a healthcare professional'],
        summary: 'Unable to analyze symptoms at this time',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  React.useEffect(() => {
    if (selectedSymptoms.length > 0) {
      analyzeSymptoms();
    }
  }, [selectedSymptoms]);

  const getSeverityColor = (severity: string) => {
    if (highContrast) return '#ffffff';
    switch (severity) {
      case 'mild': return '#059669';
      case 'moderate': return '#d97706';
      case 'severe': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    const color = getSeverityColor(severity);
    switch (severity) {
      case 'mild': return <CheckCircle size={24} color={color} />;
      case 'moderate': return <Info size={24} color={color} />;
      case 'severe': return <AlertTriangle size={24} color={color} />;
      default: return <Info size={24} color={color} />;
    }
  };

  const styles = createStyles(fontSize, highContrast);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color={highContrast ? '#ffffff' : '#6b7280'} />
        </TouchableOpacity>
        <Text style={styles.title}>Symptom Analysis</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isAnalyzing ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Analyzing your symptoms...</Text>
            <Text style={styles.loadingSubtext}>This may take a few moments</Text>
          </View>
        ) : results ? (
          <View style={styles.resultsContainer}>
            <View style={styles.severityCard}>
              <View style={styles.severityHeader}>
                {getSeverityIcon(results.severity)}
                <Text style={styles.severityTitle}>
                  {results.severity?.charAt(0).toUpperCase() + results.severity?.slice(1)} Severity
                </Text>
              </View>
              <Text style={styles.severityDescription}>
                {results.summary || 'Analysis completed'}
              </Text>
            </View>

            <View style={styles.recommendationsContainer}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {results.recommendations?.map((recommendation: string, index: number) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>• {recommendation}</Text>
                </View>
              ))}
            </View>

            {results.severity === 'severe' && (
              <View style={styles.emergencyNotice}>
                <AlertTriangle size={24} color={highContrast ? '#ffffff' : '#dc2626'} />
                <Text style={styles.emergencyText}>
                  If you are experiencing severe symptoms, please seek immediate medical attention.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => onComplete(results)}
              accessibilityLabel="Save results and continue"
            >
              <Text style={styles.completeButtonText}>Save Results</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Preparing analysis...</Text>
          </View>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This analysis is for informational purposes only and should not replace professional medical advice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (fontSize: string, highContrast: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: highContrast ? '#000000' : '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: highContrast ? '#333333' : '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: fontSize === 'large' ? 24 : 20,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
  },
  resultsContainer: {
    paddingVertical: 20,
  },
  severityCard: {
    backgroundColor: highContrast ? '#333333' : '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: highContrast ? 0 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  severityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityTitle: {
    fontSize: fontSize === 'large' ? 20 : 18,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginLeft: 12,
  },
  severityDescription: {
    fontSize: fontSize === 'large' ? 16 : 14,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    lineHeight: fontSize === 'large' ? 24 : 20,
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 12,
  },
  recommendationItem: {
    backgroundColor: highContrast ? '#333333' : '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: highContrast ? 0 : 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recommendationText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#ffffff' : '#1f2937',
    lineHeight: fontSize === 'large' ? 20 : 18,
  },
  emergencyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: highContrast ? '#330000' : '#fef2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  emergencyText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#dc2626',
    marginLeft: 12,
    flex: 1,
  },
  completeButton: {
    backgroundColor: highContrast ? '#ffffff' : '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButtonText: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#000000' : '#ffffff',
  },
  disclaimer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: highContrast ? '#333333' : '#f9fafb',
    borderRadius: 8,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: fontSize === 'large' ? 12 : 10,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    textAlign: 'center',
    lineHeight: fontSize === 'large' ? 18 : 16,
  },
});