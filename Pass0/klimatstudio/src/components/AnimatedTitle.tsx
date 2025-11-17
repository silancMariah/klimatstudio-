'use client';
import { useEffect, useState } from 'react';

export default function AnimatedTitle() {
  const text = 'En resa genom rymden och jorden';
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(v => (v < text.length ? v + 1 : v));
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <h2 className="animated-title">
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className={`letter ${i < visible ? 'visible' : ''}`}
          style={{ animationDelay: `${i * 0.045}s` }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Space+Grotesk:wght@400;600&display=swap');

        .animated-title {
          font-family: 'Orbitron','Space Grotesk',system-ui,sans-serif;
          font-size: clamp(1.3rem, 3.2vw, 2.2rem);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #5fc3e4; /* ljusblå grundfärg */
          text-shadow:
            0 0 5px #5fc3e4,
            0 0 10px #0077ff,
            0 0 20px #00d4ff,
            0 0 35px #00bfff;
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%,100% {
            text-shadow: 0 0 5px #5fc3e4, 0 0 10px #0077ff, 0 0 20px #00d4ff, 0 0 35px #00bfff;
          }
          50% {
            text-shadow: 0 0 10px #a3d8ff, 0 0 25px #66ffff, 0 0 40px #a3d8ff;
          }
        }

        .letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(16px);
          filter: blur(6px);
        }

        .letter.visible {
          animation: appear 0.55s cubic-bezier(.22,.61,.36,1) forwards;
        }

        @keyframes appear {
          0%   { opacity:0; transform:translateY(16px); filter:blur(6px); }
          100% { opacity:1; transform:translateY(0); filter:blur(0); }
        }
      `}</style>
    </h2>
  );
}
