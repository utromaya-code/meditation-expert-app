import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen({ route, navigation }) {
  const { 
    practice, 
    duration = 600, 
    backgroundSound = 'none',
    intervalEnabled = false,
    intervalMinutes = 5,
  } = route.params;
  const insets = useSafeAreaInsets();
  const { saveSession, newAchievements, clearNewAchievements } = useApp();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalDuration] = useState(duration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [preparationPhase, setPreparationPhase] = useState(true);
  const [preparationCountdown, setPreparationCountdown] = useState(3);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const preparationRef = useRef(null);
  const intervalRef = useRef(null);
  const sessionSaved = useRef(false);
  const backgroundSoundRef = useRef(null);
  const lastIntervalTime = useRef(0);

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

  // Фаза подготовки
  useEffect(() => {
    if (preparationPhase && preparationCountdown > 0) {
      preparationRef.current = setTimeout(() => {
        if (preparationCountdown > 1) {
          setPreparationCountdown(preparationCountdown - 1);
          if (Haptics) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        } else {
          setPreparationPhase(false);
          setIsPlaying(true);
        }
      }, 1000);
    }
    
    return () => {
      if (preparationRef.current) {
        clearTimeout(preparationRef.current);
      }
    };
  }, [preparationPhase, preparationCountdown]);

  // Основной таймер
  useEffect(() => {
    if (isPlaying && !preparationPhase) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          
          // Интервальные сигналы
          if (intervalEnabled && intervalMinutes > 0) {
            const minutesElapsed = Math.floor(newTime / 60);
            const lastMinutes = Math.floor(lastIntervalTime.current / 60);
            
            if (minutesElapsed > lastMinutes && minutesElapsed % intervalMinutes === 0 && minutesElapsed > 0) {
              lastIntervalTime.current = newTime;
              if (Haptics) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              }
            }
          }
          
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            setIsCompleted(true);
            clearInterval(timerRef.current);
            if (Haptics) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            handleSessionComplete(newTime);
            return newTime;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isPlaying, preparationPhase, intervalEnabled, intervalMinutes, totalDuration]);

  // Фоновый звук
  useEffect(() => {
    if (backgroundSound !== 'none' && isPlaying && !preparationPhase) {
      loadBackgroundSound();
    } else {
      stopBackgroundSound();
    }
    
    return () => {
      stopBackgroundSound();
    };
  }, [backgroundSound, isPlaying, preparationPhase]);

  const loadBackgroundSound = async () => {
    try {
      // В реальном приложении здесь будут реальные файлы звуков
      // Пока используем тишину, но структура готова
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      
      // Для демо просто создаём пустой звук
      // В продакшене: const { sound } = await Audio.Sound.createAsync(
      //   require(`../assets/sounds/${backgroundSound}.mp3`),
      //   { isLooping: true, volume: 0.3 }
      // );
      // backgroundSoundRef.current = sound;
      // await sound.playAsync();
    } catch (error) {
      console.log('Error loading background sound:', error);
    }
  };

  const stopBackgroundSound = async () => {
    if (backgroundSoundRef.current) {
      try {
        await backgroundSoundRef.current.stopAsync();
        await backgroundSoundRef.current.unloadAsync();
        backgroundSoundRef.current = null;
      } catch (error) {
        console.log('Error stopping background sound:', error);
      }
    }
  };

  // Показать достижение
  useEffect(() => {
    if (newAchievements && newAchievements.length > 0) {
      const achievement = newAchievements[0];
      Alert.alert(
        '🎉 Новое достижение!',
        `${achievement.title}\n${achievement.description}`,
        [{ text: 'Отлично!', onPress: clearNewAchievements }]
      );
    }
  }, [newAchievements]);

  // Сохранение сессии
  const handleSessionComplete = async (duration) => {
    if (sessionSaved.current) return;
    sessionSaved.current = true;
    
    try {
      const session = await saveSession({
        practiceId: practice.id,
        practiceTitle: practice.title,
        duration: duration,
        completedSteps: currentStep + 1,
        totalSteps: practice.steps.length,
      });
      
      // Предлагаем записать в дневник через 2 секунды
      setTimeout(() => {
        Alert.alert(
          '🎉 Практика завершена!',
          'Хотите записать свои ощущения в дневник?',
          [
            { text: 'Пропустить', style: 'cancel' },
            { 
              text: 'Записать', 
              onPress: () => navigation.navigate('Journal', {
                sessionId: session.id,
                practiceTitle: practice.title,
              })
            },
          ]
        );
      }, 2000);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // Сохранение при ручном завершении (кнопка назад)
  const handleClose = async () => {
    if (elapsedTime > 60 && !sessionSaved.current) {
      // Сохраняем если прошло больше минуты
      await handleSessionComplete(elapsedTime);
    }
    navigation.goBack();
  };

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
          onPress={handleClose}
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
        {/* Preparation Phase */}
        {preparationPhase && (
          <View style={styles.preparationContainer}>
            <Text style={styles.preparationText}>Приготовьтесь</Text>
            <Text style={styles.preparationCountdown}>{preparationCountdown}</Text>
            <Text style={styles.preparationHint}>Сделайте глубокий вдох</Text>
          </View>
        )}

        {/* Main Visualization */}
        {!preparationPhase && (
          <>
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
            
            {/* Background sound indicator */}
            {backgroundSound !== 'none' && (
              <View style={styles.soundIndicator}>
                <Ionicons name="musical-notes" size={16} color={COLORS.textMuted} />
                <Text style={styles.soundIndicatorText}>
                  {backgroundSound === 'rain' ? '🌧️' :
                   backgroundSound === 'ocean' ? '🌊' :
                   backgroundSound === 'forest' ? '🌲' :
                   backgroundSound === 'fire' ? '🔥' :
                   backgroundSound === 'wind' ? '💨' : ''}
                </Text>
              </View>
            )}
            
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
          </>
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
  preparationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  preparationText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  preparationCountdown: {
    fontSize: 120,
    fontWeight: '700',
    color: COLORS.gold,
    lineHeight: 140,
  },
  preparationHint: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.lg,
  },
  soundIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCard + 'CC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  soundIndicatorText: {
    fontSize: 14,
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
