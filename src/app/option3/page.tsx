'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import fortuneCookieAnimation from '../../../public/fortune-cookie.json';

interface MessageData {
  title: string;
  message: string;
}

interface WindowWithWebkitAudioContext extends Window {
  webkitAudioContext: typeof AudioContext;
}

export default function Option3Page() {
  const router = useRouter();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [isCracking, setIsCracking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  
  const {
    isDarkMode,
    audioEnabled,
    screenlessMode,
    toggleTheme,
    toggleReadAloud,
    toggleScreenless,
  } = useUserPreferences();

  const messages = useMemo(() => ({
    good: {
      safe: [
        {
          title: "Gratitude Practice",
          message: "Take a moment to appreciate this feeling. You're doing well, and that's worth celebrating. Consider writing down one thing that made today special."
        },
        {
          title: "Share Your Light",
          message: "Your positive energy is contagious! Share a smile with someone today - it might be exactly what they need."
        },
        {
          title: "Set Intentions",
          message: "This is a great time to set a small, achievable goal for tomorrow. What would make you feel even better?"
        },
        {
          title: "Spread Kindness",
          message: "Your good mood is a gift. Consider doing something kind for someone else - it will amplify your own joy."
        }
      ],
      moving: [
        {
          title: "Flow with Movement",
          message: "Keep that positive energy flowing! As you move, notice the rhythm of your steps and let it ground you."
        },
        {
          title: "Connect with Others",
          message: "Your good mood is perfect for connecting with others. Consider reaching out to a friend or family member."
        },
        {
          title: "Explore Something New",
          message: "Use this energy to explore something new on your route today - maybe a different path or a new coffee shop."
        },
        {
          title: "Creative Thinking",
          message: "Your positive state is ideal for creative thinking. What ideas or solutions come to mind as you move?"
        }
      ]
    },
    okay: {
      safe: [
        {
          title: "Embrace the Moment",
          message: "It's perfectly normal to feel okay. Sometimes 'okay' is exactly where we need to be. Take a few deep breaths and acknowledge this moment."
        },
        {
          title: "Small Improvements",
          message: "Being okay is a stable foundation. What small thing could you do right now to feel a bit better?"
        },
        {
          title: "Your Power",
          message: "This neutral state is actually quite powerful. You have the energy to make choices that could improve your day."
        },
        {
          title: "Find Gratitude",
          message: "Okay is a good place to be. Consider what you're grateful for right now, even if it's something simple."
        }
      ],
      moving: [
        {
          title: "Mindful Movement",
          message: "Okay is a perfectly valid feeling. As you move, let the rhythm of your steps help you find your center."
        },
        {
          title: "Notice Beauty",
          message: "This neutral energy is great for observation. Notice something beautiful or interesting on your journey."
        },
        {
          title: "Meditative Walking",
          message: "Being okay while moving can be meditative. Focus on your breathing and the sensation of movement."
        },
        {
          title: "Plan for Joy",
          message: "Use this stable state to plan something small that might bring you joy later today."
        }
      ]
    },
    bad: {
      safe: [
        {
          title: "Be Gentle",
          message: "I see you're having a tough time. That's okay - difficult feelings are part of being human. You don't have to figure everything out right now."
        },
        {
          title: "Self-Compassion",
          message: "It's okay to not be okay. Take a moment to be gentle with yourself. What would feel comforting right now?"
        },
        {
          title: "You're Not Alone",
          message: "You're not alone in feeling this way. Consider reaching out to someone you trust, even if it's just to say you're having a rough day."
        },
        {
          title: "This Too Shall Pass",
          message: "This feeling won't last forever. For now, try to be as kind to yourself as you would be to a friend who's struggling."
        }
      ],
      moving: [
        {
          title: "One Step at a Time",
          message: "I understand this is hard. Sometimes movement can help shift our energy. Focus on putting one foot in front of the other."
        },
        {
          title: "Notice the Good",
          message: "You're doing the best you can right now. As you move, try to notice one thing that's not terrible - maybe the air on your skin or the sound of your footsteps."
        },
        {
          title: "Be Patient",
          message: "It's okay to feel this way while moving. Don't push yourself too hard. What would feel most supportive right now?"
        },
        {
          title: "Temporary Feelings",
          message: "This difficult moment is temporary. Keep moving if it helps, or find a quiet place to pause if you need to."
        }
      ]
    },
    awful: {
      safe: [
        {
          title: "Reach Out",
          message: "I'm so sorry you're feeling this way. You don't have to go through this alone. Is there someone you can call right now?"
        },
        {
          title: "Your Feelings Matter",
          message: "This is really hard, and your feelings are valid. Try to be extra gentle with yourself today. You're doing the best you can."
        },
        {
          title: "Just Breathe",
          message: "When things feel this overwhelming, sometimes the best thing is to just breathe. Take slow, deep breaths and know that this moment will pass."
        },
        {
          title: "You Deserve Support",
          message: "You're not alone, even if it feels that way. Consider reaching out to a crisis helpline or someone you trust. You deserve support."
        }
      ],
      moving: [
        {
          title: "Find Safety",
          message: "I know this is incredibly difficult. If you're safe to do so, try to find a quiet place to sit and breathe for a moment."
        },
        {
          title: "Be Kind to Yourself",
          message: "You're going through something really hard. Don't feel pressured to keep moving if you need to stop and rest."
        },
        {
          title: "One Moment at a Time",
          message: "This feeling is overwhelming, but it won't last forever. Focus on getting through the next few minutes, one step at a time."
        },
        {
          title: "You're Not Alone",
          message: "You're not alone in this pain. Consider calling a friend, family member, or crisis helpline. You deserve to be heard and supported."
        }
      ]
    }
  }), []);

  useEffect(() => {
    // Load user preferences and current mood/context
    const savedMood = localStorage.getItem('currentMood');
    const savedContext = localStorage.getItem('currentContext');

    if (savedMood && savedContext) {
      setCurrentMood(savedMood);
      setCurrentContext(savedContext);
      
      // Get random message
      const availableMessages = messages[savedMood as keyof typeof messages]?.[savedContext as keyof typeof messages.good];
      if (availableMessages) {
        const randomMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
        setSelectedMessage(randomMessage);
      }
    } else {
      // If no mood or context selected, redirect to home
      router.push('/');
      return;
    }
  }, [router, messages]);

  const openCookie = () => {
    if (isOpened || isCracking) return;
    setIsCracking(true);
    
    // Play the Lottie animation
    if (lottieRef.current) {
      lottieRef.current.play();
    }
    
    // Play crack sound
    if (audioEnabled) {
      const audioContext = new (window.AudioContext || (window as unknown as WindowWithWebkitAudioContext).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const onAnimationComplete = () => {
    setAnimationComplete(true);
    setIsOpened(true);
    setIsCracking(false);
    
    // Wait a moment then reveal the fortune
    setTimeout(() => {
      revealFortune();
    }, 500);
  };

  const revealFortune = () => {
    // Expand the fortune slip
    setTimeout(() => {
      setIsExpanded(true);
    }, 300);
    
    // Speak the fortune if audio is enabled
    if (audioEnabled && selectedMessage) {
      const utterance = new SpeechSynthesisUtterance(`Your fortune: ${selectedMessage.title}. ${selectedMessage.message}`);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };



  const handleGiveMeAnother = () => {
    // Reset cookie state
    setIsOpened(false);
    setIsCracking(false);
    setIsExpanded(false);
    setAnimationComplete(false);
    
    // Reset Lottie animation
    if (lottieRef.current) {
      lottieRef.current.stop();
    }
    
    // Get new random message
    const availableMessages = messages[currentMood as keyof typeof messages]?.[currentContext as keyof typeof messages.good];
    if (availableMessages) {
      const randomMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
      setSelectedMessage(randomMessage);
    }
  };

  const shareFortune = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My StillLift Fortune',
        text: `${selectedMessage?.title}: ${selectedMessage?.message}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const text = `${selectedMessage?.title}: ${selectedMessage?.message} - StillLift`;
      navigator.clipboard.writeText(text).then(() => {
        // Show a brief feedback
        const shareButton = document.querySelector('.share-btn');
        if (shareButton) {
          const originalText = shareButton.textContent;
          shareButton.textContent = 'Copied!';
          setTimeout(() => {
            shareButton.textContent = originalText;
          }, 1500);
        }
      });
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
            <div className="fortune-intro">
              <h2 className="font-inter font-semibold">Open your fortune</h2>
              <p>Tap to crack open your wellness fortune</p>
            </div>
            <div className="fortune-cookie-container">
              <div 
                className={`cookie-wrapper ${isCracking ? 'cracking' : ''} ${isOpened ? 'opened' : ''}`}
                onClick={openCookie}
                style={{ cursor: isCracking ? 'default' : 'pointer' }}
              >
                <Lottie
                  lottieRef={lottieRef}
                  animationData={fortuneCookieAnimation}
                  autoplay={false}
                  loop={false}
                  onComplete={onAnimationComplete}
                  style={{
                    width: '240px',
                    height: '180px',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              
              <div className={`fortune-slip ${isOpened ? 'revealed' : ''} ${isExpanded ? 'expanded' : ''}`}>
                <div className="slip-content">
                  <h3 className="fortune-title">{selectedMessage?.title}</h3>
                  <p className="fortune-message">{selectedMessage?.message}</p>
                  {isOpened && (
                    <>
                      <div className="micro-tips">
                        <div className="micro-tip">Take a moment to reflect on this message</div>
                        <div className="micro-tip">Consider how you can apply this wisdom today</div>
                      </div>
                      <div className="fortune-actions">
                        <button 
                          className="action-btn primary glass-btn"
                          onClick={handleGiveMeAnother}
                        >
                          Another Fortune
                        </button>
                        <button 
                          className="action-btn secondary glass-btn share-btn"
                          onClick={shareFortune}
                        >
                          Share
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {!isOpened && (
                <div className="tap-hint">
                  <span className="hint-text">Tap to open your fortune!</span>
                  <div className="hint-sparkles">✨ 🌟 ✨</div>
                </div>
              )}
            </div>

            <Link href="/context" className="back-btn glass-btn">
              ← Back
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 