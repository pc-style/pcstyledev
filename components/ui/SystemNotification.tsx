import React, { memo } from 'react';
import { Activity } from 'lucide-react';

interface Props {
  notifications: string[];
}

export const SystemNotification = memo(({ notifications }: Props) => (
  <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200] space-y-2 pointer-events-none w-[calc(100vw-2rem)] sm:w-auto">
    {notifications.map((n, i) => (
      <div
        key={i}
        className="bg-black/90 border-l-4 border-[#ff00ff] p-4 text-[11px] font-mono text-[#ff00ff] animate-slideIn backdrop-blur-md shadow-2xl flex items-center gap-4 break-words max-w-full"
      >
        <div className="bg-[#ff00ff]/10 p-1">
          <Activity size={12} className="animate-pulse" />
        </div>
        <span className="uppercase tracking-[0.2em] font-black">{n}</span>
      </div>
    ))}
  </div>
));
