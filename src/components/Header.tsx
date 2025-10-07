'use client';

import Image from 'next/image';
import logoStillliftNew from '@/../public/Logo stilllift new.svg';

interface HeaderProps {
  isDarkMode: boolean;
  audioEnabled: boolean;
  screenlessMode: boolean;
  onToggleTheme: () => void;
  onToggleReadAloud: () => void;
  onToggleScreenless: () => void;
}

export default function Header({
  isDarkMode,
  audioEnabled,
  screenlessMode,
  onToggleTheme,
  onToggleReadAloud,
  onToggleScreenless
}: HeaderProps) {
  return (
    <header className="glass-header">
      <div className="header-content">
        <div className="logo" aria-label="StillLift">
          <Image
            src={logoStillliftNew}
            alt="StillLift logo"
            width={48}
            height={48}
            priority
          />
          <span className="logo-text font-inter">StillLift</span>
        </div>
        <div className="controls">
          <button 
            onClick={onToggleTheme}
            className={`toggle-switch ${isDarkMode ? 'active' : ''}`}
            aria-label="Toggle dark mode"
          >
            <span className="toggle-icon left">☀️</span>
            <span className="toggle-icon right">🌙</span>
          </button>
          <button 
            onClick={onToggleReadAloud}
            className={`control-btn glass-control ${audioEnabled ? 'active' : ''}`}
            aria-label="Read aloud messages"
          >
            <span className="control-icon">🔊</span>
          </button>
          <button 
            onClick={onToggleScreenless}
            className={`control-btn glass-control ${screenlessMode ? 'active' : ''}`}
            aria-label="Screenless mode"
          >
            <span className="control-icon">👁️‍🗨️</span>
          </button>
        </div>
      </div>
    </header>
  );
} 