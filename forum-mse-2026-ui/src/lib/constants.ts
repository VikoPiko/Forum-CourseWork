export type UserRole = 'ADMIN' | 'MODERATOR' | 'USER';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
}
