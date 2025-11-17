import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, MutableRefObject } from 'react';
import type { Group } from 'three';
import { loadPyodide } from 'pyodide';

const DEFAULT_STORAGE_KEY = 'stationScene.savedModel';
const SUPPORTED_FORMATS = ['model/gltf-binary', 'model/gltf+json'];

const CONTROL_HELPERS = `
def move_forward(distance):
    send_js_command("move_forward", float(distance))

def rotate(degrees):
    send_js_command("rotate", float(degrees))

def move_up(distance):
    send_js_command("move_up", float(distance))

def move_down(distance):
    send_js_command("move_down", float(distance))

def change_color(hex_color):
    send_js_command("change_color", str(hex_color))

`;

const DEFAULT_PYTHON = `"""
📡 Mini-AI – börja enkelt!

1. move_forward/move_up/move_down/rotate styr modellen.
2. change_color byter färg.
3. ai(question) är din minihjärna. Använd if-satser som kollar ord i frågan.
"""

move_forward(1.5)
rotate(20)

def ai(question: str) -> str:
    q = (question or "").lower()

    if "sol" in q:
        return "Solen ger oss ljus och energi. Just nu ser min sensor starkt solljus!"

    if "co2" in q or "koldioxid" in q:
        return "Koldioxidhalten ligger runt 420 ppm. Satelliten håller koll på utsläppen."

    if "temperatur" in q or "värme" in q:
        return "Medeltemperaturen på jorden är ungefär 15°C."

    if "fakta" in q or "kul" in q:
        return "Visste du att satelliter kan se skogar växa och krympa?"

    return "Lägg till en ny if-sats för just den frågan!";`;

export type StationLogicOptions = {
  storageKey?: string;
};

export type DropHandlers = {
  handleModelUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: DragEvent<HTMLDivElement>) => void;
};

export type ConversationEntry = {
  role: 'user' | 'ai' | 'system';
  text: string;
};

export type StationLogic = {
  pythonCode: string;
  setPythonCode: (value: string) => void;
  runPython: () => Promise<void>;
  modelUrl: string | null;
  savedModelName: string | null;
  uploadError: string | null;
  isDragging: boolean;
  clearSavedModel: () => void;
  dropHandlers: DropHandlers;
  conversation: ConversationEntry[];
  askAi: (question: string) => Promise<void>;
  aiStatus: { ready: boolean; message: string };
  isAiThinking: boolean;
};

export function useStationLogic(
  satelliteRef: MutableRefObject<Group | null>,
  options?: StationLogicOptions
): StationLogic {
  const storageKey = options?.storageKey ?? DEFAULT_STORAGE_KEY;

  const [pythonCode, setPythonCode] = useState(DEFAULT_PYTHON);
  const [pyodide, setPyodide] = useState<any>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [savedModelName, setSavedModelName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [conversation, setConversation] = useState<ConversationEntry[]>([
    {
      role: 'system',
      text: '👩‍🚀 Kör Pythonkoden för att aktivera din AI. Fråga den sedan om klimatdata eller skriv egna svar!',
    },
  ]);
  const [aiStatus, setAiStatus] = useState<{ ready: boolean; message: string }>({
    ready: false,
    message: 'Kör koden för att skapa en funktion ai(question).',
  });
  const [isAiThinking, setIsAiThinking] = useState(false);

  const objectUrlRef = useRef<string | null>(null);
  const aiFunctionRef = useRef<any>(null);

  useEffect(() => {
    let keepMounted = true;

    const init = async () => {
      try {
        const py = await loadPyodide();
        if (!keepMounted) return;

        const handlers = {
          move_forward: (value: number) => {
            const node = satelliteRef.current;
            if (!node) return;
            const amount = Number.isFinite(value) ? Number(value) : 0;
            node.position.z -= amount;
          },
          rotate: (value: number) => {
            const node = satelliteRef.current;
            if (!node) return;
            const degrees = Number.isFinite(value) ? Number(value) : 0;
            node.rotation.y += (degrees * Math.PI) / 180;
          },
          move_up: (value: number) => {
            const node = satelliteRef.current;
            if (!node) return;
            const amount = Number.isFinite(value) ? Number(value) : 0;
            node.position.y += amount;
          },
          move_down: (value: number) => {
            const node = satelliteRef.current;
            if (!node) return;
            const amount = Number.isFinite(value) ? Number(value) : 0;
            node.position.y -= amount;
          },
          change_color: (value: string) => {
            const node = satelliteRef.current;
            if (!node || typeof value !== 'string') return;
            node.traverse(obj => {
              if ((obj as any).isMesh) {
                (obj as any).material?.color?.set?.(value);
              }
            });
          },
        } as const;

        py.globals.set('send_js_command', (command: string, arg: unknown) => {
          const handler = (handlers as any)[command];
          if (!handler) {
            console.warn('[satellite-ai] Unknown command from Python:', command);
            return;
          }
          try {
            handler(arg);
          } catch (error) {
            console.error('[satellite-ai] Command failed', command, error);
          }
        });

        setPyodide(py);
      } catch (error) {
        console.error('Failed to initialise Pyodide', error);
      }
    };

    init();

    return () => {
      keepMounted = false;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      if (aiFunctionRef.current?.destroy) {
        aiFunctionRef.current.destroy();
        aiFunctionRef.current = null;
      }
    };
  }, [satelliteRef]);

  const runPython = useCallback(async () => {
    if (!pyodide) return;

    const code = `${CONTROL_HELPERS}
${pythonCode}`;

    try {
      await pyodide.runPythonAsync(code);

      if (aiFunctionRef.current?.destroy) {
        aiFunctionRef.current.destroy();
        aiFunctionRef.current = null;
      }

      let aiProxy: any = null;
      try {
        aiProxy = pyodide.globals.get('ai');
      } catch (error) {
        aiProxy = null;
      }

      if (aiProxy && typeof aiProxy.callKwargs === 'function') {
        aiFunctionRef.current = aiProxy;
        setAiStatus({ ready: true, message: 'AI:n är redo! Ställ en fråga nedan.' });
        setConversation(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === 'system' && last.text.startsWith('🚀')) {
            return prev;
          }
          return [...prev, { role: 'system', text: '🚀 Härligt! Din AI svarar på frågor nu.' }];
        });
      } else {
        aiProxy?.destroy?.();
        setAiStatus({
          ready: false,
          message: 'Jag hittade ingen funktion ai(question). Lägg till en i din kod.',
        });
      }
    } catch (error) {
      console.error('Failed to run Python code', error);
      setAiStatus({ ready: false, message: 'Pythonkoden gav ett fel. Kolla konsolen.' });
    }
  }, [pyodide, pythonCode]);

  const revokeCurrentObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const persistModel = useCallback(
    (file: File, dataUrl: string) => {
      try {
        const base64Data = dataUrl.split(',')[1];
        const payload = {
          name: file.name,
          mimeType: file.type || 'model/gltf-binary',
          data: base64Data,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        setSavedModelName(file.name);
      } catch (error) {
        console.error('Failed to persist model', error);
        setUploadError('Kunde inte spara modellen lokalt. Försök igen.');
      }
    },
    [storageKey]
  );

  const processModelFile = useCallback(
    (file: File) => {
      setUploadError(null);

      const mimeType = file.type || 'model/gltf-binary';
      if (
        !SUPPORTED_FORMATS.includes(mimeType) &&
        !file.name.endsWith('.glb') &&
        !file.name.endsWith('.gltf')
      ) {
        setUploadError(
          'Endast .glb eller .gltf filer stöds. Exportera din Tinkercad-modell som GLB.'
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Filen är större än 5 MB. Försök förenkla modellen innan export.');
        return;
      }

      revokeCurrentObjectUrl();

      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setModelUrl(url);
      setSavedModelName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          persistModel(file, result);
        }
      };
      reader.onerror = () => {
        console.error('Failed to read uploaded file', reader.error);
        setUploadError('Kunde inte läsa filen. Försök exportera igen från Tinkercad.');
      };
      reader.readAsDataURL(file);
    },
    [persistModel, revokeCurrentObjectUrl]
  );

  const handleModelUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        processModelFile(file);
      }
    },
    [processModelFile]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer?.files?.[0];
      if (file) {
        processModelFile(file);
      }
    },
    [processModelFile]
  );

  const clearSavedModel = useCallback(() => {
    revokeCurrentObjectUrl();
    localStorage.removeItem(storageKey);
    setModelUrl(null);
    setSavedModelName(null);
    setUploadError(null);
  }, [revokeCurrentObjectUrl, storageKey]);

  const dropHandlers = useMemo(
    () => ({
      handleModelUpload,
      handleDragOver,
      handleDragLeave,
      handleDrop,
    }),
    [handleModelUpload, handleDragOver, handleDragLeave, handleDrop]
  );

  const askAi = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      setConversation(prev => [...prev, { role: 'user', text: trimmed }]);

      if (!aiFunctionRef.current) {
        setConversation(prev => [
          ...prev,
          {
            role: 'system',
            text: '⚠️ Din AI är inte redo. Kör koden och se till att funktionen ai(question) finns.',
          },
        ]);
        return;
      }

      setIsAiThinking(true);

      try {
        const result = aiFunctionRef.current(trimmed);
        let answer: string | null = null;

        if (typeof result === 'string') {
          answer = result;
        } else if (result && typeof result.toString === 'function') {
          answer = result.toString();
          result.destroy?.();
        }

        if (!answer || answer === 'None') {
          answer = 'Jag behöver lite mer kod för att förstå det där. Uppdatera din ai(question)!';
        }

        setConversation(prev => [...prev, { role: 'ai', text: answer as string }]);
      } catch (error) {
        console.error('AI call failed', error);
        setConversation(prev => [
          ...prev,
          {
            role: 'system',
            text: '⚠️ Något gick fel när AI:n skulle svara. Kolla att funktionen ai(question) returnerar text.',
          },
        ]);
      } finally {
        setIsAiThinking(false);
      }
    },
    []
  );

  return {
    pythonCode,
    setPythonCode,
    runPython,
    modelUrl,
    savedModelName,
    uploadError,
    isDragging,
    clearSavedModel,
    dropHandlers,
    conversation,
    askAi,
    aiStatus,
    isAiThinking,
  };
}
