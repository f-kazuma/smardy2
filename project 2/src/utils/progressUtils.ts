import { Goal } from '../types';
import { calculateDaysPassed } from './dateUtils';

export const calculateExpectedProgress = (goal: Goal): number => {
  const daysPassed = Math.max(0, calculateDaysPassed(goal.startDate));
  return Math.min(goal.targetAmount, daysPassed * goal.dailyTarget);
};

export const calculateProgressPercentage = (current: number, total: number): number => {
  return Math.min(100, (current / total) * 100);
};

export const calculateProgressDifference = (actual: number, expected: number): number => {
  return actual - expected;
};