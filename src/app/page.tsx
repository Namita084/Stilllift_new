'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import { useUserPreferences } from '@/hooks/useUserPreferences';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import RevealElement from '@/components/3DRevealElement';
import TextBackButton from '@/components/TextBackButton';
import { initAnalytics, trackMoodSelected, trackContextSelected, trackMoodContextCombination, trackMicroHabitRevealed, trackUserAction } from '@/lib/analytics';
import { getRandomMessage, getAllMessages, type Mood, type Context, type ContentMessage } from '@/lib/content';
import { useAudioController } from '@/context/AudioControllerContext';
import '@/components/3DComponents.css';

interface MicroHabitData {
  action: string;
  actionType: 'ACTION' | 'REPEAT/RECITE' | 'VISUALIZE';
  message: string;
  revealToken: string;
  revealType: string;
  accentColor: string;
  animationSpeed: 'rich' | 'quick' | 'gentle' | 'instant';
  audioIndex?: number;
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sheetContent, setSheetContent] = useState<{ safe: ContentMessage[]; moving: ContentMessage[]; focussed: ContentMessage[] } | null>(null);
  
  const {
    isDarkMode,
    audioEnabled,
    screenlessMode,
    toggleTheme,
    toggleReadAloud,
    toggleScreenless,
    setScreenlessMode,
  } = useUserPreferences();

  const { playHomepageAudio, stopHomepageAudio, playTaskAudio, stopTaskAudio } = useAudioController();

  const prevAudioEnabled = useRef(audioEnabled);
  const lastAutoAudioKeyRef = useRef<string | null>(null);
  const prevShowRevealRef = useRef(showReveal);
  const prevScreenlessModeRef = useRef(screenlessMode);
  const hasInstantRevealRef = useRef(false);
  const hasTrackedRevealRef = useRef(false);

  useEffect(() => {
    const wasEnabled = prevAudioEnabled.current;
    prevAudioEnabled.current = audioEnabled;

    if (!showReveal && audioEnabled && !wasEnabled) {
      playHomepageAudio().catch((error) => {
        console.warn('[audio] Unable to start homepage audio:', error);
      });
    }

    if (!audioEnabled && wasEnabled) {
      stopTaskAudio();
      stopHomepageAudio();
    }
  }, [audioEnabled, showReveal, playHomepageAudio, stopHomepageAudio, stopTaskAudio]);

  useEffect(() => {
    if (showReveal) {
      stopHomepageAudio();
    }
  }, [showReveal, stopHomepageAudio]);

  useEffect(() => {
    const wasShowingReveal = prevShowRevealRef.current;
    prevShowRevealRef.current = showReveal;

    if (wasShowingReveal && !showReveal && audioEnabled) {
      playHomepageAudio().catch((error) => {
        console.warn('[audio] Unable to resume homepage audio:', error);
      });
    }
  }, [showReveal, audioEnabled, playHomepageAudio]);

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    localStorage.setItem('currentMood', mood);
    // Track mood selection
    trackMoodSelected(mood);
  };

  const handleContextSelection = (context: string) => {
    setSelectedContext(context);
    localStorage.setItem('currentContext', context);
    // Track context selection
    trackContextSelected(context);
  };

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

    // Fetch Google Sheet content (CSV export) once on load
    const controller = new AbortController();
    const loadSheet = async () => {
      try {
        const res = await fetch('https://docs.google.com/spreadsheets/d/12c1m52MTkfVhBMlE8Hr3VEeBBMjBR-Oe/export?format=csv&gid=1079777578', { signal: controller.signal });
        if (!res.ok) return;
        const csvText = await res.text();
        // Basic CSV parse (no commas inside cells expected for our columns A-C)
        const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
        const dataRows = lines.slice(1); // skip header row (STILL,MOVING,FOCUSED)
        const parseCell = (cell: string): ContentMessage | null => {
          const trimmed = cell.trim();
          if (!trimmed) return null;
          // Detect action type by bracket token like [ACTION] / [REPEAT/RECITE] / [VISUALIZE]
          const typeMatch = trimmed.match(/\[(ACTION|REPEAT\/RECITE|VISUALIZE)\]/i);
          const actionType = (typeMatch?.[1]?.toUpperCase() as ContentMessage['actionType']) || 'ACTION';
          const message = trimmed.replace(/\s*\[(ACTION|REPEAT\/RECITE|VISUALIZE)\]\s*/i, '').trim();
          return { actionType, message, displayTime: 120 };
        };
        const safe: ContentMessage[] = [];
        const moving: ContentMessage[] = [];
        const focussed: ContentMessage[] = [];
        for (const row of dataRows) {
          const cols = row.split(',');
          if (cols[0]) { const m = parseCell(cols[0]); if (m) safe.push(m); }
          if (cols[1]) { const m = parseCell(cols[1]); if (m) moving.push(m); }
          if (cols[2]) { const m = parseCell(cols[2]); if (m) focussed.push(m); }
        }
        setSheetContent({ safe, moving, focussed });
      } catch (_) {
        // Silently fall back to local content library
      }
      return () => controller.abort();
    };
    loadSheet();
  }, []);

  // Auto-navigate to reveal when both mood and context are selected
  useEffect(() => {
    if (selectedMood && selectedContext) {
      // Track mood-context combination
      trackMoodContextCombination(selectedMood, selectedContext);
      
      // Small delay to show the selection state before revealing
      const timer = setTimeout(() => {
        setShowReveal(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedMood, selectedContext]);

  // Backend logic: Auto-select micro-habit based on Mood + Context
  const getMicroHabit = (): MicroHabitData | null => {
    if (!selectedMood || !selectedContext) return null;

    // Prefer Google Sheet content if loaded (pick a random item for variety)
    let contentMessage: ContentMessage | null = null;
    let sheetChosenIndex: number | null = null;
    // For Good + On the move, force local library (skip Sheet)
    if (sheetContent && !(selectedMood === 'good' && selectedContext === 'moving')) {
      const source = selectedContext === 'safe'
        ? sheetContent.safe
        : selectedContext === 'moving'
          ? sheetContent.moving
          : sheetContent.focussed;
      if (source && source.length > 0) {
        sheetChosenIndex = Math.floor(Math.random() * source.length);
        contentMessage = source[sheetChosenIndex] ?? null;
      }
    }
    // Fallback to local content if sheet not loaded or empty
    if (!contentMessage) {
      contentMessage = getRandomMessage(selectedMood as Mood, selectedContext as Context);
    }
    if (!contentMessage) return null;

    // Map content to micro-habit format with appropriate styling
    const getActionType = (mood: string, context: string): 'ACTION' | 'REPEAT/RECITE' | 'VISUALIZE' => {
      if (mood === 'good' && context === 'safe') return 'VISUALIZE';
      if (mood === 'good' && (context === 'moving' || context === 'focussed')) return 'ACTION';
      if (mood === 'okay' && context === 'safe') return 'ACTION';
      if (mood === 'okay' && context === 'moving') return 'REPEAT/RECITE';
      if (mood === 'okay' && context === 'focussed') return 'VISUALIZE';
      if (mood === 'bad') return 'REPEAT/RECITE';
      if (mood === 'awful') return 'ACTION';
      return 'ACTION';
    };

    const getRevealType = (mood: string, context: string): string => {
      // Card experience only for moving contexts; safe context uses mood-specific tokens
      if (context === 'moving' || context === 'focussed') {
        return 'playing-card';
      }
      // Still & Safe Place
      if (mood === 'good') return 'treasure-chest';
      if (mood === 'okay') return 'balloon-pop';
      if (mood === 'bad') return 'envelope';
      if (mood === 'awful') return 'bandage';
      return 'treasure-chest';
    };

  const getRevealToken = (mood: string, context: string): string => {
    // Card glyph for moving/focussed; emoji tokens for safe context per mood
    if (context === 'moving' || context === 'focussed') {
      return '🎴';
    }
    if (mood === 'good') return '💎'; // treasure chest theme
    if (mood === 'okay') return '🎈'; // balloon/confetti theme
    if (mood === 'bad') return '📩'; // envelope/message theme
    if (mood === 'awful') return '🩹'; // bandage/prescription theme
    return '🎴';
  };

    const getAccentColor = (actionType: string): string => {
      if (actionType === 'VISUALIZE') return '#8B5CF6'; // Purple
      if (actionType === 'REPEAT/RECITE') return '#10B981'; // Green
      return '#3B82F6'; // Blue for ACTION
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

    const actionType = getActionType(selectedMood, selectedContext);
    const revealType = getRevealType(selectedMood, selectedContext);
    const revealToken = getRevealToken(selectedMood, selectedContext);
    const accentColor = getAccentColor(actionType);
    const animationSpeed = getAnimationSpeed(selectedMood, selectedContext);

    // Determine the audio index
    // Prefer the index from the local library order (the canonical audio order).
    // If not found in local library, fall back to sheet index (if any), then to embedded audioIndex.
    const allForContext = getAllMessages(selectedMood as Mood, selectedContext as Context);
    const positionIndex = allForContext.findIndex(m => m.message === contentMessage!.message);
    let audioIndex: number | undefined = undefined;
    if (positionIndex >= 0) {
      audioIndex = positionIndex + 1;
    } else if (sheetChosenIndex !== null) {
      audioIndex = sheetChosenIndex + 1;
    } else {
      audioIndex = contentMessage.audioIndex;
    }

    return {
      action: contentMessage.message,
      actionType: contentMessage.actionType as 'ACTION' | 'REPEAT/RECITE' | 'VISUALIZE',
      message: contentMessage.message,
      revealToken,
      revealType,
      accentColor,
    animationSpeed: animationSpeed as 'rich' | 'quick' | 'gentle' | 'instant',
    audioIndex
    };
  };

  const selectedMicroHabit = getMicroHabit();

  const taskAudioPayload = useMemo(() => {
    if (!selectedMicroHabit) return null;
    const fullMessage = `${selectedMicroHabit.actionType}: ${selectedMicroHabit.action}`;
    return {
      message: fullMessage,
      options: {
        rate: 0.9,
        pitch: 1,
        volume: 0.8,
        voiceHintNames: ['Samantha', 'Google UK English Female', 'Microsoft Zira'],
        mood: selectedMood ?? undefined,
        context: selectedContext ?? undefined,
        isHomepage: false,
        audioIndex: selectedMicroHabit.audioIndex ?? undefined,
        preferExactIndex: true,
      },
    };
  }, [selectedMicroHabit, selectedMood, selectedContext]);

  useEffect(() => {
    hasInstantRevealRef.current = false;
    hasTrackedRevealRef.current = false;
  }, [selectedMicroHabit]);

  const recordRevealAnalytics = useCallback(() => {
    if (hasTrackedRevealRef.current) return;
    if (selectedMicroHabit && selectedMood && selectedContext) {
      trackMicroHabitRevealed(
        selectedMood,
        selectedContext,
        selectedMicroHabit.revealType,
        selectedMicroHabit.actionType
      );
      hasTrackedRevealRef.current = true;
    }
  }, [selectedMicroHabit, selectedMood, selectedContext]);

  const revealImmediately = useCallback(() => {
    if (!selectedMicroHabit || hasInstantRevealRef.current) return;

    hasInstantRevealRef.current = true;
    setShowReveal(true);
    setIsRevealed(true);
    recordRevealAnalytics();

    const tokenElement = document.querySelector('.reveal-token');
    if (tokenElement) {
      tokenElement.classList.remove('opening', 'popping', 'pressing', 'unwrapping', 'sliding', 'glowing');
    }
  }, [recordRevealAnalytics, selectedMicroHabit]);

  useEffect(() => {
    const wasScreenless = prevScreenlessModeRef.current;
    prevScreenlessModeRef.current = screenlessMode;

    if (wasScreenless && !screenlessMode && selectedContext === 'safe') {
      revealImmediately();
    }
  }, [screenlessMode, selectedContext, revealImmediately]);

  const handleReveal = useCallback(() => {
    if (!selectedMicroHabit) return;

    const tokenElement = document.querySelector('.reveal-token');

    if (selectedMicroHabit.revealType === 'treasure-chest') {
      tokenElement?.classList.add('opening');
    } else if (selectedMicroHabit.revealType === 'balloon-pop') {
      tokenElement?.classList.add('popping');
    } else if (selectedMicroHabit.revealType === 'envelope') {
      tokenElement?.classList.add('opening');
    } else if (selectedMicroHabit.revealType === 'bandage') {
      tokenElement?.classList.add('unwrapping');
    } else if (selectedMicroHabit.revealType === 'ribbon-slide') {
      tokenElement?.classList.add('sliding');
    } else if (selectedMicroHabit.revealType === 'glow-patch') {
      tokenElement?.classList.add('glowing');
    } else if (selectedMicroHabit.revealType === 'auto-flip') {
      setIsRevealed(true);
      recordRevealAnalytics();

      if (audioEnabled && !screenlessMode && taskAudioPayload) {
        // Ensure no previous audio (homepage or task) leaks through
        stopHomepageAudio();
        stopTaskAudio();
        playTaskAudio({
          message: taskAudioPayload.message,
          options: taskAudioPayload.options,
        }).catch((error) => {
          console.warn('[audio] Unable to play task audio:', error);
        });
      }
      return;
    } else if (selectedMicroHabit.revealType === 'stamp') {
      tokenElement?.classList.add('pressing');
    }

    const animationDuration = selectedMicroHabit.animationSpeed === 'instant' ? 100 :
      selectedMicroHabit.animationSpeed === 'quick' ? 300 :
      selectedMicroHabit.animationSpeed === 'gentle' ? 800 : 600;

    setTimeout(() => {
      setIsRevealed(true);
      recordRevealAnalytics();

      if (audioEnabled && !screenlessMode && taskAudioPayload && selectedMicroHabit.revealType !== 'treasure-chest') {
        // Ensure no previous audio (homepage or task) leaks through
        stopHomepageAudio();
        stopTaskAudio();
        playTaskAudio({
          message: taskAudioPayload.message,
          options: taskAudioPayload.options,
        }).catch((error) => {
          console.warn('[audio] Unable to play task audio:', error);
        });
      }
    }, animationDuration);
  }, [
    selectedMicroHabit,
    audioEnabled,
    screenlessMode,
    taskAudioPayload,
    recordRevealAnalytics,
    playTaskAudio,
  ]);

  const handleStartOver = useCallback(() => {
    trackUserAction('start_over', selectedMood || undefined, selectedContext || undefined);

    stopTaskAudio();
    stopHomepageAudio();
    lastAutoAudioKeyRef.current = null;
    hasInstantRevealRef.current = false;
    hasTrackedRevealRef.current = false;

    localStorage.removeItem('currentMood');
    localStorage.removeItem('currentContext');
    setSelectedMood(null);
    setSelectedContext(null);
    setShowReveal(false);
    setIsRevealed(false);

    const tokenElement = document.querySelector('.reveal-token');
    tokenElement?.classList.remove('opening', 'popping', 'pressing', 'unwrapping', 'sliding', 'glowing');
  }, [selectedMood, selectedContext, stopTaskAudio, stopHomepageAudio]);

  const handleTryAnother = useCallback(() => {
    trackUserAction('try_another', selectedMood || undefined, selectedContext || undefined);

    // Stay on the same screen; keep the reveal container mounted
    // Stop any playing task audio
    stopTaskAudio();

    // Reset the flip and immediately re-reveal to trigger a new random selection
    setIsRevealed(false);
    hasInstantRevealRef.current = false;
    hasTrackedRevealRef.current = false;

    const tokenElement = document.querySelector('.reveal-token');
    tokenElement?.classList.remove('opening', 'popping', 'pressing', 'unwrapping', 'sliding', 'glowing');

    setTimeout(() => {
      setIsRevealed(true);
    }, 40);
  }, [selectedMood, selectedContext, stopTaskAudio]);

  useEffect(() => {
    if (!showReveal || !taskAudioPayload || !selectedMicroHabit) {
      return;
    }

    stopHomepageAudio();

    if (!screenlessMode) {
      lastAutoAudioKeyRef.current = null;
      return;
    }

    if (selectedMicroHabit.revealType === 'treasure-chest') {
      // Let the TreasureChest component trigger its own audio based on the randomly selected index
      return;
    }

    const autoKey = `${taskAudioPayload.message}|${selectedMicroHabit.audioIndex ?? ''}|${selectedMood ?? ''}|${selectedContext ?? ''}`;
    if (lastAutoAudioKeyRef.current === autoKey) {
      return;
    }

    playTaskAudio({
      message: taskAudioPayload.message,
      options: taskAudioPayload.options,
    }).catch((error) => {
      console.warn('[audio] Screenless autoplay blocked:', error);
    });

    lastAutoAudioKeyRef.current = autoKey;
  }, [
    screenlessMode,
    showReveal,
    taskAudioPayload,
    selectedMicroHabit,
    selectedMood,
    selectedContext,
    playTaskAudio,
    stopHomepageAudio,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Background />
      {screenlessMode && showReveal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '20px',
            gap: '12px',
            cursor: 'pointer',
            zIndex: 9999,
          }}
          onClick={() => setScreenlessMode(false)}
          aria-label="Exit screenless mode"
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setScreenlessMode(false);
            }
          }}
        >
          <span style={{ fontSize: '48px', opacity: 0.8 }} aria-hidden="true">
            👁️
          </span>
          <p style={{ opacity: 0.9, fontSize: '20px', fontWeight: 500, letterSpacing: '0.01em' }}>
            Tap to return to normal mode
          </p>
        </div>
      )}
      {showReveal && (
        <div style={{ position: 'relative' }}>
          {/* No navbar button on home; contextual back below activities */}
        </div>
      )}
      
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
                    mood={selectedMood}
                    context={selectedContext}
                    onStartOver={handleStartOver}
                    onTryAnother={handleTryAnother}
                    onPlayNarration={(msg, tag, overrideMood, overrideContext, audioIndexOverride, preferExact) => {
                      // Route narration to task audio with exact index if provided
                      playTaskAudio({
                        message: `${tag ? tag + ': ' : ''}${msg}`,
                        options: {
                          rate: 0.9,
                          pitch: 1,
                          volume: 0.8,
                          voiceHintNames: ['Samantha', 'Google UK English Female', 'Microsoft Zira'],
                          mood: (overrideMood ?? selectedMood) ?? undefined,
                          context: (overrideContext ?? selectedContext) ?? undefined,
                          isHomepage: false,
                          audioIndex: audioIndexOverride ?? undefined,
                          preferExactIndex: preferExact ?? false,
                        }
                      }).catch((error) => {
                        console.warn('[audio] Narration play failed:', error);
                      });
                    }}
                  />
                  {showReveal && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                      <TextBackButton />
                    </div>
                  )}
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
