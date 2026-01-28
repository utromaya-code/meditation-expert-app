import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import * as StorageService from '../services/StorageService';

const { width } = Dimensions.get('window');

export default function StatisticsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { 
    stats, 
    currentStreak, 
    longestStreak, 
    totalSessions, 
    totalMinutes,
    formatTotalTime,
    achievements,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [practiceDays, setPracticeDays] = useState([]);

  useEffect(() => {
    loadPracticeDays();
  }, [selectedMonth]);

  const loadPracticeDays = async () => {
    const days = await StorageService.getMonthPracticeDays(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth()
    );
    setPracticeDays(days);
  };

  // Календарь
  const renderCalendar = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // День недели первого дня (0=вс, нужно 0=пн)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Пустые ячейки в начале
    for (let i = 0; i < startDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPracticed = practiceDays.includes(dateStr);
      const isToday = new Date(year, month, day).getTime() === today.getTime();
      
      days.push(
        <View 
          key={day} 
          style={[
            styles.calendarDay,
            isPracticed && styles.calendarDayPracticed,
            isToday && styles.calendarDayToday,
          ]}
        >
          <Text style={[
            styles.calendarDayText,
            isPracticed && styles.calendarDayTextPracticed,
            isToday && styles.calendarDayTextToday,
          ]}>
            {day}
          </Text>
          {isPracticed && (
            <View style={styles.calendarDot} />
          )}
        </View>
      );
    }
    
    return days;
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const changeMonth = (delta) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setSelectedMonth(newMonth);
  };

  // Статистика по дням недели
  const weeklyData = stats?.weeklyMinutes || [0, 0, 0, 0, 0, 0, 0];
  const maxWeekly = Math.max(...weeklyData, 1);
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Топ практик
  const topPractices = stats?.practicesByType 
    ? Object.entries(stats.practicesByType)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3)
    : [];

  // Достижения
  const achievementsList = [
    { type: 'first_session', icon: '🌱', title: 'Первые шаги', desc: '1 сессия' },
    { type: 'week_streak', icon: '🔥', title: 'Неделя практики', desc: '7 дней подряд' },
    { type: 'month_streak', icon: '🌳', title: 'Месяц мастерства', desc: '30 дней подряд' },
    { type: 'hundred_sessions', icon: '💎', title: 'Эксперт', desc: '100 сессий' },
    { type: 'thousand_minutes', icon: '⏰', title: 'Мастер времени', desc: '1000 минут' },
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Статистика</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Stats */}
      <View style={styles.mainStats}>
        {/* Streak Card */}
        <LinearGradient
          colors={[COLORS.gold + '20', COLORS.gold + '05']}
          style={styles.streakCard}
        >
          <View style={styles.streakIcon}>
            <Text style={{ fontSize: 40 }}>🔥</Text>
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>
              {currentStreak === 1 ? 'день подряд' : 
               currentStreak < 5 ? 'дня подряд' : 'дней подряд'}
            </Text>
          </View>
          <View style={styles.streakBest}>
            <Text style={styles.streakBestLabel}>Лучший</Text>
            <Text style={styles.streakBestValue}>{longestStreak}</Text>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={24} color={COLORS.gold} />
            <Text style={styles.statValue}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Сессий</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color="#60a5fa" />
            <Text style={styles.statValue}>{formatTotalTime()}</Text>
            <Text style={styles.statLabel}>Всего</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy-outline" size={24} color="#a78bfa" />
            <Text style={styles.statValue}>{stats?.longestSession || 0}</Text>
            <Text style={styles.statLabel}>Мин макс</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.section}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.calendarNav}>
            <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.calendarTitle}>
            {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.calendarNav}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.calendarWeekDays}>
          {weekDays.map(day => (
            <Text key={day} style={styles.calendarWeekDay}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {renderCalendar()}
        </View>
        
        <View style={styles.calendarLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.gold }]} />
            <Text style={styles.legendText}>Практика</Text>
          </View>
          <Text style={styles.legendCount}>
            {practiceDays.length} из {new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate()} дней
          </Text>
        </View>
      </View>

      {/* Weekly Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Активность по дням</Text>
        <View style={styles.weeklyChart}>
          {weeklyData.map((value, index) => (
            <View key={index} style={styles.weeklyBar}>
              <View style={styles.weeklyBarBg}>
                <View 
                  style={[
                    styles.weeklyBarFill, 
                    { height: `${(value / maxWeekly) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.weeklyBarLabel}>{weekDays[index]}</Text>
              {value > 0 && (
                <Text style={styles.weeklyBarValue}>{value}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Top Practices */}
      {topPractices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Любимые практики</Text>
          {topPractices.map(([id, data], index) => (
            <View key={id} style={styles.practiceItem}>
              <View style={styles.practiceRank}>
                <Text style={styles.practiceRankText}>{index + 1}</Text>
              </View>
              <View style={styles.practiceInfo}>
                <Text style={styles.practiceName}>{data.title}</Text>
                <Text style={styles.practiceStats}>
                  {data.count} сессий • {data.minutes} мин
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Achievements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Достижения</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
            <Text style={styles.seeAll}>Все →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.achievementsGrid}>
          {achievementsList.map(achievement => {
            const isUnlocked = achievements[achievement.type];
            return (
              <View 
                key={achievement.type} 
                style={[
                  styles.achievementItem,
                  !isUnlocked && styles.achievementLocked,
                ]}
              >
                <Text style={[
                  styles.achievementIcon,
                  !isUnlocked && styles.achievementIconLocked,
                ]}>
                  {achievement.icon}
                </Text>
                <Text style={[
                  styles.achievementTitle,
                  !isUnlocked && styles.achievementTitleLocked,
                ]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                {isUnlocked && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={16} 
                    color={COLORS.gold} 
                    style={styles.achievementCheck}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
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
  mainStats: {
    paddingHorizontal: SPACING.md,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
    marginBottom: SPACING.md,
  },
  streakIcon: {
    marginRight: SPACING.md,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.gold,
    lineHeight: 52,
  },
  streakLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  streakBest: {
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  streakBestLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  streakBestValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  // Calendar
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  calendarNav: {
    padding: SPACING.sm,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  calendarWeekDays: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  calendarWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: (width - SPACING.md * 2) / 7,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayPracticed: {
    backgroundColor: COLORS.gold + '20',
    borderRadius: BORDER_RADIUS.md,
  },
  calendarDayToday: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.md,
  },
  calendarDayText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  calendarDayTextPracticed: {
    color: COLORS.gold,
    fontWeight: '600',
  },
  calendarDayTextToday: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginTop: 2,
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCard,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  legendCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  // Weekly
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  weeklyBar: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyBarBg: {
    width: 24,
    height: 60,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  weeklyBarFill: {
    width: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 4,
  },
  weeklyBarLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  weeklyBarValue: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Practices
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  practiceRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gold + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  practiceRankText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  practiceStats: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  // Achievements
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  achievementItem: {
    width: (width - SPACING.md * 2 - SPACING.sm) / 2,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    position: 'relative',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  achievementIconLocked: {
    opacity: 0.4,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: COLORS.textMuted,
  },
  achievementDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  achievementCheck: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
});
