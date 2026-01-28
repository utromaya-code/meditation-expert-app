import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import * as StorageService from '../services/StorageService';

const MOOD_EMOJIS = {
  1: '😔',
  2: '😐',
  3: '🙂',
  4: '😊',
  5: '🤩',
};

const ENERGY_EMOJIS = {
  1: '😴',
  2: '😑',
  3: '😌',
  4: '😃',
  5: '⚡',
};

const CLARITY_EMOJIS = {
  1: '🌫️',
  2: '😕',
  3: '🤔',
  4: '💡',
  5: '✨',
};

export default function JournalHistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await StorageService.getJournal();
      setEntries(data);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEntries();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>История дневника</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>История дневника</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.empty}>
          <Ionicons name="journal-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Дневник пуст</Text>
          <Text style={styles.emptyText}>
            Завершите практику и запишите свои ощущения
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>История дневника</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.gold}
          />
        }
      >
        {entries.map((entry, index) => {
          const date = formatDate(entry.date);
          const time = formatTime(entry.date);
          const showDateHeader = index === 0 || 
            formatDate(entries[index - 1].date) !== date;

          return (
            <View key={entry.id}>
              {showDateHeader && (
                <View style={styles.dateHeader}>
                  <Text style={styles.dateHeaderText}>{date}</Text>
                </View>
              )}
              
              <View style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryHeaderLeft}>
                    <Ionicons name="leaf" size={16} color={COLORS.gold} />
                    <Text style={styles.entryPractice}>{entry.practiceTitle}</Text>
                  </View>
                  <Text style={styles.entryTime}>{time}</Text>
                </View>

                <View style={styles.entryRatings}>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingEmoji}>{MOOD_EMOJIS[entry.mood]}</Text>
                    <Text style={styles.ratingValue}>{entry.mood}/5</Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingEmoji}>{ENERGY_EMOJIS[entry.energy]}</Text>
                    <Text style={styles.ratingValue}>{entry.energy}/5</Text>
                  </View>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingEmoji}>{CLARITY_EMOJIS[entry.clarity]}</Text>
                    <Text style={styles.ratingValue}>{entry.clarity}/5</Text>
                  </View>
                </View>

                {entry.notes && (
                  <View style={styles.entryNotes}>
                    <Text style={styles.entryNotesText}>{entry.notes}</Text>
                  </View>
                )}
              </View>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  dateHeader: {
    paddingVertical: SPACING.md,
    paddingTop: SPACING.lg,
  },
  dateHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  entryCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  entryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  entryPractice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  entryTime: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  entryRatings: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.bgPrimary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  ratingEmoji: {
    fontSize: 18,
  },
  ratingValue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  entryNotes: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCard,
  },
  entryNotesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
