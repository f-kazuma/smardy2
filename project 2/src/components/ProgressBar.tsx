import React from 'react';
import { Goal } from '../types';
import clsx from 'clsx';
import { calculateExpectedProgress, calculateProgressPercentage, calculateProgressDifference } from '../utils/progressUtils';

interface ProgressBarProps {
  goal: Goal;
}

export default function ProgressBar({ goal }: ProgressBarProps) {
  const expectedProgress = calculateExpectedProgress(goal);
  const actualProgress = goal.progress;
  const difference = calculateProgressDifference(actualProgress, expectedProgress);

  const progressPercentage = calculateProgressPercentage(actualProgress, goal.targetAmount);
  const expectedProgressPercentage = calculateProgressPercentage(expectedProgress, goal.targetAmount);

  return (
    <div className="w-full space-y-2">
      <div className="h-6 bg-gray-200 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
        <div
          className="absolute top-0 h-full w-1 bg-red-500"
          style={{ left: `${expectedProgressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          進捗: {actualProgress} / {goal.targetAmount}
        </span>
        <span className="text-gray-600">
          目標: {Math.round(expectedProgress)}
        </span>
        <span className={clsx(
          difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600',
          'font-medium'
        )}>
          {difference > 0 ? '+' : ''}{Math.round(difference)}
        </span>
      </div>
    </div>
  );
}