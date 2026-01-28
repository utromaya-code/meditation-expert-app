import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [reminders, setReminders] = React.useState(true);
  const [sounds, setSounds] = React.useState(true);

  const menuItems = [
    {
      title: 'Настройки',
      items: [
        { icon: 'notifications-outline', label: 'Напоминания', toggle: true, value: reminders, onToggle: setReminders },
        { icon: 'volume-high-outline', label: 'Звуки', toggle: true, value: sounds, onToggle: setSounds },
        { icon: 'moon-outline', label: 'Тёмная тема', badge: 'Вкл' },
        { icon: 'language-outline', label: 'Язык', badge: 'Русский' },
      ],
    },
    {
      title: 'Аккаунт',
      items: [
        { icon: 'diamond-outline', label: 'Подписка', badge: 'Free', badgeColor: COLORS.textMuted, onPress: () => navigation.navigate('Subscription') },
        { icon: 'cloud-download-outline', label: 'Скачанные практики' },
        { icon: 'analytics-outline', label: 'Статистика' },
      ],
    },
    {
      title: 'Поддержка',
      items: [
        { icon: 'help-circle-outline', label: 'Помощь и FAQ' },
        { icon: 'mail-outline', label: 'Связаться с нами' },
        { icon: 'star-outline', label: 'Оценить приложение' },
        { icon: 'share-outline', label: 'Поделиться' },
      ],
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
      </View>

      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={COLORS.textSecondary} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Гость</Text>
          <Text style={styles.userEmail}>Войдите для синхронизации</Text>
        </View>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Войти</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Сессий</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Минут</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Дней подряд</Text>
        </View>
      </View>

      {/* Premium Banner */}
      <TouchableOpacity 
        style={styles.premiumBanner}
        onPress={() => navigation.navigate('Subscription')}
      >
        <LinearGradient
          colors={[COLORS.gold, COLORS.goldLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.premiumGradient}
        >
          <View style={styles.premiumLeft}>
            <Ionicons name="diamond" size={28} color={COLORS.bgPrimary} />
          </View>
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>Эксперт PRO</Text>
            <Text style={styles.premiumDesc}>Разблокируйте все практики</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.bgPrimary} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Menu Sections */}
      {menuItems.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.menuSection}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.menuCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={itemIndex}
                style={[
                  styles.menuItem,
                  itemIndex < section.items.length - 1 && styles.menuItemBorder
                ]}
                onPress={item.onPress}
                disabled={item.toggle}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={22} color={COLORS.textSecondary} />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                {item.toggle ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: COLORS.bgSecondary, true: COLORS.goldDim }}
                    thumbColor={item.value ? COLORS.gold : COLORS.textMuted}
                  />
                ) : item.badge ? (
                  <View style={styles.menuItemRight}>
                    <Text style={[styles.menuItemBadge, item.badgeColor && { color: item.badgeColor }]}>
                      {item.badge}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* App Version */}
      <Text style={styles.version}>Версия 1.0.0</Text>

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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  loginButton: {
    backgroundColor: COLORS.goldDim,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.round,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gold,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.borderCard,
  },
  premiumBanner: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  premiumLeft: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  premiumTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.bgPrimary,
  },
  premiumDesc: {
    fontSize: 13,
    color: COLORS.bgPrimary,
    opacity: 0.8,
  },
  menuSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  menuCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCard,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  menuItemBadge: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  version: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
