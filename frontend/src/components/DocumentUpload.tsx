'use client';

import { useState } from 'react';

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: { name: string; type: string; file: File }) => void;
}

export default function DocumentUpload({ isOpen, onClose, onUpload }: DocumentUploadProps) {
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('other');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentName.trim() || !selectedFile) {
      return;
    }

    setIsUploading(true);
    
    try {
       onUpload({
        name: documentName,
        type: documentType,
        file: selectedFile
      });
      
      // Сброс формы
      setDocumentName('');
      setDocumentType('other');
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Автоматически устанавливаем имя документа из имени файла
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Загрузить документ</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название документа */}
            <div>
              <label htmlFor="documentName" className="block text-sm font-medium text-gray-700 mb-2">
                Название документа
              </label>
              <input
                id="documentName"
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите название документа"
                required
              />
            </div>

            {/* Тип документа */}
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                Тип документа
              </label>
              <select
                id="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="passport">Паспорт</option>
                <option value="contract">Контракт</option>
                <option value="other">Другое</option>
              </select>
            </div>

            {/* Выбор файла */}
            <div>
              <label htmlFor="documentFile" className="block text-sm font-medium text-gray-700 mb-2">
                Файл
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  id="documentFile"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required
                />
                <label htmlFor="documentFile" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{selectedFile.name}</div>
                      <div className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        Нажмите для выбора файла
                      </div>
                      <div className="text-xs text-gray-500">
                        PDF, DOC, DOCX, JPG, PNG (макс. 10 MB)
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!documentName.trim() || !selectedFile || isUploading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
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
                  'Загрузить'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
