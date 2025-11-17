import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '../contexts/MobileContext';
import { useSceneStore } from '../core/SceneManager';
import { SCENE_MANAGER } from '../config/config';

export interface SceneText {
  header: string;
  sub: string;
  backgroundColor?: string; // background color for the text container
}

function SceneTextComponent() {
  const { currentScene, sceneZoomed, goToPrevScene, goToNextScene } = useSceneStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobile();
  // calculate responsive font sizes
  const headerSize = isMobile ? '32px' : '48px';
  const subSize = isMobile ? '18px' : '24px';
  const topPosition = isMobile ? '20px' : '30px';

  // get scene text based on current scene
  const getSceneText = () => {
    switch (currentScene) {
      case 'galaxy':
        return { header: 'Milky Way', sub: 'Galaxy' };
      case 'solarSystemApproach':
        return { header: 'Interstellär rymd', sub: 'Orionarmen'};
      case 'solarSystemRotation':
        return { header: 'Solsystem', sub: 'Stjärnsystem' };
      case 'earthApproach':
        return { header: 'Jordens närhet', sub: 'Nära rymden' };
      case 'earth':
        return { header: 'Jorden', sub: 'Planet' };
      case 'station':
        return { header: 'Rymdstation', sub: 'Skapa och starta din satellit' };
      default:
        return null;
    }
  };
  const [localText, setLocalText] = useState<SceneText | null>(getSceneText());

  useEffect(() => {
    // remove text when last scene zoomed in (cant properly see the device's content)
    if (SCENE_MANAGER.SCENE_ORDER.indexOf(currentScene) === SCENE_MANAGER.SCENE_ORDER.length - 1 && sceneZoomed === 'in') {
      setLocalText(null);
      return
    }

    const sceneText = getSceneText();
    if (sceneText?.header == localText?.header && sceneText?.sub == localText?.sub) return;

    if (sceneText) {
      setLocalText(sceneText);
    } else if (localText) { // when parent clears overlayText, clear localText.
      setLocalText(null)
    }
  }, [currentScene, sceneZoomed]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: topPosition,
        left: 0,
        right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 1,
        backgroundColor: localText?.backgroundColor,
        padding: isMobile ? '0 15px' : '0',
      }}
    >
      <div style={{ fontFamily: 'Tektur-Medium', fontSize: headerSize, color: 'white' }}>
        {localText?.header}
      </div>
      <div style={{ fontFamily: 'Tektur-Regular', fontSize: subSize, color: 'gray' }}>
        {localText?.sub}
      </div>
     {currentScene === 'earth' && (
  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
    <button
      style={{ padding: '10px 24px', fontSize: '18px', borderRadius: '12px', border: 'none', backgroundColor: '#8b5cf6', color: 'white', cursor: 'pointer', pointerEvents: 'auto', boxShadow: '0 6px 16px rgba(139,92,246,0.35)' }}
      onClick={() => window.open('https://www.tinkercad.com/', '_blank')}
    >
      Skapa en satellit
    </button>
    <button
      style={{ padding: '10px 24px', fontSize: '18px', borderRadius: '12px', border: 'none', backgroundColor: '#14b8a6', color: 'white', cursor: 'pointer', pointerEvents: 'auto', boxShadow: '0 6px 16px rgba(20,184,166,0.35)' }}
      onClick={() => window.open('https://www.nasa.gov/', '_blank')}
    >
      Lär dig mer
    </button>
    <button
      style={{
        padding: '10px 24px',
        fontSize: '18px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#1d3cff',
        color: 'white',
        cursor: 'pointer',
        pointerEvents: 'auto',
        boxShadow: '0 6px 16px rgba(29,60,255,0.35)',
      }}
      onClick={() => navigate('/mini-ai')}
    >
      Starta mini-AI
    </button>
    <button
      style={{
        padding: '10px 24px',
        fontSize: '18px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#f97316',
        color: '#ffffff',
        cursor: 'pointer',
        pointerEvents: 'auto',
        boxShadow: '0 6px 16px rgba(249,115,22,0.35)',
      }}
      onClick={() => goToNextScene()}
    >
      Till rymdstationen →
    </button>
    <button
      style={{
        padding: '10px 24px',
        fontSize: '18px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#ef4444',
        color: '#fff',
        cursor: 'pointer',
        pointerEvents: 'auto',
        boxShadow: '0 6px 16px rgba(239,68,68,0.35)',
      }}
      onClick={() => navigate('/station-sim')}
    >
      3D-satellitläge
    </button>
  </div>
)}
{currentScene === 'station' && (
  <button
    style={{
      marginTop: '12px',
      padding: '10px 28px',
      fontSize: '18px',
      borderRadius: '999px',
      border: '1px solid rgba(255,255,255,0.3)',
      backgroundColor: 'rgba(0,0,0,0.65)',
      color: 'white',
      cursor: 'pointer',
      pointerEvents: 'auto',
      backdropFilter: 'blur(8px)',
    }}
    onClick={() => goToPrevScene()}
  >
    ← Tillbaka till bygget
  </button>
)}
    </div>
  );
} 

export default SceneTextComponent;
