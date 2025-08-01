'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Game = () => {
  const [currentScene, setCurrentScene] = useState('main'); // 'main', 'foot', 'ring', 'purse', 'id'
  const [overlayText, setOverlayText] = useState('');
  const [showIdCard, setShowIdCard] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [nextScene, setNextScene] = useState(null);
  const [nextOverlayText, setNextOverlayText] = useState('');

  const handleSceneChange = (scene, text) => {
    setTransitioning(true);
    setNextScene(scene);
    setNextOverlayText(text);
    setShowIdCard(false); // Reset ID card visibility
  };

  useEffect(() => {
    if (transitioning) {
      const timer = setTimeout(() => {
        setCurrentScene(nextScene);
        setOverlayText(nextOverlayText);
        setTransitioning(false);
      }, 500); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [transitioning, nextScene, nextOverlayText]);

  const handleMainSceneClick = () => {
    handleSceneChange('main', '');
  };

  const handleIdCardClick = () => {
    setShowIdCard(true);
    setOverlayText("Victim identified: Marissa Holloway, 36. Her story ends here. But yours begins.");
  };

  const renderSceneContent = () => {
    switch (currentScene) {
      case 'main':
        return (
          <>
            <Image src="/images/scene.png" alt="Crime Scene" layout="fill" objectFit="cover" />
            {/* Interactive Zones for Main Scene */}
            {/* Zone A: Missing Shoe */}
            <div
              className="interactive-zone shoe-zone"
              onClick={(e) => { e.stopPropagation(); handleSceneChange('foot', "One heel is gone. Removed, not lost. Could it be a trophy for the killer?"); }}
            ></div>
            {/* Zone B: Wedding Ring Mark */}
            <div
              className="interactive-zone ring-zone"
              onClick={(e) => { e.stopPropagation(); handleSceneChange('ring', "The ring was taken off. No swelling, no bruises. Recently removed—possibly willingly. A clue to motive?"); }}
            ></div>
            {/* Zone C: Open Purse */}
            <div
              className="interactive-zone purse-zone"
              onClick={(e) => { e.stopPropagation(); handleSceneChange('purse', "No wallet. No cash. But there’s still something inside…"); }}
            ></div>
          </>
        );
      case 'foot':
        return (
          <>
            <Image src="/images/foot.png" alt="Missing Shoe" layout="fill" objectFit="cover" />
            <div className="overlay-text">{overlayText}</div>
          </>
        );
      case 'ring':
        return (
          <>
            <Image src="/images/ring.png" alt="Wedding Ring Mark" layout="fill" objectFit="cover" />
            <div className="overlay-text">{overlayText}</div>
          </>
        );
      case 'purse':
        return (
          <>
            <Image src={showIdCard ? "/images/purse2.png" : "/images/purse.png"} alt="Open Purse" layout="fill" objectFit="cover" />
            {!showIdCard && (
              <div
                className="interactive-zone id-zone"
                onClick={(e) => { e.stopPropagation(); handleIdCardClick(); }}
              ></div>
            )}
            {showIdCard && (
              <>
                <Image src="/images/id.png" alt="Driver's License" width={280} height={175} className="id-card-overlay" />
                <div className="overlay-text">{overlayText}</div>
              </>
            )}
            {!showIdCard && <div className="overlay-text">{overlayText}</div>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="game-wrapper">
      <div className={`game-container ${transitioning ? 'fade-out' : ''}`} onClick={handleMainSceneClick}>
        {renderSceneContent()}
      </div>
    </div>
  );
};

export default Game;