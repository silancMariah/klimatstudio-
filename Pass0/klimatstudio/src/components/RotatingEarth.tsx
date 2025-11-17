import { useEffect, useState } from "react";

export default function RotatingEarth() {
  const frameCount = 121;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((prev) => (prev + 1) % frameCount);
    }, 80); // 80ms per bild ≈ 12.5 fps
    return () => clearInterval(id);
  }, []);

  return (
    <img
      src={`/earth_frames_no_bg/frame_${frame + 1}.png`}
      alt="Rotating Earth"
      style={{
        width: "900px",
        height: "auto",
        animation: "float 4s ease-in-out infinite",
      }}
    />
  );
}
