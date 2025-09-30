'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import { useUserPreferences } from '@/hooks/useUserPreferences';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import RevealElement from '@/components/3DRevealElement';
import { initAnalytics, trackMoodSelected, trackContextSelected, trackMoodContextCombination, trackMicroHabitRevealed, trackUserAction } from '@/lib/analytics';
import { getAllMessages, type Mood, type Context, type ContentMessage } from '@/lib/content';
import { playMessageAudio, stopAllNarration, registerExternalAudioStopper } from '@/lib/audio';
import '@/components/3DComponents.css';

type NormalizedActionType = 'ACTION' | 'REPEAT/RECITE' | 'VISUALIZE';

const normalizeActionType = (actionType: ContentMessage['actionType']): NormalizedActionType => {
  if (actionType === 'RECITE') return 'REPEAT/RECITE';
  return actionType;
};

const getRevealType = (mood: string, context: string): string => {
  if (context === 'moving' || context === 'focussed') {
    return 'playing-card';
  }
  if (mood === 'good') return 'treasure-chest';
  if (mood === 'okay') return 'balloon-pop';
  if (mood === 'bad') return 'envelope';
  if (mood === 'awful') return 'bandage';
  return 'treasure-chest';
};

const getRevealToken = (mood: string, context: string): string => {
  if (context === 'moving' || context === 'focussed') {
    return '🎴';
  }
  if (mood === 'good') return '💎';
  if (mood === 'okay') return '🎈';
  if (mood === 'bad') return '📩';
  if (mood === 'awful') return '🩹';
  return '🎴';
};

const getAccentColor = (actionType: NormalizedActionType): string => {
  if (actionType === 'VISUALIZE') return '#8B5CF6';
  if (actionType === 'REPEAT/RECITE') return '#10B981';
  return '#3B82F6';
};

const getAnimationSpeed = (mood: string, context: string): 'rich' | 'quick' | 'gentle' | 'instant' => {
  if (mood === 'good' && context === 'safe') return 'rich';
  if (mood === 'good' && context === 'moving') return 'quick';
  if (mood === 'good' && context === 'focussed') return 'instant';
  if (mood === 'okay' && context === 'safe') return 'rich';
  if (mood === 'okay' && context === 'moving') return 'quick';
  if (mood === 'okay' && context === 'focussed') return 'gentle';
  if (mood === 'bad' && context === 'safe') return 'rich';
  if (mood === 'bad' && context === 'moving') return 'quick';
  if (mood === 'bad' && context === 'focussed') return 'instant';
  if (mood === 'awful' && context === 'safe') return 'gentle';
  if (mood === 'awful' && (context === 'moving' || context === 'focussed')) return 'instant';
  return 'rich';
};

interface MicroHabitData {
  action: string;
  actionType: 'ACTION' | 'REPEAT/RECITE' | 'VISUALIZE';
  message: string;
  revealToken: string;
  revealType: string;
  accentColor: string;
  animationSpeed: 'rich' | 'quick' | 'gentle' | 'instant';
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const homepageAudioRef = useRef<HTMLAudioElement | null>(null);
  const repeatTimerRef = useRef<number | null>(null);
  const contentAudioRepeatRef = useRef<number | null>(null);
  const hasUserRespondedRef = useRef(false);
  const prevAudioEnabledRef = useRef(false);
  const prevScreenlessModeRef = useRef(false);
  const [currentContentIndex, setCurrentContentIndex] = useState<number | null>(null);
  const lastContentAudioKeyRef = useRef<string | null>(null);
  const reRevealTimeoutRef = useRef<number | null>(null);

  const availableMessages = useMemo<ContentMessage[]>(() => {
    if (!selectedMood || !selectedContext) return [];
    return getAllMessages(selectedMood as Mood, selectedContext as Context);
  }, [selectedMood, selectedContext]);

  const currentContent = useMemo<ContentMessage | null>(() => {
    if (currentContentIndex === null) return null;
    return availableMessages[currentContentIndex] ?? null;
  }, [availableMessages, currentContentIndex]);

  useEffect(() => {
    if (selectedMood && selectedContext && currentContentIndex === null && availableMessages.length > 0) {
      setCurrentContentIndex(0);
    }
  }, [selectedMood, selectedContext, currentContentIndex, availableMessages.length]);
  
  const {
    isDarkMode,
    audioEnabled,
    screenlessMode,
    toggleTheme,
    toggleReadAloud,
    toggleScreenless,
  } = useUserPreferences();

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    localStorage.setItem('currentMood', mood);
    // Track mood selection
    trackMoodSelected(mood);

    setCurrentContentIndex(null);
    stopHomepageAudio();
    hasUserRespondedRef.current = true;
    lastContentAudioKeyRef.current = null;
    clearContentAudioRepeat();
  };

  const handleContextSelection = (context: string) => {
    setSelectedContext(context);
    localStorage.setItem('currentContext', context);
    // Track context selection
    trackContextSelected(context);

    if (selectedMood) {
      setCurrentContentIndex(null);
    }
    stopHomepageAudio();
    hasUserRespondedRef.current = true;
    lastContentAudioKeyRef.current = null;
    clearContentAudioRepeat();
  };

  const clearRepeatTimer = useCallback(() => {
    if (repeatTimerRef.current) {
      clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  }, []);

  const clearContentAudioRepeat = useCallback(() => {
    if (contentAudioRepeatRef.current) {
      clearTimeout(contentAudioRepeatRef.current);
      contentAudioRepeatRef.current = null;
    }
  }, []);

  const clearReRevealTimeout = useCallback(() => {
    if (reRevealTimeoutRef.current) {
      clearTimeout(reRevealTimeoutRef.current);
      reRevealTimeoutRef.current = null;
    }
  }, []);

  const stopHomepageAudio = useCallback((options?: { skipGlobalStop?: boolean }) => {
    const audio = homepageAudioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.onended = null;
      homepageAudioRef.current = null;
    }
    clearRepeatTimer();
    clearContentAudioRepeat();
    if (!options?.skipGlobalStop) {
      stopAllNarration();
    }
  }, [clearRepeatTimer, clearContentAudioRepeat, stopAllNarration]);

  useEffect(() => {
    const unregister = registerExternalAudioStopper(() => stopHomepageAudio({ skipGlobalStop: true }));
    return () => {
      unregister();
    };
  }, [stopHomepageAudio]);

  const playHomepageAudio = useCallback(() => {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return;

    hasUserRespondedRef.current = false;
    clearRepeatTimer();
    clearContentAudioRepeat();
    stopAllNarration();

    const existingAudio = homepageAudioRef.current;
    if (existingAudio) {
      existingAudio.pause();
      existingAudio.currentTime = 0;
      existingAudio.onended = null;
    }

    const audio = new Audio('/Audio/homepage audio.mp3');
    homepageAudioRef.current = audio;

    const scheduleRepeat = () => {
      clearRepeatTimer();
      repeatTimerRef.current = window.setTimeout(() => {
        if (!hasUserRespondedRef.current) {
          playHomepageAudio();
        }
      }, 5 * 60 * 1000);
    };

    const handleAudioEnded = () => {
      audio.onended = null;
      if (!hasUserRespondedRef.current) {
        scheduleRepeat();
      }
    };

    audio.onended = handleAudioEnded;

    audio.play().catch((error) => {
      console.error('[audio] Failed to play homepage audio:', error);
      if (!hasUserRespondedRef.current) {
        scheduleRepeat();
      }
    });
  }, [clearRepeatTimer, clearContentAudioRepeat, stopAllNarration]);

  const playContentAudio = useCallback((content: ContentMessage) => {
    if (!content || !selectedMood || !selectedContext) return;

    const normalizedActionType = normalizeActionType(content.actionType);
    const messageKey = `${selectedMood}-${selectedContext}-${content.message}`;

    if (!audioEnabled && !screenlessMode) {
      lastContentAudioKeyRef.current = null;
      clearContentAudioRepeat();
      return;
    }

    stopAllNarration();
    clearContentAudioRepeat();

    playMessageAudio(undefined, `${normalizedActionType}: ${content.message}`, {
      mood: selectedMood,
      context: selectedContext,
      audioIndex: (content.audioIndex ?? availableMessages.indexOf(content) + 1) || 1,
      preferExactIndex: !!content.audioIndex,
      voiceHintNames: ['Samantha','Google UK English Female','Microsoft Zira'],
    }).then(() => {
      lastContentAudioKeyRef.current = messageKey;
      contentAudioRepeatRef.current = window.setTimeout(() => {
        if (lastContentAudioKeyRef.current === messageKey) {
          playContentAudio(content);
        }
      }, 5 * 60 * 1000);
    }).catch((error) => {
      console.error('[audio] Failed to play content audio:', error);
    });
  }, [selectedMood, selectedContext, availableMessages, clearContentAudioRepeat]);

  // Load saved mood and context on component mount
  useEffect(() => {
    // Initialize analytics
    initAnalytics();
    
    // Clear any existing selections to start fresh
    localStorage.removeItem('currentMood');
    localStorage.removeItem('currentContext');
    setSelectedMood(null);
    setSelectedContext(null);
    setShowReveal(false);
    setIsRevealed(false);
    prevAudioEnabledRef.current = audioEnabled;
    prevScreenlessModeRef.current = screenlessMode;

    return () => {
      stopHomepageAudio();
    };
  }, []);

  // Auto-navigate to reveal when both mood and context are selected
  useEffect(() => {
    if (selectedMood && selectedContext) {
      // Track mood-context combination
      trackMoodContextCombination(selectedMood, selectedContext);

      if (!hasUserRespondedRef.current) {
        hasUserRespondedRef.current = true;
      }
      stopHomepageAudio();
      
      // Small delay to show the selection state before revealing
      const timer = setTimeout(() => {
        setShowReveal(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedMood, selectedContext]);

  useEffect(() => {
    const prevAudioEnabled = prevAudioEnabledRef.current;
    const prevScreenlessMode = prevScreenlessModeRef.current;

    const audioJustEnabled = !prevAudioEnabled && audioEnabled;
    const screenlessJustEnabled = !prevScreenlessMode && screenlessMode;

    if (audioJustEnabled || screenlessJustEnabled) {
      hasUserRespondedRef.current = false;
      playHomepageAudio();
    }

    if (!audioEnabled && !screenlessMode) {
      stopHomepageAudio();
      hasUserRespondedRef.current = false;
    }

    prevAudioEnabledRef.current = audioEnabled;
    prevScreenlessModeRef.current = screenlessMode;
  }, [audioEnabled, screenlessMode]);



  const handleReveal = () => {
    const tokenElement = document.querySelector('.reveal-token');
    if (!selectedMicroHabit) return;

    // Add opening animation class based on reveal type
    if (selectedMicroHabit.revealType === 'treasure-chest') {
      if (tokenElement) tokenElement.classList.add('opening');
    } else if (selectedMicroHabit.revealType === 'balloon-pop') {
      if (tokenElement) tokenElement.classList.add('popping');
    } else if (selectedMicroHabit.revealType === 'envelope') {
      if (tokenElement) tokenElement.classList.add('opening');
    } else if (selectedMicroHabit.revealType === 'bandage') {
      if (tokenElement) tokenElement.classList.add('unwrapping');
    } else if (selectedMicroHabit.revealType === 'ribbon-slide') {
      if (tokenElement) tokenElement.classList.add('sliding');
    } else if (selectedMicroHabit.revealType === 'glow-patch') {
      if (tokenElement) tokenElement.classList.add('glowing');
    } else if (selectedMicroHabit.revealType === 'auto-flip') {
      // Auto-flip doesn't need manual trigger
      setIsRevealed(true);
      return;
    } else if (selectedMicroHabit.revealType === 'stamp') {
      if (tokenElement) tokenElement.classList.add('pressing');
    }

    // Wait for animation to complete before revealing
    const animationDuration = selectedMicroHabit.animationSpeed === 'instant' ? 100 : 
                             selectedMicroHabit.animationSpeed === 'quick' ? 300 : 
                             selectedMicroHabit.animationSpeed === 'gentle' ? 800 : 600;

    setTimeout(() => {
      setIsRevealed(true);
      
      // Track micro-habit reveal
      if (selectedMicroHabit && selectedMood && selectedContext) {
        trackMicroHabitRevealed(selectedMood, selectedContext, selectedMicroHabit.revealType, selectedMicroHabit.actionType);
      }
      
      // Auto-play pre-generated audio (fallback to TTS) if enabled
      if (audioEnabled && selectedMicroHabit) {
        // Play audio that matches what's displayed on screen
        const fullMessage = `${selectedMicroHabit.actionType}: ${selectedMicroHabit.action}`;
        playMessageAudio(undefined, fullMessage, {
          rate: 0.9,
          pitch: 1,
          volume: 0.8,
          voiceHintNames: ['Samantha','Google UK English Female','Microsoft Zira'],
          mood: selectedMood || undefined,
          context: selectedContext || undefined,
          isHomepage: false
        });
      }
    }, animationDuration);
  };

  const handleStartOver = () => {
    // Track user action
    trackUserAction('start_over', selectedMood || undefined, selectedContext || undefined);
    
    localStorage.removeItem('currentMood');
    localStorage.removeItem('currentContext');
    setSelectedMood(null);
    setSelectedContext(null);
    setShowReveal(false);
    setIsRevealed(false);
    hasUserRespondedRef.current = false;
    lastContentAudioKeyRef.current = null;
    clearContentAudioRepeat();
    clearReRevealTimeout();

    if (audioEnabled || screenlessMode) {
      playHomepageAudio();
    } else {
      stopHomepageAudio();
    }
    
    // Remove animation classes
    const tokenElement = document.querySelector('.reveal-token');
    if (tokenElement) {
      tokenElement.classList.remove('opening', 'popping', 'pressing', 'unwrapping', 'sliding', 'glowing');
    }
  };

  const handleTryAnother = () => {
    // Track user action
    trackUserAction('try_another', selectedMood || undefined, selectedContext || undefined);
    
    setShowReveal(false);
    setIsRevealed(false);
    hasUserRespondedRef.current = true;
    lastContentAudioKeyRef.current = null;
    clearContentAudioRepeat();
    clearReRevealTimeout();
    stopAllNarration();

    if (availableMessages.length > 0) {
      reRevealTimeoutRef.current = window.setTimeout(() => {
        setCurrentContentIndex((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % availableMessages.length;
        });
        setShowReveal(true);
      }, 400);
    }
    
    // Remove animation classes
    const tokenElement = document.querySelector('.reveal-token');
    if (tokenElement) {
      tokenElement.classList.remove('opening', 'popping', 'pressing', 'unwrapping', 'sliding', 'glowing');
    }
  };

  // Backend logic: Auto-select micro-habit based on Mood + Context
  const getMicroHabit = (): MicroHabitData | null => {
    if (!selectedMood || !selectedContext) return null;

    const contentMessage = currentContent;
    if (!contentMessage) return null;

    // Map content to micro-habit format with appropriate styling
    const actionType = normalizeActionType(contentMessage.actionType);
    const revealType = getRevealType(selectedMood, selectedContext);
    const revealToken = getRevealToken(selectedMood, selectedContext);
    const accentColor = getAccentColor(actionType);
    const animationSpeed = getAnimationSpeed(selectedMood, selectedContext);

    return {
      action: contentMessage.message,
      actionType,
      message: contentMessage.message,
      revealToken,
      revealType,
      accentColor,
      animationSpeed: animationSpeed as 'rich' | 'quick' | 'gentle' | 'instant'
    };
  };

  const selectedMicroHabit = getMicroHabit();

  useEffect(() => {
    if (currentContent && (audioEnabled || screenlessMode) && showReveal) {
      playContentAudio(currentContent);
    }

    if (!audioEnabled && !screenlessMode) {
      lastContentAudioKeyRef.current = null;
      clearContentAudioRepeat();
      stopAllNarration();
    }
  }, [currentContent, audioEnabled, screenlessMode, showReveal, playContentAudio, clearContentAudioRepeat]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Background />
      
      <Header
        isDarkMode={isDarkMode}
        audioEnabled={audioEnabled}
        screenlessMode={screenlessMode}
        onToggleTheme={toggleTheme}
        onToggleReadAloud={toggleReadAloud}
        onToggleScreenless={toggleScreenless}
      />

      <main className="flex-1 flex flex-col">
        <section className="screen active">
          <div className="container">
            {!showReveal ? (
              <>
                {/* Instructions */}
                <div className="instructions-section">
                  <p className="instruction-text">
                    Select both your mood and current situation to continue
                  </p>
                  <p className="instruction-subtext">
                    We&apos;ll automatically create a personalized experience just for you
                  </p>
                </div>

                {/* Main Questions Section */}
                <div className="main-questions-container">
                  {/* Mood Question */}
                  <div className="question-section mood-section">
                    <div className="question-header">
                      <h2 className="font-inter font-semibold">How are you feeling today?</h2>
                    </div>
                    <div className="mood-buttons">
                      <button 
                        className={`mood-btn glass-card ${selectedMood === 'good' ? 'selected' : 'good'}`}
                        onClick={() => handleMoodSelection('good')}
                        data-mood="good"
                      >
                        <div className="mood-content">
                          <span className="mood-emoji">😊</span>
                          <span className="mood-text font-inter">Good</span>
                        </div>

                      </button>
                      <button 
                        className={`mood-btn glass-card ${selectedMood === 'okay' ? 'selected' : 'okay'}`}
                        onClick={() => handleMoodSelection('okay')}
                        data-mood="okay"
                      >
                        <div className="mood-content">
                          <span className="mood-emoji">😐</span>
                          <span className="mood-text font-inter">Okay</span>
                        </div>

                      </button>
                      <button 
                        className={`mood-btn glass-card ${selectedMood === 'bad' ? 'selected' : 'bad'}`}
                        onClick={() => handleMoodSelection('bad')}
                        data-mood="bad"
                      >
                        <div className="mood-content">
                          <span className="mood-emoji">😔</span>
                          <span className="mood-text font-inter">Bad</span>
                        </div>

                      </button>
                      <button 
                        className={`mood-btn glass-card ${selectedMood === 'awful' ? 'selected' : 'awful'}`}
                        onClick={() => handleMoodSelection('awful')}
                        data-mood="awful"
                      >
                        <div className="mood-content">
                          <span className="mood-emoji">😢</span>
                          <span className="mood-text font-inter">Awful</span>
                        </div>

                      </button>
                    </div>
                  </div>

                  {/* Context Question */}
                  <div className="question-section context-section">
                    <div className="question-header">
                      <h2 className="font-inter font-semibold">Where are you right now?</h2>
                    </div>
                    <div className="context-buttons">
                      <button 
                        className={`context-btn glass-card ${selectedContext === 'safe' ? 'selected' : 'safe'}`}
                        onClick={() => handleContextSelection('safe')}
                        data-context="safe"
                      >
                        <div className="context-content">
                          <span className="context-icon">🪑</span>
                          <span className="context-text font-inter font-medium">Still & Safe Place</span>
                        </div>

                      </button>
                      <button 
                        className={`context-btn glass-card ${selectedContext === 'moving' ? 'selected' : 'moving'}`}
                        onClick={() => handleContextSelection('moving')}
                        data-context="moving"
                      >
                        <div className="context-content">
                          <span className="context-icon">🚶</span>
                          <span className="context-text font-inter font-medium">On the Move, but Safe</span>
                        </div>

                      </button>
                      <button 
                        className={`context-btn glass-card ${selectedContext === 'focussed' ? 'selected' : 'focussed'}`}
                        onClick={() => handleContextSelection('focussed')}
                        data-context="focussed"
                      >
                        <div className="context-content">
                          <span className="context-icon">🎯</span>
                          <span className="context-text font-inter font-medium">On the Move and Focussed</span>
                        </div>

                      </button>
                    </div>
                  </div>
                </div>


              </>
            ) : (
              <>
                {/* Reveal Experience */}
                <div className="reveal-container">
                  {selectedMicroHabit?.revealType !== 'balloon-pop' && (
                    <div className="reveal-header">
                      <h2 className="font-inter font-semibold text-slate-900 dark:text-slate-100">
                        Your Personalized Experience
                      </h2>
                      <p className="reveal-subtitle font-inter text-slate-600 dark:text-slate-300">
                        Based on your mood: <span className="font-medium capitalize">{selectedMood}</span> • 
                        Location: <span className="font-medium">
                          {selectedContext === 'safe' ? 'Still & Safe Place' : 
                           selectedContext === 'moving' ? 'On the Move, but Safe' : 
                           'On the Move and Focussed'}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  {/* Render the computed reveal type based on mood/context mapping */}
                  <RevealElement
                    revealType={selectedMicroHabit?.revealType || 'playing-card'}
                    isRevealed={isRevealed}
                    onReveal={handleReveal}
                    accentColor={selectedMicroHabit?.accentColor || '#3B82F6'}
                    animationSpeed={selectedMicroHabit?.animationSpeed || 'rich'}
                    message={selectedMicroHabit?.message}
                    action={selectedMicroHabit?.action}
                    actionType={selectedMicroHabit?.actionType}
                    onStartOver={handleStartOver}
                    onTryAnother={handleTryAnother}
                    mood={selectedMood}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
