import React, { useState } from 'react';
import { Command, Github, Lock, Unlock } from 'lucide-react';

export const Identity = () => {
  const [decrypted, setDecrypted] = useState(false);
  const [emailText, setEmailText] = useState('ENCRYPTED_DATA_PACKET');
  
  const handleDecrypt = () => {
    if (decrypted) return;
    const target = "AdamKrupa@Tuta.io";
    const chars = "X#_<>[]01";
    let iterations = 0;
    
    const interval = setInterval(() => {
      setEmailText(target.split('').map((c, i) => {
        if (i < iterations) return target[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iterations >= target.length) {
        clearInterval(interval);
        setDecrypted(true);
      }
      iterations += 1/2;
    }, 50);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 md:py-24 animate-fadeIn">
      <div className="grid lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12">
          <div className="flex items-center gap-6">
            <div className="h-[2px] w-12 bg-[#ff00ff]"></div>
            <span className="text-[#ff00ff] text-[10px] uppercase font-black tracking-[1em]">root_access</span>
          </div>
          <h2 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8]">
            pc<br/><span className="text-[#ff00ff] italic">style</span>
          </h2>
          <p className="text-gray-400 text-xl lowercase leading-relaxed font-light opacity-90 max-w-lg italic">
            first year a.i. student at <span className="text-white border-b border-[#ff00ff] pb-1">Politechnika Częstochowska</span>.
            creating high-fidelity tools and procedural wonders. 
            dedicated to aesthetic performance and privacy-first engineering.
          </p>
          <div className="flex flex-wrap gap-8 pt-6">
            <button 
              onClick={handleDecrypt}
              className={`group relative px-12 py-5 overflow-hidden border transition-all cursor-none flex items-center gap-4 font-black uppercase text-xs tracking-[0.3em] ${
                decrypted 
                ? 'border-[#ff00ff] bg-[#ff00ff] text-black hover:bg-transparent hover:text-[#ff00ff]' 
                : 'border-white/30 text-gray-400 hover:border-[#ff00ff] hover:text-[#ff00ff]'
              }`}
            >
              {decrypted ? <Unlock size={16} /> : <Lock size={16} />}
              {decrypted ? (
                 <a href={`mailto:${emailText}`} className="cursor-none">{emailText}</a>
              ) : (
                 <span>DECRYPT_CONTACT</span>
              )}
            </button>
            <a href="https://github.com/pc-style" target="_blank" rel="noreferrer" className="px-12 py-5 border border-gray-800 text-gray-600 hover:text-white hover:border-white transition-all font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 cursor-none">
              <Github size={16} /> public_repo
            </a>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-10 border border-[#ff00ff]/10 group-hover:border-[#ff00ff]/30 transition-all group-hover:scale-105 duration-700"></div>
          <div className="bg-[#080808] aspect-square flex items-center justify-center border border-[#ff00ff]/10 shadow-[0_0_100px_rgba(255,0,255,0.05)] relative overflow-hidden group-hover:rotate-1 transition-all">
            <div className="text-center z-10">
               <img
                 src="/pfp.png"
                 alt="pcstyle profile"
                 className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 rounded-lg object-cover shadow-[0_0_30px_rgba(255,0,255,0.25)]"
               />
               <div className="space-y-3">
                 <span className="text-white text-[11px] uppercase font-black tracking-[0.6em] block">uplink_active</span>
                 <span className="text-gray-700 text-[9px] uppercase tracking-widest block font-mono">loc: Czestochowa, PL</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
