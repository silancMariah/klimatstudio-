'use client';
import { useEffect, useState } from 'react';
import '../index.css';

export default function RotatingEarth() {
  const frameCount = 33;
  const [frame, setFrame] = useState(0);

  // 🔵 För rörelse
  const [pos, setPos] = useState({ x: 50, y: 50 });

  // 🔁 Jordens sprite-animation
  useEffect(() => {
    const id = setInterval(() => {
      setFrame(p => (p + 1) % frameCount);
    }, 80); 
    return () => clearInterval(id);
  }, []);

  // 🟣 Mjuk slumpad rörelse
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const newX = Math.random() * 80 + 10;  
      const newY = Math.random() * 80 + 10;

      setPos({ x: newX, y: newY });
    }, 3000); // var 3 sekund

    return () => clearInterval(moveInterval);
  }, []);

  // 🖼️ Returnera bilden
  return (
    <img
      src={`/space_split/frame_${frame + 1}.png`}
      style={{
        position: 'absolute',
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: '160px',
        transition: 'all 2.8s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
      alt="Rotating Earth"
    />
  );
}
