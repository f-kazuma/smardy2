import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { GoalFormData } from '../types';

interface GoalFormProps {
  onSubmit: (goal: GoalFormData) => void;
}

export default function GoalForm({ onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [baseAmount, setBaseAmount] = useState('');
  const [repetitions, setRepetitions] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      baseAmount: Number(baseAmount),
      repetitions: Number(repetitions),
      startDate,
      endDate,
    });
    setTitle('');
    setBaseAmount('');
    setRepetitions('1');
    setStartDate('');
    setEndDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">新しい目標を設定</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">目標タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="例: TOEIC単語学習"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">基本数（ページ数・問題数など）</label>
          <input
            type="number"
            value={baseAmount}
            onChange={(e) => setBaseAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="例: 500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">周回数</label>
          <input
            type="number"
            value={repetitions}
            min="1"
            onChange={(e) => setRepetitions(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">開始日</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">終了日</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        目標を追加
      </button>
    </form>
  );
}