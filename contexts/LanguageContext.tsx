import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  speak: (text: string) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    symptoms: 'Symptoms',
    assistant: 'Assistant',
    health: 'Health',
    settings: 'Settings',
    
    // Greetings
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    welcomeToCareCompanion: 'Welcome to CareCompanion AI',
    howCanIHelpToday: 'How can I help you today?',
    
    // Home Screen
    quickActions: 'Quick Actions',
    checkSymptoms: 'Check Symptoms',
    describeSymptoms: 'Describe your symptoms for health insights',
    healthAssistant: 'Health Assistant',
    askHealthQuestions: 'Ask questions about your health',
    emergencyContacts: 'Emergency Contacts',
    quickAccessEmergency: 'Quick access to emergency services',
    recentActivity: 'Recent Activity',
    noRecentActivity: 'No recent activity',
    offlineMode: 'Offline Mode Active',
    dataStoredLocally: 'Your data is stored securely on your device',
    
    // Symptoms
    symptomChecker: 'Symptom Checker',
    selectSymptoms: 'Select your symptoms to get health insights',
    commonSymptoms: 'Common Symptoms',
    headache: 'Headache',
    fever: 'Fever',
    cough: 'Cough',
    fatigue: 'Fatigue',
    nausea: 'Nausea',
    dizziness: 'Dizziness',
    chestPain: 'Chest Pain',
    breathingDifficulty: 'Breathing Difficulty',
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe',
    selectedSymptoms: 'Selected Symptoms',
    analyzeSymptoms: 'Analyze Symptoms',
    emergencyNotice: 'If you have severe symptoms, seek immediate medical attention',
    
    // Voice Commands
    voiceCommandButton: 'Voice Command Button',
    voiceSymptomInput: 'Voice Symptom Input',
    describeYourSymptoms: 'Describe your symptoms',
    youMentioned: 'You mentioned',
    addingToChecker: 'Adding to symptom checker',
    pleaseDescribeSymptoms: 'Please describe your symptoms',
    startingSymptomChecker: 'Starting symptom checker',
    
    // Chat
    aiGreeting: 'Hello! I\'m your health assistant. How can I help you today?',
    typeYourMessage: 'Type your message...',
    sendMessage: 'Send Message',
    voiceInput: 'Voice Input',
    messageInput: 'Message Input',
    enterHealthQuestion: 'Enter your health question',
    aiThinking: 'AI is thinking...',
    aiDisclaimer: 'This AI assistant provides general health information only. Always consult healthcare professionals for medical advice.',
    aiError: 'I apologize, but I encountered an error. Please try again.',
    
    // Health Records
    healthRecords: 'Health Records',
    trackYourHealth: 'Track and monitor your health metrics',
    vitalSigns: 'Vital Signs',
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    temperature: 'Temperature',
    weight: 'Weight',
    bloodSugar: 'Blood Sugar',
    healthInsights: 'Health Insights',
    overallHealth: 'Overall Health',
    yourHealthIsGood: 'Your health metrics are within normal ranges',
    recommendations: 'Recommendations',
    stayHydrated: 'Stay hydrated and maintain regular exercise',
    scheduleAppointment: 'Schedule Appointment',
    exportData: 'Export Data',
    schedule: 'Schedule',
    export: 'Export',
    dataPrivacy: 'Data Privacy',
    yourDataIsSecure: 'Your health data is stored securely on your device',
    
    // Common Actions
    understood: 'Understood',
    takingToSymptoms: 'Taking you to symptom checker',
    emergency: 'Emergency',
    showingEmergencyContacts: 'Showing emergency contacts',
    showingHealthRecords: 'Showing health records',
    didNotUnderstand: 'I didn\'t understand that. Please try again.',
    openingSymptomChecker: 'Opening symptom checker',
    openingHealthAssistant: 'Opening health assistant',
    recorded: 'Recorded',
    
    // Health Metrics
    addMetric: 'Add Metric',
    enterHeartRate: 'Enter Heart Rate (bpm)',
    enterBloodPressure: 'Enter Blood Pressure (mmHg)',
    enterTemperature: 'Enter Temperature (°C)',
    enterWeight: 'Enter Weight (kg)',
    cancel: 'Cancel',
    add: 'Add',
    success: 'Success',
    metricAdded: 'Health metric added successfully',
    
    // Symptom Checker Results
    symptomCheck: 'Symptom Check',
    symptomCheckCompleted: 'Symptom check completed',
    detailedHealthAnalysis: 'Based on your symptoms, here is a detailed health analysis...',
    healthRecommendationsList: 'Here are personalized health recommendations...',
    
    // Settings and About
    appointment: 'Appointment',
    exportHealthData: 'Export health data to secure file',
  },
  es: {
    // Navigation
    home: 'Inicio',
    symptoms: 'Síntomas',
    assistant: 'Asistente',
    health: 'Salud',
    settings: 'Ajustes',
    
    // Greetings  
    goodMorning: 'Buenos Días',
    goodAfternoon: 'Buenas Tardes',
    goodEvening: 'Buenas Noches',
    welcomeToCareCompanion: 'Bienvenido a CareCompanion AI',
    howCanIHelpToday: '¿Cómo puedo ayudarte hoy?',
    
    // Home Screen
    quickActions: 'Acciones Rápidas',
    checkSymptoms: 'Verificar Síntomas',
    describeSymptoms: 'Describe tus síntomas para obtener información de salud',
    healthAssistant: 'Asistente de Salud',
    askHealthQuestions: 'Haz preguntas sobre tu salud',
    emergencyContacts: 'Contactos de Emergencia',
    quickAccessEmergency: 'Acceso rápido a servicios de emergencia',
    recentActivity: 'Actividad Reciente',
    noRecentActivity: 'No hay actividad reciente',
    offlineMode: 'Modo Sin Conexión Activo',
    dataStoredLocally: 'Tus datos se almacenan de forma segura en tu dispositivo',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [voiceEnabled, setVoiceEnabledState] = useState(true);

  useEffect(() => {
    loadLanguageSettings();
  }, []);

  const loadLanguageSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('language_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setCurrentLanguage(parsed.language || 'en');
        setVoiceEnabledState(parsed.voiceEnabled !== false);
      }
    } catch (error) {
      console.error('Error loading language settings:', error);
    }
  };

  const saveLanguageSettings = async (language: string, voice: boolean) => {
    try {
      await AsyncStorage.setItem('language_settings', JSON.stringify({
        language,
        voiceEnabled: voice,
      }));
    } catch (error) {
      console.error('Error saving language settings:', error);
    }
  };

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    saveLanguageSettings(lang, voiceEnabled);
  };

  const setVoiceEnabled = (enabled: boolean) => {
    setVoiceEnabledState(enabled);
    saveLanguageSettings(currentLanguage, enabled);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage as keyof typeof translations];
    return translation?.[key as keyof typeof translation] || key;
  };

  const speak = (text: string) => {
    if (voiceEnabled && Platform.OS !== 'web') {
      Speech.speak(text, {
        language: currentLanguage,
        pitch: 1.0,
        rate: 0.9,
      });
    }
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      speak,
      voiceEnabled,
      setVoiceEnabled,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};