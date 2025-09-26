'use client';

import { useState, useEffect } from 'react';

import { useUserPreferences } from '@/hooks/useUserPreferences';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import RevealElement from '@/components/3DRevealElement';
import { initAnalytics, trackMoodSelected, trackContextSelected, trackMoodContextCombination, trackMicroHabitRevealed, trackUserAction } from '@/lib/analytics';
import { getRandomMessage, type Mood, type Context } from '@/lib/content';
import { playMessageAudio } from '@/lib/audio';
import '@/components/3DComponents.css';

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
    
    // Remove animation classes
    const tokenElement = document.querySelector('.reveal-token');
    if (tokenElement) {
      tokenElement.classList.remove('opening', 'popping', 'pressing', 'unwrapping', 'sliding', 'glowing');
    }
  };

  // Backend logic: Auto-select micro-habit based on Mood + Context
  const getMicroHabit = (): MicroHabitData | null => {
    if (!selectedMood || !selectedContext) return null;

    // Get random message from content library
    const contentMessage = getRandomMessage(selectedMood as Mood, selectedContext as Context);
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

    return {
      action: contentMessage.message,
      actionType: contentMessage.actionType as 'ACTION' | 'REPEAT/RECITE' | 'VISUALIZE',
      message: contentMessage.message,
      revealToken,
      revealType,
      accentColor,
      animationSpeed: animationSpeed as 'rich' | 'quick' | 'gentle' | 'instant'
    };
  };

  const selectedMicroHabit = getMicroHabit();

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
