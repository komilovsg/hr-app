// Локальные типы для backend
interface User {
  id: number;
  name: string;
  role: 'employee' | 'manager';
  team: string;
  email: string;
  phone: string;
  salary: number;
  bonus: number;
  avatar?: string; // URL аватарки
  social: {
    linkedin?: string;
    telegram?: string;
  };
  documents: Document[];
}

interface Document {
  id: number;
  name: string;
  type: 'passport' | 'contract' | 'other';
  uploadedAt: string;
}

// Новые типы для заявлений на отпуск
export interface VacationRequest {
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

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Иван Иванов",
    role: "employee",
    team: "frontend",
    email: "ivan@zinda.ai",
    phone: "+998901234567",
    salary: 1200,
    bonus: 200,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    social: {
      linkedin: "linkedin.com/ivan",
      telegram: "@ivan"
    },
    documents: [
      {
        id: 1,
        name: "Passport.pdf",
        type: "passport",
        uploadedAt: "2025-01-01T10:00:00Z"
      }
    ]
  },
  {
    id: 2,
    name: "Далер Алямов",
    role: "manager",
    team: "frontend",
    email: "daler@zinda.ai",
    phone: "+998901234568",
    salary: 2000,
    bonus: 400,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    social: {
      linkedin: "linkedin.com/@daler_alyamov",
      telegram: "@@daler_alyamov"
    },
    documents: [
      {
        id: 2,
        name: "Contract.pdf",
        type: "contract",
        uploadedAt: "2025-01-01T11:00:00Z"
      }
    ]
  },
  {
    id: 3,
    name: "Алексей Сидоров",
    role: "employee",
    team: "backend",
    email: "alex@zinda.ai",
    phone: "+998901234569",
    salary: 1500,
    bonus: 300,
    social: {
      linkedin: "linkedin.com/alex",
      telegram: "@alex"
    },
    documents: []
  },
  {
    id: 4,
    name: "Денис",
    role: "manager",
    team: "backend",
    email: "denis@zinda.ai",
    phone: "+998901234570",
    salary: 2200,
    bonus: 450,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    social: {
      linkedin: "linkedin.com/denis",
      telegram: "@denis"
    },
    documents: []
  }
];

// Mock данные для заявок на отпуск
export const mockVacationRequests: VacationRequest[] = [
  {
    id: 1,
    userId: 1,
    userName: "Иван Иванов",
    userTeam: "frontend",
    type: "vacation",
    reason: "Летний отпуск с семьей",
    startDate: "2025-07-15",
    endDate: "2025-07-30",
    status: "pending",
    managerId: 2,
    managerName: "Далер",
    createdAt: "2025-01-01T09:00:00Z",
    updatedAt: "2025-01-01T09:00:00Z"
  },
  {
    id: 2,
    userId: 3,
    userName: "Алексей Сидоров",
    userTeam: "backend",
    type: "sick",
    reason: "Болезнь",
    startDate: "2025-01-10",
    endDate: "2025-01-12",
    status: "approved",
    managerId: 4,
    managerName: "Денис",
    createdAt: "2025-01-08T10:00:00Z",
    updatedAt: "2025-01-09T14:00:00Z",
    managerComment: "Одобрено. Выздоравливайте!"
  },
  {
    id: 3,
    userId: 3,
    userName: "Алексей Сидоров",
    userTeam: "backend",
    type: "vacation",
    reason: "Отпуск по личным обстоятельствам",
    startDate: "2025-08-01",
    endDate: "2025-08-15",
    status: "pending",
    managerId: 4,
    managerName: "Денис",
    createdAt: "2025-01-15T11:00:00Z",
    updatedAt: "2025-01-15T11:00:00Z"
  }
];

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const findUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getTeamMembers = (team: string): User[] => {
  return mockUsers.filter(user => user.team === team);
};

export const getManagerByTeam = (team: string): User | undefined => {
  return mockUsers.find(user => user.role === 'manager' && user.team === team);
};

export const getVacationRequestsByUserId = (userId: number): VacationRequest[] => {
  return mockVacationRequests.filter(request => request.userId === userId);
};

export const getPendingVacationRequestsForManager = (managerId: number): VacationRequest[] => {
  return mockVacationRequests.filter(request => 
    request.managerId === managerId && request.status === 'pending'
  );
};

export const createVacationRequest = (requestData: Omit<VacationRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): VacationRequest => {
  const newRequest: VacationRequest = {
    ...requestData,
    id: Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockVacationRequests.push(newRequest);
  return newRequest;
};

export const updateVacationRequestStatus = (requestId: number, status: 'approved' | 'rejected', managerComment?: string): VacationRequest | null => {
  const request = mockVacationRequests.find(r => r.id === requestId);
  if (!request) return null;
  
  request.status = status;
  request.updatedAt = new Date().toISOString();
  if (managerComment) {
    request.managerComment = managerComment;
  }
  
  return request;
};
