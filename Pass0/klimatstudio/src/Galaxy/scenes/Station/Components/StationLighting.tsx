export function StationLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 4, 6]}
        intensity={1.1}
        color={0x88c9ff}
      />
      <spotLight
        position={[-4, 6, 3]}
        angle={0.6}
        penumbra={0.4}
        intensity={0.8}
        color={0xfff2d6}
        castShadow
      />
    </>
  );
}
