import { User } from './user';
import { SessionInfo } from './session';
import { LoginRequest, CreateUserRequest, UpdateUserRequest } from './user';

export interface AuthState {
  user: User | null;
  session: SessionInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (userData: CreateUserRequest) => Promise<void>;
  updateProfile: (userData: UpdateUserRequest) => Promise<void>;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}

export interface AuthValidation {
  isValid: boolean;
  errors: AuthError[];
}
