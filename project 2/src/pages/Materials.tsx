import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { StudyMaterial } from '../types';
import { Book, Trash2, Check, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

export default function Materials() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    type: 'book' as const,
    description: '',
    totalPages: '',
    currentPage: '',
    url: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMaterials();
    }
  }, [user]);

  const loadMaterials = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'materials'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const loadedMaterials = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<StudyMaterial, 'id'>),
        id: doc.id
      }));
      setMaterials(loadedMaterials);
    } catch (error) {
      console.error('Error loading materials:', error);
      toast.error('教材の読み込みに失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const materialData = {
        ...newMaterial,
        userId: user.uid,
        completed: false,
        totalPages: newMaterial.totalPages ? Number(newMaterial.totalPages) : undefined,
        currentPage: newMaterial.currentPage ? Number(newMaterial.currentPage) : undefined,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'materials'), materialData);
      const material: StudyMaterial = {
        ...materialData,
        id: docRef.id
      };

      setMaterials(prev => [...prev, material]);
      setNewMaterial({
        title: '',
        type: 'book',
        description: '',
        totalPages: '',
        currentPage: '',
        url: ''
      });
      toast.success('教材を追加しました');
    } catch (error) {
      console.error('Error adding material:', error);
      toast.error('教材の追加に失敗しました');
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const material = materials.find(m => m.id === id);
      if (!material) return;

      const materialRef = doc(db, 'materials', id);
      await updateDoc(materialRef, { 
        completed: !material.completed,
        updatedAt: serverTimestamp()
      });

      setMaterials(prev =>
        prev.map(m =>
          m.id === id ? { ...m, completed: !m.completed } : m
        )
      );
      toast.success(material.completed ? '未完了に戻しました' : '完了しました');
    } catch (error) {
      console.error('Error updating material:', error);
      toast.error('更新に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('この教材を削除してもよろしいですか？')) return;
    
    try {
      await deleteDoc(doc(db, 'materials', id));
      setMaterials(prev => prev.filter(material => material.id !== id));
      toast.success('教材を削除しました');
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('教材の削除に失敗しました');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Book className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">教材リスト</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              value={newMaterial.title}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">種類</label>
            <select
              value={newMaterial.type}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, type: e.target.value as any }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="book">書籍</option>
              <option value="video">動画</option>
              <option value="online">オンライン</option>
              <option value="other">その他</option>
            </select>
          </div>
        </div>
        {newMaterial.type === 'book' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">総ページ数</label>
              <input
                type="number"
                value={newMaterial.totalPages}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, totalPages: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">現在のページ</label>
              <input
                type="number"
                value={newMaterial.currentPage}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, currentPage: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
        {(newMaterial.type === 'video' || newMaterial.type === 'online') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={newMaterial.url}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">説明</label>
          <textarea
            value={newMaterial.description}
            onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          教材を追加
        </button>
      </form>

      <div className="space-y-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className={clsx(
              'bg-white p-4 rounded-lg shadow-md transition-colors duration-200',
              material.completed && 'bg-gray-50'
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={clsx(
                    'text-lg font-semibold',
                    material.completed ? 'text-gray-500' : 'text-gray-900'
                  )}>
                    {material.title}
                  </h3>
                  {material.url && (
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {material.type === 'book' && material.totalPages && (
                    <>
                      {material.currentPage || 0} / {material.totalPages} ページ
                    </>
                  )}
                </p>
                <p className="mt-2 text-gray-700">{material.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleComplete(material.id)}
                  className={clsx(
                    'p-2 rounded-full transition-colors duration-200',
                    material.completed
                      ? 'text-green-600 hover:text-green-700'
                      : 'text-gray-400 hover:text-green-600'
                  )}
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {materials.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            教材がまだ登録されていません。新しい教材を追加してください。
          </p>
        )}
      </div>
    </div>
  );
}