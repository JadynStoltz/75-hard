export interface DailyTasks {
  workoutOutdoor: boolean;
  workoutIndoor: boolean;
  water: boolean; // 3.8 Litres
  read: boolean; // 10 pages non-fiction
  diet: boolean; // Clean diet, no cheat meals, no alcohol
  picture: boolean; // Progress pic
}

export enum DayStatus {
  LOCKED = 'LOCKED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface DayData {
  dayNumber: number;
  status: DayStatus;
  tasks: DailyTasks;
  dateCompleted?: string;
  notes?: string;
}

export interface AppState {
  currentDayIndex: number; // 0 to 74
  history: DayData[];
  startDate: string | null;
  hasFailed: boolean;
}