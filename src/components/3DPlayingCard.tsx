'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PlayingCardProps {
  isRevealed: boolean;
  onReveal: () => void;
  accentColor: string;
  animationSpeed: 'rich' | 'quick' | 'gentle' | 'instant';
  message?: string;
  action?: string;
  actionType?: 'ACTION' | 'REPEAT/RECITE' | 'VISUALIZE';
  onStartOver?: () => void;
  onTryAnother?: () => void;
}

export default function PlayingCard({ 
  isRevealed, 
  onReveal, 
  accentColor, 
  animationSpeed, 
  message, 
  action, 
  actionType,
  onStartOver,
  onTryAnother 
}: PlayingCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canClick, setCanClick] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Messages for rotating content
  const messages = [
    {
      action: action || "Take a mindful moment",
      message: message || "Sometimes the smallest pause can create the biggest shift in perspective.",
      tag: actionType || "VISUALIZE"
    },
    {
      action: "Focus on what you can control",
      message: "Release what's beyond your reach and embrace what's within your power.",
      tag: "ACTION"
    },
    {
      action: "Repeat: 'I choose peace in this moment'",
      message: "Every breath is a chance to reset and choose how you want to feel.",
      tag: "REPEAT/RECITE"
    }
  ];

  const getAnimationDuration = useCallback(() => {
    switch (animationSpeed) {
      case 'instant': return 300;
      case 'quick': return 800;
      case 'gentle': return 1200;
      case 'rich': return 1600;
      default: return 1000;
    }
  }, [animationSpeed]);

  // Ensure portal only renders on client to avoid SSR/hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-flip after delay using transition-based flip (no keyframes)
  useEffect(() => {
    if (!isRevealed && canClick) {
      const flipDelay = animationSpeed === 'instant' ? 500 : 1200;

      const flipTimer = setTimeout(() => {
        console.log('🎴 Starting playing card flip (transition)…');
        setCanClick(false);
        const duration = getAnimationDuration();

        // Trigger flip via CSS transition
        setIsFlipped(true);
        console.log('🎴 Playing card flipped - showing message…');

        // Show message shortly after flip starts
        const showMsgDelay = Math.min(250, Math.floor(duration * 0.3));
        const expandDelay = Math.max(450, Math.floor(duration * 0.6));

        const msgTimer = setTimeout(() => {
          setShowMessage(true);
          // Expand for readability
          const expandTimer = setTimeout(() => {
            setIsExpanded(true);
            console.log('🎴 Playing card expanded for better readability');
            // Notify reveal after a small delay
            const revealTimer = setTimeout(() => {
              onReveal();
            }, 300);
            return () => clearTimeout(revealTimer);
          }, expandDelay);
          return () => clearTimeout(expandTimer);
        }, showMsgDelay);

        return () => clearTimeout(msgTimer);
      }, flipDelay);

      return () => clearTimeout(flipTimer);
    }
  }, [isRevealed, canClick, animationSpeed, getAnimationDuration, onReveal]);

  // Debug: log bounding rect to ensure we remain centered
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    console.log('🎯 Card rect', { top: rect.top, left: rect.left, width: rect.width, height: rect.height, centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2 });
  }, [isFlipped, isExpanded]);

  const handleStartOver = () => {
    console.log('🏠 Going back to home screen...');
    if (onStartOver) {
      onStartOver();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleGiveAnother = () => {
    console.log('📝 Getting another message...');
    if (onTryAnother) {
      onTryAnother();
    } else {
      const nextMessage = (currentMessage + 1) % messages.length;
      setCurrentMessage(nextMessage);
      
      // Reset and re-flip with new message
      setIsFlipping(false);
      setIsFlipped(false);
      setShowMessage(false);
      setIsExpanded(false);
      setCanClick(true);
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'VISUALIZE': return '#8B5CF6'; // Purple
      case 'ACTION': return '#3B82F6'; // Blue
      case 'REPEAT/RECITE': return '#10B981'; // Green
      default: return accentColor;
    }
  };

  const currentMessageData = messages[currentMessage];

  const cardContent = (
    <div className="playing-card-container">
      <div 
        ref={cardRef}
        className={`playing-card ${isFlipped ? 'flipped' : ''} ${isExpanded ? 'expanded' : ''}`}
        style={{ '--flip-duration': `${getAnimationDuration()}ms` } as React.CSSProperties}
        data-speed={animationSpeed}
      >
        {/* Card Back (shows first) */}
        <div className="card-face card-back">
          <div className="card-back-content">
            <div className="back-pattern">
              <div className="pattern-layer-1"></div>
              <div className="pattern-layer-2"></div>
              <div className="pattern-layer-3"></div>
            </div>
            <div className="back-branding">
              <div className="back-logo">🎴</div>
              <div className="back-text">Still Lift</div>
              <div className="back-subtitle">Your Playing Card</div>
            </div>
            <div className="loading-indicator">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Preparing your message...</p>
            </div>
          </div>
        </div>

        {/* Card Front (shows after flip) */}
        <div className="card-face card-front">
          {showMessage && (
            <div className="message-content">
              {/* Message Tag */}
              <div 
                className="message-tag"
                style={{ backgroundColor: getTagColor(currentMessageData.tag) }}
              >
                {currentMessageData.tag}
              </div>

              {/* Message Action */}
              <h3 className="message-action">
                {currentMessageData.action}
              </h3>

              {/* Message Text */}
              <p className="message-text">
                {currentMessageData.message}
              </p>

              {/* Action Buttons */}
              <div className="message-actions">
                <button 
                  className="action-button start-over"
                  onClick={handleStartOver}
                >
                  🏠 Start Over
                </button>
                <button 
                  className="action-button give-another primary"
                  onClick={handleGiveAnother}
                >
                  🎴 Try Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .playing-card-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          perspective: 1200px;
          padding: 0 !important;
          margin: 0 !important;
          z-index: 9999 !important;
          background: transparent;
          overflow: hidden;
          display: block !important;
          pointer-events: none; /* allow clicks to pass unless on card */
        }

        .playing-card {
          position: fixed !important; /* fix to viewport to avoid any ancestor layout shifts */
          top: 50% !important;
          left: 50% !important;
          width: 250px !important;
          height: 341px !important;
          transform: translate(-50%, -50%) rotateY(0deg) !important;
          transform-style: preserve-3d !important;
          transition: transform var(--flip-duration, 0.8s) cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
          cursor: pointer;
          will-change: transform;
          padding: 0 !important;
          margin: 0 auto !important;
          border-radius: 12px;
          transform-origin: center center !important;
          /* Fallback positioning */
          display: block !important;
          z-index: 10000; /* sit above any footers */
          pointer-events: auto; /* receive clicks */
        }

        .playing-card.flipped {
          transform: translate(-50%, -50%) rotateY(180deg) !important;
          transform-origin: center center !important;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; /* Add transition for smooth expansion */
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
        }

        .playing-card.expanded {
          width: 350px !important;
          height: 480px !important;
          transform: translate(-50%, -50%) rotateY(180deg) scale(1.1) !important;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
          transform-origin: center center !important;
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.1);
          will-change: transform;
          transform-style: preserve-3d;
        }

        .card-back {
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e3a8a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.2);
          padding: 1.5rem;
        }

        .card-front {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          transform: rotateY(180deg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          border: 2px solid rgba(30, 58, 138, 0.1);
          overflow-y: auto;
        }

        .dark-mode .card-front {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #f1f5f9;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .dark-mode .card-back {
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .back-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.2;
        }

        .pattern-layer-1 {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%);
        }

        .pattern-layer-2 {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 60%);
        }

        .pattern-layer-3 {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
        }

        .back-branding {
          text-align: center;
          z-index: 2;
          margin-bottom: 1.5rem;
          flex-shrink: 0;
        }

        .back-logo {
          font-size: 4rem;
          margin-bottom: 0.75rem;
          animation: pulse 2s infinite;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
        }

        .back-text {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          margin-bottom: 0.25rem;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }

        .back-subtitle {
          font-size: 0.9rem;
          opacity: 0.9;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .loading-indicator {
          text-align: center;
          z-index: 2;
          flex-shrink: 0;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: loadingDots 1.5s infinite;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          will-change: transform, opacity;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: 0.3s;
        }

        .loading-dots span:nth-child(3) {
          animation-delay: 0.6s;
        }

        .loading-indicator p {
          font-size: 0.8rem;
          opacity: 0.8;
          font-weight: 300;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          animation: messageSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          gap: 1.25rem;
          will-change: transform, opacity;
        }

        .message-tag {
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.5px;
          align-self: flex-start;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        .message-action {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.4;
          letter-spacing: -0.01em;
          flex-shrink: 0;
          margin: 0;
        }

        .dark-mode .message-action {
          color: #f1f5f9;
        }

        .message-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #475569;
          flex-grow: 1;
          font-weight: 400;
          overflow-y: auto;
          margin: 0;
        }

        .dark-mode .message-text {
          color: #cbd5e1;
        }

        .message-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
          flex-shrink: 0;
        }

        .action-button {
          flex: 1;
          padding: 0.75rem 0.875rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                      box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      background 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-size: 0.8rem;
          letter-spacing: 0.3px;
          will-change: transform, box-shadow;
        }

        .start-over {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
        }

        .dark-mode .start-over {
          background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
          color: #f1f5f9;
        }

        .start-over:hover {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .start-over:hover {
          background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        .give-another {
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
          color: white;
          box-shadow: 0 3px 8px rgba(30, 58, 138, 0.25);
        }

        .give-another:hover {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(30, 58, 138, 0.4);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Keyframe-based flipping removed to avoid positioning issues */

        @keyframes loadingDots {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          40% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        @keyframes messageSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .playing-card {
            width: 220px !important;
            height: 300px !important;
          }

          .playing-card.expanded {
            width: 300px !important;
            height: 420px !important;
            transform: translate(-50%, -50%) rotateY(180deg) scale(1.05) !important;
          }

          .playing-card.flipped {
            transform: translate(-50%, -50%) rotateY(180deg) !important;
          }

          .card-front {
            padding: 1.25rem;
          }

          .card-back {
            padding: 1.25rem;
          }

          .message-action {
            font-size: 1rem;
          }

          .message-text {
            font-size: 0.85rem;
          }

          .action-button {
            font-size: 0.75rem;
            padding: 0.65rem 0.75rem;
          }

          .message-actions {
            flex-direction: column;
            gap: 0.6rem;
          }

          .back-text {
            font-size: 1.3rem;
          }

          .back-logo {
            font-size: 3.5rem;
          }

          .message-tag {
            font-size: 0.7rem;
            padding: 0.45rem 0.8rem;
          }

          .loading-indicator p {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .playing-card {
            width: 200px !important;
            height: 273px !important;
          }

          .playing-card.expanded {
            width: 280px !important;
            height: 380px !important;
            transform: translate(-50%, -50%) rotateY(180deg) scale(1.02) !important;
          }

          .playing-card.flipped {
            transform: translate(-50%, -50%) rotateY(180deg) !important;
          }

          .card-front {
            padding: 1rem;
          }

          .card-back {
            padding: 1rem;
          }

          .message-action {
            font-size: 0.95rem;
          }

          .message-text {
            font-size: 0.8rem;
          }

          .back-text {
            font-size: 1.2rem;
          }

          .back-logo {
            font-size: 3rem;
          }

          .message-tag {
            font-size: 0.65rem;
            padding: 0.4rem 0.7rem;
          }

          .loading-indicator p {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );

  if (!mounted) return null;
  return createPortal(cardContent, document.body);
}
