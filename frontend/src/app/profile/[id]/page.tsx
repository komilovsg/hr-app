'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { User } from '@hr-app/shared';
import AvatarDisplay from '@/components/AvatarDisplay';

export default function UserProfile() {
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Получаем текущего пользователя из localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setCurrentUser(parsedUser);
        }
        
        // Получаем профиль пользователя
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки профиля пользователя');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ошибка</h1>
          <p className="text-gray-600">{error || 'Пользователь не найден'}</p>
        </div>
      </div>
    );
  }

  const handleSocialClick = (type: 'telegram' | 'linkedin', value: string) => {
    if (type === 'telegram') {
      window.open(`https://t.me/${value.replace('@', '')}`, '_blank');
    } else if (type === 'linkedin') {
      window.open(`https://${value}`, '_blank');
    }
  };

  // Проверяем права доступа
  const isManager = currentUser?.role === 'manager';
  const isOwnProfile = currentUser?.id === user.id;
  const canViewFullProfile = isManager || isOwnProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 Профиль пользователя</h1>
          <p className="text-gray-600">Подробная информация о сотруднике</p>
          {!canViewFullProfile && (
            <div className="mt-2 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              ⚠️ Ограниченный доступ - только основная информация
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
            <AvatarDisplay 
              userName={user.name} 
              size="lg" 
              className="mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium mb-2">
              {user.role === 'manager' ? 'Team Lead' : 'Сотрудник'}
            </div>
            <p className="text-blue-100">{user.team} Team</p>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Info - доступно всем */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Личная информация</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      📧
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      📱
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="font-medium text-gray-900">{user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      🏷️
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Команда</p>
                      <p className="font-medium text-gray-900">{user.team}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Info - только для менеджеров и владельца профиля */}
              {canViewFullProfile ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Финансовая информация</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Зарплата</span>
                        <span className="text-2xl font-bold text-green-600">${user.salary}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Бонус</span>
                        <span className="text-2xl font-bold text-blue-600">${user.bonus}</span>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Общий доход</span>
                        <span className="text-2xl font-bold text-orange-600">${user.salary + user.bonus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🔒 Доступ ограничен</h3>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                    <div className="text-4xl mb-2">🔐</div>
                    <p className="text-gray-600 text-sm">
                      Финансовая информация доступна только руководителям и владельцу профиля
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links - доступно всем */}
            {user.social && (user.social.telegram || user.social.linkedin) && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">🌐 Социальные сети</h3>
                <div className="flex space-x-4">
                  {user.social.telegram && (
                    <button
                      onClick={() => handleSocialClick('telegram', user.social.telegram!)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <span>📱</span>
                      <span>Telegram</span>
                    </button>
                  )}
                  {user.social.linkedin && (
                    <button
                      onClick={() => handleSocialClick('linkedin', user.social.linkedin!)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
                    >
                      <span>💼</span>
                      <span>LinkedIn</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Documents - только для менеджеров и владельца профиля */}
            {canViewFullProfile && user.documents && user.documents.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📁 Документы</h3>
                <div className="grid gap-3">
                  {user.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        📄
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.type}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents access restriction for non-managers */}
            {!canViewFullProfile && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📁 Документы</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                  <div className="text-4xl mb-2">🔒</div>
                  <p className="text-gray-600 text-sm">
                    Документы доступны только руководителям и владельцу профиля
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              if (currentUser) {
                // Возвращаемся на dashboard текущего пользователя
                window.location.href = '/dashboard';
              } else {
                // Fallback - возврат в браузере
                window.history.back();
              }
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            🏠 Вернуться в личный кабинет
          </button>
        </div>
      </div>
    </div>
  );
}
