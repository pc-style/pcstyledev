import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import { Activity, Database, Volume2, VolumeX, Terminal as TerminalIcon } from 'lucide-react';
import { createSynth } from './utils/audio';

import { NeuralCursor } from './components/ui/NeuralCursor';
import { KernelLog } from './components/ui/KernelLog';
import { SystemNotification } from './components/ui/SystemNotification';
import { BootSequence } from './components/ui/BootSequence';
import { CRTOverlay } from './components/ui/CRTOverlay';
import { AudioVisualizer } from './components/ui/AudioVisualizer';
import { HexClock } from './components/ui/HexClock';
import { LiveCodingStatus } from './components/ui/LiveCodingStatus';
import { MatrixBackground } from './components/layout/MatrixBackground';

import { Projects } from './pages/Projects';
import { Terminal } from './pages/Terminal';
import { Identity } from './pages/Identity';
import { Stats } from './pages/Stats';

function Layout({
  soundEnabled,
  setSoundEnabled,
  handleLogoClick,
  synth,
  notifications,
  addNotification
}: any) {
  const location = useLocation();
  const activeTab = location.pathname.substring(1) || 'projects';

  return (
    <>
      <MatrixBackground />
      <CRTOverlay />
      <div className={`relative z-10 transition-all duration-1000`}>
        {/* Navigation / Top Bar */}
        <header className="border-b border-[#ff00ff]/20 bg-black/95 backdrop-blur-xl sticky top-0 z-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-2 sm:py-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <div className="flex items-center gap-4 sm:gap-6 group">
              <div
                onClick={handleLogoClick}
                className="w-10 h-10 md:w-12 md:h-12 bg-[#ff00ff] cursor-none flex items-center justify-center text-black font-black italic text-xl md:text-2xl active:scale-90 transition-all shadow-[0_0_15px_#ff00ff66]"
              >
                PC
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tighter text-white uppercase group-hover:text-[#ff00ff] transition-colors">
                  pcstyle<span className="text-[#ff00ff]/40">.dev</span>
                </h1>
                <div className="flex gap-6 mt-1">
                  <LiveCodingStatus />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
              <nav className="flex items-center justify-center gap-1 sm:gap-3 md:gap-6 lg:gap-10 w-full overflow-x-auto no-scrollbar scroll-smooth py-1">
                {[
                  { path: '/', label: 'projects' },
                  { path: '/terminal', label: 'terminal' },
                  { path: '/stats', label: 'stats' },
                  { path: '/identity', label: 'identity' }
                ].map(item => {
                  const isActive = (item.path === '/' && activeTab === 'projects') || activeTab === item.label;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => {
                        addNotification(`ACCESSING_${item.label.toUpperCase()}`);
                        if (soundEnabled) synth?.playBlip(600, 'sine', 0.05);
                      }}
                      className={`text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all relative px-2 py-2 md:py-3 flex-shrink-0 ${isActive ? 'text-[#ff00ff] font-black' : 'text-gray-600 hover:text-white'
                        }`}
                    >
                      {item.label}
                      {isActive && <div className="absolute bottom-0 left-0 w-full h-[2px] md:h-1 bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]"></div>}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex gap-4 items-center justify-center md:ml-4 scale-75 md:scale-100">
                <HexClock />
                <div className="hidden md:block h-4 w-[1px] bg-[#ff00ff]/20 mx-2"></div>
                <AudioVisualizer synth={synth} isActive={soundEnabled} />
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    addNotification(!soundEnabled ? "AUDIO_LIVE" : "MUTE_ACTIVE");
                  }}
                  className={`p-2 border rounded-full transition-all ${soundEnabled ? 'border-[#ff00ff] text-[#ff00ff]' : 'border-gray-800 text-gray-700'}`}
                >
                  {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-24 relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
          <Outlet context={{ soundEnabled, synth, addNotification }} />
        </main>

        <footer className="p-8 sm:p-12 md:p-20 border-t border-[#ff00ff]/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-10">
            <div className="flex flex-col items-center md:items-start gap-3">
              <p className="text-[12px] text-[#ff00ff] font-black uppercase tracking-[0.5em] opacity-30">
                &copy; 2025 pcstyle.dev
              </p>
              <span className="text-[10px] text-gray-800 uppercase tracking-widest font-mono">protocol_reserved: 777-99-ALPHA</span>
            </div>
            <div className="flex gap-6 sm:gap-10 md:gap-16 text-gray-700">
              {['privacy', 'network', 'source'].map(link => (
                <span key={link} className="text-[10px] uppercase font-black cursor-none hover:text-[#ff00ff] transition-all tracking-[0.3em]">
                  {link}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <NeuralCursor />
      <KernelLog />
      <SystemNotification notifications={notifications} />
    </>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);
  const [isHacked, setIsHacked] = useState(false);
  const [isSuperHacker, setIsSuperHacker] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const synth = useMemo(() => createSynth(), []);

  const addNotification = useCallback((msg: string) => {
    setNotifications(prev => [...prev.slice(-4), msg]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== msg));
    }, 4000);
  }, []);

  // Konami Code Logic
  useEffect(() => {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let history: string[] = [];

    const handler = (e: KeyboardEvent) => {
      history = [...history, e.key];
      if (history.length > sequence.length) history.shift();
      if (JSON.stringify(history) === JSON.stringify(sequence)) {
        setIsSuperHacker(prev => !prev);
        if (soundEnabled) synth?.playBlip(1200, 'sawtooth', 0.5);
        // Don't show notification immediately, rely on state change effect
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [soundEnabled, synth]);

  useEffect(() => {
    if (isSuperHacker) {
      addNotification("ROOT_ACCESS_GRANTED: OVERDRIVE_MODE");
    }
  }, [isSuperHacker, addNotification]);

  // Save/Load sound preference
  useEffect(() => {
    const saved = localStorage.getItem('pcstyle_sound');
    if (saved) setSoundEnabled(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('pcstyle_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleBootComplete = useCallback(() => {
    setBooting(false);
    addNotification("UPLINK_STABLE");
  }, [addNotification]);

  const handleLogoClick = useCallback(() => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    addNotification(`INPUT_OVERRIDE: ${newCount}/5`);
    if (soundEnabled) synth?.playBlip(200 + newCount * 100, 'sine');

    if (newCount >= 5) {
      setIsHacked(true);
      addNotification("SYSTEM_FAILURE_SIMULATED");
      setTimeout(() => {
        setIsHacked(false);
        setLogoClicks(0);
      }, 3000);
    }
  }, [logoClicks, soundEnabled, synth, addNotification]);

  return (
    <div
      className={`min-h-screen bg-black text-gray-300 font-mono selection:bg-[#ff00ff] selection:text-black overflow-x-hidden cursor-none transition-all duration-1000 ${isHacked ? 'animate-shake' : ''}`}
      style={{ filter: isSuperHacker ? 'hue-rotate(90deg) contrast(1.2)' : 'none' }}
    >
      {booting ? (
        <BootSequence onComplete={handleBootComplete} />
      ) : (
        <HashRouter>
          <Routes>
            <Route path="/" element={
              <Layout
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
                handleLogoClick={handleLogoClick}
                synth={synth}
                notifications={notifications}
                addNotification={addNotification}
              />
            }>
              <Route index element={<Projects />} />
              <Route path="terminal" element={<Terminal />} />
              <Route path="stats" element={<Stats />} />
              <Route path="identity" element={<Identity />} />
            </Route>
          </Routes>
        </HashRouter>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%) scaleX(0); opacity: 0; }
          to { transform: translateX(0) scaleX(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0,0); filter: contrast(1); }
          10% { transform: translate(-10px, -5px); filter: hue-rotate(90deg) brightness(2); }
          50% { transform: translate(10px, 5px); filter: invert(1); }
        }
        .animate-slideIn { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake { animation: shake 0.2s infinite; }
        .scrollbar-custom::-webkit-scrollbar { width: 2px; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: #ff00ff55; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}