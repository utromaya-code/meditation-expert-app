import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import * as StorageService from '../services/StorageService';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😔', label: 'Плохо' },
  { value: 2, emoji: '😐', label: 'Нейтрально' },
  { value: 3, emoji: '🙂', label: 'Хорошо' },
  { value: 4, emoji: '😊', label: 'Отлично' },
  { value: 5, emoji: '🤩', label: 'Превосходно' },
];

const ENERGY_OPTIONS = [
  { value: 1, emoji: '😴', label: 'Устал' },
  { value: 2, emoji: '😑', label: 'Вяло' },
  { value: 3, emoji: '😌', label: 'Нормально' },
  { value: 4, emoji: '😃', label: 'Бодро' },
  { value: 5, emoji: '⚡', label: 'Энергично' },
];

const CLARITY_OPTIONS = [
  { value: 1, emoji: '🌫️', label: 'Туманно' },
  { value: 2, emoji: '😕', label: 'Смутно' },
  { value: 3, emoji: '🤔', label: 'Обычно' },
  { value: 4, emoji: '💡', label: 'Ясно' },
  { value: 5, emoji: '✨', label: 'Кристально' },
];

export default function JournalScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { refreshData } = useApp();
  const { sessionId, practiceTitle } = route.params || {};
  
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [clarity, setClarity] = useState(3);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!sessionId) {
      Alert.alert('Ошибка', 'Не найдена информация о сессии');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await StorageService.addJournalEntry({
        sessionId,
        practiceTitle: practiceTitle || 'Медитация',
        mood,
        energy,
        clarity,
        notes: notes.trim(),
        tags: [],
      });

      if (Haptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      await refreshData();
      
      Alert.alert(
        '✅ Запись сохранена',
        'Ваши ощущения записаны в дневник',
        [{ text: 'ОК', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить запись');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingSelector = (title, value, setValue, options) => (
    <View style={styles.ratingSection}>
      <Text style={styles.ratingTitle}>{title}</Text>
      <View style={styles.ratingOptions}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.ratingOption,
              value === option.value && styles.ratingOptionActive,
            ]}
            onPress={() => {
              if (Haptics) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setValue(option.value);
            }}
          >
            <Text style={styles.ratingEmoji}>{option.emoji}</Text>
            {value === option.value && (
              <Text style={styles.ratingLabel}>{option.label}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Дневник практики</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Practice Info */}
        {practiceTitle && (
          <View style={styles.practiceCard}>
            <Ionicons name="leaf" size={20} color={COLORS.gold} />
            <Text style={styles.practiceTitle}>{practiceTitle}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Как вы себя чувствуете?</Text>

        {/* Mood */}
        {renderRatingSelector('Настроение', mood, setMood, MOOD_OPTIONS)}

        {/* Energy */}
        {renderRatingSelector('Энергия', energy, setEnergy, ENERGY_OPTIONS)}

        {/* Clarity */}
        {renderRatingSelector('Ясность ума', clarity, setClarity, CLARITY_OPTIONS)}

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Заметки (необязательно)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Что вы заметили во время практики? Какие ощущения, мысли, инсайты?"
            placeholderTextColor={COLORS.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={[COLORS.gold, COLORS.goldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButtonGradient}
          >
            <Ionicons name="checkmark" size={20} color={COLORS.bgPrimary} />
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить запись'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: SPACING.xxl }} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.goldDim,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
  },
  practiceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gold,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  ratingSection: {
    marginBottom: SPACING.xl,
  },
  ratingTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  ratingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xs,
  },
  ratingOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.bgCard,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratingOptionActive: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.gold + '50',
  },
  ratingEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  ratingLabel: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: '600',
  },
  notesSection: {
    marginBottom: SPACING.xl,
  },
  notesTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  notesInput: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.textPrimary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  saveButton: {
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.bgPrimary,
  },
});
