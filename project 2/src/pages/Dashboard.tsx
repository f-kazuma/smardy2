import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Goal, GoalFormData } from '../types';
import GoalForm from '../components/GoalForm';
import GoalCard from '../components/GoalCard';
import { Target, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { calculateDaysBetween } from '../utils/dateUtils';

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'goals'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const loadedGoals = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Goal, 'id'>),
        id: doc.id
      }));
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('目標の読み込みに失敗しました');
    }
  };

  const handleGoalSubmit = async (formData: GoalFormData) => {
    if (!user) return;
    try {
      const totalDays = calculateDaysBetween(formData.startDate, formData.endDate);
      const targetAmount = formData.baseAmount * formData.repetitions;
      const dailyTarget = Number((targetAmount / totalDays).toFixed(2));

      const goalData = {
        ...formData,
        userId: user.uid,
        targetAmount,
        dailyTarget,
        progress: 0,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'goals'), goalData);

      const goal: Goal = {
        ...formData,
        id: docRef.id,
        targetAmount,
        dailyTarget,
        progress: 0
      };

      setGoals(prev => [...prev, goal]);
      toast.success('目標を追加しました');
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('目標の追加に失敗しました');
    }
  };

  const handleProgressUpdate = async (id: string, amount: number) => {
    try {
      const goalRef = doc(db, 'goals', id);
      const goal = goals.find(g => g.id === id);
      if (!goal) return;

      const newProgress = goal.progress + amount;
      await updateDoc(goalRef, { 
        progress: newProgress,
        updatedAt: serverTimestamp()
      });

      setGoals(prev =>
        prev.map(goal =>
          goal.id === id
            ? { ...goal, progress: newProgress }
            : goal
        )
      );
      toast.success('進捗を更新しました');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('進捗の更新に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('この目標を削除してもよろしいですか？')) return;
    
    try {
      await deleteDoc(doc(db, 'goals', id));
      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast.success('目標を削除しました');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('目標の削除に失敗しました');
    }
  };

  const handleEdit = async (updatedGoal: Goal) => {
    try {
      const goalRef = doc(db, 'goals', updatedGoal.id);
      await updateDoc(goalRef, { 
        title: updatedGoal.title,
        updatedAt: serverTimestamp()
      });
      
      setGoals(prev =>
        prev.map(goal =>
          goal.id === updatedGoal.id ? updatedGoal : goal
        )
      );
      toast.success('目標を更新しました');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('目標の更新に失敗しました');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('ログアウトしました');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('ログアウトに失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">目標達成トラッカー</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4" />
            ログアウト
          </button>
        </div>

        <GoalForm onSubmit={handleGoalSubmit} />

        <div className="space-y-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onProgressUpdate={handleProgressUpdate}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
          {goals.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              目標がまだ登録されていません。新しい目標を追加してください。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}