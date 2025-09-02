'use client';

import { useState, useEffect, useCallback } from 'react';

interface BandageProps {
  isRevealed: boolean;
  onReveal: () => void;
  accentColor: string;
  animationSpeed: 'rich' | 'quick' | 'gentle' | 'instant';
}

const prescriptionMessages = [
  {
    id: 1,
    text: "Practice square breathing (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s)",
    type: "[ACTION]"
  },
  {
    id: 2,
    text: "Repeat: 'I'm doing just fine' (1 min)",
    type: "[REPEAT/RECITE]"
  },
  {
    id: 3,
    text: "Visualise your favourite quiet place (2 min)",
    type: "[VISUALIZE]"
  }
];

export default function Bandage({ isRevealed, onReveal, accentColor, animationSpeed }: BandageProps) {
  const [showBandage, setShowBandage] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const [isPasted, setIsPasted] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const getAnimationDuration = useCallback(() => {
    switch (animationSpeed) {
      case 'instant': return 100;
      case 'quick': return 300;
      case 'gentle': return 800;
      case 'rich': return 1200;
      default: return 600;
    }
  }, [animationSpeed]);

  // Automatic animation sequence
  useEffect(() => {
    console.log('🩹 Starting automatic bandage sequence...');
    
    // Step 1: Show bandage after initial delay (1 second)
    const showBandageTimeout = setTimeout(() => {
      console.log('🩹 Showing bandage...');
      setShowBandage(true);
      setIsPasting(true);
    }, 1000);

    // Step 2: Complete bandage pasting (after 1.5 seconds total)
    const pasteBandageTimeout = setTimeout(() => {
      console.log('🩹 Bandage pasted');
      setIsPasting(false);
      setIsPasted(true);
    }, 1500);

    // Step 3: Show prescription (after 3 seconds total)
    const showPrescriptionTimeout = setTimeout(() => {
      console.log('💊 Prescription message revealed');
      setShowPrescription(true);
    }, 3000);

    // Cleanup timeouts on unmount
    return () => {
      clearTimeout(showBandageTimeout);
      clearTimeout(pasteBandageTimeout);
      clearTimeout(showPrescriptionTimeout);
    };
  }, []); // Run once on mount

  const handleReplay = () => {
    console.log('🔄 Replaying bandage animation...');
    setShowBandage(false);
    setIsPasting(false);
    setIsPasted(false);
    setShowPrescription(false);
  };

  const handleGiveAnother = () => {
    console.log('📝 Getting another prescription...');
    setCurrentMessageIndex((prev) => (prev + 1) % prescriptionMessages.length);
  };

  const getCurrentMessage = () => prescriptionMessages[currentMessageIndex];



  return (
    <div className="bandage-wrap-container">
            {/* Skin Area - Always Visible */}
      <div className="skin-area">
        <div className="skin-base"></div>
        <div className="skin-texture"></div>
      </div>

      {/* Realistic Bandage Wrap - Shows automatically */}
      {showBandage && (
        <div 
          className={`bandage-wrap ${isPasting ? 'pasting' : ''} ${isPasted ? 'pasted' : ''}`}
          style={{ userSelect: 'none' }}
        >
        {/* Bandage Base/Wound Area */}
        <div className="wound-area">
          <div className="wound-base"></div>
          <div className="wound-shadow"></div>
        </div>
        
        {/* Hyper-Realistic Band-Aid */}
        <div className="realistic-bandage-cross">
          {/* Heart Icon at Top */}
          <div className="bandage-heart">❤️</div>
          
          {/* Cross-shaped Bandage */}
          <div className="bandage-cross">
            {/* Horizontal Strip */}
            <div className="horizontal-strip">
              <div className="strip-texture"></div>
              <div className="perforation-left"></div>
              <div className="perforation-right"></div>
            </div>
            
            {/* Vertical Strip */}
            <div className="vertical-strip">
              <div className="strip-texture"></div>
              <div className="perforation-top"></div>
              <div className="perforation-bottom"></div>
            </div>
            
            {/* Central Pad */}
            <div className="central-pad">
              <div className="pad-texture"></div>
              <div className="pad-shadow"></div>
            </div>
            
            {/* Adhesive Dots Pattern */}
            <div className="adhesive-pattern">
              <div className="dot-row row-1">
                <div className="adhesive-dot"></div>
                <div className="adhesive-dot"></div>
                <div className="adhesive-dot"></div>
              </div>
              <div className="dot-row row-2">
                <div className="adhesive-dot"></div>
                <div className="adhesive-dot"></div>
                <div className="adhesive-dot"></div>
              </div>
              <div className="dot-row row-3">
                <div className="adhesive-dot"></div>
                <div className="adhesive-dot"></div>
                <div className="adhesive-dot"></div>
              </div>
            </div>
          </div>

          {/* Drop Shadow */}
          <div className="bandage-shadow"></div>
        </div>
        
        {/* Healing Glow */}
        <div className="healing-glow"></div>
        </div>
      )}

      {/* Prescription Message Card */}
      {showPrescription && (
        <div className={`prescription-card visible`}>
        {/* Letterhead */}
        <div className="prescription-letterhead">
          <div className="letterhead-logo">💚</div>
          <div className="letterhead-title">Stillift Wellness</div>
          <div className="letterhead-subtitle">Mindful Care & Emotional Support</div>
        </div>
        
        {/* Main Content */}
        <div className="prescription-body">
          <div className="prescription-message">
            <div className="message-content">
              {getCurrentMessage().text}
            </div>
            <div className="message-type">
              {getCurrentMessage().type}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="prescription-actions">
          <button 
            className="prescription-button start-over-button"
            onClick={handleReplay}
          >
            🔄 Start Over
          </button>
          <button 
            className="prescription-button another-button"
            onClick={handleGiveAnother}
          >
            📝 Give Me Another
          </button>
        </div>
      </div>
      )}

      <style jsx>{`
        .bandage-wrap-container {
          position: relative;
          width: 400px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-radius: 20px;
          overflow: visible;
          perspective: 1000px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }

        /* Dark theme support */
        .dark-mode .bandage-wrap-container {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        }

        /* Skin Area */
        .skin-area {
          position: absolute;
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #fdbcb4 0%, #f5a394 25%, #e8967a 50%, #d4825c 75%, #c0714a 100%);
          border-radius: 20px;
          box-shadow: 
            inset 0 2px 4px rgba(255, 255, 255, 0.3),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1),
            0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .skin-base {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(200, 113, 74, 0.3) 0%, transparent 40%);
          border-radius: inherit;
        }

        .skin-texture {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent 3px),
            repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.02) 0px, rgba(0, 0, 0, 0.02) 1px, transparent 1px, transparent 4px);
          border-radius: inherit;
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .bandage-wrap-container {
            width: 90vw;
            max-width: 350px;
            height: 250px;
          }

          .bandage-wrap {
            width: 160px;
            height: 160px;
          }

          .bandaid-base {
            width: 140px;
            height: 100px;
          }

          .absorbent-pad {
            width: 60px;
            height: 60px;
          }

          .adhesive-area {
            width: 30px;
            height: 80px;
          }

          .bandage-cross {
            width: 120px;
            height: 120px;
          }
          
          .horizontal-strip {
            width: 120px;
            height: 38px;
          }
          
          .vertical-strip {
            width: 38px;
            height: 120px;
          }
          
          .central-pad {
            width: 30px;
            height: 30px;
          }
          
          .bandage-heart {
            font-size: 14px;
            top: -12px;
          }

          .prescription-card {
            width: 90vw;
            max-width: 400px;
            min-height: auto;
            margin: 10px;
            transform: translate(-50%, -50%) scale(0.95);
            font-size: 14px;
          }

          .prescription-header {
            padding: 12px 16px 10px;
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }

          .rx-symbol {
            font-size: 32px;
            margin-right: 0;
            margin-bottom: 8px;
          }

          .doctor-info {
            text-align: center;
          }

          .doctor-name {
            font-size: 16px;
            margin-bottom: 2px;
          }

          .prescription-date {
            font-size: 12px;
          }

          .prescription-content {
            padding: 16px 20px;
            margin-left: 0;
          }

          .prescription-title {
            font-size: 14px;
            margin-bottom: 16px;
            text-align: center;
            letter-spacing: 1px;
          }

          .prescription-instructions {
            margin-bottom: 24px;
          }

          .instruction-line {
            padding: 8px 0;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            margin-left: 15px;
          }

          .instruction-line::before {
            left: -12px;
            font-size: 14px;
          }

          .med-name {
            font-size: 13px;
            font-weight: 600;
          }

          .dosage {
            font-size: 11px;
            text-align: left;
            max-width: none;
            font-weight: 500;
          }

          .prescription-note {
            font-size: 11px;
            padding: 12px;
            margin-top: 12px;
            line-height: 1.4;
          }

          .prescription-actions {
            padding: 12px 16px;
            flex-direction: column;
            gap: 10px;
          }

          .prescription-button {
            padding: 10px 16px;
            font-size: 12px;
            width: 100%;
            min-height: 44px;
          }

          .bandage-hint {
            bottom: -50px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 300px;
          }

          .hint-text {
            font-size: 13px;
            padding: 8px 12px;
          }
        }

        /* Small Mobile Devices */
        @media (max-width: 480px) {
          .bandage-wrap-container {
            width: 95vw;
            max-width: 320px;
            height: 220px;
          }

          .bandage-wrap {
            width: 140px;
            height: 140px;
          }

          .bandaid-base {
            width: 120px;
            height: 80px;
          }

          .absorbent-pad {
            width: 50px;
            height: 50px;
          }

          .adhesive-area {
            width: 25px;
            height: 60px;
          }

          .bandage-cross {
            width: 100px;
            height: 100px;
          }
          
          .horizontal-strip {
            width: 100px;
            height: 32px;
          }
          
          .vertical-strip {
            width: 32px;
            height: 100px;
          }
          
          .central-pad {
            width: 24px;
            height: 24px;
          }
          
          .bandage-heart {
            font-size: 12px;
            top: -10px;
          }

          .prescription-card {
            width: 95vw;
            max-width: 95vw;
            margin: 5px;
            transform: translate(-50%, -50%) scale(0.9);
            max-height: 85vh;
            overflow-y: auto;
          }

          .prescription-header {
            padding: 10px 12px 8px;
          }

          .rx-symbol {
            font-size: 28px;
          }

          .doctor-name {
            font-size: 14px;
          }

          .prescription-content {
            padding: 12px 16px;
          }

          .prescription-title {
            font-size: 12px;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
          }

          .instruction-line {
            padding: 6px 0;
            margin-left: 12px;
          }

          .med-name {
            font-size: 12px;
          }

          .dosage {
            font-size: 10px;
          }

          .prescription-note {
            font-size: 10px;
            padding: 10px;
            margin-top: 10px;
          }

          .prescription-actions {
            padding: 10px 12px;
            gap: 8px;
          }

          .prescription-button {
            padding: 8px 12px;
            font-size: 11px;
            min-height: 40px;
          }

          .bandage-hint {
            bottom: -45px;
            width: 95%;
            max-width: 280px;
          }

          .hint-text {
            font-size: 12px;
            padding: 6px 10px;
          }
        }

        /* Realistic Square Bandage Wrap */
        .bandage-wrap {
          position: relative;
          width: 200px;
          height: 200px;
          cursor: pointer;
          transition: transform 0.3s ease;
          transform-style: preserve-3d;
        }

        .bandage-wrap:hover {
          transform: scale(1.05);
        }

        .bandage-wrap:active {
          transform: scale(0.95);
        }

        .bandage-wrap.pasting .bandage-cross {
          animation: bandage-press 500ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .bandage-wrap.pasted .bandage-cross {
          transform: translate(-50%, -50%) scale(0.98);
        }
        
        .bandage-wrap.pasted .horizontal-strip,
        .bandage-wrap.pasted .vertical-strip {
          box-shadow: 
            inset 0 2px 0 rgba(255, 255, 255, 0.4),
            inset 0 -2px 0 rgba(0, 0, 0, 0.15),
            0 2px 6px rgba(0, 0, 0, 0.2);
        }

        /* Wound/Base Area */
        .wound-area {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #FEF2F2;
          border-radius: 20px;
          z-index: 1;
        }

        .wound-base {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
          border-radius: 20px;
          border: 2px solid #FECACA;
          box-shadow: inset 0 2px 8px rgba(254, 202, 202, 0.3);
        }

        /* Dark theme wound area */
        .dark-mode .wound-area {
          background: #3F1F1F;
        }

        .dark-mode .wound-base {
          background: linear-gradient(135deg, #3F1F1F 0%, #5F2F2F 100%);
          border-color: #5F2F2F;
          box-shadow: inset 0 2px 8px rgba(95, 47, 47, 0.3);
        }

        .wound-shadow {
          position: absolute;
          bottom: -4px;
          left: 2px;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          z-index: -1;
          filter: blur(4px);
        }

        /* Hyper-Realistic Band-Aid Design */
        .realistic-bandage-cross {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 10;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Heart Icon */
        .bandage-heart {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 16px;
          z-index: 25;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          animation: heartbeat 2s infinite ease-in-out;
        }

        @keyframes heartbeat {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
        }

        /* Cross-shaped Bandage */
        .bandage-cross {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 160px;
          height: 160px;
        }

        /* Horizontal Strip */
        .horizontal-strip {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 160px;
          height: 50px;
          background: linear-gradient(135deg, #f4d1ae 0%, #e8c4a0 50%, #ddb892 100%);
          border-radius: 25px;
          box-shadow: 
            inset 0 2px 0 rgba(255, 255, 255, 0.3),
            inset 0 -2px 0 rgba(0, 0, 0, 0.1),
            0 4px 8px rgba(0, 0, 0, 0.15);
          z-index: 15;
        }

        /* Vertical Strip */
        .vertical-strip {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 160px;
          background: linear-gradient(45deg, #f4d1ae 0%, #e8c4a0 50%, #ddb892 100%);
          border-radius: 25px;
          box-shadow: 
            inset 0 2px 0 rgba(255, 255, 255, 0.3),
            inset 0 -2px 0 rgba(0, 0, 0, 0.1),
            0 4px 8px rgba(0, 0, 0, 0.15);
          z-index: 15;
        }

        /* Strip Texture */
        .strip-texture {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 3px),
            repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 4px);
          border-radius: inherit;
        }

        /* Central Pad */
        .central-pad {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #e8e8e8 100%);
          border-radius: 8px;
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 20;
        }

        .pad-texture {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5) 0%, transparent 50%),
            repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.02) 0px, rgba(0, 0, 0, 0.02) 1px, transparent 1px, transparent 2px);
          border-radius: inherit;
        }

        /* Perforations */
        .perforation-left, .perforation-right, .perforation-top, .perforation-bottom {
          position: absolute;
          background: repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0, 0, 0, 0.1) 3px, rgba(0, 0, 0, 0.1) 5px);
        }

        .perforation-left {
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
          height: 40px;
          border-radius: 7px 0 0 7px;
        }

        .perforation-right {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
          height: 40px;
          border-radius: 0 7px 7px 0;
        }

        .perforation-top {
          top: 0;
          left: 50%;
          transform: translateX(-50%) rotate(90deg);
          width: 15px;
          height: 40px;
          border-radius: 7px 0 0 7px;
        }

        .perforation-bottom {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) rotate(90deg);
          width: 15px;
          height: 40px;
          border-radius: 0 7px 7px 0;
        }

        /* Adhesive Dots Pattern */
        .adhesive-pattern {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          z-index: 16;
        }

        .dot-row {
          position: absolute;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .row-1 { top: 20%; }
        .row-2 { top: 50%; transform: translateY(-50%); }
        .row-3 { bottom: 20%; }

        .adhesive-dot {
          width: 3px;
          height: 3px;
          background: rgba(139, 69, 19, 0.3);
          border-radius: 50%;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        /* Drop Shadow */
        .bandage-shadow {
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 170px;
          height: 170px;
          background: radial-gradient(ellipse, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 70%);
          border-radius: 50%;
          z-index: 5;
          filter: blur(4px);
        }

        /* Main Band-Aid Base */
        .bandaid-base {
          position: absolute;
          width: 180px;
          height: 120px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #F4E4C1 0%, #E8D5A6 50%, #F4E4C1 100%);
          border-radius: 20px;
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          z-index: 15;
        }

        /* Central Absorbent Pad */
        .absorbent-pad {
          position: absolute;
          width: 80px;
          height: 80px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #FEFEFE 0%, #F0F0F0 100%);
          border-radius: 8px;
          border: 1px solid #E0E0E0;
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.05),
            0 1px 3px rgba(0, 0, 0, 0.1);
          z-index: 20;
        }

        /* Gauze Texture */
        .gauze-texture {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            repeating-linear-gradient(0deg, 
              transparent, transparent 2px, 
              rgba(0, 0, 0, 0.02) 2px, rgba(0, 0, 0, 0.02) 3px),
            repeating-linear-gradient(90deg, 
              transparent, transparent 2px, 
              rgba(0, 0, 0, 0.02) 2px, rgba(0, 0, 0, 0.02) 3px);
          border-radius: 8px;
        }

        /* Absorbent Core */
        .absorbent-core {
          position: absolute;
          width: 60px;
          height: 60px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 21;
        }

        /* Adhesive Areas */
        .adhesive-area {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 100px;
          background: linear-gradient(135deg, #F4E4C1 0%, #E8D5A6 100%);
          z-index: 18;
        }

        .adhesive-left-area {
          left: 10px;
          border-radius: 15px 5px 5px 15px;
        }

        .adhesive-right-area {
          right: 10px;
          border-radius: 5px 15px 15px 5px;
        }

        /* Adhesive Dots Pattern */
        .adhesive-dots {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 2px),
            radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 2px),
            radial-gradient(circle at 25% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 2px);
          background-size: 8px 8px;
          border-radius: inherit;
        }

        /* Band-Aid Edges */
        .bandaid-edge {
          position: absolute;
          background: linear-gradient(135deg, #E8D5A6 0%, #D4C4A8 100%);
          z-index: 16;
        }

        .edge-left, .edge-right {
          width: 2px;
          height: 100%;
          top: 0;
        }

        .edge-left { left: 0; }
        .edge-right { right: 0; }

        .edge-top, .edge-bottom {
          width: 100%;
          height: 2px;
          left: 0;
        }

        .edge-top { top: 0; }
        .edge-bottom { bottom: 0; }

        /* Corner Curves */
        .corner-curve {
          position: absolute;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, #E8D5A6 0%, #D4C4A8 100%);
          z-index: 17;
        }

        .corner-tl { top: 0; left: 0; border-radius: 0 0 20px 0; }
        .corner-tr { top: 0; right: 0; border-radius: 0 0 0 20px; }
        .corner-bl { bottom: 0; left: 0; border-radius: 0 20px 0 0; }
        .corner-br { bottom: 0; right: 0; border-radius: 20px 0 0 0; }

        /* Protective Film Effect */
        .protective-film {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 50%, 
            rgba(255, 255, 255, 0.1) 100%);
          border-radius: 20px;
          z-index: 19;
          pointer-events: none;
        }

        /* Brand Marking */
        .bandage-heart {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
          z-index: 22;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
          animation: heartbeat 2s infinite ease-in-out;
        }

        @keyframes heartbeat {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        /* Peeling Corner */
        .peel-corner {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 15px;
          height: 15px;
          background: linear-gradient(135deg, #F4E4C1 0%, #E8D5A6 100%);
          border-radius: 0 0 0 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          z-index: 23;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .realistic-bandaid:hover .peel-corner {
          opacity: 1;
        }

        /* Shadow Underneath */
        .shadow-underneath {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 2px;
          left: 2px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          z-index: 14;
          filter: blur(4px);
        }

        /* Unwrapped State - Realistic Peeling */
        .bandage-wrap.unwrapped .realistic-bandaid {
          animation: realistic-peel 1.5s ease-out forwards;
        }

        .bandage-wrap.unwrapped .bandaid-base {
          animation: bandaid-lift 1.5s ease-out forwards;
        }

        .bandage-wrap.unwrapped .absorbent-pad {
          animation: pad-detach 1.2s ease-out 0.3s forwards;
        }

        .bandage-wrap.unwrapped .adhesive-area {
          animation: adhesive-release 1.0s ease-out forwards;
        }

        .bandage-wrap.unwrapped .adhesive-left-area {
          animation-delay: 0.1s;
        }

        .bandage-wrap.unwrapped .adhesive-right-area {
          animation-delay: 0.3s;
        }

        .bandage-wrap.unwrapped .protective-film {
          animation: film-crinkle 1.5s ease-out forwards;
        }

        /* Bandage Edges for 3D effect */
        .bandage-edges {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 16;
        }

        .edge-left, .edge-right, .edge-top, .edge-bottom {
          position: absolute;
          background: linear-gradient(45deg, #E6E6E6, #CCCCCC);
          opacity: 0.8;
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
        }

        .edge-left {
          width: 3px;
          height: 100%;
          left: 0;
          border-radius: 2px 0 0 2px;
        }

        .edge-right {
          width: 3px;
          height: 100%;
          right: 0;
          border-radius: 0 2px 2px 0;
        }

        .edge-top {
          width: 100%;
          height: 3px;
          top: 0;
          border-radius: 2px 2px 0 0;
        }

        .edge-bottom {
          width: 100%;
          height: 3px;
          bottom: 0;
          border-radius: 0 0 2px 2px;
        }

        /* Unwrapping Animation Effects */
        .unwrap-effects {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .bandage-wrap.unwrapping .unwrap-effects {
          opacity: 1;
        }

        .unwrap-strip {
          position: absolute;
          background: linear-gradient(135deg, #FFFBEB 0%, #F5F5DC 100%);
          border: 1px solid #D4D4AA;
          border-radius: 4px;
          box-shadow: 
            inset 0 1px 3px rgba(255, 255, 255, 0.8),
            0 2px 4px rgba(0, 0, 0, 0.1);
          background-image: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.1) 2px,
              rgba(255, 255, 255, 0.1) 4px
            );
          animation: unwrap-fly 1.2s ease-out forwards;
        }

        .unwrap-1 {
          width: 160px;
          height: 25px;
          top: 20px;
          left: 10px;
          animation-delay: 0s;
        }

        .unwrap-2 {
          width: 170px;
          height: 26px;
          top: 70px;
          left: 5px;
          animation-delay: 0.2s;
        }

        .unwrap-3 {
          width: 165px;
          height: 24px;
          top: 120px;
          left: 8px;
          animation-delay: 0.4s;
        }

        /* Remove old bandage edges when unwrapped */
        .bandage-wrap.unwrapped .bandage-edges {
          opacity: 0;
        }

        /* Healing Glow Effect */
        .healing-glow {
          position: absolute;
          width: 120%;
          height: 120%;
          top: -10%;
          left: -10%;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          animation: healing-pulse 2s ease-in-out infinite;
          z-index: 5;
        }

        .bandage-wrap.unwrapped .healing-glow {
          opacity: 1;
        }

        /* Prescription Card - Blank Paper Style */
        .prescription-card {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 480px;
          min-height: 400px;
          background: #FEFEFE;
          border: none;
          border-radius: 0;
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 80vh;
          overflow-y: auto;
          pointer-events: none;
          font-family: var(--font-cursive), cursive;
        }

        /* Dark theme prescription card */
        .dark-mode .prescription-card {
          background: #1F2937;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .prescription-card.visible {
          opacity: 1 !important;
          transform: translate(-50%, -50%) scale(1) !important;
          pointer-events: all;
        }

        /* Letterhead */
        .prescription-letterhead {
          text-align: center;
          padding: 30px 40px 20px;
          border-bottom: 2px solid #333;
          margin-bottom: 40px;
        }

        .letterhead-logo {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .letterhead-title {
          font-family: 'Georgia', serif;
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .letterhead-subtitle {
          font-family: 'Georgia', serif;
          font-size: 14px;
          color: #666;
          font-style: italic;
        }

        .dark-mode .letterhead-title {
          color: #E5E7EB;
        }

        .dark-mode .letterhead-subtitle {
          color: #9CA3AF;
        }

        .dark-mode .prescription-letterhead {
          border-bottom-color: #E5E7EB;
        }

        /* Prescription Body */
        .prescription-body {
          padding: 20px 40px 40px;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .prescription-message {
          text-align: center;
          max-width: 100%;
        }

        .message-content {
          font-family: var(--font-cursive), cursive;
          font-size: 28px;
          font-weight: 500;
          color: #333;
          line-height: 1.4;
          margin-bottom: 20px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .message-type {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .dark-mode .message-content {
          color: #E5E7EB;
        }

        .dark-mode .message-type {
          color: #9CA3AF;
        }

        /* Prescription Actions */
        .prescription-actions {
          padding: 20px 40px 30px;
          display: flex;
          gap: 16px;
          justify-content: center;
          border-top: 1px solid #E5E7EB;
          margin-top: 20px;
        }

        .dark-mode .prescription-actions {
          border-top-color: #4B5563;
        }

        .prescription-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .start-over-button {
          background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
          color: #374151;
          border: 1px solid #D1D5DB;
        }

        .start-over-button:hover {
          background: linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .another-button {
          background: linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%);
          color: #1E40AF;
          border: 1px solid #60A5FA;
        }

        .another-button:hover {
          background: linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
        }

        /* Interaction Hint */
        .bandage-hint {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 100;
        }

        .hint-text {
          font-family: 'Inter', sans-serif;
          color: #6B7280;
          font-size: 16px;
          font-weight: 500;
          display: block;
          margin-bottom: 8px;
        }

        .hint-pulse {
          width: 20px;
          height: 20px;
          background: #F59E0B;
          border-radius: 50%;
          margin: 0 auto;
          animation: hint-pulse-warm 2s ease-in-out infinite;
        }

        /* Animations */
        @keyframes bandage-shake {
          0%, 100% { transform: scale(1.05) rotate(0deg); }
          25% { transform: scale(1.05) rotate(-1deg); }
          75% { transform: scale(1.05) rotate(1deg); }
        }

        @keyframes realistic-peel {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          30% {
            transform: scale(1.02) rotate(1deg);
            opacity: 0.9;
          }
          70% {
            transform: scale(0.95) rotate(5deg) translateY(-20px);
            opacity: 0.5;
          }
          100% {
            transform: scale(0.8) rotate(15deg) translateY(-60px) translateX(30px);
            opacity: 0;
          }
        }

        @keyframes bandaid-lift {
          0% {
            transform: translate(-50%, -50%) rotateZ(0deg);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          50% {
            transform: translate(-50%, -50%) rotateZ(2deg) translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          }
          100% {
            transform: translate(-50%, -50%) rotateZ(8deg) translateY(-40px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          }
        }

        @keyframes pad-detach {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1) rotate(2deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.9) rotate(10deg) translateY(-20px);
            opacity: 0.3;
          }
        }

        @keyframes adhesive-release {
          0% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
          30% {
            opacity: 0.8;
            transform: translateY(-50%) scale(1.05);
          }
          100% {
            opacity: 0.2;
            transform: translateY(-50%) scale(0.9) rotate(3deg);
          }
        }

        @keyframes film-crinkle {
          0% {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 50%, 
              rgba(255, 255, 255, 0.1) 100%);
          }
          50% {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.3) 0%, 
              rgba(255, 255, 255, 0.1) 30%, 
              rgba(255, 255, 255, 0.2) 60%, 
              rgba(255, 255, 255, 0.05) 100%);
          }
          100% {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 100%);
          }
        }

        @keyframes healing-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes hint-pulse-warm {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        /* Press-in animation */
        @keyframes bandaid-press {
          0% { transform: translate(-50%, -50%) scale(1); }
          40% { transform: translate(-50%, -50%) scale(0.96); }
          70% { transform: translate(-50%, -50%) scale(1.01); }
          100% { transform: translate(-50%, -50%) scale(0.98); }
        }
      `}</style>
    </div>
  );
}
