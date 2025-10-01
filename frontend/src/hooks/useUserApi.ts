import { useState } from 'react';
import { User, UserRole, UserStatus } from '../types/user';

// User API 함수들 (백엔드 API 연동)
const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch('http://localhost:8080/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },
  
  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`http://localhost:8080/api/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },
  
  getUserByEmail: async (email: string): Promise<User> => {
    const response = await fetch(`http://localhost:8080/api/users/email/${email}`);
    if (!response.ok) throw new Error('Failed to fetch user by email');
    return response.json();
  },
  
  getUsersByRole: async (role: UserRole): Promise<User[]> => {
    const response = await fetch(`http://localhost:8080/api/users/role/${role}`);
    if (!response.ok) throw new Error('Failed to fetch users by role');
    return response.json();
  },
  
  getUsersByStatus: async (status: UserStatus): Promise<User[]> => {
    const response = await fetch(`http://localhost:8080/api/users/status/${status}`);
    if (!response.ok) throw new Error('Failed to fetch users by status');
    return response.json();
  },
  
  createUser: async (userData: any): Promise<User> => {
    const response = await fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },
  
  updateUser: async (id: number, userData: any): Promise<User> => {
    const response = await fetch(`http://localhost:8080/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },
  
  updateUserStatus: async (id: number, status: UserStatus): Promise<User> => {
    const response = await fetch(`http://localhost:8080/api/users/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update user status');
    return response.json();
  },
  
  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`http://localhost:8080/api/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },
  
  checkEmailExists: async (email: string): Promise<boolean> => {
    const response = await fetch(`http://localhost:8080/api/users/exists/${email}`);
    if (!response.ok) throw new Error('Failed to check email');
    const data = await response.json();
    return data.exists;
  },
};

export const useUserApi = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // 백엔드 연결 상태 확인
  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/test');
      if (response.ok) {
        setIsBackendConnected(true);
        return true;
      }
    } catch (error) {
      console.warn('Backend not connected, using mock data');
    }
    setIsBackendConnected(false);
    return false;
  };

  // Mock users data (백엔드 연결 실패 시 사용)
  const mockUsers: User[] = [
    {
      id: 1,
      email: 'admin@restaurant.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      phoneNumber: '+1234567890',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      lastLogin: '2024-01-15T09:30:00Z',
      profileImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      email: 'manager@restaurant.com',
      firstName: 'Manager',
      lastName: 'User',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      phoneNumber: '+1234567891',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      lastLogin: '2024-01-15T09:00:00Z',
      profileImageUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      email: 'customer1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      phoneNumber: '+1234567892',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      lastLogin: '2024-01-15T08:30:00Z',
      profileImageUrl: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      email: 'customer2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      phoneNumber: '+1234567893',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      lastLogin: '2024-01-15T07:45:00Z',
      profileImageUrl: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      email: 'inactive@example.com',
      firstName: 'Inactive',
      lastName: 'User',
      role: UserRole.CUSTOMER,
      status: UserStatus.INACTIVE,
      phoneNumber: '+1234567894',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z',
      lastLogin: '2024-01-10T10:00:00Z',
      profileImageUrl: undefined
    }
  ];

  // 모든 사용자 조회
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const data = await userApi.getAllUsers();
        setUsers(data);
      } else {
        setUsers(mockUsers);
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  // 역할별 사용자 조회
  const loadUsersByRole = async (role: UserRole) => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const data = await userApi.getUsersByRole(role);
        setUsers(data);
      } else {
        const filteredUsers = mockUsers.filter(u => u.role === role);
        setUsers(filteredUsers);
      }
    } catch (err) {
      setError('Failed to load users by role');
      console.error('Error loading users by role:', err);
      const filteredUsers = mockUsers.filter(u => u.role === role);
      setUsers(filteredUsers);
    } finally {
      setLoading(false);
    }
  };

  // 상태별 사용자 조회
  const loadUsersByStatus = async (status: UserStatus) => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const data = await userApi.getUsersByStatus(status);
        setUsers(data);
      } else {
        const filteredUsers = mockUsers.filter(u => u.status === status);
        setUsers(filteredUsers);
      }
    } catch (err) {
      setError('Failed to load users by status');
      console.error('Error loading users by status:', err);
      const filteredUsers = mockUsers.filter(u => u.status === status);
      setUsers(filteredUsers);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 생성
  const createUser = async (userData: any) => {
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const newUser = await userApi.createUser(userData);
        setUsers(prev => [...prev, newUser]);
        return newUser;
      } else {
        // Mock data에 추가
        const newUser: User = {
          id: Math.max(...mockUsers.map(u => u.id)) + 1,
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUsers(prev => [...prev, newUser]);
        return newUser;
      }
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
      throw err;
    }
  };

  // 사용자 업데이트
  const updateUser = async (id: number, userData: any) => {
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const updatedUser = await userApi.updateUser(id, userData);
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
        return updatedUser;
      } else {
        // Mock data 업데이트
        setUsers(prev => prev.map(u => 
          u.id === id 
            ? { ...u, ...userData, updatedAt: new Date().toISOString() }
            : u
        ));
        return { ...mockUsers.find(u => u.id === id)!, ...userData };
      }
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
      throw err;
    }
  };

  // 사용자 상태 업데이트
  const updateUserStatus = async (id: number, status: UserStatus) => {
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const updatedUser = await userApi.updateUserStatus(id, status);
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
        return updatedUser;
      } else {
        // Mock data 업데이트
        setUsers(prev => prev.map(u => 
          u.id === id 
            ? { ...u, status, updatedAt: new Date().toISOString() }
            : u
        ));
        return { ...mockUsers.find(u => u.id === id)!, status };
      }
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error updating user status:', err);
      throw err;
    }
  };

  // 사용자 삭제
  const deleteUser = async (id: number) => {
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        await userApi.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        // Mock data에서 삭제
        setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  // 이메일 중복 확인
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        return await userApi.checkEmailExists(email);
      } else {
        return mockUsers.some(u => u.email === email);
      }
    } catch (err) {
      console.error('Error checking email:', err);
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    isBackendConnected,
    loadUsers,
    loadUsersByRole,
    loadUsersByStatus,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    checkEmailExists,
  };
};
