import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { VoiceButton } from '@/components/VoiceButton';
import { ChatMessage } from '@/components/ChatMessage';
import { HealthAI } from '@/utils/HealthAI';
import { Send, Mic, Volume2 } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  spoken?: boolean;
}

export default function ChatScreen() {
  const { fontSize, highContrast } = useAccessibility();
  const { t, speak } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('aiGreeting'),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const healthAI = useRef(new HealthAI()).current;

  useEffect(() => {
    // Speak the initial greeting
    setTimeout(() => {
      speak(t('aiGreeting'));
    }, 500);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    try {
      const response = await healthAI.processMessage(text.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the AI response
      setTimeout(() => {
        speak(response);
      }, 500);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('aiError'),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      speak(t('aiError'));
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceCommand = async (command: string) => {
    await handleSendMessage(command);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const styles = createStyles(fontSize, highContrast);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('healthAssistant')}</Text>
          <Text style={styles.subtitle}>{t('askHealthQuestions')}</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onSpeak={() => speak(message.text)}
            />
          ))}
          
          {isThinking && (
            <View style={styles.thinkingContainer}>
              <Text style={styles.thinkingText}>{t('aiThinking')}</Text>
              <View style={styles.typingIndicator}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <VoiceButton
            onCommand={handleVoiceCommand}
            style={styles.voiceInputButton}
            accessibilityLabel={t('voiceInput')}
            size="small"
          />
          
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('typeYourMessage')}
            placeholderTextColor={highContrast ? '#888888' : '#9ca3af'}
            multiline
            maxLength={500}
            accessibilityLabel={t('messageInput')}
            accessibilityHint={t('enterHealthQuestion')}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isThinking}
            accessibilityLabel={t('sendMessage')}
          >
            <Send size={20} color={inputText.trim() ? '#ffffff' : '#9ca3af'} />
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{t('aiDisclaimer')}</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (fontSize: string, highContrast: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: highContrast ? '#000000' : '#f8fafc',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: highContrast ? '#333333' : '#e5e7eb',
  },
  title: {
    fontSize: fontSize === 'large' ? 24 : 20,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 8,
  },
  thinkingText: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    marginRight: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: highContrast ? '#666666' : '#9ca3af',
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: highContrast ? '#333333' : '#e5e7eb',
    backgroundColor: highContrast ? '#111111' : '#ffffff',
  },
  voiceInputButton: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: highContrast ? '#666666' : '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: fontSize === 'large' ? 16 : 14,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#ffffff' : '#1f2937',
    backgroundColor: highContrast ? '#333333' : '#ffffff',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: highContrast ? '#333333' : '#e5e7eb',
  },
  disclaimer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: highContrast ? '#111111' : '#ffffff',
  },
  disclaimerText: {
    fontSize: fontSize === 'large' ? 10 : 8,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#888888' : '#9ca3af',
    textAlign: 'center',
  },
});