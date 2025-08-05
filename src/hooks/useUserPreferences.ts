'use client';

import { useState, useEffect } from 'react';

export function useUserPreferences() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [screenlessMode, setScreenlessMode] = useState(false);

  useEffect(() => {
    // Load user preferences from localStorage
    const savedTheme = localStorage.getItem('theme');
    const savedAudio = localStorage.getItem('audio');
    const savedScreenless = localStorage.getItem('screenless');

    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }

    if (savedAudio === 'enabled') {
      setAudioEnabled(true);
    }

    if (savedScreenless === 'enabled') {
      setScreenlessMode(true);
      document.body.classList.add('screenless-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleReadAloud = () => {
    const newAudioEnabled = !audioEnabled;
    setAudioEnabled(newAudioEnabled);
    localStorage.setItem('audio', newAudioEnabled ? 'enabled' : 'disabled');
  };

  const toggleScreenless = () => {
    const newScreenlessMode = !screenlessMode;
    setScreenlessMode(newScreenlessMode);
    
    if (newScreenlessMode) {
      document.body.classList.add('screenless-mode');
      document.body.classList.remove('normal-mode');
      localStorage.setItem('screenless', 'enabled');
    } else {
      document.body.classList.add('normal-mode');
      document.body.classList.remove('screenless-mode');
      localStorage.setItem('screenless', 'disabled');
    }
  };

  return {
    isDarkMode,
    audioEnabled,
    screenlessMode,
    toggleTheme,
    toggleReadAloud,
    toggleScreenless,
  };
} 