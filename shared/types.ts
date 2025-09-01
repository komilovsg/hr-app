export interface User {
  id: number;
  name: string;
  role: UserRole;
  team: string;
  email: string;
  phone: string;
  salary: number;
  bonus: number;
  social: SocialLinks;
  documents: Document[];
}

export type UserRole = 'employee' | 'manager';

export interface SocialLinks {
  linkedin?: string;
  telegram?: string;
}

export interface Document {
  id: number;
  name: string;
  type: DocumentType;
  uploadedAt: string;
  url?: string;
}

export type DocumentType = 'passport' | 'contract' | 'other';

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Permissions {
  viewOwnSalary: boolean;
  viewOwnBonus: boolean;
  viewTeamContacts: boolean;
  viewOtherSalary: boolean;
  viewOwnDocuments: boolean;
  uploadDocuments: boolean;
  viewTeamDocuments: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permissions> = {
  employee: {
    viewOwnSalary: true,
    viewOwnBonus: true,
    viewTeamContacts: true,
    viewOtherSalary: false,
    viewOwnDocuments: true,
    uploadDocuments: true,
    viewTeamDocuments: false,
  },
  manager: {
    viewOwnSalary: true,
    viewOwnBonus: true,
    viewTeamContacts: true,
    viewOtherSalary: true,
    viewOwnDocuments: true,
    uploadDocuments: true,
    viewTeamDocuments: true,
  },
};
