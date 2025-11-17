// Pass0 – första riktiga “passet”. Visar galax-bakgrund, klimatpanelen och en tom yta för 3D.
// Skapar ett ClimateSystem-objekt och skickar det till UI-komponenten. Täcker hela skärmen.

'use client';
import { useNavigate } from 'react-router-dom';
import GalaxyApp from '../Galaxy/GalaxyApp';

export default function Pass0() {
  const navigate = useNavigate();

  return (
    <div
      className="homepage-container"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
        background: 'black',
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 20,
          padding: '0.6rem 1.2rem',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.4)',
          background: 'rgba(3, 6, 18, 0.7)',
          color: '#f4f7ff',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}
      >
        ← Tillbaka
      </button>

      {/* 🌌 Bakgrundsgalax */}
      <GalaxyApp />

      {/* 🪐 3D-värld */}
      <div
        style={{
          width: '100%',
          height: '100vh',
          position: 'absolute',
          zIndex: 5,
        }}
      >
      </div>
    </div>
  );
}

