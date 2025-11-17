import { useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { Group } from 'three';
import { Vector3 } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import { StationScene3D } from './StationScene3D';
import { useStationLogic } from './useStationLogic';

export function StationExperience() {
  const satelliteRef = useRef<Group | null>(null);
  const logic = useStationLogic(satelliteRef);
  const [followSatellite, setFollowSatellite] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (!logic.modelUrl || !satelliteRef.current || !controlsRef.current) return;
    const worldPos = new Vector3();
    satelliteRef.current.getWorldPosition(worldPos);
    const controls = controlsRef.current;
    controls.target.copy(worldPos);
    controls.object.position.copy(worldPos).add(new Vector3(4, 2, 4));
    controls.update();
    setFollowSatellite(true);
  }, [logic.modelUrl]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#03030f',
        overflow: 'hidden',
      }}
    >
      <Canvas camera={{ position: [12, 6, 16], fov: 45 }}>
        <OrbitControls ref={controlsRef} enableDamping target={[0, 0, 0]} />
        <KeyboardCameraControls controlsRef={controlsRef} />
        <FollowSatelliteCamera
          satelliteRef={satelliteRef}
          controlsRef={controlsRef}
          isFollowing={followSatellite}
        />
        <StationScene3D modelUrl={logic.modelUrl} satelliteRef={satelliteRef} />
      </Canvas>

      <ControlOverlay
        logic={logic}
        followSatellite={followSatellite}
        onToggleFollow={() => setFollowSatellite(prev => !prev)}
      />
    </div>
  );
}

type ControlOverlayProps = {
  logic: ReturnType<typeof useStationLogic>;
  followSatellite: boolean;
  onToggleFollow: () => void;
};

function ControlOverlay({ logic, followSatellite, onToggleFollow }: ControlOverlayProps) {
  const {
    dropHandlers,
    savedModelName,
    uploadError,
    isDragging,
    clearSavedModel,
  } = logic;

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '420px',
        width: '100%',
        zIndex: 10,
      }}
    >
      <button
        onClick={onToggleFollow}
        style={{
          padding: '10px 18px',
          borderRadius: '10px',
          border: 'none',
          background: followSatellite ? '#ffad42' : '#3a4fff',
          color: followSatellite ? '#1a0f00' : '#eef3ff',
          cursor: 'pointer',
          fontWeight: 600,
          alignSelf: 'flex-end',
        }}
      >
        {followSatellite ? 'Pausa följning' : 'Följ satelliten'}
      </button>

      <div
        style={{
          background: 'rgba(6, 10, 24, 0.88)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(92, 120, 255, 0.25)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>📦 Satellitmodell</h3>
        <input type="file" accept=".glb,.gltf" onChange={dropHandlers.handleModelUpload} />
        <div
          onDragOver={dropHandlers.handleDragOver}
          onDragLeave={dropHandlers.handleDragLeave}
          onDrop={dropHandlers.handleDrop}
          style={{
            marginTop: '12px',
            padding: '20px',
            borderRadius: '10px',
            border: `2px dashed ${isDragging ? '#26c6da' : 'rgba(255,255,255,0.2)'}`,
            textAlign: 'center',
            color: '#dce3ff',
            background: isDragging ? 'rgba(38, 198, 218, 0.1)' : 'rgba(12, 16, 38, 0.6)',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          {isDragging ? 'Släpp filen för att ladda upp den' : 'Dra din GLB hit för att ladda upp'}
        </div>
        {savedModelName && (
          <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#8effd0' }}>
            Sparad modell: <strong>{savedModelName}</strong>
          </p>
        )}
        {uploadError && (
          <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#ff8c8c' }}>{uploadError}</p>
        )}
        {savedModelName && (
          <button
            onClick={clearSavedModel}
            style={{
              marginTop: '10px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: '#3a3a5f',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            Rensa sparad modell
          </button>
        )}
      </div>

    </div>
  );
}

type FollowSatelliteCameraProps = {
  satelliteRef: MutableRefObject<Group | null>;
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
  isFollowing: boolean;
};

function FollowSatelliteCamera({ satelliteRef, controlsRef, isFollowing }: FollowSatelliteCameraProps) {
  const { camera } = useThree();
  const target = useMemo(() => new Vector3(), []);
  const offset = useMemo(() => new Vector3(4, 1.8, 4), []);
  const destination = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const node = satelliteRef.current;
    if (!node) return;

    const controls = controlsRef.current;

    if (isFollowing) {
      node.getWorldPosition(target);
      destination.copy(offset).add(target);
      camera.position.lerp(destination, 0.08);
      camera.lookAt(target);
      if (controls) {
        controls.target.lerp(target, 0.15);
        controls.update();
      }
    } else if (controls) {
      controls.update();
    }
  });

  return null;
}

type KeyboardCameraControlsProps = {
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
};

function KeyboardCameraControls({ controlsRef }: KeyboardCameraControlsProps) {
  const pressedKeys = useRef(new Set<string>());
  const { camera } = useThree();
  const moveVector = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.current.add(event.key.toLowerCase());
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.current.delete(event.key.toLowerCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const controls = controlsRef.current;
    moveVector.set(0, 0, 0);

    if (pressedKeys.current.has('arrowup')) {
      moveVector.z -= 0.6;
    }
    if (pressedKeys.current.has('arrowdown')) {
      moveVector.z += 0.6;
    }
    if (pressedKeys.current.has('arrowleft')) {
      moveVector.x -= 0.6;
    }
    if (pressedKeys.current.has('arrowright')) {
      moveVector.x += 0.6;
    }
    if (pressedKeys.current.has('w')) {
      moveVector.y += 0.4;
    }
    if (pressedKeys.current.has('s')) {
      moveVector.y -= 0.4;
    }

    if (moveVector.lengthSq() > 0) {
      camera.position.add(moveVector);
      if (controls) {
        controls.target.add(moveVector);
        controls.update();
      }
    }
  });

  return null;
}
