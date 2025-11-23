import { useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { AdditiveBlending, BackSide, Color, Group, Mesh, MeshStandardMaterial, QuadraticBezierCurve3, Vector3 } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import Stars from '../../Galaxy/scenes/SolarSystem/Components/Stars';
import Nebula from '../../Galaxy/scenes/SolarSystem/Components/Nebula';
import { SCENE_MANAGER } from '../../Galaxy/config/config';
import { SatelliteModel } from '../../Galaxy/scenes/Station/Components/SatelliteModel';

export type RocketLaunchState = 'idle' | 'launching' | 'complete';

type RocketLaunchSceneProps = {
  modelUrl: string | null;
  launchState: RocketLaunchState;
  onLaunchComplete: () => void;
};

const EARTH_RADIUS = 2.1;
const START_ALTITUDE = EARTH_RADIUS + 0.4;

export function RocketLaunchScene({ modelUrl, launchState, onLaunchComplete }: RocketLaunchSceneProps) {
  return (
    <>
      <color attach="background" args={['#020312']} />
      <fog attach="fog" args={['#010106', 18, 85]} />
      <ambientLight intensity={0.45} color={0x9cb6ff} />
      <directionalLight position={[12, 18, 18]} intensity={1.2} color={0xfff2c6} castShadow />
      <hemisphereLight args={[0xb8ccff, 0x05030b, 0.45]} position={[0, 40, 0]} />

      <Stars />
      <Nebula />

      <EarthWithAtmosphere />
      <LaunchPad />
      <RocketAndEffects modelUrl={modelUrl} launchState={launchState} onLaunchComplete={onLaunchComplete} />
      <UpperAtmosphereGlow />
    </>
  );
}

function EarthWithAtmosphere() {
  const earthRef = useRef<Group>(null);
  const cloudsRef = useRef<Group>(null);
  const dayTexture = useLoader(TextureLoader, SCENE_MANAGER.SCENE_ASSETS.textures.solarSystem.earth);
  const cloudsTexture = useLoader(TextureLoader, SCENE_MANAGER.SCENE_ASSETS.textures.solarSystem.earthclouds);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.03;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group position={[0, -EARTH_RADIUS - 0.2, 0]}>
      <group ref={earthRef}>
        <mesh receiveShadow>
          <sphereGeometry args={[EARTH_RADIUS, 128, 128]} />
          <meshStandardMaterial map={dayTexture} roughness={0.6} metalness={0.1} />
        </mesh>
      </group>
      <group ref={cloudsRef}>
        <mesh>
          <sphereGeometry args={[EARTH_RADIUS + 0.03, 128, 128]} />
          <meshStandardMaterial
            map={cloudsTexture}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      </group>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS + 0.08, 64, 64]} />
        <meshBasicMaterial
          color={new Color('#5ea8ff')}
          transparent
          opacity={0.12}
          side={BackSide}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function LaunchPad() {
  return (
    <group position={[0, START_ALTITUDE - 2.4, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.15, 48]} />
        <meshStandardMaterial color="#1f2937" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.4, 48]} />
        <meshStandardMaterial color="#60a5fa" emissive="#1e3a8a" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

type RocketAndEffectsProps = {
  modelUrl: string | null;
  launchState: RocketLaunchState;
  onLaunchComplete: () => void;
};

function RocketAndEffects({ modelUrl, launchState, onLaunchComplete }: RocketAndEffectsProps) {
  const rocketRef = useRef<Group>(null);
  const flameRef = useRef<Mesh>(null);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  const startPoint = useMemo(() => new Vector3(0, START_ALTITUDE, 0), []);
  const controlPoint = useMemo(() => new Vector3(4, START_ALTITUDE + 8, -2), []);
  const endPoint = useMemo(() => new Vector3(0, START_ALTITUDE + 28, -10), []);
  const curve = useMemo(() => new QuadraticBezierCurve3(startPoint, controlPoint, endPoint), [startPoint, controlPoint, endPoint]);
  const lookTarget = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (!rocketRef.current) return;
    completedRef.current = false;
    progressRef.current = 0;
    const base = curve.getPoint(0);
    rocketRef.current.position.copy(base);
    rocketRef.current.lookAt(base.clone().add(new Vector3(0, 1, 0)));

    if (flameRef.current) {
      const material = flameRef.current.material as MeshStandardMaterial;
      material.opacity = launchState === 'launching' ? 0.7 : 0.4;
    }
  }, [curve, launchState]);

  useFrame((state, delta) => {
    const rocket = rocketRef.current;
    if (!rocket) return;

    if (launchState === 'launching') {
      progressRef.current = Math.min(1, progressRef.current + delta / 6);
      const eased = easeOutCubic(progressRef.current);
      const point = curve.getPoint(eased);
      const tangent = curve.getTangent(eased).normalize();
      rocket.position.copy(point);
      lookTarget.copy(point).add(tangent);
      rocket.lookAt(lookTarget);
      rocket.rotation.z = Math.sin(eased * Math.PI * 0.5) * 0.25;

      animateFlame(flameRef, state.clock.elapsedTime, 0.9);

      if (progressRef.current >= 1 && !completedRef.current) {
        completedRef.current = true;
        onLaunchComplete();
      }
      return;
    }

    if (launchState === 'complete') {
      animateFlame(flameRef, state.clock.elapsedTime, 0.1);
      return;
    }

    const idlePoint = curve.getPoint(0);
    rocket.position.copy(idlePoint);
    rocket.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.05;
    rocket.rotation.z = Math.sin(state.clock.elapsedTime) * 0.08;
    rocket.lookAt(idlePoint.clone().add(new Vector3(0, 1, 0)));
    animateFlame(flameRef, state.clock.elapsedTime, 0.4);
  });

  return (
    <group ref={rocketRef}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={1.6}>
        <RocketVisual modelUrl={modelUrl} />
      </group>
      <mesh ref={flameRef} position={[0, -0.9, 0]}>
        <coneGeometry args={[0.35, 1, 24, 1, true]} />
        <meshStandardMaterial color="#f97316" emissive="#ffedd5" emissiveIntensity={2} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function animateFlame(ref: MutableRefObject<Mesh | null>, time: number, strength: number) {
  if (!ref.current) return;
  const flame = ref.current;
  const wobble = 0.4 + Math.sin(time * 18) * 0.1;
  flame.scale.set(1 + wobble * strength, 1 + strength * 1.5, 1 + wobble * strength);
  const material = flame.material as MeshStandardMaterial;
  material.opacity = 0.15 + 0.6 * strength;
  material.emissiveIntensity = 1.2 + strength;
}

type RocketVisualProps = {
  modelUrl: string | null;
};

function RocketVisual({ modelUrl }: RocketVisualProps) {
  if (modelUrl) {
    return <SatelliteModel modelUrl={modelUrl} autoRotate={false} scale={1.4} />;
  }
  return <FallbackRocket />;
}

function FallbackRocket() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 1.8, 32]} />
        <meshStandardMaterial color="#dbeafe" metalness={0.15} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.35, 0.9, 32]} />
        <meshStandardMaterial color="#93c5fd" metalness={0.1} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.55, 24]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.4, 0.25, 0]} rotation={[0, 0, Math.PI / 3]}>
        <boxGeometry args={[0.8, 0.15, 0.05]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <mesh position={[-0.4, 0.25, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <boxGeometry args={[0.8, 0.15, 0.05]} />
        <meshStandardMaterial color="#fb7185" />
      </mesh>
      <mesh position={[0, -0.1, 0.25]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 24]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.1, -0.25]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 24]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function UpperAtmosphereGlow() {
  const glowRef = useRef<Group>(null);
  useFrame((state) => {
    if (!glowRef.current) return;
    glowRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <group ref={glowRef} position={[0, 15, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[18, 24, 64]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.08} blending={AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[25, 32, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.05} blending={AdditiveBlending} />
      </mesh>
    </group>
  );
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}
