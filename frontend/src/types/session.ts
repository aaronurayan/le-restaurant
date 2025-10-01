import { User } from './user';

export interface UserSession {
  id: number;
  userId: number;
  sessionToken: string;
  createdAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  status: SessionStatus;
}

export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

export interface SessionInfo {
  token: string;
  expiresAt: string;
  user: User;
}

export interface SessionRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SessionResponse {
  session: UserSession;
  user: User;
}
