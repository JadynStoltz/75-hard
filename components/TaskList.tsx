import React, { useRef } from 'react';
import { DailyTasks } from '../types';
import { Check, Droplets, BookOpen, Dumbbell, Apple, Camera, Eye } from 'lucide-react';

interface TaskListProps {
  tasks: DailyTasks;
  onToggle: (key: keyof DailyTasks) => void;
  onPhotoUpload?: (file: File) => void;
  isReadOnly?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onPhotoUpload, isReadOnly = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const items: { key: keyof DailyTasks; label: string; detail: string; icon: React.ReactNode }[] = [
    { 
      key: 'workoutOutdoor', 
      label: 'OUTDOOR OPS', 
      detail: '45MIN // EXPOSED', 
      icon: <Dumbbell size={18} /> 
    },
    { 
      key: 'workoutIndoor', 
      label: 'INDOOR OPS', 
      detail: '45MIN // TRAINING', 
      icon: <Dumbbell size={18} /> 
    },
    { 
      key: 'water', 
      label: 'HYDRATION', 
      detail: '3.8 LITRES', 
      icon: <Droplets size={18} /> 
    },
    { 
      key: 'read', 
      label: 'INTEL', 
      detail: '10 PAGES', 
      icon: <BookOpen size={18} /> 
    },
    { 
      key: 'diet', 
      label: 'NUTRITION', 
      detail: 'STRICT PROTOCOL', 
      icon: <Apple size={18} /> 
    },
    { 
      key: 'picture', 
      label: 'VISUAL LOG', 
      detail: tasks.picture ? 'IMAGE SECURED' : 'EVIDENCE REQUIRED', 
      icon: tasks.picture ? <Eye size={18} /> : <Camera size={18} /> 
    },
  ];

  const handleInteraction = (key: keyof DailyTasks) => {
    if (isReadOnly) return;

    if (key === 'picture' && !tasks.picture && onPhotoUpload) {
      // If picture is not set, trigger upload
      fileInputRef.current?.click();
    } else {
      // Otherwise toggle normally (checking others, or unchecking picture)
      onToggle(key);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment" // Prefer rear camera
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && onPhotoUpload) {
            onPhotoUpload(e.target.files[0]);
            // Reset value so we can select same file again if needed (rare but good practice)
            e.target.value = '';
          }
        }}
      />

      {items.map((item) => {
        const isChecked = tasks[item.key];
        
        return (
          <button 
            key={item.key}
            onClick={() => handleInteraction(item.key)}
            disabled={isReadOnly}
            className={`
              w-full relative overflow-hidden group transition-all duration-200
              flex items-center justify-between p-4 border-l-2
              ${isChecked 
                ? 'bg-zinc-900/80 border-tac-green' 
                : 'bg-black/40 border-zinc-800 hover:bg-zinc-900/40'
              }
            `}
          >
            {/* Background Fill Animation */}
            <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${isChecked ? 'bg-gradient-to-r from-green-900/10 to-transparent opacity-100' : 'opacity-0'}`} />

            <div className="flex items-center gap-4 z-10">
              <div className={`p-2 rounded bg-black/50 border border-zinc-800 ${isChecked ? 'text-tac-green' : 'text-zinc-600'}`}>
                {item.icon}
              </div>
              <div className="text-left">
                <div className={`font-heading font-bold text-lg leading-none tracking-wider ${isChecked ? 'text-white' : 'text-zinc-400'}`}>
                  {item.label}
                </div>
                <div className={`font-mono text-[10px] tracking-widest mt-1 ${item.key === 'picture' && isChecked ? 'text-tac-green' : 'text-zinc-600'}`}>
                  {item.detail}
                </div>
              </div>
            </div>

            {/* Checkbox Design */}
            <div className={`
              z-10 w-6 h-6 border flex items-center justify-center transition-all duration-300
              ${isChecked 
                ? 'bg-tac-green border-tac-green text-black' 
                : 'bg-transparent border-zinc-700 text-transparent'
              }
            `}>
              <Check size={14} strokeWidth={4} />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TaskList;