'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, Document } from '@hr-app/shared';
import DocumentUpload from '@/components/DocumentUpload';
import VacationRequestForm from '@/components/VacationRequestForm';
import VacationRequestsList from '@/components/VacationRequestsList';
import AvatarDisplay from '@/components/AvatarDisplay';
import AvatarModal from '@/components/AvatarModal';
import TeamButton from '@/components/TeamButton';

interface VacationRequestLocal {
  id: number;
  userId: number;
  userName: string;
  userTeam: string;
  type: 'vacation' | 'sick';
  reason: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  managerId: number;
  managerName: string;
  createdAt: string;
  updatedAt: string;
  managerComment?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showVacationForm, setShowVacationForm] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [vacationRequests, setVacationRequests] = useState<VacationRequestLocal[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      loadVacationRequests(userObj);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadVacationRequests = async (userObj: User) => {
    try {
      // Загружаем заявки пользователя
      const userRequestsResponse = await fetch(`/api/vacation/requests?userId=${userObj.id}`);
      if (userRequestsResponse.ok) {
        const userRequestsData = await userRequestsResponse.json();
        setVacationRequests(userRequestsData.data || []);
      }

      // Если пользователь менеджер, загружаем pending заявки
      if (userObj.role === 'manager') {
        const pendingResponse = await fetch(`/api/vacation/pending?managerId=${userObj.id}`);
        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json();
          // Assuming pendingData.data is an array of VacationRequestLocal
          setVacationRequests(prev => [...prev, ...(pendingData.data || [])]);
        }
      }
    } catch (error) {
      console.error('Error loading vacation requests:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSocialClick = (type: 'telegram' | 'linkedin', value: string) => {
    if (type === 'telegram') {
      // Открываем Telegram чат
      window.open(`https://t.me/${value.replace('@', '')}`, '_blank');
    } else if (type === 'linkedin') {
      // Открываем LinkedIn профиль
      window.open(`https://${value}`, '_blank');
    }
  };

  const handleDocumentUpload = async (documentData: { name: string; type: string; file: File }) => {
    if (!user) return;

    try {
      // В реальном приложении здесь будет загрузка файла на сервер
      const newDocument = {
        id: Date.now(),
        name: documentData.name,
        type: documentData.type as 'passport' | 'contract' | 'other',
        uploadedAt: new Date().toISOString(),
      };

      // Обновляем локальное состояние
      const updatedUser = {
        ...user,
        documents: [...user.documents, newDocument]
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Здесь можно добавить уведомление об успешной загрузке
      console.log('Document uploaded successfully:', newDocument);
    } catch (error) {
      console.error('Upload failed:', error);
      // Здесь можно добавить уведомление об ошибке
    }
  };

  const handleVacationRequest = async (requestData: {
    type: string;
    reason: string;
    startDate: string;
    endDate: string;
  }) => {
    if (!user) return;

    try {
      const response = await fetch('/api/vacation/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...requestData
        }),
      });

      if (response.ok) {
        const newRequest = await response.json();
        setVacationRequests(prev => [newRequest.data, ...prev]);
        
        // Если пользователь менеджер, обновляем pending заявки
        if (user.role === 'manager') {
          // Assuming newRequest.data is a VacationRequestLocal
          setVacationRequests(prev => [newRequest.data, ...prev]);
        }
        
        console.log('Vacation request created successfully:', newRequest.data);
      } else {
        console.error('Failed to create vacation request');
      }
    } catch (error) {
      console.error('Error creating vacation request:', error);
    }
  };

  const handleVacationStatusUpdate = async (requestId: number, status: 'approved' | 'rejected', comment?: string) => {
    try {
      const response = await fetch(`/api/vacation/request/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, managerComment: comment }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        
        // Обновляем списки
        setVacationRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest.data : req)
        );
        // Assuming updatedRequest.data is a VacationRequestLocal
        setVacationRequests(prev => 
          prev.filter(req => req.id !== requestId)
        );
        
        console.log('Vacation request status updated:', updatedRequest.data);
      } else {
        console.error('Failed to update vacation request status');
      }
    } catch (error) {
      console.error('Error updating vacation request status:', error);
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      avatar: avatarUrl
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const roleColor = user.role === 'manager' ? 'manager' : 'employee';
  const roleText = user.role === 'manager' ? 'Менеджер' : 'Сотрудник';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HR</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                HR System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* User Avatar in Header */}
                <AvatarDisplay
                  avatar={user.avatar}
                  userName={user.name}
                  size="sm"
                  onClick={() => setShowAvatarModal(true)}
                />
                <span className="text-gray-700 font-medium">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="text-center">
                <AvatarDisplay
                  avatar={user.avatar}
                  userName={user.name}
                  size="lg"
                  onClick={() => setShowAvatarModal(true)}
                  className="mx-auto mb-6"
                />
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold bg-${roleColor}-100 text-${roleColor}-800 border border-${roleColor}-200`}>
                  {roleText}
                </span>
                <p className="text-gray-600 mt-3 font-medium">{user.team}</p>
                
                {/* Team Button */}
                <div className="mt-6">
                  <TeamButton user={user} />
                </div>

                {/* Documents Section */}
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium text-gray-900">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Телефон</div>
                    <div className="font-medium text-gray-900">{user.phone}</div>
                  </div>
                </div>

                {/* Social Links */}
                {(user.social.telegram || user.social.linkedin) && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500 mb-3 text-center">Социальные сети</div>
                    <div className="flex justify-center space-x-3">
                      {user.social.telegram && (
                        <button
                          onClick={() => handleSocialClick('telegram', user.social.telegram!)}
                          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                          title="Открыть Telegram"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        </button>
                      )}
                      {user.social.linkedin && (
                        <button
                          onClick={() => handleSocialClick('linkedin', user.social.linkedin!)}
                          className="w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                          title="Открыть LinkedIn"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Salary Info */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                Зарплата и бонусы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-green-600 font-medium">Зарплата</div>
                      <div className="text-3xl font-bold text-green-900">${user.salary.toLocaleString()}</div>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-blue-600 font-medium">Бонус</div>
                      <div className="text-3xl font-bold text-blue-900">${user.bonus.toLocaleString()}</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vacation Requests */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Заявки на отпуск
                </h3>
                <button 
                  onClick={() => setShowVacationForm(true)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Новая заявка
                </button>
              </div>
              
              <VacationRequestsList
                requests={vacationRequests}
                userRole={user.role}
                onStatusUpdate={user.role === 'manager' ? handleVacationStatusUpdate : undefined}
              />
            </div>

            {/* Pending Requests for Managers */}
            {user.role === 'manager' && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  Заявки на рассмотрении
                </h3>
                
                <VacationRequestsList
                  requests={vacationRequests.filter(req => req.status === 'pending')}
                  userRole="manager"
                  onStatusUpdate={handleVacationStatusUpdate}
                />
              </div>
            )}

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Документы
                </h3>
                <button 
                  onClick={() => setShowDocumentUpload(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить
                </button>
              </div>
              
              {user.documents.length > 0 ? (
                <div className="space-y-3">
                  {user.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{doc.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleDateString('ru-RU')}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">Документы не загружены</p>
                  <p className="text-gray-400">Нажмите "Добавить" чтобы загрузить первый документ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Document Upload Modal */}
      <DocumentUpload
        isOpen={showDocumentUpload}
        onClose={() => setShowDocumentUpload(false)}
        onUpload={handleDocumentUpload}
      />

      {/* Vacation Request Modal */}
      <VacationRequestForm
        isOpen={showVacationForm}
        onClose={() => setShowVacationForm(false)}
        onSubmit={handleVacationRequest}
      />

      {/* Avatar Modal */}
      <AvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={user?.avatar}
        userName={user?.name || ''}
        onAvatarChange={handleAvatarChange}
      />
    </div>
  );
}
