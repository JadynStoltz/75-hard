import React, { useEffect, useState } from 'react';
import { DayData, DayStatus } from '../types';
import TaskList from './TaskList';
import { X, ImageOff, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import { getPhoto } from '../services/imageDb';

interface HistoryDetailModalProps {
  day: DayData;
  onClose: () => void;
}

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ day, onClose }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchImage = async () => {
      if (day.tasks.picture) {
        setLoadingImage(true);
        try {
          const blob = await getPhoto(day.dayNumber);
          if (blob && active) {
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          }
        } catch (e) {
          console.error("Error loading image", e);
        } finally {
          if (active) setLoadingImage(false);
        }
      }
    };
    fetchImage();
    return () => {
      active = false;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [day]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-900/30">
          <div>
             <h2 className="text-xl font-heading font-bold text-white tracking-widest uppercase">
               Log Entry: Day {day.dayNumber}
             </h2>
             <div className="flex items-center gap-2 mt-1">
               {day.status === DayStatus.COMPLETED ? (
                 <span className="text-tac-green font-mono text-[10px] flex items-center gap-1">
                   <ShieldCheck size={10} /> MISSION ACCOMPLISHED
                 </span>
               ) : day.status === DayStatus.FAILED ? (
                  <span className="text-red-600 font-mono text-[10px] flex items-center gap-1">
                    <ShieldAlert size={10} /> MISSION FAILED
                  </span>
               ) : (
                  <span className="text-zinc-400 font-mono text-[10px] flex items-center gap-1">
                    <Calendar size={10} /> IN PROGRESS
                  </span>
               )}
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          
          {/* Evidence Section */}
          <div className="space-y-2">
            <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Visual Evidence</h3>
            <div className="w-full aspect-square bg-black border border-zinc-800 rounded-sm flex items-center justify-center overflow-hidden relative group">
              {loadingImage ? (
                <div className="animate-pulse text-tac-green font-mono text-xs">DECRYPTING MEDIA...</div>
              ) : imageUrl ? (
                <img src={imageUrl} alt={`Day ${day.dayNumber} Evidence`} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-700">
                  <ImageOff size={32} />
                  <span className="font-mono text-[10px]">NO DATA FOUND</span>
                </div>
              )}
              
              {/* Scanline effect overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />
            </div>
          </div>

          {/* Task Log */}
          <div className="space-y-2">
            <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Protocol Manifest</h3>
            <div className="opacity-80 pointer-events-none">
               <TaskList tasks={day.tasks} onToggle={() => {}} isReadOnly={true} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-900/30">
          <div className="text-[10px] font-mono text-zinc-600 flex justify-between uppercase">
            <span>Entry ID: {btoa(`day-${day.dayNumber}`).substring(0,8)}</span>
            <span>{day.dateCompleted ? new Date(day.dateCompleted).toLocaleDateString() : 'DATE UNKNOWN'}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HistoryDetailModal;