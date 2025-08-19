'use client';

import { useState, useCallback } from 'react';

interface TreasureChestProps {
  isRevealed: boolean;
  onReveal: () => void;
  accentColor: string;
  animationSpeed: 'rich' | 'quick' | 'gentle' | 'instant';
}

export default function TreasureChest({ 
  onReveal,
  animationSpeed = 'gentle'
}: TreasureChestProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [canClick, setCanClick] = useState(true);

  // Animation duration based on speed
  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case 'instant': return 200;
      case 'quick': return 600;
      case 'gentle': return 1000;
      case 'rich': return 1500;
      default: return 1000;
    }
  };

  const handleClick = useCallback(() => {
    if (!canClick || isOpening) return;
    
    console.log('TreasureChest: Click detected, starting animation');
    setCanClick(false);
    setIsOpening(true);
    
    const duration = getAnimationDuration();
    
    // Chest opens
    setTimeout(() => {
      setIsOpened(true);
      setShowConfetti(true);
      console.log('TreasureChest: Chest opened, showing confetti');
    }, duration * 0.3);
    
    // Message appears after confetti
    setTimeout(() => {
      setShowMessage(true);
      setIsOpening(false);
      onReveal();
      console.log('TreasureChest: Message revealed');
    }, duration * 0.8);
    
  }, [canClick, isOpening, onReveal, getAnimationDuration]);

  const handleReplay = () => {
    console.log('TreasureChest: Replay clicked');
    setIsOpening(false);
    setIsOpened(false);
    setShowConfetti(false);
    setShowMessage(false);
    setCanClick(true);
  };

  const handleNext = () => {
    console.log('TreasureChest: Next clicked');
    // Could trigger a callback for next action
  };

  return (
    <div className="treasure-chest-container">
      {/* Treasure Chest - Lottie Style */}
      <div 
        className={`treasure-chest ${isOpening ? 'opening' : ''} ${isOpened ? 'opened' : ''}`}
        onClick={handleClick}
      >
        {/* Chest Base - Simple Rectangle */}
        <div className="chest-base">
          {/* Base rectangle */}
          <div className="base-rect"></div>
          
          {/* Lock */}
          <div className="chest-lock">
            <div className="lock-body">🔒</div>
          </div>
          
          {/* Chest decorative bands */}
          <div className="chest-band chest-band-1"></div>
          <div className="chest-band chest-band-2"></div>
        </div>
        
        {/* Chest Lid - Simple Rectangle */}
        <div className="chest-lid">
          <div className="lid-rect"></div>
          
          {/* Handle */}
          <div className="chest-handle"></div>
        </div>
        
        {/* Magical glow when opened */}
        <div className="magical-glow"></div>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1000}ms`,
                backgroundColor: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* Interaction Hint */}
      {canClick && !showMessage && (
        <div className="interaction-hint">
          <div className="hint-text">✨ Tap to open ✨</div>
          <div className="hint-pulse"></div>
        </div>
      )}

      {/* Message Card */}
      <div className={`message-card ${showMessage ? 'visible' : ''}`}>
        <div className="card-content">
          <div className="card-icon">🎉</div>
          <div className="card-title">Your Positive Message</div>
          <div className="card-message">
            Take a moment to appreciate this feeling. You&apos;re doing well, and that&apos;s worth celebrating.
          </div>
          
          {/* Action Buttons */}
          <div className="card-actions">
            <button 
              className="action-button replay-button"
              onClick={handleReplay}
            >
              🔄 Replay
            </button>
            <button 
              className="action-button next-button"
              onClick={handleNext}
            >
              ➡️ Next
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .treasure-chest-container {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 20px;
        }

        /* Dark theme support */
        .dark-mode .treasure-chest-container {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .treasure-chest-container {
            width: 90vw;
            max-width: 350px;
            height: 250px;
          }

          .treasure-chest {
            width: 160px;
            height: 128px;
          }

          .chest-base {
            width: 160px;
            height: 96px;
          }

          .chest-lid {
            width: 160px;
            height: 32px;
          }

          .chest-lock {
            font-size: 20px;
          }

          .message-card {
            width: 90vw;
            max-width: 320px;
            padding: 20px;
            margin: 20px;
          }

          .message-title {
            font-size: 18px;
            margin-bottom: 12px;
          }

          .message-content {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 16px;
          }

          .message-actions {
            flex-direction: column;
            gap: 12px;
          }

          .message-button {
            padding: 12px 20px;
            font-size: 14px;
            width: 100%;
          }

          .chest-hint {
            bottom: -60px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 300px;
          }

          .hint-text {
            font-size: 14px;
            padding: 8px 12px;
          }
        }

        /* Small Mobile Devices */
        @media (max-width: 480px) {
          .treasure-chest-container {
            width: 95vw;
            max-width: 320px;
            height: 220px;
          }

          .treasure-chest {
            width: 140px;
            height: 112px;
          }

          .chest-base {
            width: 140px;
            height: 84px;
          }

          .chest-lid {
            width: 140px;
            height: 28px;
          }

          .chest-lock {
            font-size: 18px;
          }

          .message-card {
            width: 95vw;
            max-width: 95vw;
            padding: 16px;
            margin: 10px;
          }

          .message-title {
            font-size: 16px;
            margin-bottom: 10px;
          }

          .message-content {
            font-size: 13px;
            margin-bottom: 14px;
          }

          .message-actions {
            gap: 10px;
          }

          .message-button {
            padding: 10px 16px;
            font-size: 13px;
            min-height: 40px;
          }

          .chest-hint {
            bottom: -50px;
            width: 95%;
            max-width: 280px;
          }

          .hint-text {
            font-size: 13px;
            padding: 6px 10px;
          }
        }

        .treasure-chest {
          position: relative;
          width: 200px;
          height: 160px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .treasure-chest:hover {
          transform: scale(1.05);
        }

        .treasure-chest.opening {
          animation: bounce 0.6s ease;
        }

        /* Chest Base - Lottie Style Rectangle */
        .chest-base {
          position: absolute;
          bottom: 0;
          width: 200px;
          height: 120px;
        }

        .base-rect {
          width: 100%;
          height: 100%;
          background: #8B4513; /* Exact Lottie color [0.545, 0.271, 0.075] */
          border-radius: 8px;
          box-shadow: 
            0 4px 0 #654321,
            0 8px 20px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        /* Decorative bands */
        .chest-band {
          position: absolute;
          width: 100%;
          height: 8px;
          background: #654321;
          border-radius: 4px;
        }

        .chest-band-1 {
          top: 25%;
        }

        .chest-band-2 {
          top: 75%;
        }

        /* Lock - Simplified */
        .chest-lock {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
        }

        .lock-body {
          font-size: 24px;
          text-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            0 0 10px rgba(255, 215, 0, 0.5);
          transition: all 0.3s ease;
        }

        .treasure-chest.opened .lock-body {
          opacity: 0;
          transform: scale(0.5);
        }

        /* Chest Lid - Lottie Style Rectangle */
        .chest-lid {
          position: absolute;
          top: 0;
          width: 200px;
          height: 40px;
          transform-origin: 0 100%;
          transition: transform 1s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .treasure-chest.opened .chest-lid {
          transform: rotateX(-110deg);
        }

        .lid-rect {
          width: 100%;
          height: 100%;
          background: #CD853F; /* Exact Lottie color [0.804, 0.522, 0.247] */
          border-radius: 8px;
          box-shadow: 
            0 2px 0 #A0522D,
            0 4px 15px rgba(0, 0, 0, 0.15);
          position: relative;
        }

        /* Handle - Simple and Clean */
        .chest-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 8px;
          background: #FFD700;
          border-radius: 4px;
          transform: translate(-50%, -50%);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        /* Magical Glow Effect */
        .magical-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
          border-radius: 20px;
          opacity: 0;
          animation: magical-pulse 2s ease-in-out infinite alternate;
        }

        .treasure-chest.opened .magical-glow {
          opacity: 1;
        }

        /* Confetti */
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          animation: confetti-fall 2s linear forwards;
        }

        /* Interaction Hint */
        .interaction-hint {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          pointer-events: none;
        }

        .hint-text {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
          animation: pulse 2s ease-in-out infinite;
        }

        .hint-pulse {
          width: 20px;
          height: 20px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          margin: 0 auto;
          animation: ripple 2s ease-in-out infinite;
        }

        /* Message Card */
        .message-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 280px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          transform: translate(-50%, -50%) scale(0.8) translateY(20px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 10;
        }

        .message-card.visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1) translateY(0);
          pointer-events: all;
        }

        .card-content {
          text-align: center;
          padding: 28px;
        }

        .card-icon {
          font-size: 40px;
          margin-bottom: 16px;
          animation: bounce 1s ease infinite;
        }

        .card-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          color: #1e293b;
          font-size: 20px;
          margin-bottom: 12px;
        }

        .card-message {
          font-family: 'Inter', sans-serif;
          color: #64748b;
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .card-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .action-button {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .replay-button {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
        }

        .replay-button:hover {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .next-button {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .next-button:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        /* Animations */
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-8px) scale(1.02); }
          60% { transform: translateY(-4px) scale(1.01); }
        }

        @keyframes magical-pulse {
          0% { 
            opacity: 0.4;
            transform: scale(1);
          }
          100% { 
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotateZ(720deg);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
