'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { playMessageAudio } from '@/lib/audio';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import StillLiftMobileCard from '@/components/StillLiftMobileCard';

interface MessageData {
  title: string;
  message: string;
  actionType?: string;
}

export default function MessageCardMovingPage() {
  const router = useRouter();
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null);
  const [showCard, setShowCard] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [microTips, setMicroTips] = useState<string[]>([]);
  const {
    isDarkMode,
    audioEnabled,
    screenlessMode,
    toggleTheme,
    toggleReadAloud,
    toggleScreenless,
  } = useUserPreferences();

  const microTipsData = useMemo(() => ({
    good: [
      "Keep moving and let your body flow with the rhythm",
      "Notice how your movement creates positive energy",
      "Share a smile with someone you pass along the way"
    ],
    okay: [
      "Use your movement to boost your energy naturally",
      "Focus on one step at a time, one breath at a time",
      "Let the rhythm of movement help center your thoughts"
    ],
    bad: [
      "Use gentle movement to help process difficult feelings",
      "Remember that movement can be medicine for your mind",
      "Ground yourself by feeling your feet connect with the earth"
    ],
    awful: [
      "Move slowly and be gentle with yourself",
      "If you need to stop and rest, that's completely okay",
      "Focus on just the next step, nothing more"
    ]
  }), []);

  useEffect(() => {
    // Load user preferences and selected message
    const savedMessage = localStorage.getItem('selectedMessage');
    const savedMood = localStorage.getItem('currentMood');
    const savedContext = localStorage.getItem('currentContext');

    console.log('Loading message card moving page:', { savedMessage, savedMood, savedContext });

    if (savedMessage) {
      try {
        const parsedMessage = JSON.parse(savedMessage);
        console.log('Parsed message:', parsedMessage);
        setSelectedMessage(parsedMessage);
      } catch (error) {
        console.error('Error parsing message:', error);
        router.push('/');
        return;
      }
    } else {
      console.log('No message found, redirecting to home');
      router.push('/');
      return;
    }

    if (savedMood) {
      setCurrentMood(savedMood);
      // Set micro tips based on mood
      const tips = microTipsData[savedMood as keyof typeof microTipsData];
      if (tips) {
        const shuffledTips = [...tips].sort(() => Math.random() - 0.5).slice(0, Math.min(3, tips.length));
        setMicroTips(shuffledTips);
      }
    }
  }, [router, microTipsData]);

  // Show action buttons after card flip completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowActions(true);
    }, 3000); // 2000ms flip delay + 1000ms extra

    return () => clearTimeout(timer);
  }, []);

  const handleGiveMeAnother = () => {
    router.push('/cards');
  };

  const handleStartOver = () => {
    // Clear all stored data
    localStorage.removeItem('currentMood');
    localStorage.removeItem('currentContext');
    localStorage.removeItem('selectedMessage');
    router.push('/');
  };

  const playCurrentMessage = () => {
    if (selectedMessage && audioEnabled) {
      playMessageAudio(
        selectedMessage.title,
        selectedMessage.message,
        { rate: 0.9, pitch: 1, volume: 0.8, voiceHintNames: ['Samantha','Google UK English Female','Microsoft Zira'] }
      );
    }
  };

  if (!selectedMessage) {
    return <div>Loading...</div>;
  }

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
            <StillLiftMobileCard
              message={selectedMessage.message}
              actionType={selectedMessage.actionType as 'ACTION' | 'VISUALIZE' | 'RECITE' || 'ACTION'}
              title={selectedMessage.actionType || 'ACTION'}
            />

            {/* Action Buttons and Micro Tips */}
            {showActions && (
              <div className="message-actions-overlay">
                <div className="micro-tips-section">
                  <h4 className="micro-tips-title">While you&apos;re on the move:</h4>
                  <div className="micro-tips">
                    {microTips.map((tip, index) => (
                      <div key={index} className="micro-tip">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="audio-section">
                  <button 
                    className="audio-play-btn glass-btn" 
                    onClick={playCurrentMessage}
                    aria-label="Play audio"
                  >
                    <span className="speaker-icon">🔊</span>
                    <span>Play Message</span>
                  </button>
                </div>

                <div className="message-actions">
                  <button 
                    className="action-btn primary glass-btn neubrutalism-btn"
                    onClick={handleGiveMeAnother}
                  >
                    Give Me Another
                  </button>
                  <button 
                    className="action-btn secondary glass-btn neubrutalism-btn"
                    onClick={handleStartOver}
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .message-actions-overlay {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 500px;
          padding: 0 1rem;
          z-index: 100;
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .micro-tips-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(0, 72, 81, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        .micro-tips-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .micro-tips {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .micro-tip {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.4;
          border: 1px solid rgba(0, 72, 81, 0.1);
        }

        .audio-section {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .audio-play-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(0, 72, 81, 0.2);
          border-radius: 15px;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .audio-play-btn:hover {
          background: rgba(255, 255, 255, 1);
          border-color: rgba(0, 72, 81, 0.3);
          transform: translateY(-2px);
        }

        .speaker-icon {
          font-size: 1.2rem;
        }

        .message-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .action-btn {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          letter-spacing: 0.3px;
          backdrop-filter: blur(20px);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #004851 0%, #006B7A 100%);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .action-btn.primary:hover {
          background: linear-gradient(135deg, #003A40 0%, #004851 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 72, 81, 0.3);
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #475569;
          border: 2px solid rgba(0, 72, 81, 0.1);
        }

        .action-btn.secondary:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .micro-tips-section {
            background: rgba(30, 41, 59, 0.95);
            border-color: rgba(255, 255, 255, 0.1);
          }

          .micro-tips-title {
            color: #f1f5f9;
          }

          .micro-tip {
            background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
            color: #cbd5e1;
            border-color: rgba(255, 255, 255, 0.1);
          }

          .audio-play-btn {
            background: rgba(30, 41, 59, 0.9);
            color: #f1f5f9;
            border-color: rgba(255, 255, 255, 0.2);
          }

          .audio-play-btn:hover {
            background: rgba(30, 41, 59, 1);
          }

          .action-btn.secondary {
            background: rgba(30, 41, 59, 0.9);
            color: #f1f5f9;
            border-color: rgba(255, 255, 255, 0.1);
          }

          .action-btn.secondary:hover {
            background: rgba(30, 41, 59, 1);
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .message-actions-overlay {
            bottom: 1rem;
            padding: 0 1rem;
          }

          .micro-tips-section {
            padding: 1.25rem;
          }

          .message-actions {
            flex-direction: column;
            gap: 0.75rem;
          }

          .action-btn {
            padding: 0.875rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
