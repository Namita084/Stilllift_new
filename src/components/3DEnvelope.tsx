'use client';

import { useState, useCallback } from 'react';

interface EnvelopeProps {
  isRevealed: boolean;
  onReveal: () => void;
  accentColor: string;
  animationSpeed: 'rich' | 'quick' | 'gentle' | 'instant';
}

const envelopeMessages = [
  {
    id: 1,
    title: "🤗 You're Not Alone",
    message: "Take five deep breaths, counting to four on inhale and six on exhale. This feeling is temporary, and you're stronger than you know."
  },
  {
    id: 2,
    title: "🌱 Gentle Reminder",
    message: "It's okay to not be okay. You're human, and this moment will pass. Reach out to someone you trust when you're ready."
  },
  {
    id: 3,
    title: "💙 Be Kind to Yourself",
    message: "Treat yourself with the same compassion you'd show a good friend. You're doing the best you can with what you have right now."
  }
];

export default function Envelope({ 
  isRevealed, 
  onReveal, 
  accentColor, 
  animationSpeed 
}: EnvelopeProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [canClick, setCanClick] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Animation duration based on speed
  const getAnimationDuration = useCallback(() => {
    switch (animationSpeed) {
      case 'instant': return 400;
      case 'quick': return 800;
      case 'gentle': return 1200;
      case 'rich': return 1600;
      default: return 1200;
    }
  }, [animationSpeed]);

  const handleClick = useCallback(() => {
    if (!canClick || isAnimating || isRevealed) return;
    
    console.log('💌 Envelope clicked! Opening with care...');
    setCanClick(false);
    setIsAnimating(true);
    
    const duration = getAnimationDuration();
    
    // Gentle flap opening
    setTimeout(() => {
      setFlapOpen(true);
      console.log('💌 Envelope flap opening...');
    }, duration * 0.1);
    
    // Message card slides out gently and stays longer
    setTimeout(() => {
      setMessageVisible(true);
      console.log('💌 Message revealed with care');
    }, duration * 0.6);
    

    
  }, [canClick, isAnimating, isRevealed, onReveal, getAnimationDuration]);

  const handleReplay = () => {
    console.log('🔄 Replaying envelope animation...');
    setIsAnimating(false);
    setFlapOpen(false);
    setMessageVisible(false);
    setCanClick(true);
  };

  const handleStartOver = () => {
    console.log('🏠 Going back to home screen...');
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleGiveAnother = () => {
    console.log('📝 Getting another message...');
    setCurrentMessageIndex((prev) => (prev + 1) % envelopeMessages.length);
    // Reset to show new message
    setIsAnimating(false);
    setFlapOpen(false);
    setMessageVisible(false);
    setCanClick(true);
  };

  const getCurrentMessage = () => envelopeMessages[currentMessageIndex];

  return (
    <div className="envelope-lottie-container">
      {/* Envelope - Lottie Style */}
      <div 
        className={`envelope-lottie ${flapOpen ? 'opened' : ''} ${isAnimating ? 'opening' : ''} ${messageVisible ? 'disappearing' : ''}`}
        onClick={handleClick}
        style={{ cursor: canClick ? 'pointer' : 'default' }}
      >
                 {/* Envelope Base Body - Clean Rectangle */}
         <div className="envelope-base-lottie">
           {/* Main envelope body */}
           <div className="envelope-body-rectangle"></div>
         </div>
        
        {/* Envelope Flap - Triangular */}
        <div className={`envelope-flap-lottie ${flapOpen ? 'open' : ''}`}>
          <div className="flap-triangle"></div>
        </div>
        
        {/* Heart Seal - As Requested */}
        <div className={`heart-seal-lottie ${flapOpen ? 'hidden' : ''}`}>
          ❤️
        </div>
        
        
      </div>

      

      {/* Large Impact Message Card */}
      <div className={`large-message-card ${messageVisible ? 'visible' : ''}`}>
        <div className="large-card-content">
          {/* Tag */}
          <div className="large-card-tag">
            {getCurrentMessage().title}
          </div>
          
          {/* Message with clean background */}
          <div className="large-card-message">
            <div className="clean-text-area">
              {getCurrentMessage().message}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="large-card-actions">
            <button 
              className="large-action-button replay-large-button"
              onClick={handleStartOver}
            >
              🔄 Start Over
            </button>
            <button 
              className="large-action-button support-large-button"
              onClick={handleGiveAnother}
            >
              📝 Give Me Another
            </button>
          </div>
        </div>
      </div>

      {/* Interaction Hint */}
      {canClick && !isAnimating && !messageVisible && (
        <div className="interaction-hint-envelope">
          <div className="hint-text-envelope">💌 Gentle tap to open 💌</div>
          <div className="hint-pulse-envelope"></div>
        </div>
      )}

      <style jsx>{`
        .envelope-lottie-container {
          position: relative;
          width: 400px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
          border-radius: 20px;
          overflow: visible;
          perspective: 1000px;
        }

        /* Dark theme support */
        .dark-mode .envelope-lottie-container {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .envelope-lottie-container {
            width: 90vw;
            max-width: 350px;
            height: 250px;
          }

          .envelope-lottie {
            width: 160px;
            height: 120px;
          }

          .envelope-body-rectangle {
            width: 160px;
            height: 120px;
          }

          .envelope-flap-lottie {
            width: 0;
            height: 0;
            border-left: 80px solid transparent;
            border-right: 80px solid transparent;
            border-bottom: 60px solid #F3F4F6;
          }

          .large-message-card {
            width: 90vw;
            max-width: 320px;
            min-height: 350px;
            padding: 20px;
            margin: 20px;
          }

          .large-card-tag {
            font-size: 14px;
            padding: 8px 16px;
            margin-bottom: 16px;
          }

          .large-card-message {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 20px;
          }

          .clean-text-area {
            font-size: 18px;
            padding: 20px;
            min-height: 150px;
          }

          .large-card-actions {
            flex-direction: column;
            gap: 12px;
          }

          .large-action-button {
            padding: 12px 20px;
            font-size: 14px;
            width: 100%;
          }

          .envelope-hint {
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
          .envelope-lottie-container {
            width: 95vw;
            max-width: 320px;
            height: 220px;
          }

          .envelope-lottie {
            width: 140px;
            height: 100px;
          }

          .envelope-body-rectangle {
            width: 140px;
            height: 100px;
          }

          .envelope-flap-lottie {
            width: 0;
            height: 0;
            border-left: 70px solid transparent;
            border-right: 70px solid transparent;
            border-bottom: 50px solid #F3F4F6;
          }

          .large-message-card {
            width: 95vw;
            max-width: 95vw;
            min-height: 300px;
            padding: 16px;
            margin: 10px;
          }

          .large-card-tag {
            font-size: 13px;
            padding: 6px 12px;
            margin-bottom: 12px;
          }

          .large-card-message {
            font-size: 13px;
            margin-bottom: 16px;
          }

          .clean-text-area {
            font-size: 16px;
            padding: 16px;
            min-height: 120px;
          }

          .large-card-actions {
            gap: 10px;
          }

          .large-action-button {
            padding: 10px 16px;
            font-size: 13px;
            min-height: 40px;
          }

          .envelope-hint {
            bottom: -50px;
            width: 95%;
            max-width: 280px;
          }

          .hint-text {
            font-size: 13px;
            padding: 6px 10px;
          }
        }

        /* Lottie Style Envelope */
        .envelope-lottie {
          position: relative;
          width: 280px;
          height: 200px;
          transition: transform 0.3s ease;
        }

        .envelope-lottie:hover {
          transform: scale(1.05);
        }

        .envelope-lottie.opening {
          animation: envelope-shake 0.6s ease;
        }

        .envelope-lottie.disappearing {
          opacity: 0;
          transform: scale(0.8) translateY(-20px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        /* Envelope Base - Clean Rectangle Like Lottie */
        .envelope-base-lottie {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .envelope-body-rectangle {
          width: 100%;
          height: 100%;
          background: #FEFEFE;
          border: 2px solid #E5E7EB;
          border-radius: 6px;
          position: relative;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        /* Flat design like Lottie - no 3D sides */

        /* Envelope Flap - Clean Triangle Like Lottie */
        .envelope-flap-lottie {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 140px solid transparent;
          border-right: 140px solid transparent;
          border-top: 140px solid #F3F4F6;
          transform-origin: top center;
          transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 5;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
        }

        .envelope-flap-lottie.open {
          transform: translateX(-50%) rotateX(135deg);
        }

        /* Heart Seal - Simple and Clean */
        .heart-seal-lottie {
          position: absolute;
          top: 25%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          z-index: 10;
          transition: all 0.6s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
          animation: heart-pulse 2s ease-in-out infinite;
        }

        .heart-seal-lottie.hidden {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.3);
        }

        /* Large Impact Message Card */
        .large-message-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 500px;
          min-height: 400px;
          background: #FFFFFF;
          border: 3px solid #E5E7EB;
          border-radius: 20px;
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          z-index: 20;
          pointer-events: none;
        }

        .dark-mode .large-message-card {
          background: #1F2937;
          border-color: #4B5563;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .large-message-card.visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
          pointer-events: all;
        }

        .large-card-content {
          padding: 40px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        /* Large Card Tag */
        .large-card-tag {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          color: #374151;
          font-size: 28px;
          text-align: center;
          margin-bottom: 30px;
          background: rgba(156, 163, 175, 0.1);
          padding: 16px 24px;
          border-radius: 16px;
          border-left: 6px solid #6B7280;
        }

        .dark-mode .large-card-tag {
          color: #E5E7EB;
          background: rgba(75, 85, 99, 0.2);
          border-left-color: #9CA3AF;
        }
        
        /* Large Card Message with Full Lined Background */
        .large-card-message {
          flex-grow: 1;
          margin-bottom: 30px;
        }
        
        .clean-text-area {
          width: 100%;
          height: 100%;
          min-height: 200px;
          background: transparent;
          padding: 30px;
          border-radius: 12px;
          font-family: var(--font-cursive), cursive;
          color: #374151;
          font-size: 24px;
          font-weight: 500;
          line-height: 1.6;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .clean-text-area {
          color: #E5E7EB;
        }
        
        /* Large Card Actions */
        .large-card-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        
        .large-action-button {
          padding: 16px 32px;
          border: none;
          border-radius: 16px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .replay-large-button {
          background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
          color: #374151;
          border: 2px solid #D1D5DB;
        }
        
        .replay-large-button:hover {
          background: linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .support-large-button {
          background: linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%);
          color: #1E40AF;
          border: 2px solid #60A5FA;
        }
        
        .support-large-button:hover {
          background: linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(96, 165, 250, 0.3);
        }



        /* Interaction Hint */
        .interaction-hint-envelope {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          pointer-events: none;
        }

        .hint-text-envelope {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #a16207;
          margin-bottom: 8px;
          animation: hint-pulse-warm 2s ease-in-out infinite;
        }

        .hint-pulse-envelope {
          width: 24px;
          height: 24px;
          background: rgba(251, 191, 36, 0.3);
          border-radius: 50%;
          margin: 0 auto;
          animation: ripple-pulse-warm 2s ease-in-out infinite;
        }

        /* Simple Animations */
        @keyframes envelope-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }

        @keyframes heart-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes gentle-bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
          60% { transform: translateY(-2px); }
        }

        @keyframes hint-pulse-warm {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes ripple-pulse-warm {
          0% {
            transform: scale(1);
            opacity: 0.6;
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

