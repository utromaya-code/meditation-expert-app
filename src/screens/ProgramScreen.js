import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { PROGRAM } from '../data/practices';

export default function ProgramScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Программа</Text>
        <Text style={styles.subtitle}>План на месяц для начинающих</Text>
      </View>

      {/* Progress Card */}
      <LinearGradient
        colors={[COLORS.goldDim, COLORS.bgCard]}
        style={styles.progressCard}
      >
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Ваш прогресс</Text>
          <Text style={styles.progressPercent}>0%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '0%' }]} />
        </View>
        <Text style={styles.progressText}>Начните первую практику</Text>
      </LinearGradient>

      {/* Timeline */}
      <View style={styles.timeline}>
        {PROGRAM.map((week, index) => (
          <View key={week.week} style={styles.weekBlock}>
            {/* Timeline connector */}
            {index < PROGRAM.length - 1 && (
              <View style={styles.timelineConnector} />
            )}
            
            {/* Week label */}
            <View style={styles.weekLabel}>
              <View style={[
                styles.weekBadge,
                index === 0 && styles.weekBadgeActive
              ]}>
                <Text style={styles.weekNumber}>{week.week}</Text>
              </View>
              <Text style={styles.weekText}>Неделя</Text>
            </View>
            
            {/* Week content */}
            <View style={styles.weekContent}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekTitle}>{week.title}</Text>
                {index === 0 && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentText}>Сейчас</Text>
                  </View>
                )}
              </View>
              <Text style={styles.weekDesc}>{week.description}</Text>
              
              <View style={styles.practicesGrid}>
                {week.practices.map((item, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.practiceItem}
                    onPress={() => navigation.navigate('Практики')}
                  >
                    <Text style={styles.practiceIcon}>{item.icon}</Text>
                    <View style={styles.practiceInfo}>
                      <Text style={styles.practiceTime}>{item.time}</Text>
                      <Text style={styles.practiceName}>{item.practice}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>💡 Советы для успеха</Text>
        <View style={styles.tipCard}>
          <Ionicons name="time-outline" size={20} color={COLORS.gold} />
          <Text style={styles.tipText}>Практикуйте в одно и то же время каждый день</Text>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="notifications-outline" size={20} color={COLORS.gold} />
          <Text style={styles.tipText}>Установите напоминание на телефоне</Text>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="trending-up-outline" size={20} color={COLORS.gold} />
          <Text style={styles.tipText}>Начните с 5 минут и постепенно увеличивайте</Text>
        </View>
      </View>

      <View style={{ height: SPACING.xxl * 2 }} />
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
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  progressCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gold,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  timeline: {
    position: 'relative',
  },
  weekBlock: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  timelineConnector: {
    position: 'absolute',
    left: 25,
    top: 50,
    bottom: -SPACING.lg,
    width: 2,
    backgroundColor: COLORS.borderCard,
  },
  weekLabel: {
    alignItems: 'center',
    width: 52,
    marginRight: SPACING.md,
  },
  weekBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderCard,
  },
  weekBadgeActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldDim,
  },
  weekNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gold,
  },
  weekText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  weekContent: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  currentBadge: {
    backgroundColor: COLORS.greenDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  currentText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.green,
  },
  weekDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  practicesGrid: {
    gap: SPACING.sm,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  practiceIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  practiceName: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  tipsSection: {
    marginTop: SPACING.lg,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
