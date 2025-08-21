'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import RevealElement from '@/components/3DRevealElement';
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
  const router = useRouter();
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
  };

  const handleContextSelection = (context: string) => {
    setSelectedContext(context);
    localStorage.setItem('currentContext', context);
  };

  const handleContinue = () => {
    setShowReveal(true);
  };

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
      
      // Auto-speak the message if audio is enabled
      if (audioEnabled && selectedMicroHabit) {
        const utterance = new SpeechSynthesisUtterance(selectedMicroHabit.message);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    }, animationDuration);
  };

  const handleStartOver = () => {
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

    const microHabits = {
      good: {
        safe: {
          action: "Practice gratitude by naming three things you appreciate right now",
          actionType: "VISUALIZE" as const,
          message: "Take a moment to appreciate this feeling. You're doing well, and that's worth celebrating. Consider writing down one thing that made today special.",
          revealToken: "🎁",
          revealType: "treasure-chest",
          accentColor: "#10B981", // Green for VISUALIZE
          animationSpeed: "rich" as const // Rich animation for Still & Safe
        },
        moving: {
          action: "Share your positive energy with someone who might need it",
          actionType: "ACTION" as const,
          message: "Your positive energy is contagious! Share a smile with someone today - it might be exactly what they need.",
          revealToken: "🎀",
          revealType: "ribbon-slide",
          accentColor: "#3B82F6", // Blue for ACTION
          animationSpeed: "quick" as const // Quick animation for On the Move
        },
        focussed: {
          action: "Focus on one task and give it your full attention for 10 minutes",
          actionType: "ACTION" as const,
          message: "Your focused energy is powerful! Channel it into one meaningful task. You'll be amazed at what you can accomplish.",
          revealToken: "🎯",
          revealType: "auto-flip",
          accentColor: "#F59E0B", // Amber for ACTION
          animationSpeed: "instant" as const // Instant animation for Focused state
        }
      },
      okay: {
        safe: {
          action: "Try a simple stretching routine to boost your energy",
          actionType: "ACTION" as const,
          message: "It's perfectly normal to feel okay. Sometimes 'okay' is exactly where we need to be. Take a few deep breaths and acknowledge this moment.",
          revealToken: "🎈",
          revealType: "balloon-pop",
          accentColor: "#F59E0B", // Amber for ACTION
          animationSpeed: "rich" as const // Rich animation for Still & Safe
        },
        moving: {
          action: "Listen to a favorite song or podcast",
          actionType: "REPEAT/RECITE" as const,
          message: "Okay is a perfectly valid feeling. As you move, let the rhythm of your steps help you find your center.",
          revealToken: "🎀",
          revealType: "ribbon-slide",
          accentColor: "#8B5CF6", // Purple for RECITE
          animationSpeed: "quick" as const // Quick animation for On the Move
        },
        focussed: {
          action: "Take a 2-minute break to reset your focus",
          actionType: "VISUALIZE" as const,
          message: "Sometimes the best way to stay focused is to take a brief reset. Close your eyes and visualize your goal clearly.",
          revealToken: "🎯",
          revealType: "stamp",
          accentColor: "#8B5CF6", // Purple for VISUALIZE
          animationSpeed: "gentle" as const // Gentle animation for Focused reset
        }
      },
      bad: {
        safe: {
          action: "Take five deep breaths, counting to four on inhale and six on exhale",
          actionType: "REPEAT/RECITE" as const,
          message: "I see you're having a tough time. That's okay - difficult feelings are part of being human. You don't have to figure everything out right now.",
          revealToken: "✉️",
          revealType: "envelope",
          accentColor: "#06B6D4", // Cyan for RECITE
          animationSpeed: "rich" as const // Rich animation for Still & Safe
        },
        moving: {
          action: "Try the 5-4-3-2-1 grounding technique",
          actionType: "REPEAT/RECITE" as const,
          message: "I understand this is hard. Sometimes movement can help shift our energy. Focus on putting one foot in front of the other.",
          revealToken: "✨",
          revealType: "glow-patch",
          accentColor: "#84CC16", // Lime for RECITE
          animationSpeed: "quick" as const // Quick animation for On the Move
        },
        focussed: {
          action: "Use focused breathing to calm your mind",
          actionType: "REPEAT/RECITE" as const,
          message: "When things feel overwhelming, focus can be your anchor. Breathe in for 4, hold for 4, breathe out for 6.",
          revealToken: "🎯",
          revealType: "auto-flip",
          accentColor: "#84CC16", // Lime for RECITE
          animationSpeed: "instant" as const // Instant animation for Focused breathing
        }
      },
      awful: {
        safe: {
          action: "Reach out to someone you trust - you don't have to go through this alone",
          actionType: "ACTION" as const,
          message: "I'm so sorry you're feeling this way. You don't have to go through this alone. Is there someone you can call right now?",
          revealToken: "🩹",
          revealType: "bandage",
          accentColor: "#EF4444", // Red for ACTION
          animationSpeed: "gentle" as const // Gentle animation for Awful mood
        },
        moving: {
          action: "Find a quiet, safe space to sit and breathe",
          actionType: "ACTION" as const,
          message: "I know this is incredibly difficult. If you're safe to do so, try to find a quiet place to sit and breathe for a moment.",
          revealToken: "✨",
          revealType: "glow-patch",
          accentColor: "#A855F7", // Purple for ACTION
          animationSpeed: "instant" as const // Instant for Awful + On the Move
        },
        focussed: {
          action: "Focus on one small, achievable task",
          actionType: "ACTION" as const,
          message: "When everything feels impossible, focus on just one small thing. You don't have to solve everything at once.",
          revealToken: "🎯",
          revealType: "auto-flip",
          accentColor: "#A855F7", // Purple for ACTION
          animationSpeed: "instant" as const // Instant for Awful + Focused
        }
      }
    };

    return microHabits[selectedMood as keyof typeof microHabits]?.[selectedContext as keyof typeof microHabits.good] || null;
  };

  const selectedMicroHabit = getMicroHabit();
  const canShowReveal = selectedMood && selectedContext;

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
                        <div className="accent-blob good-blob"></div>
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
                        <div className="accent-blob okay-blob"></div>
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
                        <div className="accent-blob bad-blob"></div>
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
                        <div className="accent-blob awful-blob"></div>
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
                          <div className="context-text-group">
                            <span className="context-text font-inter font-medium">Still & Safe Place</span>
                            <span className="context-subtitle font-inter text-sm">(seated, able to interact physically)</span>
                          </div>
                        </div>
                        <div className="accent-blob safe-blob"></div>
                      </button>
                      <button 
                        className={`context-btn glass-card ${selectedContext === 'moving' ? 'selected' : 'moving'}`}
                        onClick={() => handleContextSelection('moving')}
                        data-context="moving"
                      >
                        <div className="context-content">
                          <span className="context-icon">🚶</span>
                          <div className="context-text-group">
                            <span className="context-text font-inter font-medium">On the Move, but Safe</span>
                            <span className="context-subtitle font-inter text-sm">(walking, commuting, etc.)</span>
                          </div>
                        </div>
                        <div className="accent-blob moving-blob"></div>
                      </button>
                      <button 
                        className={`context-btn glass-card ${selectedContext === 'focussed' ? 'selected' : 'focussed'}`}
                        onClick={() => handleContextSelection('focussed')}
                        data-context="focussed"
                      >
                        <div className="context-content">
                          <span className="context-icon">🎯</span>
                          <div className="context-text-group">
                            <span className="context-text font-inter font-medium">On the Move and Focussed</span>
                            <span className="context-subtitle font-inter text-sm">(working, studying, etc.)</span>
                          </div>
                        </div>
                        <div className="accent-blob focussed-blob"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                {canShowReveal && (
                  <div className="continue-section">
                    <button 
                      className="continue-btn"
                      onClick={handleContinue}
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* Instructions */}
                <div className="instructions-section">
                  <h3 className="font-inter font-medium text-slate-700 dark:text-slate-300 text-center mt-6">
                    Select both your mood and current situation to continue
                  </h3>
                  <p className="font-inter text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
                    We&apos;ll automatically create a personalized experience just for you
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Reveal Experience */}
                <div className="reveal-container">
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
                  
                  {!isRevealed ? (
                    <div className="reveal-token-container">
                      <RevealElement
                        revealType={selectedMicroHabit?.revealType || 'treasure-chest'}
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
                  ) : selectedMicroHabit?.revealType === 'treasure-chest' ? (
                    <div></div>
                  ) : (
                    <div className="micro-habit-revealed glass-card">
                      <div className="action-type-badge" style={{ 
                        backgroundColor: selectedMicroHabit?.actionType === 'VISUALIZE' ? '#8B5CF6' : 
                                       selectedMicroHabit?.actionType === 'REPEAT/RECITE' ? '#10B981' : 
                                       '#3B82F6'
                      }}>
                        {selectedMicroHabit?.actionType}
                      </div>
                      <h3 className="micro-habit-title font-inter font-semibold">
                        {selectedMicroHabit?.action}
                      </h3>
                      <p className="micro-habit-message font-inter">
                        {selectedMicroHabit?.message}
                      </p>
                      <div className="micro-habit-actions">
                        <button 
                          className="action-btn primary glass-btn"
                          onClick={handleTryAnother}
                        >
                          Try Another
                        </button>
                        <button 
                          className="action-btn secondary glass-btn"
                          onClick={handleStartOver}
                        >
                          Start Over
                        </button>
                      </div>
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
