'use client';

import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MiniAi.css';

type AiRule = { input: string; output: string };
type ParsedAi = { name: string; rules: AiRule[] };
type ChatMessage = { id: number; sender: 'user' | 'ai'; text: string; time: string };

const INITIAL_CODE = `AI "Min Första AI"

Inputs("hej")
Outputs("Hej! Jag är din AI vän!")

Inputs("vad heter du")
Outputs("Jag heter Min Första AI och jag älskar att prata!")

Inputs("vad kan du")
Outputs("Jag kan svara på dina frågor och vara din vän!")`;

const DEFAULT_RESPONSES = [
  'Hmm, jag förstår inte riktigt. Kan du fråga något annat?',
  'Det var intressant! Berätta mer!',
  'Jag vet inte svaret på det, men det låter spännande!',
  'Kan du förklara det på ett annat sätt?',
  'Wow, det hade jag inte tänkt på! Vad mer vill du veta?',
];

function parseAi(code: string, fallbackName: string): ParsedAi {
  const lines = code
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  let aiName = fallbackName || 'Min AI';
  const rules: AiRule[] = [];
  let currentInput: string | null = null;

  lines.forEach(line => {
    if (line.toLowerCase().startsWith('ai ')) {
      const nameMatch = line.match(/ai\s+"([^"]+)"/i);
      if (nameMatch) {
        aiName = nameMatch[1];
      }
    } else if (line.toLowerCase().startsWith('inputs')) {
      const inputMatch = line.match(/inputs\s*\(\s*"([^"]+)"\s*\)/i);
      if (inputMatch) {
        currentInput = inputMatch[1].toLowerCase();
      }
    } else if (line.toLowerCase().startsWith('outputs') && currentInput) {
      const outputMatch = line.match(/outputs\s*\(\s*"([^"]+)"\s*\)/i);
      if (outputMatch) {
        rules.push({ input: currentInput, output: outputMatch[1] });
        currentInput = null;
      }
    }
  });

  return { name: aiName, rules };
}

export default function MiniAi() {
  const navigate = useNavigate();
  const [aiName, setAiName] = useState('Min Första AI');
  const [code, setCode] = useState(INITIAL_CODE);
  const [currentAi, setCurrentAi] = useState<ParsedAi | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const nextMessageId = useRef(1);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasReadyAi = useMemo(() => !!currentAi, [currentAi]);

  useEffect(() => {
    if (!currentAi) return;
    const handle = window.setTimeout(() => {
      try {
        const parsed = parseAi(code, aiName);
        if (parsed.rules.length > 0) {
          setCurrentAi(parsed);
          setStatus({ type: 'success', text: '✨ AI uppdaterad automatiskt!' });
        }
      } catch {
        /* ignore auto-update parse errors */
      }
    }, 600);
    return () => window.clearTimeout(handle);
  }, [code, aiName]);

  useEffect(() => {
    if (!status) return;
    const handle = window.setTimeout(() => setStatus(null), 3000);
    return () => window.clearTimeout(handle);
  }, [status]);

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const addMessage = (sender: 'user' | 'ai', text: string) => {
    const time = new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [
      ...prev,
      { id: nextMessageId.current++, sender, text, time },
    ]);
  };

  const testAi = () => {
    if (!code.trim()) {
      setStatus({ type: 'error', text: '❌ Skriv lite AI-kod först!' });
      return;
    }

    try {
      const parsed = parseAi(code, aiName);
      if (parsed.rules.length === 0) {
        setStatus({ type: 'error', text: '❌ Din AI saknar Inputs/Outputs.' });
        return;
      }
      setCurrentAi(parsed);
      setChatHistory([]);
      setStatus({ type: 'success', text: `🎉 ${parsed.name} är redo att chatta!` });
      window.setTimeout(() => {
        addMessage(
          'ai',
          `Hej! Jag är ${parsed.name}! Jag kan svara på ${parsed.rules.length} olika frågor. Vad vill du prata om?`,
        );
      }, 500);
    } catch {
      setStatus({ type: 'error', text: '❌ Något gick fel. Kolla din AI-kod!' });
    }
  };

  const findResponse = (userMessage: string): string => {
    if (!currentAi) return '';
    const lower = userMessage.toLowerCase();
    const match = currentAi.rules.find(rule => lower.includes(rule.input));
    if (match) {
      return match.output;
    }
    return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!currentAi) {
      setStatus({ type: 'error', text: '❌ Testa din AI först!' });
      return;
    }

    const outgoing = message;
    setMessage('');
    autoResize();
    addMessage('user', outgoing);
    setIsTyping(true);

    const reply = findResponse(outgoing);
    const delay = 800 + Math.random() * 1200;
    window.setTimeout(() => {
      setIsTyping(false);
      addMessage('ai', reply);
    }, delay);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const quickSend = (text: string) => {
    if (!hasReadyAi) {
      setStatus({ type: 'error', text: '❌ Testa din AI först!' });
      return;
    }
    setMessage(text);
    window.setTimeout(() => {
      sendMessage();
    }, 150);
  };

  const clearChat = () => {
    setChatHistory([]);
    setStatus({ type: 'success', text: '🧹 Chatten rensad!' });
  };

  const exportChat = () => {
    if (chatHistory.length === 0) {
      setStatus({ type: 'error', text: '❌ Ingen chatt att kopiera!' });
      return;
    }
    const lines = chatHistory
      .map(entry => `${entry.sender === 'user' ? 'Du' : currentAi?.name || 'AI'}: ${entry.text}`)
      .join('\n\n');
    navigator.clipboard
      .writeText(`Chatt med ${currentAi?.name || 'AI'}\n\n${lines}`)
      .then(() => setStatus({ type: 'success', text: '📋 Chatten kopierad!' }))
      .catch(() => setStatus({ type: 'error', text: '❌ Kunde inte kopiera chatten.' }));
  };

  const autoResize = () => {
    if (!textareaRef.current) return;
    const element = textareaRef.current;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 120)}px`;
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="mini-ai-page">
      <div className="floating-shapes" />
      <button className="mini-ai-back" onClick={() => navigate('/pass0')}>
        ← Tillbaka till rymdresan
      </button>

      <div className="mini-ai-content">
        <header className="mini-ai-header">
          <div className="mini-ai-emoji"></div>
          <h1>Bygg din AI </h1>
          <p>Bygg din egen AI med enkel text! Ingen komplicerad kod, bara skriv vad din AI ska kunna!</p>
          <span> Skriv "AI", sedan "Inputs(fråga)" och "Outputs(svar)"</span>
        </header>

        <div className="mini-ai-grid">
          <div className="ai-card">
            <h2>Bygg din AI här</h2>
            <label>
              <span>AI-namn</span>
              <input
                type="text"
                value={aiName}
                onChange={event => setAiName(event.target.value)}
                placeholder="T.ex. Min roliga AI"
              />
            </label>

            <label>
              <span>Din AI-kod</span>
              <textarea
                className="code-editor"
                value={code}
                onChange={event => setCode(event.target.value)}
                placeholder='Skriv t.ex. AI "Min AI"...'
              />
            </label>

            <div className="mini-ai-actions">
              <button className="rainbow-button" onClick={testAi}>
                TESTA MIN AI, STARTA CHATTEN!
              </button>
              <p>👆 Klicka här först för att aktivera din AI!</p>
            </div>

            {status && (
              <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
                {status.text}
              </div>
            )}
          </div>

          <div className="mini-ai-chat-column">
            <div className="info-card">
              <div className="info-row">
                <span>💬</span>
                <h3>ChatGPT-liknande chatt</h3>
              </div>
              <p>
                När du testar din AI kan du chatta precis som med ChatGPT! Din AI svarar baserat på de Inputs/Outputs du programmerat.
              </p>
              <div className="info-tags">
          
              </div>
            </div>

            <div className="ai-card chat-card">
              <div className="chat-header">
                <div className="chat-avatar">🤖</div>
                <div>
                  <h3>{currentAi?.name || 'Din AI'}</h3>
                  <p>{hasReadyAi ? 'Online - redo att svara!' : 'Starta AI:n för att börja chatta.'}</p>
                </div>
                <div className="chat-actions">
                  <button onClick={clearChat} title="Rensa chatt">
                    🗑️
                  </button>
                  <button onClick={exportChat} title="Kopiera chatt">
                    📋
                  </button>
                </div>
              </div>

              <div className="chat-container" ref={chatRef}>
                {chatHistory.length === 0 && (
                  <div className="chat-empty">
                    <div className="chat-empty-icon">💬</div>
                    <h4>Messenger-stil chatt</h4>
                    <p>🚀 Steg 1: Testa din AI. 💬 Steg 2: Skriv dina frågor!</p>
                  </div>
                )}

                {chatHistory.map(entry => (
                  <div key={entry.id} className={`chat-message ${entry.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                    {entry.sender === 'ai' && <div className="message-avatar ai-avatar">🤖</div>}
                    <div className="message-content">
                      <p>{entry.text}</p>
                      <span>{entry.time}</span>
                    </div>
                    {entry.sender === 'user' && <div className="message-avatar user-avatar">👤</div>}
                  </div>
                ))}

                {isTyping && (
                  <div className="chat-message ai-message typing">
                    <div className="message-avatar ai-avatar">🤖</div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>

              <form className="chat-input-row" onSubmit={handleFormSubmit}>
                <textarea
                  ref={textareaRef}
                  value={message}
                  placeholder="Skriv ett meddelande..."
                  onChange={event => {
                    setMessage(event.target.value);
                    autoResize();
                  }}
                  onKeyDown={handleKeyPress}
                  disabled={!hasReadyAi}
                />
                <button type="submit" disabled={!hasReadyAi || !message.trim()}>
                  ➤
                </button>
              </form>

              <div className="quick-suggestions">
                <button onClick={() => quickSend('Hej! Vad heter du?')}>👋 Hej!</button>
                <button onClick={() => quickSend('Vad kan du hjälpa mig med?')}>❓ Vad kan du?</button>
                <button onClick={() => quickSend('Berätta något roligt!')}>😄 Något roligt!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
