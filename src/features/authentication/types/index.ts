export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  profileImage?: string;
  userType: UserType;
}

export enum UserType {
  TRAINER = 'trainer',
  STUDENT = 'student',
  ADMIN = 'admin',
}

export interface LoginCredentials {
  cpf: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: LoginResponse }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }; 