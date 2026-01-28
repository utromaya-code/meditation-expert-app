import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { PRACTICES } from '../data/practices';

export default function PracticesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Практики</Text>
        <Text style={styles.subtitle}>Золотая Коллекция медитаций</Text>
      </View>

      {/* Filter tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={{ paddingRight: SPACING.md }}
      >
        <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>Все</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Начинающий</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Средний</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Продвинутый</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Practices List */}
      <View style={styles.practicesList}>
        {PRACTICES.map((practice) => (
          <TouchableOpacity
            key={practice.id}
            style={styles.practiceCard}
            onPress={() => navigation.navigate('PracticeDetail', { practice })}
            activeOpacity={0.8}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrap, { backgroundColor: practice.colorDim }]}>
                <Text style={{ fontSize: 36 }}>{practice.icon}</Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.practiceTitle}>{practice.title}</Text>
                {practice.isPremium && (
                  <View style={styles.premiumBadge}>
                    <Ionicons name="diamond" size={12} color={COLORS.gold} />
                    <Text style={styles.premiumText}>PRO</Text>
                  </View>
                )}
              </View>
              <Text style={styles.practiceSubtitle}>{practice.subtitle}</Text>
              <Text style={styles.practiceDesc} numberOfLines={2}>
                {practice.description}
              </Text>
              
              <View style={styles.cardMeta}>
                <View style={[styles.tag, { backgroundColor: practice.colorDim }]}>
                  <Text style={[styles.tagText, { color: practice.color }]}>
                    {practice.levelText}
                  </Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{practice.typeText}</Text>
                </View>
                <View style={styles.duration}>
                  <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.durationText}>{practice.duration}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => navigation.navigate('Player', { practice })}
            >
              <Ionicons name="play" size={20} color={COLORS.bgPrimary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

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
  filterRow: {
    marginBottom: SPACING.lg,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  filterTabActive: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.gold + '40',
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.gold,
  },
  practicesList: {
    gap: SPACING.md,
  },
  practiceCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    alignItems: 'center',
  },
  cardLeft: {
    marginRight: SPACING.md,
  },
  iconWrap: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.goldDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
  },
  practiceSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  practiceDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
    lineHeight: 18,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.bgSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
});
