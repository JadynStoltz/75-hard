import React, { useEffect, useState } from 'react';
import { getDailyMotivation } from '../services/geminiService';
import { Terminal } from 'lucide-react';

interface MotivationWidgetProps {
  dayNumber: number;
}

const MotivationWidget: React.FC<MotivationWidgetProps> = ({ dayNumber }) => {
  const [quote, setQuote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const fetchMotivation = async () => {
      setLoading(true);
      const isTough = dayNumber < 7 || (dayNumber > 30 && dayNumber < 45);
      const text = await getDailyMotivation(dayNumber, isTough);
      if (mounted) {
        setQuote(text);
        setLoading(false);
      }
    };

    fetchMotivation();
    return () => { mounted = false; };
  }, [dayNumber]);

  return (
    <div className="w-full py-4 border-y border-zinc-900/50 bg-black/20">
      <div className="flex items-start gap-3 text-sm font-mono leading-relaxed text-zinc-400">
        <Terminal size={16} className="text-tac-green mt-0.5 shrink-0" />
        <div className="uppercase tracking-wide">
          {loading ? (
             <span className="animate-pulse">DECRYPTING HQ TRANSMISSION...</span>
          ) : (
             <span className="text-zinc-300">"{quote}"</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotivationWidget;