/**
 * StorageService - сервис для хранения прогресса пользователя
 * Сохраняет: сессии, стрики, статистику, настройки
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SESSIONS: '@meditation_sessions',
  STATS: '@meditation_stats',
  SETTINGS: '@meditation_settings',
  STREAK: '@meditation_streak',
  ACHIEVEMENTS: '@meditation_achievements',
  JOURNAL: '@meditation_journal',
};

// ==================== СЕССИИ ====================

/**
 * Сохранить завершённую сессию медитации
 */
export const saveSession = async (session) => {
  try {
    const sessions = await getSessions();
    const newSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      practiceId: session.practiceId,
      practiceTitle: session.practiceTitle,
      duration: session.duration, // в секундах
      completedSteps: session.completedSteps,
      totalSteps: session.totalSteps,
      mood: session.mood || null, // 1-5
      notes: session.notes || '',
    };
    
    sessions.push(newSession);
    await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    
    // Обновляем статистику и стрик
    await updateStats(newSession);
    await updateStreak();
    
    return newSession;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

/**
 * Получить все сессии
 */
export const getSessions = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

/**
 * Получить сессии за период
 */
export const getSessionsByPeriod = async (startDate, endDate) => {
  const sessions = await getSessions();
  return sessions.filter(s => {
    const date = new Date(s.date);
    return date >= startDate && date <= endDate;
  });
};

/**
 * Получить сессии за сегодня
 */
export const getTodaySessions = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return getSessionsByPeriod(today, tomorrow);
};

// ==================== СТАТИСТИКА ====================

const DEFAULT_STATS = {
  totalSessions: 0,
  totalMinutes: 0,
  longestSession: 0,
  currentStreak: 0,
  longestStreak: 0,
  practicesByType: {},
  weeklyMinutes: [0, 0, 0, 0, 0, 0, 0], // пн-вс
  monthlyData: {},
  lastPracticeDate: null,
};

/**
 * Обновить статистику после сессии
 */
const updateStats = async (session) => {
  try {
    const stats = await getStats();
    const minutes = Math.round(session.duration / 60);
    
    stats.totalSessions += 1;
    stats.totalMinutes += minutes;
    stats.longestSession = Math.max(stats.longestSession, minutes);
    stats.lastPracticeDate = session.date;
    
    // Статистика по типам практик
    if (!stats.practicesByType[session.practiceId]) {
      stats.practicesByType[session.practiceId] = {
        title: session.practiceTitle,
        count: 0,
        minutes: 0,
      };
    }
    stats.practicesByType[session.practiceId].count += 1;
    stats.practicesByType[session.practiceId].minutes += minutes;
    
    // Статистика по дням недели
    const dayOfWeek = new Date(session.date).getDay();
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Пн=0, Вс=6
    stats.weeklyMinutes[adjustedDay] += minutes;
    
    // Месячные данные
    const monthKey = new Date(session.date).toISOString().slice(0, 7); // YYYY-MM
    if (!stats.monthlyData[monthKey]) {
      stats.monthlyData[monthKey] = { sessions: 0, minutes: 0, days: {} };
    }
    stats.monthlyData[monthKey].sessions += 1;
    stats.monthlyData[monthKey].minutes += minutes;
    
    const dayKey = new Date(session.date).toISOString().slice(0, 10); // YYYY-MM-DD
    stats.monthlyData[monthKey].days[dayKey] = true;
    
    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
};

/**
 * Получить статистику
 */
export const getStats = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.STATS);
    return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : { ...DEFAULT_STATS };
  } catch (error) {
    console.error('Error getting stats:', error);
    return { ...DEFAULT_STATS };
  }
};

// ==================== СТРИКИ ====================

/**
 * Обновить стрик
 */
const updateStreak = async () => {
  try {
    const stats = await getStats();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastPractice = stats.lastPracticeDate ? new Date(stats.lastPracticeDate) : null;
    
    if (lastPractice) {
      lastPractice.setHours(0, 0, 0, 0);
      
      if (lastPractice.getTime() === today.getTime()) {
        // Уже практиковали сегодня — не меняем стрик
      } else if (lastPractice.getTime() === yesterday.getTime()) {
        // Практиковали вчера — увеличиваем стрик
        stats.currentStreak += 1;
      } else {
        // Пропустили дни — сбрасываем стрик
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }
    
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
    
    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    return stats.currentStreak;
  } catch (error) {
    console.error('Error updating streak:', error);
    return 0;
  }
};

/**
 * Проверить и обновить стрик при открытии приложения
 */
export const checkStreak = async () => {
  try {
    const stats = await getStats();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (stats.lastPracticeDate) {
      const lastPractice = new Date(stats.lastPracticeDate);
      lastPractice.setHours(0, 0, 0, 0);
      
      // Если последняя практика была раньше чем вчера — сбрасываем стрик
      if (lastPractice.getTime() < yesterday.getTime()) {
        stats.currentStreak = 0;
        await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
      }
    }
    
    return stats.currentStreak;
  } catch (error) {
    console.error('Error checking streak:', error);
    return 0;
  }
};

// ==================== КАЛЕНДАРЬ ====================

/**
 * Получить дни с практикой за месяц
 */
export const getMonthPracticeDays = async (year, month) => {
  try {
    const stats = await getStats();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    if (stats.monthlyData[monthKey]) {
      return Object.keys(stats.monthlyData[monthKey].days);
    }
    return [];
  } catch (error) {
    console.error('Error getting month practice days:', error);
    return [];
  }
};

// ==================== НАСТРОЙКИ ====================

const DEFAULT_SETTINGS = {
  reminderEnabled: false,
  reminderTime: '08:00',
  soundEnabled: true,
  hapticEnabled: true,
  theme: 'dark',
  defaultDuration: 600, // 10 минут
};

/**
 * Получить настройки
 */
export const getSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Error getting settings:', error);
    return { ...DEFAULT_SETTINGS };
  }
};

/**
 * Сохранить настройки
 */
export const saveSettings = async (settings) => {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

// ==================== ДНЕВНИК ====================

/**
 * Добавить запись в дневник
 */
export const addJournalEntry = async (entry) => {
  try {
    const journal = await getJournal();
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sessionId: entry.sessionId,
      practiceTitle: entry.practiceTitle,
      mood: entry.mood, // 1-5
      energy: entry.energy, // 1-5
      clarity: entry.clarity, // 1-5
      notes: entry.notes || '',
      tags: entry.tags || [],
    };
    
    journal.unshift(newEntry); // Новые записи в начало
    await AsyncStorage.setItem(KEYS.JOURNAL, JSON.stringify(journal));
    return newEntry;
  } catch (error) {
    console.error('Error adding journal entry:', error);
    throw error;
  }
};

/**
 * Получить дневник
 */
export const getJournal = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.JOURNAL);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting journal:', error);
    return [];
  }
};

// ==================== ДОСТИЖЕНИЯ ====================

export const ACHIEVEMENT_TYPES = {
  FIRST_SESSION: 'first_session',
  WEEK_STREAK: 'week_streak',
  MONTH_STREAK: 'month_streak',
  HUNDRED_SESSIONS: 'hundred_sessions',
  THOUSAND_MINUTES: 'thousand_minutes',
  ALL_PRACTICES: 'all_practices',
  EARLY_BIRD: 'early_bird', // Практика до 7 утра
  NIGHT_OWL: 'night_owl', // Практика после 22:00
};

/**
 * Проверить и разблокировать достижения
 */
export const checkAchievements = async () => {
  try {
    const stats = await getStats();
    const achievements = await getAchievements();
    const newAchievements = [];
    
    // Первая сессия
    if (stats.totalSessions >= 1 && !achievements[ACHIEVEMENT_TYPES.FIRST_SESSION]) {
      achievements[ACHIEVEMENT_TYPES.FIRST_SESSION] = new Date().toISOString();
      newAchievements.push({
        type: ACHIEVEMENT_TYPES.FIRST_SESSION,
        title: '🌱 Первые шаги',
        description: 'Завершите первую медитацию',
      });
    }
    
    // Неделя подряд
    if (stats.currentStreak >= 7 && !achievements[ACHIEVEMENT_TYPES.WEEK_STREAK]) {
      achievements[ACHIEVEMENT_TYPES.WEEK_STREAK] = new Date().toISOString();
      newAchievements.push({
        type: ACHIEVEMENT_TYPES.WEEK_STREAK,
        title: '🔥 Неделя практики',
        description: '7 дней медитации подряд',
      });
    }
    
    // Месяц подряд
    if (stats.currentStreak >= 30 && !achievements[ACHIEVEMENT_TYPES.MONTH_STREAK]) {
      achievements[ACHIEVEMENT_TYPES.MONTH_STREAK] = new Date().toISOString();
      newAchievements.push({
        type: ACHIEVEMENT_TYPES.MONTH_STREAK,
        title: '🌳 Месяц мастерства',
        description: '30 дней медитации подряд',
      });
    }
    
    // 100 сессий
    if (stats.totalSessions >= 100 && !achievements[ACHIEVEMENT_TYPES.HUNDRED_SESSIONS]) {
      achievements[ACHIEVEMENT_TYPES.HUNDRED_SESSIONS] = new Date().toISOString();
      newAchievements.push({
        type: ACHIEVEMENT_TYPES.HUNDRED_SESSIONS,
        title: '💎 Эксперт',
        description: '100 сессий медитации',
      });
    }
    
    // 1000 минут
    if (stats.totalMinutes >= 1000 && !achievements[ACHIEVEMENT_TYPES.THOUSAND_MINUTES]) {
      achievements[ACHIEVEMENT_TYPES.THOUSAND_MINUTES] = new Date().toISOString();
      newAchievements.push({
        type: ACHIEVEMENT_TYPES.THOUSAND_MINUTES,
        title: '⏰ Мастер времени',
        description: '1000 минут практики',
      });
    }
    
    if (newAchievements.length > 0) {
      await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    }
    
    return newAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

/**
 * Получить достижения
 */
export const getAchievements = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting achievements:', error);
    return {};
  }
};

// ==================== ОЧИСТКА (для тестирования) ====================

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

export default {
  saveSession,
  getSessions,
  getSessionsByPeriod,
  getTodaySessions,
  getStats,
  checkStreak,
  getMonthPracticeDays,
  getSettings,
  saveSettings,
  addJournalEntry,
  getJournal,
  checkAchievements,
  getAchievements,
  clearAllData,
};
