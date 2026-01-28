import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import * as NotificationService from '../services/NotificationService';

const TIMES = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '21:00', '22:00',
];

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useApp();
  
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (settings) {
      setReminderEnabled(settings.reminderEnabled || false);
      setReminderTime(settings.reminderTime || '08:00');
      setSoundEnabled(settings.soundEnabled !== false);
      setHapticEnabled(settings.hapticEnabled !== false);
    }
  }, [settings]);

  const handleReminderToggle = async (value) => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setReminderEnabled(value);
    
    const success = await NotificationService.toggleReminders(value, reminderTime);
    
    if (value && !success) {
      Alert.alert(
        'Разрешение не получено',
        'Пожалуйста, разрешите уведомления в настройках телефона',
        [
          { text: 'ОК', onPress: () => setReminderEnabled(false) }
        ]
      );
    } else {
      await updateSettings({ reminderEnabled: value });
    }
  };

  const handleTimeChange = async (time) => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setReminderTime(time);
    setShowTimePicker(false);
    
    if (reminderEnabled) {
      await NotificationService.updateReminderTime(time);
    }
    await updateSettings({ reminderTime: time });
  };

  const handleSoundToggle = async (value) => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSoundEnabled(value);
    await updateSettings({ soundEnabled: value });
  };

  const handleHapticToggle = async (value) => {
    if (value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setHapticEnabled(value);
    await updateSettings({ hapticEnabled: value });
  };

  const handleTestNotification = async () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const success = await NotificationService.sendTestNotification();
    
    if (success) {
      Alert.alert('✅', 'Тестовое уведомление отправлено!\nОно придёт через 2 секунды');
    } else {
      Alert.alert('Ошибка', 'Не удалось отправить уведомление. Проверьте разрешения.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройки</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Уведомления</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={22} color={COLORS.gold} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Напоминания</Text>
                  <Text style={styles.settingDesc}>Ежедневное напоминание о практике</Text>
                </View>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={handleReminderToggle}
                trackColor={{ false: COLORS.bgCard, true: COLORS.gold + '60' }}
                thumbColor={reminderEnabled ? COLORS.gold : COLORS.textMuted}
                ios_backgroundColor={COLORS.bgCard}
              />
            </View>

            {reminderEnabled && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity 
                  style={styles.settingRow}
                  onPress={() => setShowTimePicker(!showTimePicker)}
                >
                  <View style={styles.settingInfo}>
                    <Ionicons name="time-outline" size={22} color={COLORS.textSecondary} />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Время</Text>
                      <Text style={styles.settingDesc}>Когда напоминать</Text>
                    </View>
                  </View>
                  <View style={styles.timeValue}>
                    <Text style={styles.timeText}>{reminderTime}</Text>
                    <Ionicons 
                      name={showTimePicker ? 'chevron-up' : 'chevron-down'} 
                      size={16} 
                      color={COLORS.textMuted} 
                    />
                  </View>
                </TouchableOpacity>

                {showTimePicker && (
                  <View style={styles.timePicker}>
                    {TIMES.map(time => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeOption,
                          time === reminderTime && styles.timeOptionActive,
                        ]}
                        onPress={() => handleTimeChange(time)}
                      >
                        <Text style={[
                          styles.timeOptionText,
                          time === reminderTime && styles.timeOptionTextActive,
                        ]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>

          {/* Test notification button */}
          {reminderEnabled && (
            <TouchableOpacity 
              style={styles.testButton}
              onPress={handleTestNotification}
            >
              <Ionicons name="paper-plane-outline" size={18} color={COLORS.gold} />
              <Text style={styles.testButtonText}>Тестовое уведомление</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sound & Haptic Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Звуки и вибрация</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="volume-high-outline" size={22} color={COLORS.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Звуки</Text>
                  <Text style={styles.settingDesc}>Звук начала и конца медитации</Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={handleSoundToggle}
                trackColor={{ false: COLORS.bgCard, true: COLORS.gold + '60' }}
                thumbColor={soundEnabled ? COLORS.gold : COLORS.textMuted}
                ios_backgroundColor={COLORS.bgCard}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="phone-portrait-outline" size={22} color={COLORS.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Вибрация</Text>
                  <Text style={styles.settingDesc}>Тактильная обратная связь</Text>
                </View>
              </View>
              <Switch
                value={hapticEnabled}
                onValueChange={handleHapticToggle}
                trackColor={{ false: COLORS.bgCard, true: COLORS.gold + '60' }}
                thumbColor={hapticEnabled ? COLORS.gold : COLORS.textMuted}
                ios_backgroundColor={COLORS.bgCard}
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О приложении</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="information-circle-outline" size={22} color={COLORS.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Версия</Text>
                  <Text style={styles.settingDesc}>1.0.0</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="document-text-outline" size={22} color={COLORS.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Условия использования</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Политика конфиденциальности</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>Эксперт Медитации</Text>
          <Text style={styles.creditsSubtext}>Золотая Коллекция практик</Text>
          <Text style={styles.creditsSubtext}>© 2026 Утро Майя</Text>
        </View>

        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  settingCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  settingDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderCard,
    marginLeft: SPACING.md + 22 + SPACING.md,
  },
  timeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.bgPrimary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gold,
  },
  timePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    paddingTop: 0,
    gap: SPACING.xs,
  },
  timeOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.bgPrimary,
  },
  timeOptionActive: {
    backgroundColor: COLORS.goldDim,
    borderWidth: 1,
    borderColor: COLORS.gold + '50',
  },
  timeOptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  timeOptionTextActive: {
    color: COLORS.gold,
    fontWeight: '600',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
    borderStyle: 'dashed',
  },
  testButtonText: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '500',
  },
  credits: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  creditsText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  creditsSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
