import { useEffect, useState } from 'react';
import styles from './NavigationHint.module.css';
import { useMobile } from '../contexts/MobileContext';
import leftArrow from '/assets/icons/navigation_hint/left_arrow.svg';
import rightArrow from '/assets/icons/navigation_hint/right_arrow.svg';
import touchHandIcon from '/assets/icons/navigation_hint/touch_hand.svg';

const NavigationHint = () => {
  const { isMobile } = useMobile();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // göm indikatorn efter att användaren interagerat
    const hideOnInteraction = (event: TouchEvent | MouseEvent | KeyboardEvent) => {
      if (isMobile && event.type === 'touchstart' ||
          !isMobile && (event.type === 'mousedown' || event.type === 'keydown')) {
        setVisible(false);
      }
    };

    if (isMobile) {
      window.addEventListener('touchstart', hideOnInteraction);
    } else {
      window.addEventListener('mousedown', hideOnInteraction);
      window.addEventListener('keydown', hideOnInteraction);
    }

    return () => {
      window.removeEventListener('touchstart', hideOnInteraction);
      window.removeEventListener('mousedown', hideOnInteraction);
      window.removeEventListener('keydown', hideOnInteraction);
    };
  }, [isMobile]);

  if (!visible) return null;

  return (
    <div className={`${styles['navigation-hint']} ${isMobile ? styles['mobile'] : styles['desktop']}`}>
      {isMobile ? (
        <>
          <div className={styles['gesture-container']}>
            <img src={touchHandIcon} alt="Swipe gesture" className={styles['touch-hand']} />
          </div>
          <p className={styles['hint-title']}>Svep för att navigera 🚀</p>
        </>
      ) : (
        <>
          <div className={styles['arrow-container']}>
            <img src={leftArrow} alt="Vänster pil" className={styles['arrow']} />
            <img src={rightArrow} alt="Höger pil" className={styles['arrow']} />
          </div>
          <p className={styles['hint-title']}>Använd pilarna för att navigera 🪐</p>
        </>
      )}
    </div>
  );
};

export default NavigationHint;
