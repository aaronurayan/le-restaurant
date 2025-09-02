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
      
      // TODO: 실제 API 호출로 교체
      // const response = await authApi.login(credentials);
      
      // Mock login logic with role-based accounts
      const mockUsers = {
        'admin@lerestaurant.com': {
          id: 1,
          email: 'admin@lerestaurant.com',
          passwordHash: '',
          phoneNumber: '010-1234-5678',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin' as any,
          status: 'active' as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'manager@lerestaurant.com': {
          id: 2,
          email: 'manager@lerestaurant.com',
          passwordHash: '',
          phoneNumber: '010-2345-6789',
          firstName: 'Manager',
          lastName: 'User',
          role: 'manager' as any,
          status: 'active' as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'customer@lerestaurant.com': {
          id: 3,
          email: 'customer@lerestaurant.com',
          passwordHash: '',
          phoneNumber: '010-3456-7890',
          firstName: 'Customer',
          lastName: 'User',
          role: 'customer' as any,
          status: 'active' as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      const mockUser = mockUsers[credentials.email as keyof typeof mockUsers];
      
      if (!mockUser || credentials.password !== 'password123') {
        throw new Error('Invalid credentials');
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: mockToken, expiresAt: mockExpiresAt }
      });
      
      // localStorage에 저장
      localStorage.setItem('auth', JSON.stringify({
        user: mockUser,
        token: mockToken,
        expiresAt: mockExpiresAt
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
      
      // TODO: 실제 API 호출로 교체
      // const response = await authApi.register(userData);
      
      // 임시 회원가입 로직 (테스트용)
      const mockUser: User = {
        id: Date.now(),
        email: userData.email,
        passwordHash: '',
        phoneNumber: userData.phoneNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'customer' as any,
        status: userData.status || 'active' as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: mockUser, token: mockToken, expiresAt: mockExpiresAt }
      });
      
      // localStorage에 저장
      localStorage.setItem('auth', JSON.stringify({
        user: mockUser,
        token: mockToken,
        expiresAt: mockExpiresAt
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
