import { Tabs } from 'expo-router';
import { Heart, Stethoscope, MessageCircle, Settings, Home } from 'lucide-react-native';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { fontSize, highContrast } = useAccessibility();
  const { t } = useLanguage();

  const tabBarStyle = {
    backgroundColor: highContrast ? '#000000' : '#ffffff',
    borderTopColor: highContrast ? '#ffffff' : '#e5e5e5',
    height: 70,
    paddingBottom: 10,
  };

  const tabBarLabelStyle = {
    fontSize: fontSize === 'large' ? 14 : 12,
    fontFamily: 'OpenSans-SemiBold',
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarLabelStyle,
        tabBarActiveTintColor: highContrast ? '#ffffff' : '#2563eb',
        tabBarInactiveTintColor: highContrast ? '#888888' : '#6b7280',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="symptoms"
        options={{
          title: t('symptoms'),
          tabBarIcon: ({ size, color }) => (
            <Stethoscope size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t('assistant'),
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: t('health'),
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}