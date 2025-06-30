import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface HealthMetricProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  onPress: () => void;
  normal?: [number, number];
}

export const HealthMetric: React.FC<HealthMetricProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  onPress,
  normal,
}) => {
  const { fontSize, highContrast } = useAccessibility();

  const getTrendIcon = () => {
    const color = highContrast ? '#ffffff' : '#6b7280';
    switch (trend) {
      case 'up': return <TrendingUp size={16} color={color} />;
      case 'down': return <TrendingDown size={16} color={color} />;
      case 'stable': return <Minus size={16} color={color} />;
    }
  };

  const isNormal = () => {
    if (!normal || value === 0) return true;
    return value >= normal[0] && value <= normal[1];
  };

  const styles = createStyles(fontSize, highContrast, isNormal());

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityLabel={`${title}: ${value} ${unit}`}
    >
      <View style={styles.header}>
        {icon}
        <View style={styles.trendContainer}>
          {getTrendIcon()}
        </View>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {value > 0 ? value : '--'}
        </Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      
      {normal && (
        <Text style={styles.normalRange}>
          Normal: {normal[0]}-{normal[1]} {unit}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (fontSize: string, highContrast: boolean, isNormal: boolean) => StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: highContrast ? '#333333' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: highContrast ? 0 : 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: isNormal 
      ? (highContrast ? '#666666' : 'transparent')
      : (highContrast ? '#ffffff' : '#f59e0b'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendContainer: {
    opacity: 0.7,
  },
  title: {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-SemiBold',
    color: highContrast ? '#ffffff' : '#6b7280',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  value: {
    fontSize: fontSize === 'large' ? 24 : 20,
    fontFamily: 'OpenSans-Bold',
    color: highContrast ? '#ffffff' : '#1f2937',
    marginRight: 4,
  },
  unit: {
    fontSize: fontSize === 'large' ? 12 : 10,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#6b7280',
  },
  normalRange: {
    fontSize: fontSize === 'large' ? 10 : 8,
    fontFamily: 'OpenSans-Regular',
    color: highContrast ? '#cccccc' : '#9ca3af',
    fontStyle: 'italic',
  },
});