import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import type { CameraData, SceneType } from '../core/SceneManager';

type ZoomCameraCallbacks = {
  getZoomOutCameraData: (scene: SceneType) => CameraData;
  setZoomOutCameraData: (scene: SceneType, data: CameraData) => void;
  endTransition: (isZoomIn: boolean) => void;
};

/**
 * Prepare the camera before a zoom animation starts.
 *
 * - When zooming in (`backwards === false`) we capture the current camera pose so
 *   it can be restored later when the player zooms back out of the scene.
 * - When zooming out (`backwards === true`) we restore the previously saved pose.
 */
export function setupZoomCamera(
  camera: PerspectiveCamera,
  sceneKey: SceneType,
  backwards: boolean,
  { getZoomOutCameraData, setZoomOutCameraData }: ZoomCameraCallbacks
) {
  if (!camera || !sceneKey) {
    return;
  }

  if (!backwards) {
    const snapshot: CameraData = {
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone(),
      fov: camera.fov,
    };

    setZoomOutCameraData(sceneKey, snapshot);
    return;
  }

  const stored = getZoomOutCameraData(sceneKey);
  if (!stored) {
    return;
  }

  const position = stored.position instanceof Vector3
    ? stored.position
    : new Vector3().copy(stored.position as Vector3);
  const quaternion = stored.quaternion instanceof Quaternion
    ? stored.quaternion
    : new Quaternion().copy(stored.quaternion as Quaternion);

  camera.position.copy(position);
  camera.quaternion.copy(quaternion);
  camera.fov = stored.fov ?? camera.fov;
  camera.updateProjectionMatrix();
}
