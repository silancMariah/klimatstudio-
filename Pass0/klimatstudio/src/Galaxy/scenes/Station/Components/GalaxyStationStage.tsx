import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { StationScene3D } from './StationScene3D';

type GalaxyStationStageProps = {
  modelUrl?: string | null;
};

export function GalaxyStationStage({ modelUrl = null }: GalaxyStationStageProps) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(10, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return <StationScene3D modelUrl={modelUrl} />;
}
