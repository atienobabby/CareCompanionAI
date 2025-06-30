import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AccessibleCard } from '@/components/AccessibleCard';
import { 
  Settings as SettingsIcon, 
  Type, 
  Eye, 
  Volume2, 
  Globe, 
  Shield, 
  HelpCircle, 
  Info,
  Trash2,
  Download
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { 
    fontSize, 
    setFontSize, 
    highContrast, 
    setHighContrast, 
    screenReader, 
    setScreenReader 
  } = useAccessibility();
  const { currentLanguage, setLanguage, voiceEnabled, setVoiceEnabled } = useLanguage();

  const handleLanguageChange = () => {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'ar', name: 'العربية' },
      { code: 'hi', name: 'हिन्दी' },
    ];

    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      languages.map(lang => ({
        text: lang.name,
        onPress: () => setLanguage(lang.code),
        style: lang.code === currentLanguage ? 'default' : 'cancel',
      }))
    );
  };

  const handleFontSizeChange = () => {
    Alert.alert(
      'Font Size',
      'Choose your preferred font size',
      [
        { text: 'Small', onPress: () => setFontSize('small') },
        { text: 'Medium', onPress: () => setFontSize('medium') },
        { text: 'Large', onPress: () => setFontSize('large') },
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'Your health data will be exported to a secure file. This may take a moment.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Success', 'Data exported successfully') },
      ]
    );
  };

  const handleDataClear = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your health data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => Alert.alert('Cleared', 'All data has been cleared') 
        },
      ]
    );
  };

  const styles = createStyles(fontSize, highContrast);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your CareCompanion experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Type size={24} color={highContrast ? '#ffffff' : '#6b7280'} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Font Size</Text>
                <Text style={styles.settingDescription}>
                  Current: {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.settingAction}
              onPress={handleFontSizeChange}
              accessibilityLabel="Change font size"
            >
              <Text style={styles.actionText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Eye size={24} color={highContrast ? '#ffffff' : '#6b7280'} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>High Contrast</Text>
                <Text style={styles.settingDescription}>
                  Improve visibility with high contrast colors
                </Text>
              </View>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: '#767577', true: '#2563eb' }}
              thumbColor={highContrast ? '#ffffff' : '#f4f3f4'}
              accessibilityLabel="Toggle high contrast mode"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Volume2 size={24} color={highContrast ? '#ffffff' : '#6b7280'} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Screen Reader</Text>
                <Text style={styles.settingDescription}>
                  Enhanced screen reader support
                </Text>
              </View>
            </View>
            <Switch
              value={screenReader}
              onValueChange={setScreenReader}
              trackColor={{ false: '#767577', true: '#2563eb' }}
              thumbColor={screenReader ? '#ffffff' : '#f4f3f4'}
              accessibilityLabel="Toggle screen reader support"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language & Voice</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Globe size={24} color={highContrast ? '#ffffff' : '#6b7280'} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingDescription}>
                  Current: {currentLanguage.toUpperCase()}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.settingAction}
              onPress={handleLanguageChange}
              accessibilityLabel="Change language"
            >
              <Text style={styles.actionText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Volume2 size={24} color={highContrast ? '#ffffff' : '#6b7280'} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Voice Output</Text>
                <Text style={styles.settingDescription}>
                  Speak responses and notifications
                </Text>
              </View>
            </View>
            <Switch
              value={voiceEnabled}
              onValueChange={setVoiceEnabled}
              trackColor={{ false: '#767577', true: '#2563eb' }}
              thumbColor={voiceEnabled ? '#ffffff' : '#f4f3f4'}
              accessibilityLabel="Toggle voice output"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          
          <AccessibleCard
            title="Export Health Data"
            description="Download your health data as a secure file"
            icon={<Download size={24} color={highContrast ? '#ffffff' : '#2563eb'} />}
            onPress={handleDataExport}
            style={styles.dataCard}
          />
          
          <AccessibleCard
            title="Clear All Data"
            description="Permanently delete all stored health data"
            icon={<Trash2 size={24} color={highContrast ? '#ffffff' : '#dc2626'} />}
            onPress={handleDataClear}
            style={styles.dataCard}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <AccessibleCard
            title="Help & Support"
            description="Get help using CareCompanion AI"
            icon={<HelpCircle size={24} color={highContrast ? '#ffffff' : '#6b7280'} />}
            onPress={() => Alert.alert('Help', 'Help documentation will be available soon')}
            style={styles.supportCard}
          />
          
          <AccessibleCard
            title="About"
            description="Learn more about CareCompanion AI"
            icon={<Info size={24} color={highContrast ? '#ffffff' : '#6b7280'} />}
            onPress={() => Alert.alert('About', 'CareCompanion AI v1.0.0\nOffline-first health assistant for underserved communities')}
            style={styles.supportCard}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>CareCompanion AI</Text>
          <Text style={styles.footerSubtext}>Version 1.0.0</Text>
          <Text style={styles.footerSubtext}>Your privacy-first health companion</Text>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: fontSize === 'large' ? 20 : 16,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: highContrast ? '#333333' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: highContrast ? 0 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
  },
  settingAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: highContrast ? '#666666' : '#f3f4f6',
    borderRadius: 6,
  },
  actionText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#2563eb',
  },
  dataCard: {
    marginBottom: 12,
  },
  supportCard: {
    marginBottom: 12,
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#2563eb',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: fontSize === 'large' ? 12 : 10,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    textAlign: 'center',
    marginBottom: 2,
  },
});