import { AppState, DayData, DayStatus } from './types';

export const TOTAL_DAYS = 75;

export const INITIAL_TASKS = {
  workoutOutdoor: false,
  workoutIndoor: false,
  water: false,
  read: false,
  diet: false,
  picture: false,
};

export const DEFAULT_DAY_DATA: DayData = {
  dayNumber: 1,
  status: DayStatus.ACTIVE,
  tasks: { ...INITIAL_TASKS },
};

export const generateInitialState = (): AppState => {
  const history: DayData[] = Array.from({ length: TOTAL_DAYS }, (_, i) => ({
    dayNumber: i + 1,
    status: i === 0 ? DayStatus.ACTIVE : DayStatus.LOCKED,
    tasks: { ...INITIAL_TASKS },
  }));

  return {
    currentDayIndex: 0,
    history,
    startDate: new Date().toISOString(),
    hasFailed: false,
  };
};

export const QUOTES = [
  "It's not about being the best. It's about being better than you were yesterday.",
  "Pain is temporary. Quitting lasts forever.",
  "Discipline equals freedom.",
  "Don't count the days, make the days count.",
  "Your mind will quit a thousand times before your body will.",
];
