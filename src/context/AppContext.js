/**
 * AppContext - глобальное состояние приложения
 * Управляет: статистикой, стриками, настройками
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as StorageService from '../services/StorageService';
import * as NotificationService from '../services/NotificationService';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [achievements, setAchievements] = useState({});
  const [todaySessions, setTodaySessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAchievements, setNewAchievements] = useState([]);

  // Загрузка данных при старте
  useEffect(() => {
    loadInitialData();
    // Инициализация уведомлений
    NotificationService.initializeNotifications();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Параллельная загрузка данных
      const [statsData, settingsData, achievementsData, todayData] = await Promise.all([
        StorageService.getStats(),
        StorageService.getSettings(),
        StorageService.getAchievements(),
        StorageService.getTodaySessions(),
      ]);
      
      // Проверка стрика
      await StorageService.checkStreak();
      const updatedStats = await StorageService.getStats();
      
      setStats(updatedStats);
      setSettings(settingsData);
      setAchievements(achievementsData);
      setTodaySessions(todayData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Сохранить сессию
  const saveSession = useCallback(async (sessionData) => {
    try {
      const session = await StorageService.saveSession(sessionData);
      
      // Обновляем локальное состояние
      const updatedStats = await StorageService.getStats();
      setStats(updatedStats);
      
      const updatedToday = await StorageService.getTodaySessions();
      setTodaySessions(updatedToday);
      
      // Проверяем достижения
      const newAchievs = await StorageService.checkAchievements();
      if (newAchievs.length > 0) {
        setNewAchievements(newAchievs);
        // Обновляем список достижений
        const achievementsData = await StorageService.getAchievements();
        setAchievements(achievementsData);
      }
      
      return session;
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }, []);

  // Обновить настройки
  const updateSettings = useCallback(async (newSettings) => {
    try {
      const updated = await StorageService.saveSettings(newSettings);
      setSettings(updated);
      return updated;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }, []);

  // Очистить уведомление о достижении
  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  // Перезагрузить данные
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, []);

  // Проверка: практиковал ли сегодня
  const hasPracticedToday = todaySessions.length > 0;

  // Форматирование времени
  const formatTotalTime = useCallback(() => {
    if (!stats) return '0 мин';
    
    const hours = Math.floor(stats.totalMinutes / 60);
    const minutes = stats.totalMinutes % 60;
    
    if (hours === 0) return `${minutes} мин`;
    if (minutes === 0) return `${hours} ч`;
    return `${hours} ч ${minutes} мин`;
  }, [stats]);

  const value = {
    // Состояние
    stats,
    settings,
    achievements,
    todaySessions,
    isLoading,
    newAchievements,
    hasPracticedToday,
    
    // Вычисляемые значения
    currentStreak: stats?.currentStreak || 0,
    totalSessions: stats?.totalSessions || 0,
    totalMinutes: stats?.totalMinutes || 0,
    longestStreak: stats?.longestStreak || 0,
    
    // Методы
    saveSession,
    updateSettings,
    clearNewAchievements,
    refreshData,
    formatTotalTime,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
