import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpeech } from '@/hooks/useSpeech';

interface VoiceButtonProps {
  onCommand: (command: string) => void;
  style?: any;
  accessibilityLabel?: string;
  prompt?: string;
  size?: 'small' | 'medium' | 'large';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onCommand,
  style,
  accessibilityLabel,
  prompt,
  size = 'large',
}) => {
  const { fontSize, highContrast } = useAccessibility();
  const { t, speak } = useLanguage();
  const { startListening, stopListening, isListening, transcript, isSupported } = useSpeech();

  const handlePress = async () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        onCommand(transcript);
      }
    } else {
      if (prompt) {
        speak(prompt);
        setTimeout(() => {
          startListening();
        }, 1000);
      } else {
        startListening();
      }
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small': return 50;
      case 'medium': return 60;
      case 'large': return 80;
      default: return 80;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'medium': return 24;
      case 'large': return 32;
      default: return 32;
    }
  };

  const styles = createStyles(fontSize, highContrast, getButtonSize());

  if (!isSupported) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.unsupportedText}>{t('voiceNotSupported')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, isListening && styles.buttonActive]}
        onPress={handlePress}
        accessibilityLabel={accessibilityLabel || t('voiceButton')}
        accessibilityRole="button"
        accessibilityState={{ pressed: isListening }}
      >
        {isListening ? (
          <MicOff size={getIconSize()} color={highContrast ? '#000000' : '#ffffff'} />
        ) : (
          <Mic size={getIconSize()} color={highContrast ? '#000000' : '#ffffff'} />
        )}
      </TouchableOpacity>
      
      <Text style={styles.buttonText}>
        {isListening ? t('tapToStop') : t('tapToSpeak')}
      </Text>
      
      {transcript && (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (fontSize: string, highContrast: boolean, buttonSize: number) => StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: highContrast ? '#ffffff' : '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: highContrast ? 0 : 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonActive: {
    backgroundColor: highContrast ? '#ffffff' : '#dc2626',
    transform: [{ scale: 1.1 }],
  },
  buttonText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  transcriptContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: highContrast ? '#333333' : '#f3f4f6',
    borderRadius: 8,
    maxWidth: 250,
  },
  transcriptText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#ffffff' : '#1f2937',
    textAlign: 'center',
  },
  unsupportedText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});