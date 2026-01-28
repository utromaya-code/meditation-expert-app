import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

const PLANS = [
  {
    id: 'monthly',
    title: 'Ежемесячно',
    price: '599 ₽',
    period: '/месяц',
    savings: null,
  },
  {
    id: 'yearly',
    title: 'Годовой',
    price: '3 990 ₽',
    period: '/год',
    savings: '45% экономии',
    popular: true,
  },
  {
    id: 'lifetime',
    title: 'Навсегда',
    price: '9 990 ₽',
    period: 'единоразово',
    savings: 'Лучшая цена',
  },
];

const FEATURES = [
  { icon: 'checkmark-circle', text: 'Все 4 медитации с аудиогидом' },
  { icon: 'checkmark-circle', text: 'Безлимитные сессии' },
  { icon: 'checkmark-circle', text: 'Персонализированная программа' },
  { icon: 'checkmark-circle', text: 'Отслеживание прогресса' },
  { icon: 'checkmark-circle', text: 'Новые практики каждый месяц' },
  { icon: 'checkmark-circle', text: 'Доступ к курсу «Эксперт Медитации»' },
  { icon: 'checkmark-circle', text: 'Без рекламы' },
];

export default function SubscriptionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const handleSelectPlan = (planId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Here would be the purchase logic with RevenueCat or similar
    alert('Подписка будет доступна после публикации в App Store / Google Play');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.restoreText}>Восстановить</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[COLORS.goldDim, 'transparent']}
            style={styles.heroGlow}
          />
          <View style={styles.heroIcon}>
            <Ionicons name="diamond" size={48} color={COLORS.gold} />
          </View>
          <Text style={styles.heroTitle}>Эксперт PRO</Text>
          <Text style={styles.heroSubtitle}>
            Разблокируйте полный доступ к Золотой Коллекции медитаций
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name={feature.icon} size={22} color={COLORS.green} />
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.popular && styles.planCardPopular,
              ]}
              onPress={() => handleSelectPlan(plan.id)}
              activeOpacity={0.8}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>ПОПУЛЯРНЫЙ</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <View style={[
                  styles.planRadio,
                  selectedPlan === plan.id && styles.planRadioSelected
                ]}>
                  {selectedPlan === plan.id && (
                    <View style={styles.planRadioInner} />
                  )}
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.planPrice}>
                <Text style={styles.priceAmount}>{plan.price}</Text>
                <Text style={styles.pricePeriod}>{plan.period}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons key={star} name="star" size={20} color={COLORS.gold} />
            ))}
          </View>
          <Text style={styles.socialText}>
            «Лучшее приложение для медитации, которое я пробовал»
          </Text>
          <Text style={styles.socialAuthor}>— Более 10 000 пользователей</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom */}
      <LinearGradient
        colors={['transparent', COLORS.bgPrimary]}
        style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.md }]}
      >
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        >
          <LinearGradient
            colors={[COLORS.gold, COLORS.goldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.subscribeGradient}
          >
            <Text style={styles.subscribeText}>Начать бесплатный период</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.trialText}>
          7 дней бесплатно, затем {PLANS.find(p => p.id === selectedPlan)?.price} {PLANS.find(p => p.id === selectedPlan)?.period}
        </Text>
        
        <View style={styles.legalLinks}>
          <TouchableOpacity>
            <Text style={styles.legalText}>Условия</Text>
          </TouchableOpacity>
          <Text style={styles.legalDot}>•</Text>
          <TouchableOpacity>
            <Text style={styles.legalText}>Конфиденциальность</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '500',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    top: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.5,
  },
  heroIcon: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: COLORS.goldDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  featuresSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  featureText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  plansSection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    gap: SPACING.sm,
  },
  planCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.borderCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldDim,
  },
  planCardPopular: {
    paddingTop: SPACING.lg + 8,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.gold,
    paddingVertical: 4,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.bgPrimary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  planRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planRadioSelected: {
    borderColor: COLORS.gold,
  },
  planRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.gold,
  },
  planInfo: {
    gap: 4,
  },
  planTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  savingsBadge: {
    backgroundColor: COLORS.greenDim,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.green,
  },
  planPrice: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  pricePeriod: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  socialProof: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  socialText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  socialAuthor: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  subscribeButton: {
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  subscribeGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.bgPrimary,
  },
  trialText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  legalText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  legalDot: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
