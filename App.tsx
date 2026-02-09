import React, { useState, useEffect } from 'react';
import { AppState, DailyTasks, DayData, DayStatus } from './types';
import { DEFAULT_DAY_DATA, generateInitialState, TOTAL_DAYS } from './constants';
import TaskList from './components/TaskList';
import HistoryGrid from './components/HistoryGrid';
import MotivationWidget from './components/MotivationWidget';
import HistoryDetailModal from './components/HistoryDetailModal';
import { RotateCcw, CheckCircle2, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { getRecoveryAdvice } from './services/geminiService';
import { savePhoto, deletePhoto } from './services/imageDb';

const STORAGE_KEY = '75_HARD_TRACKER_V1';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : generateInitialState();
  });

  const [showFailModal, setShowFailModal] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [selectedHistoryDay, setSelectedHistoryDay] = useState<DayData | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentDayData = state.history[state.currentDayIndex];
  
  const handleToggleTask = async (taskKey: keyof DailyTasks) => {
    if (currentDayData.status !== DayStatus.ACTIVE) return;

    // Special logic for picture: if unchecking, delete the photo
    if (taskKey === 'picture' && currentDayData.tasks.picture) {
      try {
        await deletePhoto(currentDayData.dayNumber);
      } catch (e) {
        console.error("Failed to delete photo", e);
      }
    }

    const newTasks = { ...currentDayData.tasks, [taskKey]: !currentDayData.tasks[taskKey] };
    const updatedHistory = [...state.history];
    updatedHistory[state.currentDayIndex] = { ...currentDayData, tasks: newTasks };
    setState(prev => ({ ...prev, history: updatedHistory }));
  };

  const handlePhotoUpload = async (file: File) => {
    if (currentDayData.status !== DayStatus.ACTIVE) return;

    try {
      // Save to IndexedDB
      await savePhoto(currentDayData.dayNumber, file);

      // Mark task as complete
      const newTasks = { ...currentDayData.tasks, picture: true };
      const updatedHistory = [...state.history];
      updatedHistory[state.currentDayIndex] = { ...currentDayData, tasks: newTasks };
      setState(prev => ({ ...prev, history: updatedHistory }));
    } catch (e) {
      console.error("Failed to save photo", e);
      alert("Failed to save evidence. Storage might be full.");
    }
  };

  const handleCompleteDay = () => {
    const allDone = Object.values(currentDayData.tasks).every(Boolean);
    if (!allDone) return; // Button is disabled anyway

    const updatedHistory = [...state.history];
    updatedHistory[state.currentDayIndex].status = DayStatus.COMPLETED;
    updatedHistory[state.currentDayIndex].dateCompleted = new Date().toISOString();

    const nextIndex = state.currentDayIndex + 1;
    if (nextIndex < TOTAL_DAYS) {
      updatedHistory[nextIndex].status = DayStatus.ACTIVE;
      setState(prev => ({ ...prev, history: updatedHistory, currentDayIndex: nextIndex }));
      window.scrollTo(0,0);
    } else {
      // Done
      setState(prev => ({ ...prev, history: updatedHistory, currentDayIndex: nextIndex }));
    }
  };

  const handleFailChallenge = () => {
    setShowFailModal(true);
    setFailMessage("ANALYZING FAILURE DATA..."); 
    setIsResetting(true);

    getRecoveryAdvice().then((advice) => {
      setFailMessage(advice);
      setIsResetting(false);
    });
  };

  const confirmReset = async () => {
    try {
      // In a real app, clear IndexedDB here
    } catch (e) {}

    setState(generateInitialState());
    setShowFailModal(false);
    setFailMessage("");
  };

  // Completion View
  if (state.currentDayIndex >= TOTAL_DAYS) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-green-500/5" />
        <CheckCircle2 size={80} className="text-tac-green mb-8 relative z-10" />
        <h1 className="text-5xl font-heading font-bold text-white mb-4 relative z-10 tracking-tighter">MISSION<br/>COMPLETE</h1>
        <p className="font-mono text-zinc-500 text-sm mb-12 max-w-xs mx-auto relative z-10">
          DISCIPLINE INSTALLED.<br/>WELCOME TO THE 1%.
        </p>
        <button onClick={confirmReset} className="relative z-10 px-8 py-3 bg-white text-black font-bold font-heading uppercase tracking-widest hover:bg-zinc-200">
          New Campaign
        </button>
      </div>
    );
  }

  const tasksCompletedCount = Object.values(currentDayData.tasks).filter(Boolean).length;
  const progressPercent = (tasksCompletedCount / 6) * 100;

  return (
    <div className="min-h-screen flex flex-col text-zinc-100 font-sans pb-24">
      
      {/* HUD Header */}
      <header className="px-6 py-6 flex justify-between items-end sticky top-0 z-20 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 bg-tac-green rounded-full animate-pulse"></div>
             <span className="font-mono text-[10px] text-tac-green tracking-widest uppercase">Live Uplink</span>
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tighter leading-none text-white">
            DAY {currentDayData.dayNumber}
          </h1>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs text-zinc-500 mb-1">TARGETS</div>
          <div className="font-heading text-3xl font-bold leading-none text-zinc-300">
            {tasksCompletedCount}<span className="text-zinc-600">/6</span>
          </div>
        </div>
      </header>

      {/* Progress Line */}
      <div className="w-full h-[2px] bg-zinc-900 sticky top-[90px] z-20">
        <div 
          className="h-full bg-tac-green shadow-[0_0_10px_rgba(0,255,65,0.5)] transition-all duration-500 ease-out" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <main className="flex-1 px-6 pt-6 space-y-8">
        
        {/* Motivation Ticker */}
        <MotivationWidget dayNumber={currentDayData.dayNumber} />

        {/* Core Tasks */}
        <section>
          <TaskList 
            tasks={currentDayData.tasks} 
            onToggle={handleToggleTask} 
            onPhotoUpload={handlePhotoUpload}
          />
        </section>

        {/* Stats Module */}
        <section className="pt-4 border-t border-zinc-900">
           <HistoryGrid 
             history={state.history} 
             currentDayIndex={state.currentDayIndex} 
             onDayClick={setSelectedHistoryDay} 
           />
           
           <div className="mt-6 flex justify-between items-center">
             <button 
                onClick={handleFailChallenge}
                className="text-[10px] font-mono text-red-900 hover:text-red-500 uppercase tracking-widest transition-colors py-2 flex items-center gap-2"
              >
                <AlertTriangle size={12} />
                Abort Mission (Fail)
              </button>
              <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                v1.0.4 // CLASSIFIED
              </div>
           </div>
        </section>

      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-30">
        <button 
          onClick={handleCompleteDay}
          disabled={tasksCompletedCount < 6}
          className={`
            w-full h-14 flex items-center justify-between px-6 
            font-heading font-bold text-lg tracking-widest uppercase
            transition-all duration-300 border
            ${tasksCompletedCount === 6 
              ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
              : 'bg-zinc-950 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-80'
            }
          `}
        >
          <span>Complete Day</span>
          <ChevronRight className={`${tasksCompletedCount === 6 ? 'animate-bounce-x' : ''}`} />
        </button>
      </div>

      {/* History Detail Modal */}
      {selectedHistoryDay && (
        <HistoryDetailModal 
          day={selectedHistoryDay} 
          onClose={() => setSelectedHistoryDay(null)} 
        />
      )}

      {/* Fail Modal */}
      {showFailModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-950 border-t sm:border border-red-900/50 p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-heading font-bold text-red-600 uppercase tracking-tight">Mission Failed</h2>
              <button onClick={() => setShowFailModal(false)} className="text-zinc-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="font-mono text-xs text-red-200/80 mb-8 leading-relaxed border-l-2 border-red-900 pl-4 py-1">
              {isResetting ? (
                 <span className="animate-pulse">{failMessage}</span>
              ) : (
                 failMessage
              )}
            </div>

            <button 
              onClick={confirmReset}
              className="w-full py-4 bg-red-900/20 border border-red-900/50 hover:bg-red-900/40 text-red-500 hover:text-red-400 font-heading font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Confirm Restart
            </button>
          </div>
        </div>
      )}

    </div>
  );
}