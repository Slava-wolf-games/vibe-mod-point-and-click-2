'use client';

import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import Image from 'next/image';

// SFX paths
const SFX_PIANO_1 = '/SFX/MA_MotionAudio_ScaryPianoHit_01.wav';
const SFX_PIANO_2 = '/SFX/MA_MotionAudio_ScaryPianoHit_02.wav';
const SFX_PIANO_3 = '/SFX/MA_MotionAudio_ScaryPianoHit_03.wav';
const SFX_PIANO_4 = '/SFX/MA_MotionAudio_ScaryPianoHit_04.wav';
const AMBIENCE_SOUND = '/SFX/MA_Beison_Street_Ambience_with_Vehicles_and_People_1.mp3';

const Game = () => {
  const [currentScene, setCurrentScene] = useState('alley'); // 'alley', 'main', 'foot', 'ring', 'purse', 'id'
  const [overlayText, setOverlayText] = useState('');
  const [displayedText, setDisplayedText] = useState(''); // For typewriter effect
  const [showIdCard, setShowIdCard] = useState(false);
  const [idZoneAnimating, setIdZoneAnimating] = useState(false); // New state for id-zone animation
  const [transitioning, setTransitioning] = useState(false);
  const [nextScene, setNextScene] = useState(null);
  const [nextOverlayText, setNextOverlayText] = useState('');

  // Create refs for audio elements
  const audioRefs = useRef({});
  const ambienceAudioRef = useRef(null); // Ref for ambience audio

  useEffect(() => {
    // Initialize audio objects once on component mount
    audioRefs.current.piano1 = new Audio(SFX_PIANO_1);
    audioRefs.current.piano2 = new Audio(SFX_PIANO_2);
    audioRefs.current.piano3 = new Audio(SFX_PIANO_3);
    audioRefs.current.piano4 = new Audio(SFX_PIANO_4);

    // Optional: Preload audio files (can be 'auto', 'metadata', 'none')
    // For immediate playback, 'auto' or 'metadata' is good.
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = 0.25; // Set volume to 25% (50% quieter than previous 50%)
      audio.load();
    });

  }, []); // Empty dependency array means this runs once on mount

  const playSound = (sfxKey) => {
    const audio = audioRefs.current[sfxKey];
    if (audio) {
      audio.currentTime = 0; // Rewind to start for immediate replay
      audio.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  const handleSceneChange = (scene, text) => {
    setTransitioning(true);
    setNextScene(scene);
    setNextOverlayText(text);
    setShowIdCard(false); // Reset ID card visibility
    setDisplayedText(''); // Reset displayed text for new animation
  };

  useEffect(() => {
    if (transitioning) {
      const timer = setTimeout(() => {
        setCurrentScene(nextScene);
        setTransitioning(false);

        // Adjust ambience volume based on scene
        if (ambienceAudioRef.current) {
          if (nextScene === 'main') {
            ambienceAudioRef.current.volume = 0.5; // 50% quieter for scene 1 (main)
          } else if (nextScene === 'alley') {
            ambienceAudioRef.current.volume = 1.0; // Full volume for scene 0 (alley)
          }
        }


        // Introduce a delay here before setting overlayText
        const textDelayTimer = setTimeout(() => {
          setOverlayText(nextOverlayText);
        }, 1000); // 1-second delay

        // If entering the 'purse' scene, trigger id-zone animation
        if (nextScene === 'purse') {
          setTimeout(() => {
            setIdZoneAnimating(true);
          }, 100); // Small delay to ensure element is in DOM
        } else {
          setIdZoneAnimating(false); // Reset when not in purse scene
        }

        return () => clearTimeout(textDelayTimer); // Cleanup for text delay
      }, 500); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [transitioning, nextScene, nextOverlayText]);

  useEffect(() => {
    if (overlayText) {
      let index = 0;
      setDisplayedText(''); // Start fresh for each new text
      const intervalId = setInterval(() => {
        setDisplayedText(overlayText.substring(0, index + 1));
        index++;
        if (index === overlayText.length) {
          clearInterval(intervalId);
        }
      }, 25); // Typing speed (milliseconds per character)
      return () => clearInterval(intervalId);
    } else {
      setDisplayedText('');
    }
  }, [overlayText]);

  useEffect(() => {
    if (currentScene === 'alley') {
      const textDelayTimer = setTimeout(() => {
        setOverlayText("First on the scene, last to sleep. Hell of a way to end a Thursday night.");
      }, 1500); // 1.5 seconds delay
      return () => clearTimeout(textDelayTimer); // Cleanup
    }
  }, [currentScene]);

  const handleMainSceneClick = () => {
    handleSceneChange('main', '');
  };

  const handleIdCardClick = () => {
    setTimeout(() => {
      setShowIdCard(true);
      setOverlayText("Victim identified: Marissa Holloway, 36. Her story ends here. But yours begins.");
    }, 500); // Delay before showing the ID card and text
  };

  const renderSceneContent = () => {
    switch (currentScene) {
      case 'alley':
        return (
          <>
            <Image src="/images/alley.png" alt="Alley Scene" layout="fill" objectFit="cover" className={`background-image ${currentScene === 'alley' ? 'initial-fade-in' : ''}`} />
            {/* Interactive Zone for Alley Scene (Body) */}
            <div
              className="interactive-zone body-zone animate-in"
              style={{ animationDelay: '3s' }} /* Animation starts after image fade-in */
              onClick={(e) => { e.stopPropagation(); playSound('piano1'); handleSceneChange('main', "The crime scene. A chilling silence hangs in the air. Time to investigate."); }}
            ></div>
            <div className="overlay-text">{displayedText}</div>
          </>
        );
      case 'main':
        return (
          <>
            <Image src="/images/scene.png" alt="Crime Scene" layout="fill" objectFit="cover" className="background-image" />
            {/* Interactive Zones for Main Scene */}
            {/* Zone A: Missing Shoe */}
            <div
              className="interactive-zone shoe-zone animate-in"
              style={{ animationDelay: '0.25s' }}
              onClick={(e) => { e.stopPropagation(); playSound('piano1'); handleSceneChange('foot', "One heel is gone. Removed, not lost. Could it be a trophy for the killer?"); }}
            ></div>
            {/* Zone B: Wedding Ring Mark */}
            <div
              className="interactive-zone ring-zone animate-in"
              style={{ animationDelay: '0.5s' }}
              onClick={(e) => { e.stopPropagation(); playSound('piano2'); handleSceneChange('ring', "The ring was taken off. No swelling, no bruises. Recently removed—possibly willingly."); }}
            ></div>
            {/* Zone C: Open Purse */}
            <div
              className="interactive-zone purse-zone animate-in"
              style={{ animationDelay: '0.75s' }}
              onClick={(e) => { e.stopPropagation(); playSound('piano3'); handleSceneChange('purse', "No wallet. No cash. But there’s still something inside…"); }}
            ></div>
          </>
        );
      case 'foot':
        return (
          <>
            <Image src="/images/foot.png" alt="Missing Shoe" layout="fill" objectFit="cover" />
            <div className="overlay-text">{displayedText}</div>
          </>
        );
      case 'ring':
        return (
          <>
            <Image src="/images/ring.png" alt="Wedding Ring Mark" layout="fill" objectFit="cover" />
            <div className="overlay-text">{displayedText}</div>
          </>
        );
      case 'purse':
        return (
          <>
            <Image src="/images/purse.png" alt="Open Purse" layout="fill" objectFit="cover" className="background-image" />
            <Image src="/images/purse2.png" alt="Open Purse Blurred" layout="fill" objectFit="cover" className={`background-image ${showIdCard ? 'fade-in-background blurred-image' : 'fade-out-background'}`} />
            {!showIdCard && (
              <div
                className={`interactive-zone id-zone ${idZoneAnimating ? 'animate-in' : ''}`}
                style={{ animationDelay: '0.5s' }} /* Re-added animation delay */
                onClick={(e) => { e.stopPropagation(); playSound('piano4'); handleIdCardClick(); }}
              ></div>
            )}
            {showIdCard && (
              <>
                <Image src="/images/id2.png" alt="Driver's License" width={400} height={250} className={`id-card-overlay animate-in`} />
                <div className="overlay-text">{displayedText}</div>
              </>
            )}
            {!showIdCard && <div className="overlay-text">{displayedText}</div>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="game-wrapper">
      <audio src="/music/ta-panta-rei-steven-gutheinz-musicbed-licensed.mp3" autoPlay loop />
      <audio ref={ambienceAudioRef} src={AMBIENCE_SOUND} loop autoPlay />
      <div className={`game-container ${transitioning ? 'fade-out' : ''}`} onClick={() => {
        if (currentScene === 'alley') {
          handleMainSceneClick();
        } else if (currentScene === 'foot' || currentScene === 'ring' || currentScene === 'purse' || currentScene === 'id') {
          handleSceneChange('main', '');
        }
      }}>
        {renderSceneContent()}
      </div>
    </div>
  );
};

export default Game;