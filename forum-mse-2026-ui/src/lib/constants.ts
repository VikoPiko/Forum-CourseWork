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

export interface Topic {
  id: number;
  title: string;
  content: string;
  createdByUserId: number;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface Reply {
  id: number;
  postId: number;
  text: string;
  createdByUserId: number;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CreateTopicRequest {
  title: string;
  content: string;
}

export type UpdateTopicRequest = CreateTopicRequest;

export interface CreateReplyRequest {
  content: string;
}

export interface UpdateReplyRequest {
  text: string;
}
