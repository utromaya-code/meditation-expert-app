import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const DURATION_OPTIONS = [
  { value: 300, label: '5 мин', icon: '⚡', desc: 'Быстрая' },
  { value: 600, label: '10 мин', icon: '🧘', desc: 'Стандартная' },
  { value: 900, label: '15 мин', icon: '🌿', desc: 'Комфортная' },
  { value: 1200, label: '20 мин', icon: '✨', desc: 'Глубокая' },
  { value: 1800, label: '30 мин', icon: '🌟', desc: 'Продолжительная' },
];

const BACKGROUND_SOUNDS = [
  { id: 'none', name: 'Без звука', icon: '🔇', color: COLORS.textMuted },
  { id: 'rain', name: 'Дождь', icon: '🌧️', color: '#60a5fa' },
  { id: 'ocean', name: 'Океан', icon: '🌊', color: '#2dd4bf' },
  { id: 'forest', name: 'Лес', icon: '🌲', color: '#10b981' },
  { id: 'fire', name: 'Костёр', icon: '🔥', color: '#f59e0b' },
  { id: 'wind', name: 'Ветер', icon: '💨', color: '#a78bfa' },
];

export default function MeditationSetupScreen({ route, navigation }) {
  const { practice } = route.params;
  const insets = useSafeAreaInsets();
  const { settings } = useApp();
  
  const [selectedDuration, setSelectedDuration] = useState(settings?.defaultDuration || 600);
  const [selectedSound, setSelectedSound] = useState('none');
  const [intervalEnabled, setIntervalEnabled] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(5);

  const handleStart = () => {
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    navigation.navigate('Player', {
      practice,
      duration: selectedDuration,
      backgroundSound: selectedSound,
      intervalEnabled,
      intervalMinutes,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройка</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Practice Info */}
        <View style={styles.practiceCard}>
          <View style={[styles.practiceIcon, { backgroundColor: practice.colorDim }]}>
            <Text style={{ fontSize: 32 }}>{practice.icon}</Text>
          </View>
          <View style={styles.practiceInfo}>
            <Text style={styles.practiceTitle}>{practice.title}</Text>
            <Text style={styles.practiceSubtitle}>{practice.subtitle}</Text>
          </View>
        </View>

        {/* Duration Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Длительность</Text>
          <View style={styles.optionsGrid}>
            {DURATION_OPTIONS.map(option => {
              const isSelected = selectedDuration === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                    isSelected && { borderColor: practice.color },
                  ]}
                  onPress={() => {
                    if (Haptics) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setSelectedDuration(option.value);
                  }}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionDesc}>{option.desc}</Text>
                  {isSelected && (
                    <View style={[styles.checkmark, { backgroundColor: practice.color }]}>
                      <Ionicons name="checkmark" size={16} color={COLORS.bgPrimary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Background Sounds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Фоновый звук</Text>
          <View style={styles.soundsGrid}>
            {BACKGROUND_SOUNDS.map(sound => {
              const isSelected = selectedSound === sound.id;
              return (
                <TouchableOpacity
                  key={sound.id}
                  style={[
                    styles.soundCard,
                    isSelected && styles.soundCardSelected,
                    isSelected && { borderColor: sound.color },
                  ]}
                  onPress={() => {
                    if (Haptics) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setSelectedSound(sound.id);
                  }}
                >
                  <Text style={styles.soundIcon}>{sound.icon}</Text>
                  <Text style={[
                    styles.soundName,
                    isSelected && { color: sound.color },
                  ]}>
                    {sound.name}
                  </Text>
                  {isSelected && (
                    <View style={[styles.soundCheckmark, { backgroundColor: sound.color }]}>
                      <Ionicons name="checkmark" size={12} color={COLORS.bgPrimary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Interval Settings */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Ionicons name="timer-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.toggleText}>
                <Text style={styles.toggleLabel}>Интервальные сигналы</Text>
                <Text style={styles.toggleDesc}>Мягкие звуки каждые N минут</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.toggleSwitch,
                intervalEnabled && styles.toggleSwitchActive,
              ]}
              onPress={() => {
                if (Haptics) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setIntervalEnabled(!intervalEnabled);
              }}
            >
              <View style={[
                styles.toggleThumb,
                intervalEnabled && styles.toggleThumbActive,
              ]} />
            </TouchableOpacity>
          </View>

          {intervalEnabled && (
            <View style={styles.intervalOptions}>
              {[3, 5, 10, 15].map(minutes => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.intervalOption,
                    intervalMinutes === minutes && styles.intervalOptionActive,
                  ]}
                  onPress={() => {
                    if (Haptics) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setIntervalMinutes(minutes);
                  }}
                >
                  <Text style={[
                    styles.intervalOptionText,
                    intervalMinutes === minutes && styles.intervalOptionTextActive,
                  ]}>
                    {minutes} мин
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* Start Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[practice.color, practice.color + 'DD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            <Ionicons name="play" size={22} color={COLORS.bgPrimary} />
            <Text style={styles.startButtonText}>
              Начать ({Math.floor(selectedDuration / 60)} мин)
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  practiceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  practiceSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionCard: {
    width: '47%',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    position: 'relative',
  },
  optionCardSelected: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.gold,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: COLORS.gold,
  },
  optionDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  checkmark: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  soundCard: {
    width: '30%',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    position: 'relative',
  },
  soundCardSelected: {
    backgroundColor: COLORS.bgCard,
  },
  soundIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  soundName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  soundCheckmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  toggleDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: COLORS.gold,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.textMuted,
  },
  toggleThumbActive: {
    backgroundColor: COLORS.bgPrimary,
    marginLeft: 'auto',
  },
  intervalOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  intervalOption: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  intervalOptionActive: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.gold,
  },
  intervalOptionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  intervalOptionTextActive: {
    color: COLORS.gold,
    fontWeight: '600',
  },
  bottomBar: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCard,
  },
  startButton: {
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 18,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.bgPrimary,
  },
});
