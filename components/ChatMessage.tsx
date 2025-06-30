import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Volume2, User, Bot } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  spoken?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onSpeak: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSpeak }) => {
  const { fontSize, highContrast } = useAccessibility();
  const styles = createStyles(fontSize, highContrast, message.isUser);

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            {message.isUser ? (
              <User size={16} color={highContrast ? '#000000' : '#ffffff'} />
            ) : (
              <Bot size={16} color={highContrast ? '#000000' : '#ffffff'} />
            )}
          </View>
          <Text style={styles.sender}>
            {message.isUser ? 'You' : 'CareCompanion AI'}
          </Text>
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={styles.bubble}>
          <Text style={styles.messageText}>{message.text}</Text>
          
          {!message.isUser && (
            <TouchableOpacity
              style={styles.speakButton}
              onPress={onSpeak}
              accessibilityLabel="Speak message"
            >
              <Volume2 size={16} color={highContrast ? '#ffffff' : '#6b7280'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (fontSize: string, highContrast: boolean, isUser: boolean) => StyleSheet.create({
  container: {
    marginVertical: 4,
    alignItems: isUser ? 'flex-end' : 'flex-start',
  },
  messageContainer: {
    maxWidth: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: isUser 
      ? (highContrast ? '#ffffff' : '#2563eb')
      : (highContrast ? '#ffffff' : '#059669'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sender: {
    fontSize: fontSize === 'large' ? 12 : 10,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#6b7280',
    flex: 1,
  },
  timestamp: {
    fontSize: fontSize === 'large' ? 10 : 8,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#9ca3af',
  },
  bubble: {
    backgroundColor: isUser 
      ? (highContrast ? '#333333' : '#2563eb')
      : (highContrast ? '#333333' : '#f3f4f6'),
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageText: {
    fontSize: fontSize === 'large' ? 16 : 14,
    fontFamily: 'OpenSans-Regular',
    color: isUser 
      ? '#ffffff'
      : (highContrast ? '#ffffff' : '#1f2937'),
    lineHeight: fontSize === 'large' ? 22 : 20,
    flex: 1,
  },
  speakButton: {
    marginLeft: 8,
    padding: 4,
  },
});