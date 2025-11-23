'use client';

import { useNavigate } from 'react-router-dom';
import RocketLaunchExperience from '../rocket/RocketLaunchExperience';

export default function RocketWorld() {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#01020a' }}>
      <RocketLaunchExperience />
      <button
        onClick={() => navigate('/pass0')}
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 20,
          padding: '0.6rem 1.4rem',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'rgba(3, 6, 18, 0.75)',
          color: '#f4f7ff',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}
      >
        ← Tillbaka
      </button>
    </div>
  );
}
