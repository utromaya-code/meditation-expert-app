import React from 'react';
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
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function PracticeDetailScreen({ route, navigation }) {
  const { practice } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: practice.colorDim }]}>
            <Text style={{ fontSize: 64 }}>{practice.icon}</Text>
          </View>
          <Text style={styles.heroTitle}>{practice.title}</Text>
          <Text style={styles.heroSubtitle}>{practice.subtitle}</Text>
          
          <View style={styles.metaRow}>
            <View style={[styles.metaTag, { backgroundColor: practice.colorDim }]}>
              <Text style={[styles.metaText, { color: practice.color }]}>
                {practice.levelText}
              </Text>
            </View>
            <View style={styles.metaTag}>
              <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{practice.duration}</Text>
            </View>
            <View style={styles.metaTag}>
              <Ionicons name="repeat-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{practice.frequency}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О практике</Text>
          <Text style={styles.description}>{practice.fullDescription}</Text>
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Пошаговая инструкция</Text>
          {practice.steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Brain Effects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Воздействие на мозг</Text>
          <View style={styles.effectsCard}>
            {practice.brainEffects.map((effect, index) => (
              <View key={index} style={styles.effectRow}>
                <View style={[
                  styles.effectIndicator, 
                  { backgroundColor: effect.positive ? COLORS.green : COLORS.red }
                ]} />
                <Text style={styles.effectName}>{effect.name}</Text>
                <Text style={[
                  styles.effectValue,
                  { color: effect.positive ? COLORS.green : COLORS.red }
                ]}>
                  {effect.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <View style={[styles.tipsCard, { backgroundColor: COLORS.greenDim }]}>
            <Text style={[styles.tipsTitle, { color: COLORS.green }]}>✓ Советы</Text>
            {practice.tips.map((tip, index) => (
              <Text key={index} style={styles.tipText}>• {tip}</Text>
            ))}
          </View>
        </View>

        {/* Warnings */}
        {practice.warnings.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.tipsCard, { backgroundColor: COLORS.redDim }]}>
              <Text style={[styles.tipsTitle, { color: COLORS.red }]}>⚠ Предостережения</Text>
              {practice.warnings.map((warning, index) => (
                <Text key={index} style={styles.tipText}>• {warning}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <LinearGradient
        colors={['transparent', COLORS.bgPrimary]}
        style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.md }]}
      >
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => {
            if (practice.isPremium) {
              navigation.navigate('Subscription');
            } else {
              navigation.navigate('Player', { practice });
            }
          }}
        >
          <LinearGradient
            colors={[COLORS.gold, COLORS.goldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            {practice.isPremium ? (
              <>
                <Ionicons name="diamond" size={22} color={COLORS.bgPrimary} />
                <Text style={styles.startButtonText}>Разблокировать</Text>
              </>
            ) : (
              <>
                <Ionicons name="play" size={22} color={COLORS.bgPrimary} />
                <Text style={styles.startButtonText}>Начать практику</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
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
    paddingBottom: SPACING.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.round,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.goldDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gold,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  effectsCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  effectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCard,
  },
  effectIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  effectName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  effectValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  startButton: {
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 18,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.bgPrimary,
  },
});
