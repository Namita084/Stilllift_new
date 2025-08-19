'use client';

import { useState, useEffect } from 'react';

interface GiftBoxProps {
  isRevealed: boolean;
  onReveal: () => void;
  accentColor: string;
  animationSpeed: 'rich' | 'quick' | 'gentle' | 'instant';
}

export default function GiftBox({ isRevealed, onReveal, accentColor, animationSpeed }: GiftBoxProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = () => {
    if (!isRevealed && !isOpening) {
      setIsOpening(true);
      
      // Start confetti after a short delay
      setTimeout(() => {
        setShowConfetti(true);
      }, 300);
      
      onReveal();
    }
  };

  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case 'instant': return 100;
      case 'quick': return 300;
      case 'gentle': return 800;
      case 'rich': return 1200;
      default: return 600;
    }
  };

  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => {
        setIsOpening(false);
      }, getAnimationDuration());
      return () => clearTimeout(timer);
    }
  }, [isOpening, animationSpeed]);

  return (
    <div 
      className="gift-box-container"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: isRevealed ? 'default' : 'pointer' }}
    >
      {/* 3D Gift Box */}
      <div className={`gift-box ${isOpening ? 'opening' : ''} ${isRevealed ? 'revealed' : ''} ${isHovered ? 'hovered' : ''}`}>
        {/* Box Base */}
        <div className="box-base" style={{ backgroundColor: accentColor }}>
          <div className="box-shadow"></div>
        </div>
        
        {/* Box Sides */}
        <div className="box-side box-front" style={{ backgroundColor: accentColor }}></div>
        <div className="box-side box-back" style={{ backgroundColor: accentColor }}></div>
        <div className="box-side box-left" style={{ backgroundColor: accentColor }}></div>
        <div className="box-side box-right" style={{ backgroundColor: accentColor }}></div>
        
        {/* Box Top */}
        <div className="box-top" style={{ backgroundColor: accentColor }}>
          <div className="top-shadow"></div>
        </div>
        
        {/* Ribbon Vertical */}
        <div className="ribbon ribbon-vertical" style={{ backgroundColor: accentColor }}>
          <div className="ribbon-knot" style={{ backgroundColor: accentColor }}>
            <div className="knot-shadow"></div>
          </div>
        </div>
        
        {/* Ribbon Horizontal */}
        <div className="ribbon ribbon-horizontal" style={{ backgroundColor: accentColor }}>
          <div className="ribbon-end ribbon-end-left"></div>
          <div className="ribbon-end ribbon-end-right"></div>
        </div>
        
        {/* Sparkles */}
        <div className="sparkles">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">✨</div>
          <div className="sparkle sparkle-3">✨</div>
          <div className="sparkle sparkle-4">✨</div>
        </div>
        
        {/* Opening Animation Elements */}
        <div className="opening-elements">
          <div className="lid lid-left"></div>
          <div className="lid lid-right"></div>
          <div className="gift-content">
            <div className="gift-icon">🎁</div>
            <div className="gift-glow" style={{ backgroundColor: accentColor }}></div>
          </div>
        </div>
      </div>
      
      {/* Confetti Burst */}
      <div className={`confetti-container ${showConfetti ? 'active' : ''}`}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`confetti-piece confetti-${i % 8}`}
            style={{
              '--delay': `${i * 0.1}s`,
              '--rotation': `${Math.random() * 360}deg`,
              '--distance': `${Math.random() * 200 + 100}px`,
              '--color': `hsl(${Math.random() * 360}, 70%, 60%)`
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      {/* Tap Hint */}
      {!isRevealed && !isOpening && (
        <div className="tap-hint">
          <span className="hint-text">Tap to open</span>
          <span className="hint-sparkles">✨</span>
        </div>
      )}
    </div>
  );
}
