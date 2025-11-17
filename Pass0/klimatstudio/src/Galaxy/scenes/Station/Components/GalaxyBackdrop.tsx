import { Points, useGLTF } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointsMaterial,
  TextureLoader,
  Vector3,
} from 'three';
import type { GLTF } from 'three-stdlib';
import { GALAXY, SCENE_MANAGER } from '../../../config/config';

type GLTFWithNodes = GLTF & {
  nodes: {
    Object_2: Mesh;
  };
  materials: {
    ['Scene_-_Root']: PointsMaterial;
  };
};

/**
 * Lightweight version of the galaxy scene used as a backdrop for the station experience.
 * It keeps the star-cloud visuals but strips away navigation logic and camera tweening.
 */
export function GalaxyBackdrop() {
  const { camera } = useThree() as { camera: PerspectiveCamera };

  const galaxyRef = useRef<Group>(null);
  const solarSystemStarRef = useRef<Mesh>(null);

  const starTexture = useLoader(
    TextureLoader,
    SCENE_MANAGER.SCENE_ASSETS.textures.galaxy.disc
  );

  const { nodes } = useGLTF(SCENE_MANAGER.SCENE_ASSETS.models.galaxy.galaxy) as unknown as GLTFWithNodes;

  const [positions, colors] = useMemo(() => {
    nodes.Object_2.geometry.center();
    const posArray = new Float32Array(
      nodes.Object_2.geometry.attributes.position.array.buffer
    );
    const colorArray = new Float32Array(posArray.length);
    const color = new Color();
    for (let i = 0; i < posArray.length; i += 3) {
      const x = posArray[i];
      const y = posArray[i + 1];
      const z = posArray[i + 2];
      const distance = Math.sqrt(x * x + y * y + z * z);
      const normalizedDistance = distance / 100;

      color.setRGB(
        Math.cos(normalizedDistance),
        MathUtils.randFloat(0, 0.8),
        Math.sin(normalizedDistance)
      );
      color.toArray(colorArray, i);
    }
    return [posArray, colorArray];
  }, [nodes]);

  useFrame(({ clock }) => {
    if (galaxyRef.current) {
        galaxyRef.current.rotation.z = clock.getElapsedTime() / 15;
    }

    if (solarSystemStarRef.current) {
      const starPosition = new Vector3();
      solarSystemStarRef.current.getWorldPosition(starPosition);
      const distance = starPosition.distanceTo(camera.position);

      let starSize = 1 / (distance * 0.5);
      starSize = Math.max(
        GALAXY.SOLAR_SYSTEM_STAR.SIZE_MIN,
        Math.min(starSize, GALAXY.SOLAR_SYSTEM_STAR.SIZE_MAX)
      );
      solarSystemStarRef.current.scale.setScalar(starSize);

      const material = solarSystemStarRef.current.material as MeshBasicMaterial;
      material.color.set(GALAXY.SOLAR_SYSTEM_STAR.COLOR);
    }
  });

  return (
    <group ref={galaxyRef}>
      <ambientLight intensity={0.12} color={0x4a5c88} />

      <Points scale={0.05} positions={positions} colors={colors}>
        <pointsMaterial
          map={starTexture}
          transparent
          depthWrite={false}
          vertexColors
          opacity={1}
          depthTest
          size={0.01}
          blending={AdditiveBlending}
        />
      </Points>

      <group name="SolarSystemStar">
        <mesh
          ref={solarSystemStarRef}
          position={GALAXY.SOLAR_SYSTEM_STAR.INIT_POSITION}
        >
          <sphereGeometry args={GALAXY.SOLAR_SYSTEM_STAR.INIT_SIZE} />
          <meshBasicMaterial
            map={starTexture}
            color={GALAXY.SOLAR_SYSTEM_STAR.COLOR}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(SCENE_MANAGER.SCENE_ASSETS.models.galaxy.galaxy);
