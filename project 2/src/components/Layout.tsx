import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, BookOpen, List, Calendar, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'ホーム' },
    { to: '/logs', icon: BookOpen, label: '学習記録' },
    { to: '/materials', icon: List, label: '教材' },
    { to: '/schedule', icon: Calendar, label: 'スケジュール' },
  ];

  return (
    <div className="min-h-screen flex">
      <nav className="w-64 bg-white shadow-lg">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-blue-600">Smardy</h1>
          </div>
          <div className="flex-1 px-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg mb-1',
                    'transition-colors duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  )
                }
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1 bg-gray-50">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}