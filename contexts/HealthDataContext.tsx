import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  date: string;
  unit: string;
}

interface SymptomRecord {
  id: string;
  name: string;
  date: string;
  symptoms?: string[];
  results?: any;
  description: string;
}

interface HealthDataContextType {
  healthMetrics: HealthMetric[];
  recentSymptoms: SymptomRecord[];
  addHealthMetric: (metric: HealthMetric) => void;
  addSymptom: (symptom: SymptomRecord) => void;
  clearAllData: () => void;
  exportData: () => Promise<string>;
  lastCheckup: string | null;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [recentSymptoms, setRecentSymptoms] = useState<SymptomRecord[]>([]);
  const [lastCheckup, setLastCheckup] = useState<string | null>(null);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const metricsData = await AsyncStorage.getItem('health_metrics');
      const symptomsData = await AsyncStorage.getItem('recent_symptoms');
      const checkupData = await AsyncStorage.getItem('last_checkup');

      if (metricsData) {
        setHealthMetrics(JSON.parse(metricsData));
      }
      if (symptomsData) {
        setRecentSymptoms(JSON.parse(symptomsData));
      }
      if (checkupData) {
        setLastCheckup(checkupData);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const saveHealthData = async (metrics: HealthMetric[], symptoms: SymptomRecord[]) => {
    try {
      await AsyncStorage.setItem('health_metrics', JSON.stringify(metrics));
      await AsyncStorage.setItem('recent_symptoms', JSON.stringify(symptoms));
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  };

  const addHealthMetric = (metric: HealthMetric) => {
    const newMetrics = [...healthMetrics, metric];
    setHealthMetrics(newMetrics);
    saveHealthData(newMetrics, recentSymptoms);
  };

  const addSymptom = (symptom: SymptomRecord) => {
    const newSymptoms = [symptom, ...recentSymptoms].slice(0, 50); // Keep last 50 records
    setRecentSymptoms(newSymptoms);
    saveHealthData(healthMetrics, newSymptoms);
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove(['health_metrics', 'recent_symptoms', 'last_checkup']);
      setHealthMetrics([]);
      setRecentSymptoms([]);
      setLastCheckup(null);
    } catch (error) {
      console.error('Error clearing health data:', error);
    }
  };

  const exportData = async (): Promise<string> => {
    const exportData = {
      healthMetrics,
      recentSymptoms,
      lastCheckup,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(exportData, null, 2);
  };

  return (
    <HealthDataContext.Provider value={{
      healthMetrics,
      recentSymptoms,
      addHealthMetric,
      addSymptom,
      clearAllData,
      exportData,
      lastCheckup,
    }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within HealthDataProvider');
  }
  return context;
};