import type { ChangeEvent, DragEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RocketLaunchScene } from './components/RocketLaunchScene';
import type { RocketLaunchState } from './components/RocketLaunchScene';

type UploadHandlers = {
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
};

export function RocketLaunchExperience() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [launchState, setLaunchState] = useState<RocketLaunchState>('idle');
  const [statusMessage, setStatusMessage] = useState('🚀 Ladda upp en GLB-raket eller använd standardraketen.');

  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.glb')) {
      setUploadError('Endast .glb-filer stöds i raketvärlden.');
      return;
    }
    setUploadError(null);
    setModelName(file.name);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setModelUrl(url);
    setLaunchState('idle');
    setStatusMessage(`🧑‍🚀 ${file.name} är dockad och redo för start.`);
  }, []);

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files);
      event.target.value = '';
    },
    [handleFiles]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const uploadHandlers = useMemo<UploadHandlers>(
    () => ({
      onInputChange,
      onDragLeave,
      onDragOver,
      onDrop,
    }),
    [onDragLeave, onDragOver, onDrop, onInputChange]
  );

  const startLaunch = useCallback(() => {
    if (launchState === 'launching') return;
    setLaunchState('launching');
    setStatusMessage('🔥 Motorerna tänds! Raketen lämnar jorden...');
  }, [launchState]);

  const resetLaunch = useCallback(() => {
    setLaunchState('idle');
    setStatusMessage('🚀 Klar för ännu en uppskjutning.');
  }, []);

  const handleLaunchComplete = useCallback(() => {
    setLaunchState('complete');
    setStatusMessage('🌌 Uppdrag slutfört – raketen är i omloppsbana!');
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#01020a',
        overflow: 'hidden',
      }}
    >
      <Canvas camera={{ position: [5, 5, 12], fov: 55 }}>
        <OrbitControls enablePan enableDamping maxDistance={45} minDistance={6} />
        <RocketLaunchScene
          modelUrl={modelUrl}
          launchState={launchState}
          onLaunchComplete={handleLaunchComplete}
        />
      </Canvas>

      <RocketControlPanel
        statusMessage={statusMessage}
        launchState={launchState}
        onStartLaunch={startLaunch}
        onReset={resetLaunch}
        uploadHandlers={uploadHandlers}
        isDragging={isDragging}
        uploadError={uploadError}
        modelName={modelName}
      />
    </div>
  );
}

type RocketControlPanelProps = {
  statusMessage: string;
  launchState: RocketLaunchState;
  onStartLaunch: () => void;
  onReset: () => void;
  uploadHandlers: UploadHandlers;
  isDragging: boolean;
  uploadError: string | null;
  modelName: string | null;
};

function RocketControlPanel({
  statusMessage,
  launchState,
  onStartLaunch,
  onReset,
  uploadHandlers,
  isDragging,
  uploadError,
  modelName,
}: RocketControlPanelProps) {
  const canLaunch = launchState !== 'launching';
  const startLabel =
    launchState === 'complete' ? 'Starta nästa rymdresa' : launchState === 'launching' ? 'Uppskjutning pågår...' : 'Blast off';

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        width: 'min(420px, 90vw)',
        padding: '18px',
        borderRadius: '18px',
        background: 'rgba(5,11,25,0.86)',
        border: '1px solid rgba(148,163,184,0.35)',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        zIndex: 10,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.02em' }}>🚀 Raketkontroll</h2>
        <p style={{ margin: '6px 0 0', fontSize: '0.92rem', color: '#cbd5f5' }}>{statusMessage}</p>
      </div>

      <div
        style={{
          background: 'rgba(15,23,42,0.7)',
          padding: '14px',
          borderRadius: '12px',
          border: isDragging ? '2px dashed #38bdf8' : '1px solid rgba(148,163,184,0.35)',
          transition: 'border 0.2s ease',
        }}
        onDragOver={uploadHandlers.onDragOver}
        onDragLeave={uploadHandlers.onDragLeave}
        onDrop={uploadHandlers.onDrop}
      >
        <label
          htmlFor="rocket-file-upload"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            background: '#2563eb',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Ladda upp GLB
        </label>
        <input
          id="rocket-file-upload"
          type="file"
          accept=".glb"
          style={{ display: 'none' }}
          onChange={uploadHandlers.onInputChange}
        />
        <p style={{ margin: '10px 0 4px', fontSize: '0.85rem', color: '#94a3b8' }}>
          {modelName ? `Vald modell: ${modelName}` : 'Dra in en .glb för att använda din egen raket.'}
        </p>
        {uploadError && (
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#f87171' }}>{uploadError}</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={onStartLaunch}
          disabled={!canLaunch}
          style={{
            flex: 1,
            padding: '10px 18px',
            borderRadius: '999px',
            border: 'none',
            cursor: canLaunch ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            background: canLaunch ? '#f97316' : '#9ca3af',
            color: '#030711',
            transition: 'transform 0.2s',
          }}
        >
          {startLabel}
        </button>
        <button
          onClick={onReset}
          style={{
            flexBasis: '40%',
            padding: '10px 18px',
            borderRadius: '999px',
            border: '1px solid rgba(148,163,184,0.4)',
            background: 'rgba(15,23,42,0.6)',
            color: '#e2e8f0',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Återställ
        </button>
      </div>
    </div>
  );
}

export default RocketLaunchExperience;
