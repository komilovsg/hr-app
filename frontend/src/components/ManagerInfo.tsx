'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '@hr-app/shared';
import AvatarDisplay from './AvatarDisplay';

interface ManagerInfoProps {
  userTeam: string;
  userId: number;
}

export default function ManagerInfo({ userTeam, userId }: ManagerInfoProps) {
  const [manager, setManager] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        setLoading(true);
        // Получаем всех пользователей и находим руководителя команды
        const response = await axios.get('/api/users');
        const teamManager = response.data.find((user: User) => 
          user.role === 'manager' && user.team === userTeam
        );
        
        if (teamManager) {
          setManager(teamManager);
        } else {
          setError('Руководитель команды не найден');
        }
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки информации о руководителе');
        console.error('Error fetching manager:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, [userTeam]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          👨‍💼 Мой Team Lead
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !manager) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          👨‍💼 Мой Team Lead
        </h3>
        <div className="text-red-500 text-center py-4">
          {error || 'Руководитель не найден'}
        </div>
      </div>
    );
  }

  const handleManagerClick = () => {
    // Открываем профиль руководителя в новой вкладке
    window.open(`/api/users/${manager.id}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        👨‍💼 Мой Team Lead
      </h3>
      
      <div 
        className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer border border-blue-200"
        onClick={handleManagerClick}
      >
        <div className="flex items-center space-x-4">
          <AvatarDisplay userName={manager.name} size="lg" />
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-lg">{manager.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{manager.email}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-700">
              <span className="flex items-center">
                📱 {manager.phone}
              </span>
              <span className="flex items-center">
                🏷️ {manager.team} Team
              </span>
            </div>
            
            {manager.social && (
              <div className="flex items-center space-x-3 mt-3">
                {manager.social.telegram && (
                  <a
                    href={`https://t.me/${manager.social.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    📱 Telegram
                  </a>
                )}
                {manager.social.linkedin && (
                  <a
                    href={`https://${manager.social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    💼 LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
              Team Lead
            </div>
            <div className="text-xs text-gray-500">
              Кликните для просмотра профиля
            </div>
            <div className="text-blue-500 mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Кликните на карточку для перехода к профилю руководителя
      </div>
    </div>
  );
}
