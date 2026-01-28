import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen({ route, navigation }) {
  const { practice } = route.params;
  const insets = useSafeAreaInsets();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalDuration] = useState(600); // 10 minutes in seconds
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    // Breathing animation
    const breatheIn = Animated.timing(breathAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    });
    const breatheOut = Animated.timing(breathAnim, {
      toValue: 0,
      duration: 4000,
      useNativeDriver: true,
    });
    
    const breathLoop = Animated.loop(
      Animated.sequence([breatheIn, breatheOut])
    );
    
    if (isPlaying) {
      breathLoop.start();
    } else {
      breathLoop.stop();
    }
    
    return () => breathLoop.stop();
  }, [isPlaying]);

  useEffect(() => {
    // Pulse animation for play button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    if (!isPlaying) {
      pulse.start();
    } else {
      pulse.stop();
      pulseAnim.setValue(1);
    }
    
    return () => pulse.stop();
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const togglePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = elapsedTime / totalDuration;
  
  const breathScale = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });
  
  const breathOpacity = breathAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  const breathText = breathAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[practice.color + '20', COLORS.bgPrimary, COLORS.bgPrimary]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-down" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>СЕЙЧАС ИГРАЕТ</Text>
          <Text style={styles.headerTitle}>{practice.title}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Visualization */}
      <View style={styles.visualContainer}>
        {/* Breathing circles */}
        <Animated.View 
          style={[
            styles.breathCircle,
            styles.breathCircle3,
            { 
              transform: [{ scale: breathScale }],
              opacity: breathOpacity,
              borderColor: practice.color,
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.breathCircle,
            styles.breathCircle2,
            { 
              transform: [{ scale: breathScale }],
              opacity: breathOpacity,
              borderColor: practice.color,
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.breathCircle,
            styles.breathCircle1,
            { 
              transform: [{ scale: breathScale }],
              opacity: breathOpacity,
              borderColor: practice.color,
            }
          ]}
        />
        
        {/* Center icon */}
        <View style={[styles.centerIcon, { backgroundColor: practice.colorDim }]}>
          <Text style={{ fontSize: 60 }}>{practice.icon}</Text>
        </View>
        
        {/* Breath instruction */}
        {isPlaying && (
          <Animated.Text 
            style={[
              styles.breathInstruction,
              { opacity: breathText }
            ]}
          >
            Вдох
          </Animated.Text>
        )}
        {isPlaying && (
          <Animated.Text 
            style={[
              styles.breathInstruction,
              { 
                opacity: breathAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0, 1],
                })
              }
            ]}
          >
            Выдох
          </Animated.Text>
        )}
      </View>

      {/* Current Step */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepLabel}>Шаг {currentStep + 1} из {practice.steps.length}</Text>
        <Text style={styles.stepTitle}>{practice.steps[currentStep]?.title}</Text>
        <Text style={styles.stepDesc}>{practice.steps[currentStep]?.description}</Text>
        
        <View style={styles.stepNav}>
          <TouchableOpacity 
            style={[styles.stepNavBtn, currentStep === 0 && styles.stepNavBtnDisabled]}
            onPress={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
          >
            <Ionicons name="chevron-back" size={20} color={currentStep === 0 ? COLORS.textMuted : COLORS.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.stepDots}>
            {practice.steps.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.stepDot,
                  index === currentStep && styles.stepDotActive,
                  { backgroundColor: index === currentStep ? practice.color : COLORS.textMuted }
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.stepNavBtn, currentStep === practice.steps.length - 1 && styles.stepNavBtnDisabled]}
            onPress={() => currentStep < practice.steps.length - 1 && setCurrentStep(currentStep + 1)}
            disabled={currentStep === practice.steps.length - 1}
          >
            <Ionicons name="chevron-forward" size={20} color={currentStep === practice.steps.length - 1 ? COLORS.textMuted : COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress & Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + SPACING.lg }]}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(elapsedTime)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: practice.color }]} />
          </View>
          <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
        </View>

        {/* Control buttons */}
        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="play-back" size={32} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: practice.color }]}
              onPress={togglePlay}
            >
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={36} 
                color={COLORS.bgPrimary} 
                style={!isPlaying && { marginLeft: 4 }}
              />
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="play-forward" size={32} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
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
    paddingBottom: SPACING.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  moreButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  breathCircle: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
  },
  breathCircle1: {
    width: 180,
    height: 180,
  },
  breathCircle2: {
    width: 240,
    height: 240,
  },
  breathCircle3: {
    width: 300,
    height: 300,
  },
  centerIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathInstruction: {
    position: 'absolute',
    bottom: 60,
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  stepContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  stepNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.lg,
  },
  stepNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNavBtnDisabled: {
    opacity: 0.5,
  },
  stepDots: {
    flexDirection: 'row',
    gap: 6,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepDotActive: {
    width: 24,
  },
  controls: {
    paddingHorizontal: SPACING.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontVariant: ['tabular-nums'],
    width: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.bgCard,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  controlBtn: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
