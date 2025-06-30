import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessibilityContextType {
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  screenReader: boolean;
  setScreenReader: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>('medium');
  const [highContrast, setHighContrastState] = useState(false);
  const [screenReader, setScreenReaderState] = useState(false);

  useEffect(() => {
    loadAccessibilitySettings();
  }, []);

  const loadAccessibilitySettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('accessibility_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setFontSizeState(parsed.fontSize || 'medium');
        setHighContrastState(parsed.highContrast || false);
        setScreenReaderState(parsed.screenReader || false);
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  };

  const saveAccessibilitySettings = async (newSettings: any) => {
    try {
      await AsyncStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size);
    saveAccessibilitySettings({ fontSize: size, highContrast, screenReader });
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    saveAccessibilitySettings({ fontSize, highContrast: enabled, screenReader });
  };

  const setScreenReader = (enabled: boolean) => {
    setScreenReaderState(enabled);
    saveAccessibilitySettings({ fontSize, highContrast, screenReader: enabled });
  };

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      setFontSize,
      highContrast,
      setHighContrast,
      screenReader,
      setScreenReader,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};