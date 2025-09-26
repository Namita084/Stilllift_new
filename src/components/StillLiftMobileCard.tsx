"use client";

import { useEffect, useRef } from 'react';

interface StillLiftMobileCardProps {
  message: string;
  actionType: 'ACTION' | 'VISUALIZE' | 'RECITE';
  title: string;
}

export default function StillLiftMobileCard({ message, actionType, title }: StillLiftMobileCardProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = bodyRef.current;
    if (!node) return;
    const timer = setTimeout(() => {
      node.classList.add('is-flipped');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="StillLiftMobileCard__wrapper">
      <div className="StillLiftMobileCard__container">
        <div ref={bodyRef} className="StillLiftMobileCard__body">
          <div className="StillLiftMobileCard__face StillLiftMobileCard__back">
            <p>StillLift</p>
          </div>
          <div className="StillLiftMobileCard__face StillLiftMobileCard__front">
            <h3>{actionType || 'ACTION'}</h3>
            <p>{message}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Shelve the old component's CSS. This is the new component's specific CSS. */

        .StillLiftMobileCard__wrapper {
          position: fixed !important; /* Forces centered overlay */
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important; /* Viewport width */
          height: 100vh !important; /* Viewport height */
          display: flex !important;
          justify-content: center !important; /* Center Horizontal */
          align-items: center !important; /* Center Vertical */
          z-index: 9999;
          background-color: transparent; /* No dark overlay */
        }

        .StillLiftMobileCard__container {
          perspective: 1000px;
          width: 300px; /* Fixed dimension */
          height: 400px; /* Fixed dimension */
        }

        .StillLiftMobileCard__body {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.8s ease-in-out;
          transform-style: preserve-3d;
          transform: rotateY(0deg);
          border-radius: 12px;
        }

        .StillLiftMobileCard__face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          /* Add styling: background, box-shadow, text centering */
          background-color: #fff;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
        }

        .StillLiftMobileCard__front {
          transform: rotateY(180deg); /* Start the front face hidden */
          background-color: #e6f7ff;
        }

        /* Triggered class to execute the flip */
        .StillLiftMobileCard__body.is-flipped {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}




