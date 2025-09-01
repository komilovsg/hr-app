'use client';

interface VacationRequest {
  id: number;
  userId: number;
  userName: string;
  userTeam: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  reason: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  managerId?: number;
  managerName?: string;
  createdAt: string;
  updatedAt: string;
  managerComment?: string;
}

interface VacationRequestsListProps {
  requests: VacationRequest[];
  userRole: 'employee' | 'manager';
  onStatusUpdate?: (requestId: number, status: 'approved' | 'rejected', comment?: string) => void;
}

export default function VacationRequestsList({ requests, userRole, onStatusUpdate }: VacationRequestsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'На рассмотрении';
      case 'approved':
        return 'Одобрено';
      case 'rejected':
        return 'Отклонено';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'Ежегодный отпуск';
      case 'sick':
        return 'Больничный';
      case 'personal':
        return 'Личные дела';
      case 'other':
        return 'Другое';
      default:
        return type;
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg mb-2">Заявки на отпуск отсутствуют</p>
        <p className="text-gray-400">Создайте первую заявку на отпуск</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
                <span className="text-sm text-gray-500">
                  {getTypeText(request.type)}
                </span>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                {request.userName}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Команда: {request.userTeam}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-gray-700 text-sm">{request.reason}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Начало:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(request.startDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Окончание:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(request.endDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
              
              {request.managerComment && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Комментарий менеджера:</span> {request.managerComment}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Создано: {new Date(request.createdAt).toLocaleDateString('ru-RU')}
            </div>
            
            {userRole === 'manager' && request.status === 'pending' && onStatusUpdate && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onStatusUpdate(request.id, 'approved')}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-medium transition-colors duration-200"
                >
                  Одобрить
                </button>
                <button
                  onClick={() => {
                    const comment = prompt('Введите комментарий (необязательно):');
                    onStatusUpdate(request.id, 'rejected', comment || undefined);
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg font-medium transition-colors duration-200"
                >
                  Отклонить
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
