import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { PRACTICES, LEVELS } from '../data/practices';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { currentStreak, totalSessions, hasPracticedToday } = useApp();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Добро пожаловать</Text>
          <Text style={styles.title}>Эксперт Медитации</Text>
        </View>
        <TouchableOpacity 
          style={styles.premiumBadge}
          onPress={() => navigation.navigate('Subscription')}
        >
          <Ionicons name="diamond" size={16} color={COLORS.gold} />
          <Text style={styles.premiumText}>PRO</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Card */}
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('PracticeDetail', { practice: PRACTICES[0] })}
      >
        <LinearGradient
          colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>Сегодняшняя практика</Text>
            <Text style={styles.heroTitle}>Анапанасати</Text>
            <Text style={styles.heroSubtitle}>Осознанное дыхание • 10 мин</Text>
            <TouchableOpacity 
              style={styles.heroButton}
              onPress={() => navigation.navigate('MeditationSetup', { practice: PRACTICES[0] })}
            >
              <Ionicons name="play" size={20} color={COLORS.bgPrimary} />
              <Text style={styles.heroButtonText}>Начать</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroIcon}>
            <Text style={{ fontSize: 80 }}>🧘</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Quick Stats */}
      <TouchableOpacity 
        style={styles.statsRow}
        onPress={() => navigation.navigate('Statistics')}
        activeOpacity={0.8}
      >
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>🔥 {currentStreak}</Text>
          <Text style={styles.statLabel}>Стрик</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalSessions}</Text>
          <Text style={styles.statLabel}>Сессий</Text>
        </View>
        <View style={[styles.statCard, hasPracticedToday && styles.statCardActive]}>
          <Text style={styles.statNumber}>{hasPracticedToday ? '✓' : '○'}</Text>
          <Text style={styles.statLabel}>Сегодня</Text>
        </View>
      </TouchableOpacity>

      {/* Practices Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Практики</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Практики')}>
            <Text style={styles.seeAll}>Все →</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: SPACING.md }}
        >
          {PRACTICES.map((practice) => (
            <TouchableOpacity
              key={practice.id}
              style={[styles.practiceCard, { borderColor: practice.color + '30' }]}
              onPress={() => navigation.navigate('PracticeDetail', { practice })}
            >
              <View style={[styles.practiceIconWrap, { backgroundColor: practice.colorDim }]}>
                <Text style={{ fontSize: 32 }}>{practice.icon}</Text>
              </View>
              <Text style={styles.practiceTitle}>{practice.title}</Text>
              <Text style={styles.practiceSubtitle}>{practice.subtitle}</Text>
              <View style={styles.practiceMeta}>
                <View style={[styles.levelBadge, { backgroundColor: practice.colorDim }]}>
                  <Text style={[styles.levelText, { color: practice.color }]}>
                    {practice.levelText}
                  </Text>
                </View>
                {practice.isPremium && (
                  <Ionicons name="diamond" size={14} color={COLORS.gold} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Levels Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6 уровней практики</Text>
        <Text style={styles.sectionSubtitle}>Золотая Коллекция медитаций</Text>
        
        <View style={styles.levelsGrid}>
          {LEVELS.map((level, index) => (
            <View 
              key={level.id} 
              style={[styles.levelCard, { borderLeftColor: level.color }]}
            >
              <Text style={{ fontSize: 24 }}>{level.icon}</Text>
              <View style={styles.levelInfo}>
                <Text style={styles.levelTitle}>{index + 1}. {level.title}</Text>
                <Text style={styles.levelDesc}>{level.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Card */}
      <TouchableOpacity 
        style={styles.ctaCard}
        onPress={() => navigation.navigate('Subscription')}
      >
        <LinearGradient
          colors={[COLORS.gold, COLORS.goldLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaGradient}
        >
          <Ionicons name="diamond" size={32} color={COLORS.bgPrimary} />
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Разблокируйте все практики</Text>
            <Text style={styles.ctaSubtitle}>Получите доступ к премиум медитациям</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.bgPrimary} />
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.goldDim,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
  },
  premiumText: {
    color: COLORS.gold,
    fontWeight: '600',
    fontSize: 12,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.round,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: COLORS.bgPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  heroIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  statCardActive: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.gold + '30',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gold,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '500',
  },
  practiceCard: {
    width: 160,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderWidth: 1,
  },
  practiceIconWrap: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  practiceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  practiceSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  practiceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
  },
  levelsGrid: {
    gap: SPACING.sm,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  levelDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ctaCard: {
    marginTop: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.bgPrimary,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: COLORS.bgPrimary,
    opacity: 0.8,
  },
});
