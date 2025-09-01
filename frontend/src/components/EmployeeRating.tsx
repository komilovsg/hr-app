'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, EmployeeRating as EmployeeRatingType } from '@hr-app/shared';
import AvatarDisplay from './AvatarDisplay';

interface EmployeeRatingProps {
  employee: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeRating({ employee, isOpen, onClose }: EmployeeRatingProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [existingRating, setExistingRating] = useState<EmployeeRatingType | null>(null);
  const [loading, setLoading] = useState(false);
  const [characteristic, setCharacteristic] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadExistingRating();
      generateCharacteristic();
    }
  }, [isOpen, employee.id]);

  const loadExistingRating = async () => {
    try {
      const response = await axios.get(`/api/users/${employee.id}/rating`);
      const ratingData = response.data;
      setExistingRating(ratingData);
      setRating(ratingData.rating);
      setComment(ratingData.comment);
    } catch (error) {
      console.error('Error loading rating:', error);
      // Если рейтинг не найден, оставляем как есть
    }
  };

  const generateCharacteristic = () => {
    // Автоматическая генерация характеристики на основе данных сотрудника
    const baseSalary = employee.salary;
    const bonus = employee.bonus;
    const team = employee.team;
    
    let characteristicText = '';
    
    if (bonus > baseSalary * 0.3) {
      characteristicText += 'Высокопроизводительный сотрудник с отличными результатами. ';
    } else if (bonus > baseSalary * 0.15) {
      characteristicText += 'Хороший сотрудник, стабильно выполняющий свои обязанности. ';
    } else {
      characteristicText += 'Сотрудник, работающий в соответствии с базовыми требованиями. ';
    }
    
    characteristicText += `Работает в команде ${team}, демонстрирует командный дух. `;
    characteristicText += 'Проявляет инициативу в решении задач и готов к развитию.';
    
    setCharacteristic(characteristicText);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (existingRating) {
        // Обновляем существующую оценку
        console.log('Updating rating:', { rating, comment });
        // Здесь будет API запрос для обновления
      } else {
        // Создаем новую оценку
        console.log('Creating new rating:', { rating, comment });
        // Здесь будет API запрос для создания
      }
      
      // Обновляем характеристику
      generateCharacteristic();
      
      onClose();
    } catch (error) {
      console.error('Error saving rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      console.log('Deleting rating');
      // Здесь будет API запрос для удаления
      
      setExistingRating(null);
      setRating(5);
      setComment('');
      generateCharacteristic();
      
      onClose();
    } catch (error) {
      console.error('Error deleting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">⭐ Оценка сотрудника</h2>
              <p className="text-orange-100 mt-1">Управление рейтингом и характеристикой</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Employee Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <AvatarDisplay userName={employee.name} size="lg" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-gray-600">{employee.email}</p>
                <p className="text-gray-500">{employee.team} Team</p>
              </div>
            </div>
          </div>

          {/* Rating Form */}
          <div className="space-y-6">
            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Оценка (1-10):
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                      star <= rating
                        ? 'bg-yellow-400 border-yellow-500 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Текущая оценка: <span className="font-semibold">{rating}/10</span>
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Комментарий:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Опишите ваше мнение о сотруднике..."
              />
            </div>

            {/* Auto-generated Characteristic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Автоматическая характеристика:
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{characteristic}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Характеристика генерируется автоматически на основе данных сотрудника
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {existingRating ? 'Измените оценку или удалите её' : 'Создайте новую оценку'}
            </div>
            
            <div className="flex space-x-3">
              {existingRating && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  🗑️ Удалить
                </button>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg font-medium transition-colors duration-200"
              >
                {loading ? '⏳ Сохранение...' : existingRating ? '✏️ Обновить' : '💾 Сохранить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
