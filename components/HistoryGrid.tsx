import React from 'react';
import { DayData, DayStatus } from '../types';

interface HistoryGridProps {
  history: DayData[];
  currentDayIndex: number;
  onDayClick: (day: DayData) => void;
}

const HistoryGrid: React.FC<HistoryGridProps> = ({ history, currentDayIndex, onDayClick }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Operation Timeline</h3>
        <span className="text-zinc-600 font-mono text-[10px]">{Math.round((currentDayIndex / 75) * 100)}% CMPL</span>
      </div>
      
      {/* GitHub-style Heatmap */}
      <div className="flex flex-wrap gap-[3px]">
        {history.map((day, index) => {
          let bgClass = 'bg-zinc-900/50 hover:bg-zinc-800';
          let cursorClass = 'cursor-pointer';
          
          if (day.status === DayStatus.COMPLETED) {
            bgClass = 'bg-tac-green shadow-[0_0_5px_rgba(0,255,65,0.4)] hover:bg-green-400';
          } else if (day.status === DayStatus.FAILED) {
            bgClass = 'bg-red-600 hover:bg-red-500';
          } else if (day.status === DayStatus.ACTIVE) {
            bgClass = 'bg-white animate-pulse';
          } else if (day.status === DayStatus.LOCKED) {
             cursorClass = 'cursor-not-allowed opacity-50';
          }

          return (
            <button
              key={day.dayNumber}
              onClick={() => day.status !== DayStatus.LOCKED && onDayClick(day)}
              disabled={day.status === DayStatus.LOCKED}
              className={`
                w-2.5 h-2.5 rounded-[1px] transition-all duration-300
                ${bgClass} ${cursorClass}
              `}
              title={`Day ${day.dayNumber}: ${day.status}`}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-zinc-600 font-mono mt-2 text-right">TAP GRID FOR DETAILS</p>
    </div>
  );
};

export default HistoryGrid;