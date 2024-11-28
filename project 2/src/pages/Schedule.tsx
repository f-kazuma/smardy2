import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Schedule as ScheduleType } from '../types';
import { Calendar as CalendarIcon, Clock, Trash2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

export default function Schedule() {
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    subject: '',
    description: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSchedules();
    }
  }, [user]);

  const loadSchedules = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'schedules'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const loadedSchedules = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<ScheduleType, 'id'>),
        id: doc.id
      }));
      setSchedules(loadedSchedules);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('スケジュールの読み込みに失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const scheduleData = {
        ...newSchedule,
        userId: user.uid,
        completed: false,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'schedules'), scheduleData);
      const schedule: ScheduleType = {
        ...scheduleData,
        id: docRef.id
      };

      setSchedules(prev => [...prev, schedule]);
      setNewSchedule({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        subject: '',
        description: ''
      });
      toast.success('スケジュールを追加しました');
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast.error('スケジュールの追加に失敗しました');
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const schedule = schedules.find(s => s.id === id);
      if (!schedule) return;

      const scheduleRef = doc(db, 'schedules', id);
      await updateDoc(scheduleRef, { 
        completed: !schedule.completed,
        updatedAt: serverTimestamp()
      });

      setSchedules(prev =>
        prev.map(s =>
          s.id === id ? { ...s, completed: !s.completed } : s
        )
      );
      toast.success(schedule.completed ? '未完了に戻しました' : '完了しました');
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('更新に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('このスケジュールを削除してもよろしいですか？')) return;
    
    try {
      await deleteDoc(doc(db, 'schedules', id));
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      toast.success('スケジュールを削除しました');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('スケジュールの削除に失敗しました');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">スケジュール</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              value={newSchedule.title}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">科目</label>
            <input
              type="text"
              value={newSchedule.subject}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, subject: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">日付</label>
            <input
              type="date"
              value={newSchedule.date}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, date: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">開始時間</label>
            <input
              type="time"
              value={newSchedule.startTime}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font- <boltAction type="file" filePath="src/pages/Schedule.tsx">            <label className="block text-sm font-medium text-gray-700">終了時間</label>
            <input
              type="time"
              value={newSchedule.endTime}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, endTime: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">説明</label>
          <textarea
            value={newSchedule.description}
            onChange={(e) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          スケジュールを追加
        </button>
      </form>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className={clsx(
              'bg-white p-4 rounded-lg shadow-md transition-colors duration-200',
              schedule.completed && 'bg-gray-50'
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={clsx(
                  'text-lg font-semibold',
                  schedule.completed ? 'text-gray-500' : 'text-gray-900'
                )}>
                  {schedule.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{schedule.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{schedule.startTime} - {schedule.endTime}</span>
                  </div>
                  <span className="text-blue-600">{schedule.subject}</span>
                </div>
                {schedule.description && (
                  <p className="mt-2 text-gray-700">{schedule.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleComplete(schedule.id)}
                  className={clsx(
                    'p-2 rounded-full transition-colors duration-200',
                    schedule.completed
                      ? 'text-green-600 hover:text-green-700'
                      : 'text-gray-400 hover:text-green-600'
                  )}
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(schedule.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {schedules.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            スケジュールがまだ登録されていません。新しいスケジュールを追加してください。
          </p>
        )}
      </div>
    </div>
  );
}