'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '@hr-app/shared';
import AvatarDisplay from './AvatarDisplay';

interface SubordinatesListProps {
  managerId: number;
  managerTeam: string;
}

export default function SubordinatesList({ managerId, managerTeam }: SubordinatesListProps) {
  const [subordinates, setSubordinates] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubordinates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/manager/${managerId}/subordinates`);
        setSubordinates(response.data);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки списка подчиненных');
        console.error('Error fetching subordinates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubordinates();
  }, [managerId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          👥 Моя команда ({managerTeam})
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          👥 Моя команда ({managerTeam})
        </h3>
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        👥 Моя команда ({managerTeam})
      </h3>
      
      {subordinates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">👥</div>
          <p>У вас пока нет подчиненных</p>
        </div>
      ) : (
        <div className="space-y-4">
          {subordinates.map((subordinate) => (
            <div
              key={subordinate.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              onClick={() => window.open(`/api/users/${subordinate.id}`, '_blank')}
            >
              <AvatarDisplay userName={subordinate.name} size="md" />
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{subordinate.name}</h4>
                <p className="text-sm text-gray-600">{subordinate.email}</p>
                <p className="text-xs text-gray-500">
                  Зарплата: ${subordinate.salary} | Бонус: ${subordinate.bonus}
                </p>
              </div>
              
              <div className="text-right">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {subordinate.role}
                </div>
                <p className="text-xs text-gray-500 mt-1">{subordinate.team}</p>
              </div>
              
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Кликните на сотрудника для просмотра детальной информации
      </div>
    </div>
  );
}
