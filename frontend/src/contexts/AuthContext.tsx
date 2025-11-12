import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthContextType, AuthState } from '../types/auth';
import { User, LoginRequest, CreateUserRequest, UpdateUserRequest } from '../types/user';

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true
};

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; expiresAt: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string; expiresAt: string } }
  | { type: 'REGISTER_FAILURE' }
  | { type: 'UPDATE_PROFILE'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        session: {
          token: action.payload.token,
          expiresAt: action.payload.expiresAt,
          user: action.payload.user
        },
        isAuthenticated: true,
        isLoading: false
      };
    
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false
      };
    
    case 'REGISTER_START':
      return { ...state, isLoading: true };
    
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        session: {
          token: action.payload.token,
          expiresAt: action.payload.expiresAt,
          user: action.payload.user
        },
        isAuthenticated: true,
        isLoading: false
      };
    
    case 'REGISTER_FAILURE':
      return { ...state, isLoading: false };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: action.payload,
        session: state.session ? {
          ...state.session,
          user: action.payload
        } : null
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // 실제 API 호출
      const { apiClient } = await import('../services/apiClient.unified');
      const { API_ENDPOINTS } = await import('../config/api.config');
      
      const res = await fetch(`${apiClient.getBaseUrl()}${API_ENDPOINTS.auth.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(errorData.error || 'Invalid credentials');
      }

      const data = await res.json();
      const user = data.user;
      
      // UserDto를 User 타입으로 변환
      const authUser: User = {
        id: user.id,
        email: user.email,
        passwordHash: '',
        phoneNumber: user.phoneNumber || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'customer',
        status: user.status || 'active',
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString()
      };
      
      const token = data.token || 'mock-token-' + Date.now();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: authUser, token, expiresAt }
      });
      
      // localStorage에 저장
      localStorage.setItem('auth', JSON.stringify({
        user: authUser,
        token,
        expiresAt
      }));
      
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = (): void => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('auth');
  };

  const register = async (userData: CreateUserRequest): Promise<void> => {
    try {
      dispatch({ type: 'REGISTER_START' });
      
      // 실제 API 호출
      const { apiClient } = await import('../services/apiClient.unified');
      const { API_ENDPOINTS } = await import('../config/api.config');
      
      const res = await fetch(`${apiClient.getBaseUrl()}${API_ENDPOINTS.auth.register}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          phoneNumber: userData.phoneNumber,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'CUSTOMER'
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(errorData.error || 'Registration failed');
      }

      const user = await res.json();
      
      // UserDto를 User 타입으로 변환
      const authUser: User = {
        id: user.id,
        email: user.email,
        passwordHash: '',
        phoneNumber: user.phoneNumber || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'customer',
        status: user.status || 'active',
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString()
      };
      
      const token = 'mock-token-' + Date.now();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: authUser, token, expiresAt }
      });
      
      // localStorage에 저장
      localStorage.setItem('auth', JSON.stringify({
        user: authUser,
        token,
        expiresAt
      }));
      
    } catch (error) {
      console.error('Registration failed:', error);
      dispatch({ type: 'REGISTER_FAILURE' });
      throw error;
    }
  };

  const updateProfile = async (userData: UpdateUserRequest): Promise<void> => {
    try {
      if (!state.user) throw new Error('User not authenticated');
      
      // TODO: 실제 API 호출로 교체
      // const response = await authApi.updateProfile(state.user.id, userData);
      
      // 임시 업데이트 로직 (테스트용)
      const updatedUser: User = {
        ...state.user,
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
      
      // localStorage 업데이트
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        parsed.user = updatedUser;
        localStorage.setItem('auth', JSON.stringify(parsed));
      }
      
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  // 컴포넌트 마운트 시 localStorage에서 인증 정보 복원
  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const { user, token, expiresAt } = parsed;
        
        // 토큰 만료 확인
        if (new Date(expiresAt) > new Date()) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token, expiresAt }
          });
        } else {
          // 만료된 토큰 제거
          localStorage.removeItem('auth');
        }
      } catch (error) {
        console.error('Failed to restore auth from localStorage:', error);
        localStorage.removeItem('auth');
      }
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
