export interface Goal {
  id: string;
  title: string;
  baseAmount: number;
  repetitions: number;
  targetAmount: number;
  startDate: string;
  endDate: string;
  dailyTarget: number;
  progress: number;
}

export interface ProgressEntry {
  date: string;
  amount: number;
}

export interface GoalFormData {
  title: string;
  baseAmount: number;
  repetitions: number;
  startDate: string;
  endDate: string;
}

export interface StudyLog {
  id: string;
  userId: string;
  subject: string;
  duration: number;
  description: string;
  date: string;
  materialId?: string;
}

export interface StudyMaterial {
  id: string;
  userId: string;
  title: string;
  type: 'book' | 'video' | 'online' | 'other';
  description: string;
  totalPages?: number;
  currentPage?: number;
  url?: string;
  completed: boolean;
}

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  description?: string;
  completed: boolean;
}