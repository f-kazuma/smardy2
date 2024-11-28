import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { StudyLog } from '../types';
import { Clock, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StudyLogs() {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [newLog, setNewLog] = useState({
    subject: '',
    duration: 30,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadLogs();
    }
  }, [user]);

  const loadLogs = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'studyLogs'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const loadedLogs = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<StudyLog, 'id'>),
        id: doc.id
      }));
      setLogs(loadedLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
      toast.error('学習記録の読み込みに失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const logData = {
        ...newLog,
        userId: user.uid,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'studyLogs'), logData);
      const log: StudyLog = {
        ...logData,
        id: docRef.id
      };

      setLogs(prev => [...prev, log]);
      setNewLog({
        subject: '',
        duration: 30,
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      toast.success('学習記録を追加しました');
    } catch (error) {
      console.error('Error adding log:', error);
      toast.error('学習記録の追加に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('この記録を削除してもよろしいですか？')) return;
    
    try {
      await deleteDoc(doc(db, 'studyLogs', id));
      setLogs(prev => prev.filter(log => log.id !== id));
      toast.success('学習記録を削除しました');
    } catch (error) {
      console.error('Error deleting log:', error);
      toast.error('学習記録の削除に失敗しました');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Clock className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">学習記録</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">科目</label>
            <input
              type="text"
              value={newLog.subject}
              onChange={(e) => setNewLog(prev => ({ ...prev, subject: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">学習時間（分）</label>
            <input
              type="number"
              value={newLog.duration}
              onChange={(e) => setNewLog(prev => ({ ...prev, duration: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">日付</label>
          <input
            type="date"
            value={newLog.date}
            onChange={(e) => setNewLog(prev => ({ ...prev, date: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">内容</label>
          <textarea
            value={newLog.description}
            onChange={(e) => setNewLog(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          記録を追加
        </button>
      </form>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{log.subject}</h3>
                <p className="text-sm text-gray-600">{log.date} - {log.duration}分</p>
                <p className="mt-2 text-gray-700">{log.description}</p>
              </div>
              <button
                onClick={() => handleDelete(log.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            学習記録がまだありません。新しい記録を追加してください。
          </p>
        )}
      </div>
    </div>
  );
}