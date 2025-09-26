'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useContent } from '@/hooks/useContent';
import { type Mood, type Context } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';

interface MessageData {
  title: string;
  message: string;
}

export default function CardsPage() {
  const router = useRouter();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null);
  const {
    isDarkMode,
    audioEnabled,
    screenlessMode,
    toggleTheme,
    toggleReadAloud,
    toggleScreenless,
  } = useUserPreferences();

  // Use the centralized content system
  const { messages: cardMessages, isLoading, error } = useContent({
    mood: currentMood as Mood | null,
    context: currentContext as Context | null,
    count: 3,
    shuffle: true
  });

  useEffect(() => {
    // Load user preferences and current mood/context
    const savedMood = localStorage.getItem('currentMood');
    const savedContext = localStorage.getItem('currentContext');

    console.log('Cards page: Loading mood and context', { savedMood, savedContext });

    if (savedMood && savedContext) {
      setCurrentMood(savedMood);
      setCurrentContext(savedContext);
    } else {
      // If no mood or context selected, redirect to home
      console.log('Cards page: No mood or context, redirecting to home');
      router.push('/');
      return;
    }
  }, [router]);

  const handleCardSelection = (cardIndex: number) => {
    console.log('Card selection:', { cardIndex, cardMessages, cardMessagesLength: cardMessages.length });
    const selectedMessage = cardMessages[cardIndex];
    console.log('Selected message:', selectedMessage);
    
    // Validate that we have a valid message before proceeding
    if (!selectedMessage || !selectedMessage.message) {
      console.error('Invalid card message selected:', { cardIndex, selectedMessage, cardMessages });
      return;
    }
    
    localStorage.setItem('selectedMessage', JSON.stringify(selectedMessage));
    
    // Add visual feedback for card selection
    const cards = document.querySelectorAll('.tarot-card');
    cards.forEach((card, index) => {
      if (index === cardIndex) {
        // Selected card: show content and zoom to center (no flipping)
        card.classList.add('selected-zoom');
      } else {
        // Unpicked cards: slide away horizontally
        if (index < cardIndex) {
          card.classList.add('slide-away-left');
        } else {
          card.classList.add('slide-away-right');
        }
      }
    });
    
    // Get current mood and context to determine which page to navigate to
    const savedMood = localStorage.getItem('currentMood');
    const savedContext = localStorage.getItem('currentContext');
    
    // Navigate after animation based on context
    setTimeout(() => {
      if (savedMood === 'good' && savedContext === 'safe') {
        // Special case: "good and safe" gets the balloon animation
        console.log('Navigating to balloon animation for good + safe');
        router.push('/message-balloon');
      } else if (savedContext === 'moving') {
        // "On the move but safe" gets smooth card animation
        console.log('Navigating to card moving page for moving context');
        router.push('/message-card-moving');
      } else if (savedContext === 'focussed') {
        // "On the move and focussed" gets focused card animation
        console.log('Navigating to card focussed page for focussed context');
        router.push('/message-card-focussed');
      } else {
        // All other combinations get the regular message page
        console.log('Navigating to regular message page for', { savedMood, savedContext });
        router.push('/message');
      }
    }, 1500);
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
            <div className="card-selection-intro">
              <h2>Choose your guidance card</h2>
              <p>Trust your intuition and select the card that calls to you</p>
            </div>
            <div className="tarot-cards-container">
              {[0, 1, 2].map((cardIndex) => (
                <div 
                  key={cardIndex}
                  className="tarot-card" 
                  data-card={cardIndex}
                  onClick={() => handleCardSelection(cardIndex)}
                >
                  <div className="card-inner">
                    <div className="card-back">
                      <div className="card-pattern"></div>
                      <div className="card-mystique">
                        {cardIndex === 0 ? '✨' : cardIndex === 1 ? '🌟' : '💫'}
                      </div>
                    </div>
                    <div className="card-content-overlay">
                      {cardMessages[cardIndex] && (
                        <>
                          <h4 className="card-title">{cardMessages[cardIndex].actionType}</h4>
                          <p className="card-message">{cardMessages[cardIndex].message.substring(0, 100)}...</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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