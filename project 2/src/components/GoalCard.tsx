import React, { useState } from 'react';
import { CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { Goal } from '../types';
import ProgressBar from './ProgressBar';

interface GoalCardProps {
  goal: Goal;
  onProgressUpdate: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
}

export default function GoalCard({ goal, onProgressUpdate, onDelete, onEdit }: GoalCardProps) {
  const [amount, setAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(goal.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProgressUpdate(goal.id, Number(amount));
    setAmount('');
  };

  const handleEdit = () => {
    if (isEditing) {
      onEdit({ ...goal, title: editedTitle });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-lg font-semibold text-gray-800 w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
          )}
          <p className="text-sm text-gray-600">
            1日の目標: {goal.dailyTarget.toFixed(1)} / 総目標: {goal.targetAmount}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-gray-600 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-right text-sm text-gray-600">
        <div>{new Date(goal.startDate).toLocaleDateString()}</div>
        <div>{new Date(goal.endDate).toLocaleDateString()}</div>
      </div>

      <ProgressBar goal={goal} />

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="今日の達成数を入力"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          記録
        </button>
      </form>
    </div>
  );
}