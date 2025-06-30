import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface AccessibleCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onPress: () => void;
  style?: any;
  accessibilityLabel?: string;
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  title,
  description,
  icon,
  onPress,
  style,
  accessibilityLabel,
}) => {
  const { fontSize, highContrast } = useAccessibility();
  const styles = createStyles(fontSize, highContrast);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || `${title}. ${description}`}
      accessibilityRole="button"
      accessibilityHint="Tap to interact"
    >
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (fontSize: string, highContrast: boolean) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: highContrast ? '#333333' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: highContrast ? 0 : 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: highContrast ? 1 : 0,
    borderColor: highContrast ? '#666666' : 'transparent',
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSize === 'large' ? 18 : 16,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginBottom: 4,
  },
  description: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
    lineHeight: fontSize === 'large' ? 20 : 18,
  },
});