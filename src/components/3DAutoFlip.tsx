'use client';

import { useState, useEffect } from 'react';

interface AutoFlipProps {
  isRevealed: boolean;
  onReveal: () => void;
  accentColor: string;
  animationSpeed: 'rich' | 'quick' | 'gentle' | 'instant';
}

export default function AutoFlip({ 
  isRevealed, 
  onReveal, 
  accentColor, 
  animationSpeed 
}: AutoFlipProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    // Auto-start the animation after a brief delay
    const timer = setTimeout(() => {
      if (!isRevealed && !isAnimating) {
        setIsAnimating(true);
        setCardFlipped(true);
        
        // Wait for flip animation, then show message
        setTimeout(() => {
          setMessageVisible(true);
          onReveal();
        }, 400);
      }
    }, 800); // Brief delay to let user see the initial state

    return () => clearTimeout(timer);
  }, [isRevealed, isAnimating, onReveal]);

  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case 'instant': return 100;
      case 'quick': return 300;
      case 'gentle': return 800;
      case 'rich': return 600;
      default: return 400;
    }
  };

  return (
    <div 
      className={`auto-flip-container ${isRevealed ? 'revealed' : ''}`}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* Initial Card State */}
      <div className={`initial-card ${cardFlipped ? 'flipped' : ''}`}>
        <div className="card-front">
          <div className="card-content">
            <div className="card-icon">🎯</div>
            <div className="card-title">Focus Mode</div>
            <div className="card-subtitle">Preparing your message...</div>
            <div className="loading-dots">
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
            </div>
          </div>
        </div>
        <div className="card-back">
          <div className="card-content">
            <div className="card-icon">✨</div>
            <div className="card-title">Message Ready</div>
            <div className="card-subtitle">Your personalized message</div>
          </div>
        </div>
      </div>

      {/* Revealed Message */}
      <div className={`revealed-message ${messageVisible ? 'visible' : ''}`}>
        <div className="message-content">
          <div className="message-icon">💌</div>
          <div className="message-title">Your Message</div>
          <div className="message-text">Your personalized message is ready!</div>
        </div>
      </div>

      {/* Status Indicator */}
      {!isRevealed && (
        <div className="status-indicator">
          <span>Auto-revealing...</span>
        </div>
      )}

      <style jsx>{`
        .auto-flip-container {
          position: relative;
          width: 200px;
          height: 150px;
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .initial-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .initial-card.flipped {
          transform: rotateY(180deg);
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        .card-front {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border: 2px solid #e2e8f0;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateZ(2px);
        }

        .card-back {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border: 2px solid var(--accent-color);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: rotateY(180deg) translateZ(2px);
        }

        .card-content {
          text-align: center;
          padding: 20px;
        }

        .card-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .card-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          color: #1e293b;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .card-subtitle {
          font-family: 'Inter', sans-serif;
          color: #64748b;
          font-size: 12px;
          margin-bottom: 16px;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 4px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: var(--accent-color);
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .dot-1 {
          animation-delay: -0.32s;
        }

        .dot-2 {
          animation-delay: -0.16s;
        }

        .dot-3 {
          animation-delay: 0s;
        }

        .revealed-message {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border: 2px solid var(--accent-color);
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        .revealed-message.visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .message-content {
          text-align: center;
          padding: 20px;
        }

        .message-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .message-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          color: #1e293b;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .message-text {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          color: #1e293b;
          font-size: 14px;
          line-height: 1.4;
        }

        .status-indicator {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          color: #64748b;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          opacity: 0.8;
          pointer-events: none;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .auto-flip-container:hover .initial-card:not(.flipped) {
          transform: rotateY(5deg);
          transition: transform 0.2s ease;
        }

        .auto-flip-container:hover .card-front {
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
          transition: box-shadow 0.2s ease;
        }
      `}</style>
    </div>
  );
}

