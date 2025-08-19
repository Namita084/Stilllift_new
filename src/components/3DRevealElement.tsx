'use client';

import { useState } from 'react';
import TreasureChest from './3DTreasureChest';
import Balloon from './3DBalloon';
import Stamp from './3DStamp';
import WarmCup from './3DWarmCup';
import Window from './3DWindow';
import Bandage from './3DBandage';
import LightSwitch from './3DLightSwitch';
import Sticker from './3DSticker';
import Envelope from './3DEnvelope';
import RibbonSlide from './3DRibbonSlide';
import GlowPatch from './3DGlowPatch';
import AutoFlip from './3DAutoFlip';

interface RevealElementProps {
  revealType: string;
  isRevealed: boolean;
  onReveal: () => void;
  accentColor: string;
  animationSpeed: 'rich' | 'quick' | 'gentle' | 'instant';
}

export default function RevealElement({ 
  revealType, 
  isRevealed, 
  onReveal, 
  accentColor, 
  animationSpeed 
}: RevealElementProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleReveal = () => {
    setIsAnimating(true);
    onReveal();
  };

  // Render the appropriate 3D element based on reveal type
  const renderElement = () => {
    switch (revealType) {
      case 'treasure-chest':
        return (
          <TreasureChest
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'balloon':
        return (
          <Balloon
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'balloon-pop':
        return (
          <Balloon
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'envelope':
        return (
          <Envelope
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'ribbon-slide':
        return (
          <RibbonSlide
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'glow-patch':
        return (
          <GlowPatch
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'auto-flip':
        return (
          <AutoFlip
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'stamp':
        return (
          <Stamp
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'warm-cup':
        return (
          <WarmCup
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'window-wipe':
        return (
          <Window
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'bandage':
        return (
          <Bandage
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'light-switch':
        return (
          <LightSwitch
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      case 'sticker':
        return (
          <Sticker
            isRevealed={isRevealed}
            onReveal={handleReveal}
            accentColor={accentColor}
            animationSpeed={animationSpeed}
          />
        );
      
      default:
        // Fallback to a simple animated element for unknown types
        return (
          <div 
            className="fallback-reveal-element"
            onClick={handleReveal}
            style={{ 
              cursor: isRevealed ? 'default' : 'pointer',
              backgroundColor: accentColor,
              color: 'white',
              padding: '2rem',
              borderRadius: '16px',
              textAlign: 'center',
              fontSize: '3rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              transform: isRevealed ? 'scale(1.1)' : 'scale(1)',
              filter: isRevealed ? 'brightness(1.2)' : 'brightness(1)'
            }}
          >
            ✨
            {!isRevealed && (
              <div style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.8 }}>
                Tap to reveal
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="reveal-element-container">
      {renderElement()}
    </div>
  );
}
