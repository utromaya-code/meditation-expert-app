import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import * as StorageService from '../services/StorageService';

const ACHIEVEMENTS = [
  {
    id: 'first_session',
    icon: '🌱',
    title: 'Первые шаги',
    description: 'Завершите первую медитацию',
    requirement: '1 сессия',
    color: '#2dd4bf',
  },
  {
    id: 'week_streak',
    icon: '🔥',
    title: 'Неделя практики',
    description: '7 дней медитации подряд',
    requirement: '7 дней',
    color: '#f59e0b',
  },
  {
    id: 'month_streak',
    icon: '🌳',
    title: 'Месяц мастерства',
    description: '30 дней медитации подряд',
    requirement: '30 дней',
    color: '#10b981',
  },
  {
    id: 'hundred_sessions',
    icon: '💎',
    title: 'Эксперт',
    description: '100 сессий медитации',
    requirement: '100 сессий',
    color: '#d4af37',
  },
  {
    id: 'thousand_minutes',
    icon: '⏰',
    title: 'Мастер времени',
    description: '1000 минут практики',
    requirement: '1000 минут',
    color: '#8b5cf6',
  },
  {
    id: 'all_practices',
    icon: '✨',
    title: 'Мастер всех практик',
    description: 'Попробуйте все 4 практики',
    requirement: '4 практики',
    color: '#f4d03f',
  },
];

export default function AchievementsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { stats, achievements } = useApp();
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    const count = Object.keys(achievements || {}).length;
    setUnlockedCount(count);
  }, [achievements]);

  const getProgress = (achievementId) => {
    if (!stats) return 0;

    switch (achievementId) {
      case 'first_session':
        return Math.min(stats.totalSessions, 1);
      case 'week_streak':
        return Math.min(stats.currentStreak, 7);
      case 'month_streak':
        return Math.min(stats.currentStreak, 30);
      case 'hundred_sessions':
        return Math.min(stats.totalSessions, 100);
      case 'thousand_minutes':
        return Math.min(stats.totalMinutes, 1000);
      case 'all_practices':
        return Math.min(Object.keys(stats.practicesByType || {}).length, 4);
      default:
        return 0;
    }
  };

  const getRequirementValue = (achievementId) => {
    switch (achievementId) {
      case 'first_session':
        return 1;
      case 'week_streak':
        return 7;
      case 'month_streak':
        return 30;
      case 'hundred_sessions':
        return 100;
      case 'thousand_minutes':
        return 1000;
      case 'all_practices':
        return 4;
      default:
        return 0;
    }
  };

  const formatProgress = (achievementId, progress) => {
    const requirement = getRequirementValue(achievementId);
    
    if (achievementId === 'thousand_minutes') {
      return `${progress} / ${requirement} мин`;
    } else if (achievementId === 'all_practices') {
      return `${progress} / ${requirement} практик`;
    } else if (achievementId === 'week_streak' || achievementId === 'month_streak') {
      return `${progress} / ${requirement} дней`;
    } else {
      return `${progress} / ${requirement}`;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Достижения</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Summary */}
      <View style={styles.summary}>
        <LinearGradient
          colors={[COLORS.gold + '20', COLORS.gold + '05']}
          style={styles.summaryCard}
        >
          <View style={styles.summaryIcon}>
            <Text style={{ fontSize: 48 }}>🏆</Text>
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryNumber}>{unlockedCount}</Text>
            <Text style={styles.summaryLabel}>
              из {ACHIEVEMENTS.length} достижений
            </Text>
            <View style={styles.summaryProgress}>
              <View 
                style={[
                  styles.summaryProgressBar,
                  { width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ACHIEVEMENTS.map((achievement, index) => {
          const isUnlocked = achievements[achievement.id];
          const progress = getProgress(achievement.id);
          const requirement = getRequirementValue(achievement.id);
          const progressPercent = Math.min((progress / requirement) * 100, 100);

          return (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementHeader}>
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.color + '20' },
                  !isUnlocked && styles.achievementIconLocked,
                ]}>
                  <Text style={[
                    styles.achievementIconText,
                    !isUnlocked && styles.achievementIconTextLocked,
                  ]}>
                    {achievement.icon}
                  </Text>
                </View>
                
                <View style={styles.achievementInfo}>
                  <View style={styles.achievementTitleRow}>
                    <Text style={[
                      styles.achievementTitle,
                      !isUnlocked && styles.achievementTitleLocked,
                    ]}>
                      {achievement.title}
                    </Text>
                    {isUnlocked && (
                      <Ionicons 
                        name="checkmark-circle" 
                        size={20} 
                        color={COLORS.gold} 
                      />
                    )}
                  </View>
                  <Text style={styles.achievementDesc}>
                    {achievement.description}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              {!isUnlocked && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${progressPercent}%`,
                          backgroundColor: achievement.color,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {formatProgress(achievement.id, progress)}
                  </Text>
                </View>
              )}

              {/* Unlocked Badge */}
              {isUnlocked && (
                <View style={styles.unlockedBadge}>
                  <Ionicons name="trophy" size={14} color={COLORS.gold} />
                  <Text style={styles.unlockedText}>
                    Разблокировано {achievements[achievement.id] 
                      ? new Date(achievements[achievement.id]).toLocaleDateString('ru-RU')
                      : ''}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

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
  summary: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
  },
  summaryIcon: {
    marginRight: SPACING.md,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.gold,
    lineHeight: 40,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryProgress: {
    height: 6,
    backgroundColor: COLORS.bgCard,
    borderRadius: 3,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  summaryProgressBar: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  achievementCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementIconLocked: {
    opacity: 0.4,
  },
  achievementIconText: {
    fontSize: 28,
  },
  achievementIconTextLocked: {
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  achievementTitleLocked: {
    color: COLORS.textMuted,
  },
  achievementDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  progressContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCard,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCard,
  },
  unlockedText: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '500',
  },
});
