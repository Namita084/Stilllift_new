'use client';

interface ActionRevealCardProps {
  message?: string;
  action?: string;
  actionType?: string;
  onStartOver?: () => void;
  onTryAnother?: () => void;
  showCard?: boolean;
  isEmerging?: boolean;
  isFullyRevealed?: boolean;
  isStatic?: boolean;
}

const getDisplayActionType = (raw: string | null | undefined): string => {
  const value = (raw ?? '').toUpperCase();
  if (value === 'RECITE' || value === 'REPEAT/RECITE' || value === 'REPEAT') return 'REPEAT';
  return raw ?? 'ACTION';
};

export default function ActionRevealCard({
  message = '',
  action = '',
  actionType,
  onStartOver,
  onTryAnother,
  showCard = false,
  isEmerging = false,
  isFullyRevealed = false,
  isStatic = false,
}: ActionRevealCardProps) {
  if (!showCard) return null;

  const handleTryAnotherClick = () => {
    if (onTryAnother) {
      onTryAnother();
    }
  };

  const handleReplay = () => {
    // Replay functionality if needed
  };

  return (
    <>
      <div className={`treasure-message-scroll ${isEmerging ? 'emerging' : ''} ${isFullyRevealed || isStatic ? 'fully-revealed' : ''} ${isStatic ? 'static' : ''}`}>
        <div className="scroll-container">
          <div className="scroll-header">
            <div className="treasure-gems">
              <span className="gem">💎</span>
              <span className="gem">💎</span>
              <span className="gem">💎</span>
            </div>
          </div>
          
          <div className="scroll-content">
            <div className="action-badge" style={{ 
              backgroundColor: getDisplayActionType(actionType) === 'VISUALIZE' ? '#8B5CF6' : 
                             (getDisplayActionType(actionType) === 'REPEAT') ? '#10B981' : 
                              '#3B82F6',
              color: '#ffffff',
              fontWeight: '600',
              textShadow: 'none'
            }}>
              {getDisplayActionType(actionType)}
            </div>
            
            <h2 style={{ fontWeight: '600', textShadow: 'none', fontSize: '1.5rem', margin: '1rem 0', zIndex: 999 }}>
              {action}
            </h2>
            {/* Only show message if it's different from action to avoid duplication */}
            {message && message !== action && (
              <p style={{ 
                fontWeight: '600', 
                textShadow: 'none', 
                opacity: '1', 
                fontSize: '1.2rem', 
                lineHeight: '1.7', 
                margin: '1rem 0', 
                zIndex: 999,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.025em'
              }}>{message}</p>
            )}
            
            <div className="treasure-divider">
              <span>⚜️</span>
            </div>
            
            <div className="treasure-buttons">
              <button 
                className="treasure-btn primary"
                onClick={handleTryAnotherClick}
              >
                <span className="btn-icon">🔮</span>
                Try Another
              </button>
              <button 
                className="treasure-btn secondary"
                onClick={onStartOver || handleReplay}
              >
                <span className="btn-icon">🏠</span>
                Start Over
              </button>
            </div>
          </div>
          
          <div className="scroll-footer">
            <div className="golden-border"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Treasure Message Scroll */
        .treasure-message-scroll {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 60px;
          transform: translate(-50%, -50%) scale(0.1) rotateY(45deg);
          opacity: 0;
          transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
          z-index: 10000;
          isolation: isolate;
        }

        .treasure-message-scroll.emerging {
          opacity: 1;
          transform: translate(-50%, -50%) scale(0.6) rotateY(15deg);
        }

        .treasure-message-scroll.fully-revealed {
          opacity: 1;
          width: 95vw;
          max-width: 600px;
          height: auto;
          min-height: 400px;
          transform: translate(-50%, -50%) scale(1) rotateY(0deg);
          pointer-events: all;
        }

        .treasure-message-scroll.static {
          transition: none !important;
          transform: translate(-50%, -50%) scale(1) rotateY(0deg) !important;
          animation: none !important;
        }

        .scroll-container {
          width: 100%;
          height: 100%;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          z-index: 10001;
          isolation: isolate;
        }

        .dark-mode .scroll-container {
          background: var(--card-bg-strong);
          border: var(--card-border-strong);
          box-shadow: var(--card-shadow-lg);
        }

        .dark-mode .scroll-container h2,
        .dark-mode .scroll-container p {
          color: #ffffff !important;
        }

        .dark-mode .treasure-message-scroll h2,
        .dark-mode .treasure-message-scroll p,
        body.dark-mode .treasure-message-scroll h2,
        body.dark-mode .treasure-message-scroll p,
        html.dark-mode .treasure-message-scroll h2,
        html.dark-mode .treasure-message-scroll p {
          color: #ffffff !important;
        }

        .scroll-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--card-bg);
          opacity: 0.1;
          pointer-events: none;
        }

        .scroll-header {
          text-align: center;
          padding: 20px 20px 15px;
          border-bottom: var(--card-border);
          margin-bottom: 20px;
          background: var(--card-bg);
          opacity: 1;
        }

        .treasure-gems {
          margin-bottom: 10px;
        }

        .gem {
          display: inline-block;
          margin: 0 12px;
          font-size: 28px;
          animation: sparkle 2s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(0, 191, 255, 0.6),
            0 0 30px rgba(0, 191, 255, 0.4);
        }

        .gem:nth-child(2) {
          animation-delay: 0.5s;
        }

        .gem:nth-child(3) {
          animation-delay: 1s;
        }

        .scroll-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 22px;
          color: #1e293b;
          text-shadow: 
            0.5px 0.5px 1px rgba(0, 0, 0, 0.05),
            0 0 10px rgba(255, 255, 255, 0.4);
          letter-spacing: 0.3px;
        }

        .dark-mode .scroll-title,
        body.dark-mode .scroll-title {
          color: #ffffff !important;
          text-shadow: 
            0.5px 0.5px 1px rgba(0, 0, 0, 0.3),
            0 0 10px rgba(255, 255, 255, 0.1);
        }

        .scroll-content {
          padding: 0 32px 24px;
          text-align: center;
        }

        .action-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 12px;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .treasure-divider {
          text-align: center;
          margin: 22px 0;
          font-size: 24px;
          color: #A59A8C;
          opacity: 0.8;
          text-shadow: 
            0 0 8px rgba(255, 215, 0, 0.4),
            0 0 16px rgba(255, 215, 0, 0.2);
          animation: divider-glow 3s ease-in-out infinite alternate;
        }

        .dark-mode .treasure-divider {
          color: #9ca3af;
          opacity: 0.9;
          text-shadow: 
            0 0 8px rgba(255, 215, 0, 0.6),
            0 0 16px rgba(255, 215, 0, 0.3);
        }

        .treasure-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 8px;
        }

        .treasure-btn {
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 130px;
          justify-content: center;
          text-transform: capitalize;
          letter-spacing: 0.2px;
        }

        .treasure-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s;
        }

        .treasure-btn:hover::before {
          left: 100%;
        }

        .btn-icon {
          font-size: 20px;
          text-shadow: 
            0 0 8px rgba(255, 255, 255, 0.6),
            0 0 16px rgba(255, 255, 255, 0.3);
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
          transition: all 0.3s ease;
        }

        .treasure-btn:hover .btn-icon {
          transform: scale(1.1);
          text-shadow: 
            0 0 12px rgba(255, 255, 255, 0.8),
            0 0 24px rgba(255, 255, 255, 0.5);
        }

        .treasure-btn.primary {
          background: linear-gradient(135deg, #A59A8C 0%, #B8ADA0 50%, #CCC1B4 100%);
          color: #FDFDFC;
          border: 1px solid #8B8075;
          box-shadow: 
            0 4px 12px rgba(165, 154, 140, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, 0.3);
        }

        .treasure-btn.primary:hover {
          background: linear-gradient(135deg, #B8ADA0 0%, #CCC1B4 50%, #DDD2C5 100%);
          transform: translateY(-1px) scale(1.005);
          box-shadow: 
            0 6px 16px rgba(165, 154, 140, 0.2),
            inset 0 1px 2px rgba(255, 255, 255, 0.35);
        }

        .dark-mode .treasure-btn.primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
          color: #ffffff;
          border: 1px solid #2563eb;
          box-shadow: 
            0 4px 12px rgba(59, 130, 246, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.2);
        }

        .dark-mode .treasure-btn.primary:hover {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
          transform: translateY(-1px) scale(1.005);
          box-shadow: 
            0 6px 16px rgba(59, 130, 246, 0.4),
            inset 0 1px 2px rgba(255, 255, 255, 0.25);
        }

        .treasure-btn.secondary {
          background: linear-gradient(135deg, #FAFAF8 0%, #F1F0ED 50%, #EDEAE5 100%);
          color: #4A453F;
          border: 1px solid #C5BDB1;
          box-shadow: 
            0 4px 12px rgba(197, 189, 177, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 0.5);
        }

        .treasure-btn.secondary:hover {
          background: linear-gradient(135deg, #F1F0ED 0%, #EDEAE5 50%, #E8E4DF 100%);
          transform: translateY(-1px) scale(1.005);
          box-shadow: 
            0 6px 16px rgba(197, 189, 177, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, 0.6);
        }

        .dark-mode .treasure-btn.secondary {
          background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
          color: #f9fafb;
          border: 1px solid #4b5563;
          box-shadow: 
            0 4px 12px rgba(31, 41, 59, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
        }

        .dark-mode .treasure-btn.secondary:hover {
          background: linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%);
          transform: translateY(-1px) scale(1.005);
          box-shadow: 
            0 6px 16px rgba(31, 41, 59, 0.4),
            inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }

        .scroll-footer {
          padding: 12px;
          border-top: var(--card-border);
          background: var(--card-bg);
          opacity: 1;
        }

        .golden-border {
          height: 2px;
          background: var(--card-border);
          border-radius: 1px;
          box-shadow: var(--card-shadow);
        }

        @keyframes sparkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes divider-glow {
          0% {
            text-shadow: 
              0 0 8px rgba(255, 215, 0, 0.4),
              0 0 16px rgba(255, 215, 0, 0.2);
            transform: scale(1);
          }
          100% {
            text-shadow: 
              0 0 12px rgba(255, 215, 0, 0.6),
              0 0 24px rgba(255, 215, 0, 0.4),
              0 0 32px rgba(255, 215, 0, 0.2);
            transform: scale(1.1);
          }
        }

        .dark-mode .treasure-message-scroll .scroll-title,
        .dark-mode .treasure-message-scroll h2,
        .dark-mode .treasure-message-scroll p,
        body.dark-mode .treasure-message-scroll .scroll-title,
        body.dark-mode .treasure-message-scroll h2,
        body.dark-mode .treasure-message-scroll p,
        html.dark-mode .treasure-message-scroll .scroll-title,
        html.dark-mode .treasure-message-scroll h2,
        html.dark-mode .treasure-message-scroll p {
          color: #ffffff !important;
        }
      `}</style>
    </>
  );
}

