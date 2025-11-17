import { useEffect, useMemo, useState } from 'react';
import { useSceneStore } from '../core/SceneManager';
import styles from './ZoomProgressIndicator.module.css';
import { SCENE_MANAGER } from '../config/config';
import { useMobile } from '../contexts/MobileContext';

// Enkel progress-indikator: visar en ikon per scen och markerar aktuell scen.
export default function JourneyProgressIndicator() {
  const { currentScene } = useSceneStore();
  const { isMobile } = useMobile();
  const [visible, setVisible] = useState(true);
  const icons = SCENE_MANAGER.SCENE_ASSETS.icons.zoomProgressIndicator;
  type SceneIconKey = keyof typeof icons;

  // Döljer indikatorn på mobil när användaren scrollat långt ned (fler overlays samtidigt är stökigt).
  useEffect(() => {
    if (!isMobile) return;
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, [isMobile, currentScene]);

  const isSceneIconKey = (value: string): value is SceneIconKey => value in icons;

  const scenes = useMemo<SceneIconKey[]>(() => {
    // Filtrera bort scener som saknar ikon för att slippa undefined.
    return SCENE_MANAGER.SCENE_ORDER.filter(isSceneIconKey);
  }, [icons]);
  const fallbackScene: SceneIconKey = scenes[0] ?? 'galaxy';
  const activeScene = isSceneIconKey(currentScene) ? currentScene : fallbackScene;
  const activeIndex = scenes.indexOf(activeScene);

  if (!visible) return null;

  return (
    <div
      className={`${styles['zoom-progress-container']} ${isMobile ? styles['mobile'] : ''}`}
    >
      <div className={styles['zoom-progress-line']} />
      {scenes.map((scene, index) => {
        const isActive = index === activeIndex;
        const positionPercent = scenes.length === 1 ? 0 : (index / (scenes.length - 1)) * 90;
        const icon = icons[scene] ?? icons.end;

        return (
          <div
            key={scene}
            className={`${styles['scene-marker']} ${isActive ? styles['active'] : ''}`}
            style={{
              top: `${positionPercent}%`,
              left: isActive ? 0 : 4,
              backgroundColor: isActive ? 'rgba(111, 255, 233, 0.7)' : 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <span
              className={styles['marker-icon']}
              style={{ backgroundImage: `url(${icon})`, opacity: isActive ? 1 : 0.7 }}
            />
          </div>
        );
      })}
    </div>
  );
}
