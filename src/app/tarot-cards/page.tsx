'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';

interface MessageData {
  title: string;
  message: string;
}

export default function TarotCardsPage() {
  const router = useRouter();
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null);
  const [currentMood, setCurrentMood] = useState<string>('');
  const [currentContext, setCurrentContext] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  const {
    isDarkMode,
    audioEnabled,
    screenlessMode,
    toggleTheme,
    toggleReadAloud,
    toggleScreenless,
  } = useUserPreferences();

  useEffect(() => {
    // Load saved data from localStorage
    const savedMessage = localStorage.getItem('selectedMessage');
    const savedMood = localStorage.getItem('currentMood');
    const savedContext = localStorage.getItem('currentContext');

    if (savedMessage) {
      try {
        setSelectedMessage(JSON.parse(savedMessage));
      } catch (error) {
        console.error('Error parsing saved message:', error);
      }
    }

    if (savedMood) setCurrentMood(savedMood);
    if (savedContext) setCurrentContext(savedContext);
  }, []);

  const handleCardReveal = () => {
    setIsRevealed(true);
    setTimeout(() => {
      setShowMessage(true);
    }, 1000); // Wait for card flip animation
  };

  const handleGiveMeAnother = () => {
    router.push('/cards');
  };

  const handleStartOver = () => {
    localStorage.removeItem('selectedMessage');
    localStorage.removeItem('currentMood');
    localStorage.removeItem('currentContext');
    router.push('/');
  };

  const playCurrentMessage = () => {
    if (selectedMessage && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(selectedMessage.message);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

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
            <div className="tarot-cards-section">
              {!isRevealed && (
                <div className="tarot-instructions">
                  <h2>Your Tarot Reading Awaits</h2>
                  <p>Click the card to reveal your destiny</p>
                </div>
              )}
              
              <div className="tarot-card-container">
                <div 
                  className={`tarot-card ${isRevealed ? 'revealed' : ''}`}
                  onClick={!isRevealed ? handleCardReveal : undefined}
                >
                  <div className="card-back">
                        <div className="card-pattern">
                          <div className="mystical-symbol">🔮</div>
                          <div className="mystical-symbol">✨</div>
                          <div className="mystical-symbol">🌟</div>
                        </div>
                      </div>
                  <div className="card-front">
                    <div className="card-content">
                      <div className="card-title">Tarot Reading</div>
                      <div className="card-message">
                        {selectedMessage?.message || 'Your message will appear here...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {showMessage && (
                <div className="message-actions">
                  <button 
                    onClick={playCurrentMessage}
                    className="action-btn play-btn"
                  >
                    🔊 Play Message
                  </button>
                  <button 
                    onClick={handleGiveMeAnother}
                    className="action-btn another-btn"
                  >
                    🎴 Another Reading
                  </button>
                  <button 
                    onClick={handleStartOver}
                    className="action-btn start-over-btn"
                  >
                    🔄 Start Over
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

