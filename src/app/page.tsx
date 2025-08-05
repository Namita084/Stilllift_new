'use client';

import { useRouter } from 'next/navigation';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';

export default function Home() {
  const router = useRouter();
  const {
    isDarkMode,
    audioEnabled,
    screenlessMode,
    toggleTheme,
    toggleReadAloud,
    toggleScreenless,
  } = useUserPreferences();

  const handleMoodSelection = (mood: string) => {
    localStorage.setItem('currentMood', mood);
    router.push('/context');
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
            <div className="mood-question">
              <h2 
                className="font-inter font-semibold" 
                style={{ fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
              >
                How are you feeling today?
              </h2>
            </div>
            <div className="mood-buttons">
              <button 
                className="mood-btn glass-card good" 
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
                className="mood-btn glass-card okay" 
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
                className="mood-btn glass-card bad" 
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
                className="mood-btn glass-card awful" 
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
            
            {/* Instructions */}
            <div className="instructions-section">
              <h3 className="font-inter font-medium text-slate-700 dark:text-slate-300 text-center mt-8">
                Select your mood above to begin your journey
              </h3>
              <p className="font-inter text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
                You&apos;ll choose your experience type in the next step
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
