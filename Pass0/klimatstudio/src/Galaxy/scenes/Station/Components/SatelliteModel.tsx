import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Vector3 } from 'three';

const FALLBACK_MODEL_PATH = '/default/Landsat 4 and 5.glb';

export type SatelliteModelProps = {
  modelUrl: string | null;
  autoRotate?: boolean;
  scale?: number;
};

/**
 * Renders the uploaded GLB satellite and exposes its ref so external
 * scripts (Pyodide) can move/rotate it.
 */
export const SatelliteModel = forwardRef<Group, SatelliteModelProps>(
  ({ modelUrl, autoRotate = true, scale = 1 }, ref) => {
    const groupRef = useRef<Group>(null!);

    useImperativeHandle(ref, () => groupRef.current, []);

    const { scene } = useGLTF(modelUrl || FALLBACK_MODEL_PATH, true);
    const clonedScene = useMemo(() => {
      const clone = scene.clone(true);
      const box = new Box3().setFromObject(clone);
      const size = new Vector3();
      const center = new Vector3();
      box.getSize(size);
      box.getCenter(center);

      // center model and move to origin
      clone.position.sub(center);

      // normalise size so max dimension ~= 1
      const maxAxis = Math.max(size.x, size.y, size.z) || 1;
      const normalisedScale = 1 / maxAxis;
      clone.scale.setScalar(normalisedScale);
      clone.position.multiplyScalar(normalisedScale);

      // ensure meshes cast/receive shadow
      clone.traverse((child) => {
        if ((child as any).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      return clone;
    }, [scene]);

    useFrame((_, delta) => {
      if (!autoRotate || !groupRef.current) return;
      groupRef.current.rotation.y += delta * 0.6;
    });

    return (
      <group ref={groupRef} scale={scale}>
        <primitive object={clonedScene} />
      </group>
    );
  }
);

useGLTF.preload(FALLBACK_MODEL_PATH);
