'use client';

import { useState, useRef } from 'react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  userName: string;
  onAvatarChange: (avatarUrl: string) => void;
}

export default function AvatarModal({ isOpen, onClose, currentAvatar, userName, onAvatarChange }: AvatarModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    // Создаем preview и загружаем
    const reader = new FileReader();
    reader.onload = async (event) => {
      const avatarUrl = event.target?.result as string;
      
      setIsUploading(true);
      try {
        // В реальном приложении здесь будет загрузка файла на сервер
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onAvatarChange(avatarUrl);
        onClose();
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Ошибка загрузки аватарки');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    onAvatarChange('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Управление аватаркой</h3>
            <p className="text-gray-600 mt-1">Настройте свой профиль</p>
          </div>

          {/* Current Avatar Display */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-white shadow-lg mx-auto">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={`Аватар ${userName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">{userName}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Загрузка...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Загрузить новую аватарку
                </>
              )}
            </button>

            {/* Remove Avatar Button (only if avatar exists) */}
            {currentAvatar && (
              <button
                onClick={handleRemoveAvatar}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Убрать аватарку
              </button>
            )}

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
            >
              Отмена
            </button>
          </div>

          {/* File Input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Требования к файлу:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Форматы: JPG, PNG, GIF</li>
              <li>• Максимальный размер: 5MB</li>
              <li>• Рекомендуемое разрешение: 200x200 пикселей</li>
              <li>• Квадратное изображение будет автоматически обрезано</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
