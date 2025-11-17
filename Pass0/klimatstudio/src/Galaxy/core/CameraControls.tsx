import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import gsap from "gsap";

export function CameraControls() {
    const {camera} =   useThree();
    const moveCamera = (dir: string) => {
    const delta = 2;
    gsap.to(camera.position, {
      duration: 1,
      x: dir === "left" ? camera.position.x - delta :
         dir === "right" ? camera.position.x + delta : camera.position.x,
      y: dir === "up" ? camera.position.y + delta :
         dir === "down" ? camera.position.y - delta : camera.position.y,
      ease: "power2.out"
    });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveCamera("left");
      if (e.key === "ArrowRight") moveCamera("right");
      if (e.key === "ArrowUp") moveCamera("up");
      if (e.key === "ArrowDown") moveCamera("down");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return null; // no UI here
}