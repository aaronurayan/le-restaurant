import { useState, useEffect, useCallback } from 'react';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user';
import { userApi } from '../services/api';

// API 상태 타입
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// API 훅 기본 설정
function useApiState<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, loading: false, error }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, loading: false, data, error: null }));
  }, []);

  return { state, setLoading, setError, setData };
}

// 사용자 API 훅
export const useUserApi = () => {
  const { state, setLoading, setError, setData } = useApiState<User[]>();
  const [users, setUsers] = useState<User[]>([]);

  // 모든 사용자 조회
  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApi.getAllUsers();
      setUsers(data);
      setData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Failed to fetch users:', error);
    }
  }, [setLoading, setData, setError]);

  // 사용자 생성
  const createUser = useCallback(async (userData: CreateUserRequest) => {
    try {
      setLoading(true);
      const newUser = await userApi.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      setError(errorMessage);
      console.error('Failed to create user:', error);
      throw error;
    }
  }, [setLoading, setError]);

  // 사용자 정보 업데이트
  const updateUser = useCallback(async (id: number, userData: UpdateUserRequest) => {
    try {
      setLoading(true);
      const updatedUser = await userApi.updateUser(id, userData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      setError(errorMessage);
      console.error('Failed to update user:', error);
      throw error;
    }
  }, [setLoading, setError]);

  // 사용자 상태 변경
  const updateUserStatus = useCallback(async (id: number, status: string) => {
    try {
      setLoading(true);
      const updatedUser = await userApi.updateUserStatus(id, status);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user status';
      setError(errorMessage);
      console.error('Failed to update user status:', error);
      throw error;
    }
  }, [setLoading, setError]);

  // 사용자 삭제
  const deleteUser = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await userApi.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      setError(errorMessage);
      console.error('Failed to delete user:', error);
      throw error;
    }
  }, [setLoading, setError]);

  // 역할별 사용자 조회
  const getUsersByRole = useCallback(async (role: string) => {
    try {
      setLoading(true);
      const data = await userApi.getUsersByRole(role);
      setUsers(data);
      setData(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users by role';
      setError(errorMessage);
      console.error('Failed to fetch users by role:', error);
      throw error;
    }
  }, [setLoading, setData, setError]);

  // 활성 사용자만 조회
  const getActiveUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApi.getActiveUsers();
      setUsers(data);
      setData(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active users';
      setError(errorMessage);
      console.error('Failed to fetch active users:', error);
      throw error;
    }
  }, [setLoading, setData, setError]);

  // 이름으로 사용자 검색
  const searchUsersByName = useCallback(async (keyword: string) => {
    try {
      setLoading(true);
      const data = await userApi.searchUsersByName(keyword);
      setUsers(data);
      setData(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search users';
      setError(errorMessage);
      console.error('Failed to search users:', error);
      throw error;
    }
  }, [setLoading, setData, setError]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return {
    users,
    loading: state.loading,
    error: state.error,
    fetchAllUsers,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    getUsersByRole,
    getActiveUsers,
    searchUsersByName,
  };
};
