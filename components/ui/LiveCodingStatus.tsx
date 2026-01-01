import { Code2, Circle } from 'lucide-react'
import { useLiveStatus } from '../../hooks/useLiveStatus'

export function LiveCodingStatus() {
  const { status, loading } = useLiveStatus(30000)

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[9px] text-gray-600 uppercase font-black tracking-widest">
        <Circle size={10} className="animate-pulse" /> CONNECTING...
      </div>
    )
  }

  if (!status) {
    return (
      <div className="flex items-center gap-2 text-[9px] text-gray-600 uppercase font-black tracking-widest">
        <Circle size={10} /> OFFLINE
      </div>
    )
  }

  if (status.isActive) {
    return (
      <div className="flex items-center gap-2 text-[9px] text-[#ff00ff] uppercase font-black tracking-widest">
        <Code2 size={10} className="animate-pulse" />
        <span>WORKING: {status.project || status.language || 'unknown'}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-[9px] text-gray-600 uppercase font-black tracking-widest">
      <Circle size={10} /> IDLE
    </div>
  )
}
