/**
 * NotificationService - сервис для push-уведомлений
 * Напоминания о практике, мотивационные сообщения
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { getSettings, saveSettings } from './StorageService';

// Настройка обработки уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Мотивационные сообщения для напоминаний
const REMINDER_MESSAGES = [
  {
    title: '🧘 Время для практики',
    body: 'Несколько минут осознанности изменят ваш день',
  },
  {
    title: '🌅 Доброе утро!',
    body: 'Начните день с ясного ума — практика ждёт',
  },
  {
    title: '✨ Момент осознанности',
    body: 'Ваш разум готов к тренировке. Вы тоже?',
  },
  {
    title: '🔥 Не потеряйте стрик!',
    body: 'Сегодня ещё не было практики. 5 минут изменят всё',
  },
  {
    title: '🧠 Тренировка для мозга',
    body: 'Как спортзал для тела — медитация для ума',
  },
  {
    title: '🌿 Пауза для себя',
    body: 'В суете дня найдите минуту покоя',
  },
  {
    title: '💎 Инвестиция в себя',
    body: '10 минут сегодня = спокойствие на весь день',
  },
  {
    title: '🎯 Ваша цель близко',
    body: 'Каждая сессия делает вас сильнее',
  },
];

/**
 * Запросить разрешение на уведомления
 */
export const requestPermissions = async () => {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Push notification permission denied');
    return false;
  }

  // Для iOS нужна дополнительная настройка
  if (Platform.OS === 'ios') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Напоминания о практике',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  return true;
};

/**
 * Получить случайное мотивационное сообщение
 */
const getRandomMessage = () => {
  const index = Math.floor(Math.random() * REMINDER_MESSAGES.length);
  return REMINDER_MESSAGES[index];
};

/**
 * Запланировать ежедневное напоминание
 */
export const scheduleDailyReminder = async (hour, minute) => {
  try {
    // Отменяем все предыдущие напоминания
    await cancelAllReminders();
    
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return false;
    }

    const message = getRandomMessage();
    
    // Планируем ежедневное уведомление
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: 'default',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true,
      },
    });

    console.log(`Daily reminder scheduled for ${hour}:${minute}`);
    return true;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return false;
  }
};

/**
 * Запланировать напоминание о стрике (вечером, если не практиковал)
 */
export const scheduleStreakReminder = async () => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return false;

    // Напоминание в 20:00 если не практиковали
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Не потеряйте стрик!',
        body: 'До конца дня осталось несколько часов. Практика займёт всего 5 минут.',
        sound: 'default',
        data: { type: 'streak_reminder' },
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });

    return true;
  } catch (error) {
    console.error('Error scheduling streak reminder:', error);
    return false;
  }
};

/**
 * Отменить все запланированные уведомления
 */
export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All reminders cancelled');
    return true;
  } catch (error) {
    console.error('Error cancelling reminders:', error);
    return false;
  }
};

/**
 * Получить все запланированные уведомления
 */
export const getScheduledReminders = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled reminders:', error);
    return [];
  }
};

/**
 * Включить/выключить напоминания
 */
export const toggleReminders = async (enabled, time = '08:00') => {
  try {
    if (enabled) {
      const [hour, minute] = time.split(':').map(Number);
      const success = await scheduleDailyReminder(hour, minute);
      
      if (success) {
        await saveSettings({ 
          reminderEnabled: true, 
          reminderTime: time 
        });
      }
      
      return success;
    } else {
      await cancelAllReminders();
      await saveSettings({ reminderEnabled: false });
      return true;
    }
  } catch (error) {
    console.error('Error toggling reminders:', error);
    return false;
  }
};

/**
 * Обновить время напоминания
 */
export const updateReminderTime = async (time) => {
  try {
    const settings = await getSettings();
    if (settings.reminderEnabled) {
      const [hour, minute] = time.split(':').map(Number);
      await scheduleDailyReminder(hour, minute);
    }
    await saveSettings({ reminderTime: time });
    return true;
  } catch (error) {
    console.error('Error updating reminder time:', error);
    return false;
  }
};

/**
 * Инициализация уведомлений при старте приложения
 */
export const initializeNotifications = async () => {
  try {
    const settings = await getSettings();
    
    if (settings.reminderEnabled) {
      const [hour, minute] = settings.reminderTime.split(':').map(Number);
      await scheduleDailyReminder(hour, minute);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
};

/**
 * Отправить мгновенное уведомление (для тестирования)
 */
export const sendTestNotification = async () => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return false;

    const message = getRandomMessage();
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: 'default',
      },
      trigger: {
        seconds: 2,
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};

export default {
  requestPermissions,
  scheduleDailyReminder,
  scheduleStreakReminder,
  cancelAllReminders,
  getScheduledReminders,
  toggleReminders,
  updateReminderTime,
  initializeNotifications,
  sendTestNotification,
};
