'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import type { Group, Vector3Tuple } from 'three';
import { Vector3 } from 'three';
import './TurtleLab.css';
import { SatelliteModel } from '../Galaxy/scenes/Station/Components/SatelliteModel';

const DEFAULT_PROGRAM = `# Mini-turtle för satelliten
# Startar ute i rymden och ska hem till jorden
# forward/back = rörelse, left/right = sväng, up/down = höjd
# color = ändra färg

forward 1.5
left 60
forward 1
color #f87171
down 0.4
right 120
forward 2`;

type ParsedProgram = {
  points: Vector3[];
  color: string;
};

export default function TurtleLab() {
  const navigate = useNavigate();
  const [code, setCode] = useState(DEFAULT_PROGRAM);
  const [path, setPath] = useState<Vector3[]>(() => [new Vector3(3, 0, 0), new Vector3(2.5, 0, 0)]);
  const [status, setStatus] = useState<string>('Skriv kommandon och kör programmet.');
  const [color, setColor] = useState('#ffffff');
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const satelliteRef = useRef<Group | null>(null);
  const travelRef = useRef(0);
  const objectUrlRef = useRef<string | null>(null);

  const parsedLinePoints = useMemo<Vector3Tuple[]>(() => path.map(point => [point.x, point.y, point.z]), [path]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const runProgram = () => {
    try {
      const parsed = parseProgram(code);
      if (parsed.points.length < 2) {
        throw new Error('Programmet behöver minst ett forward/back-kommando.');
      }
      const outcome = evaluateCourse(parsed.points);
      setPath(parsed.points);
      setColor(parsed.color);
      travelRef.current = 0;
      if (outcome.hitObstacle) {
        setStatus('⚠️ Satelliten kolliderade med ett hinder! Ändra vägen.');
      } else if (!outcome.reachedGoal) {
        setStatus('ℹ️ Du missade planeten. Försök styra närmare jorden.');
      } else {
        setStatus('🎉 Snyggt! Satelliten nådde jorden utan hinder.');
      }
    } catch (error) {
      setStatus(`⚠️ ${(error as Error).message}`);
    }
  };

  const resetProgram = () => {
    setCode(DEFAULT_PROGRAM);
    runProgram();
  };

  return (
    <div className="turtle-page">
      <div className="turtle-header">
        <div>
          <p style={{ margin: 0, opacity: 0.7 }}>Turtle + satellit</p>
          <h1>Rita bana med kommandon</h1>
        </div>
        <button className="turtle-back" onClick={() => navigate('/pass0')}>
          ← Tillbaka
        </button>
      </div>

      <div className="turtle-layout">
        <div className="turtle-card">
          <h3>Instruktioner</h3>
          <p>Varje rad kan innehålla:</p>
          <ul style={{ opacity: 0.85, fontSize: '0.95rem', paddingLeft: '1.2rem' }}>
            <li><code>forward 2</code>, <code>back 1</code></li>
            <li><code>left 90</code>, <code>right 45</code></li>
            <li><code>up 0.5</code>, <code>down 0.5</code></li>
            <li><code>color #ff8800</code></li>
          </ul>
          <textarea value={code} onChange={event => setCode(event.target.value)} />
          <div className="turtle-actions">
            <button style={{ background: '#22c55e', color: '#04130b' }} onClick={runProgram}>
              Kör program
            </button>
            <button style={{ background: '#0f172a', color: '#dbeafe' }} onClick={resetProgram}>
              Återställ
            </button>
          </div>
          <div className="status-box">{status}</div>
          <div className="turtle-tip">
            Tips: Kommandon körs uppifrån och ned, precis som i Turtle. Testa att rita en fyrkant!
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Ladda upp din satellit (GLB)</label>
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={event => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (objectUrlRef.current) {
                  URL.revokeObjectURL(objectUrlRef.current);
                }
                const url = URL.createObjectURL(file);
                objectUrlRef.current = url;
                setModelUrl(url);
              }}
            />
          </div>
        </div>

        <div className="turtle-card">
          <h3>Satellit och bana</h3>
          <div className="turtle-stage">
            <Canvas camera={{ position: [6, 4, 8], fov: 45 }}>
              <color attach="background" args={['#02030c']} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[8, 6, 5]} intensity={1.1} />
              <OrbitControls enablePan={false} />
              <Planet />
              <Obstacles />
              <PathLine points={parsedLinePoints} />
              <AnimatedSatellite
                path={path}
                satelliteRef={satelliteRef}
                color={color}
                travelRef={travelRef}
                modelUrl={modelUrl}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseProgram(source: string): ParsedProgram {
  const lines = source.split('\n');
  const points: Vector3[] = [new Vector3(3, 0, 0)];
  let heading = 180; // pekar mot planeten i origo
  let color = '#ffffff';
  const current = points[0].clone();

  const rad = (deg: number) => (deg * Math.PI) / 180;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [command, value] = line.split(/\s+/);
    const lower = command.toLowerCase();
    const num = value ? Number(value) : NaN;

    switch (lower) {
      case 'forward':
      case 'back': {
        if (!isFinite(num)) throw new Error(`Ange en siffra till ${lower}.`);
        const distance = lower === 'forward' ? num : -num;
        current.x += Math.cos(rad(heading)) * distance;
        current.z += Math.sin(rad(heading)) * distance;
        points.push(current.clone());
        break;
      }
      case 'left':
        if (!isFinite(num)) throw new Error('Ange grader till left.');
        heading = (heading - num) % 360;
        break;
      case 'right':
        if (!isFinite(num)) throw new Error('Ange grader till right.');
        heading = (heading + num) % 360;
        break;
      case 'up':
      case 'down':
        if (!isFinite(num)) throw new Error(`Ange ett tal till ${lower}.`);
        current.y += lower === 'up' ? num : -num;
        points.push(current.clone());
        break;
      case 'color':
        if (!value?.startsWith('#')) throw new Error('Ange färg som #hex.');
        color = value;
        break;
      default:
        throw new Error(`Okänt kommando: ${command}`);
    }
  }

  return { points, color };
}

function Planet() {
  return (
    <mesh>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial color="#2563eb" emissive="#1e3a8a" emissiveIntensity={0.4} />
    </mesh>
  );
}

type AnimatedSatelliteProps = {
  path: Vector3[];
  satelliteRef: React.MutableRefObject<Group | null>;
  color: string;
  travelRef: React.MutableRefObject<number>;
  modelUrl: string | null;
};

function AnimatedSatellite({ path, satelliteRef, color, travelRef, modelUrl }: AnimatedSatelliteProps) {
  const speed = 0.6;

  useFrame((_, delta) => {
    if (path.length < 2 || !satelliteRef.current) return;
    travelRef.current += delta * speed;
    const totalSegments = path.length - 1;
    const segmentFloat = travelRef.current % totalSegments;
    const segmentIndex = Math.floor(segmentFloat);
    const t = segmentFloat - segmentIndex;
    const start = path[segmentIndex];
    const end = path[segmentIndex + 1];
    satelliteRef.current.position.lerpVectors(start, end, t);
  });

  return (
    <group ref={satelliteRef} position={[2.5, 0, 0]}>
      <SatelliteModel modelUrl={modelUrl} autoRotate={false} scale={1.1} />
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

type PathLineProps = {
  points: Vector3Tuple[];
};

function PathLine({ points }: PathLineProps) {
  if (points.length < 2) return null;
  return <Line points={points} color="#22d3ee" lineWidth={2} dashed={false} />;
}

const OBSTACLES = [
  { position: new Vector3(1.2, 0.2, -1.6), radius: 0.4 },
  { position: new Vector3(-0.5, -0.3, -0.8), radius: 0.35 },
  { position: new Vector3(0.8, 0.5, 1.2), radius: 0.4 },
];

function Obstacles() {
  return (
    <group>
      {OBSTACLES.map((obstacle, index) => (
        <mesh key={`ob-${index}`} position={obstacle.position}>
          <sphereGeometry args={[obstacle.radius, 16, 16]} />
          <meshStandardMaterial color="#f87171" emissive="#7f1d1d" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function evaluateCourse(points: Vector3[]) {
  let hitObstacle = false;
  for (const point of points) {
    if (OBSTACLES.some(obstacle => point.distanceTo(obstacle.position) < obstacle.radius + 0.2)) {
      hitObstacle = true;
      break;
    }
  }
  const destination = points[points.length - 1];
  const reachedGoal = destination.length() < 1.4;
  return { hitObstacle, reachedGoal };
}
