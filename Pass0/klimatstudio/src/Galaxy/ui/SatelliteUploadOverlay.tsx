"use client";

import { useCallback, useRef, useState } from 'react';
import { useSceneStore } from '../core/SceneManager';

const SUPPORTED_TYPES = ['model/gltf-binary', 'model/gltf+json'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function SatelliteUploadOverlay() {
  const { setCustomSatelliteModelUrl } = useSceneStore();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const processFile = useCallback(
    (file: File) => {
      const mimeType = file.type || 'model/gltf-binary';
      if (
        !SUPPORTED_TYPES.includes(mimeType) &&
        !file.name.toLowerCase().endsWith('.glb') &&
        !file.name.toLowerCase().endsWith('.gltf')
      ) {
        alert('Endast .glb/.gltf-filer stöds. Exportera din satellit som GLB.');
        return;
      }

      if (file.size > MAX_SIZE) {
        alert('Filen är större än 5 MB. Försök förenkla modellen innan export.');
        return;
      }

      const url = URL.createObjectURL(file);
      setCustomSatelliteModelUrl(url);
    },
    [setCustomSatelliteModelUrl]
  );

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) processFile(file);
      event.target.value = '';
    },
    [processFile]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer?.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        padding: '16px 20px',
        background: 'rgba(5, 10, 24, 0.85)',
        borderRadius: '14px',
        border: isDragging ? '2px solid #26c6da' : '1px solid rgba(255,255,255,0.2)',
        color: '#eef4ff',
        zIndex: 1200,
        width: '260px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={onDrop}
    >
      <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>
        🛰 Släpp din GLB här
      </p>
      <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>
        Satelliten laddas in nästa gång du zoomar till stationen.
      </p>
      <button
        type="button"
        style={{
          marginTop: '10px',
          width: '100%',
          padding: '8px 12px',
          borderRadius: '10px',
          border: 'none',
          background: '#26c6da',
          color: '#03111f',
          fontWeight: 600,
          cursor: 'pointer',
        }}
        onClick={() => inputRef.current?.click()}
      >
        Välj GLB-fil
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".glb,.gltf"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </div>
  );
}
