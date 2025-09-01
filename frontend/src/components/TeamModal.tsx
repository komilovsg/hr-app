'use client';

import { useState } from 'react';
import { User } from '@hr-app/shared';
import AvatarDisplay from './AvatarDisplay';
import EmployeeRating from '@/components/EmployeeRating';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: User[];
  currentUser: User;
  teamName: string;
}

export default function TeamModal({ isOpen, onClose, teamMembers, currentUser, teamName }: TeamModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [showRating, setShowRating] = useState(false);

  if (!isOpen) return null;

  const handleEmployeeClick = (employee: User) => {
    // Открываем страницу профиля сотрудника в новой вкладке
    window.open(`/profile/${employee.id}`, '_blank');
  };

  const handleRatingClick = (employee: User) => {
    setSelectedEmployee(employee);
    setShowRating(true);
  };

  const isManager = currentUser.role === 'manager';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">👥 Команда {teamName}</h2>
              <p className="text-blue-100 mt-1">
                {teamMembers.filter(member => member.id !== currentUser.id).length} {teamMembers.filter(member => member.id !== currentUser.id).length === 1 ? 'участник' : 'участников'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid gap-4">
            {teamMembers
              .filter(member => member.id !== currentUser.id) // Исключаем текущего пользователя
              .map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <AvatarDisplay userName={member.name} size="md" />
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.role === 'manager' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {member.role === 'manager' ? 'Team Lead' : 'Сотрудник'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-1">{member.email}</p>
                    <p className="text-gray-500 text-sm">{member.phone}</p>
                    
                    {/* Salary info for managers only */}
                    {isManager && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Зарплата:</span> ${member.salary} | 
                        <span className="font-medium ml-2">Бонус:</span> ${member.bonus}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleEmployeeClick(member)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>👤</span>
                      <span>Профиль</span>
                    </button>
                    
                    {/* Rating button for managers */}
                    {isManager && member.role === 'employee' && (
                      <button
                        onClick={() => handleRatingClick(member)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                      >
                        <span>⭐</span>
                        <span>Оценить</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            💡 Кликните на "Профиль" для перехода к странице сотрудника
            {isManager && ' | Используйте "Оценить" для управления рейтингом'}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && selectedEmployee && (
        <EmployeeRating
          employee={selectedEmployee}
          isOpen={showRating}
          onClose={() => {
            setShowRating(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
}
