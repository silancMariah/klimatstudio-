import { useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { AdditiveBlending, BackSide, Color, Group, Vector3 } from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import Stars from '../../SolarSystem/Components/Stars';
import Nebula from '../../SolarSystem/Components/Nebula';
import Sun from '../../SolarSystem/Components/Sun';
import { Planet } from '../../SolarSystem/Components/Planet';
import type { PlanetOptions } from '../../SolarSystem/Components/Planet';
import { SCENE_MANAGER, SOLAR_SYSTEM } from '../../../config/config';
import { SatelliteModel } from './SatelliteModel';
import { Html } from '@react-three/drei';

export type StationScene3DProps = {
  modelUrl: string | null;
  satelliteRef?: MutableRefObject<Group | null>;
};

const EARTH_DAY_TEXTURE = SCENE_MANAGER.SCENE_ASSETS.textures.solarSystem.earth;
const EARTH_CLOUDS_TEXTURE = SCENE_MANAGER.SCENE_ASSETS.textures.solarSystem.earthclouds;

const PLANET_NAMES = ['Merkurius', 'Venus', 'Mars', 'Jupiter', 'Saturnus', 'Uranus', 'Neptunus'];
const SATELLITE_ORBIT_RADIUS = 3.2;
const SATELLITE_ORBIT_SPEED = 0.35;
const SATELLITE_ORBIT_HEIGHT = 0.25;

export function StationScene3D({ modelUrl, satelliteRef }: StationScene3DProps) {
  const localSatelliteRef = useRef<Group>(null);
  const forwardedRef = satelliteRef ?? localSatelliteRef;
  const systemOffset = useMemo(
    () => [-SOLAR_SYSTEM.EARTH_PARAMS.orbitRadius, 0, 0] as [number, number, number],
    []
  );

  return (
    <group>
      <color attach="background" args={['#02020b']} />
      <ambientLight intensity={0.4} color={0x9cb6ff} />
      <hemisphereLight args={[0xc0d4ff, 0x080811, 0.4]} position={[0, 14, 0]} />
      <directionalLight
        position={[18, 12, 30]}
        intensity={0.55}
        color={0xfff3d1}
      />

      <Stars />
      <Nebula />
      <group position={systemOffset}>
        <SunWithLabel />
        {SOLAR_SYSTEM.PLANETS.map((planet, index) => (
          <PlanetWithLabel
            key={`planet-${index}`}
            label={PLANET_NAMES[index] ?? `Planet ${index + 1}`}
            {...(planet as any)}
          />
        ))}
        <EarthWithSatellite modelUrl={modelUrl} satelliteRef={forwardedRef} />
      </group>
    </group>
  );
}

type EarthWithSatelliteProps = {
  modelUrl: string | null;
  satelliteRef: MutableRefObject<Group | null>;
};

type PlanetWithLabelProps = PlanetOptions & { label: string };

function PlanetWithLabel({ label: _unused, ...planetProps }: PlanetWithLabelProps) {
  return (
    <group>
      <Planet {...planetProps} />
    </group>
  );
}

function SunWithLabel() {
  return <Sun />;
}

function EarthWithSatellite({ modelUrl, satelliteRef }: EarthWithSatelliteProps) {
  const earthSpinRef = useRef<Group>(null);
  const cloudsRef = useRef<Group>(null);
  const satelliteOrbitRef = useRef<Group>(null);
  const { camera } = useThree();
  const [satelliteLabelVisible, setSatelliteLabelVisible] = useState(false);
  const satelliteWorldPos = useMemo(() => new Vector3(), []);

  const dayTexture = useLoader(TextureLoader, EARTH_DAY_TEXTURE);
  const cloudsTexture = useLoader(TextureLoader, EARTH_CLOUDS_TEXTURE);

  const earthParams = SOLAR_SYSTEM.EARTH_PARAMS;

  useFrame((_, delta) => {
    if (earthSpinRef.current) {
      const dir = earthParams.planetRotationDirection === 'clockwise' ? -1 : 1;
      earthSpinRef.current.rotation.y += dir * earthParams.planetRotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.1;
    }
    if (satelliteOrbitRef.current) {
      satelliteOrbitRef.current.rotation.y += delta * SATELLITE_ORBIT_SPEED;
    }
    if (satelliteRef.current) {
      satelliteRef.current.getWorldPosition(satelliteWorldPos);
      const showSatelliteLabel = satelliteWorldPos.distanceTo(camera.position) < 55;
      if (satelliteLabelVisible !== showSatelliteLabel) {
        setSatelliteLabelVisible(showSatelliteLabel);
      }
    }
  });

  const earthPosition = useMemo(
    () => [earthParams.orbitRadius, 0, 0] as [number, number, number],
    [earthParams.orbitRadius]
  );

  const atmosphereColor = useMemo(() => new Color(0x4a88ff), []);

  return (
    <group position={earthPosition}>
      <group ref={earthSpinRef}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1.5, 128, 128]} />
            <meshStandardMaterial
              map={dayTexture}
              roughness={0.24}
              metalness={0.05}
            />
          </mesh>
      </group>

      <group ref={cloudsRef}>
        <mesh>
          <sphereGeometry args={[1.53, 128, 128]} />
          <meshStandardMaterial
            map={cloudsTexture}
            transparent
            depthWrite={false}
            opacity={0.28}
          />
        </mesh>
      </group>

      <mesh>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.1}
          blending={AdditiveBlending}
          side={BackSide}
        />
      </mesh>

      <group ref={satelliteOrbitRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[SATELLITE_ORBIT_RADIUS - 0.02, SATELLITE_ORBIT_RADIUS + 0.02, 64]} />
          <meshBasicMaterial color="#7fd8ff" transparent opacity={0.18} />
        </mesh>
        <group position={[SATELLITE_ORBIT_RADIUS, SATELLITE_ORBIT_HEIGHT, 0]}>
          <SatelliteModel
            ref={satelliteRef}
            modelUrl={modelUrl}
            autoRotate={false}
            scale={1.3}
          />
          {satelliteLabelVisible && (
            <Html
              position={[0, 0.8, 0]}
              center
              distanceFactor={12}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(8, 12, 28, 0.85)',
                color: '#9de7ff',
                fontSize: '0.75rem',
                pointerEvents: 'none',
              }}
            >
              Satelliten
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}
