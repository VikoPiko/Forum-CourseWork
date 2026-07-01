import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RUNTIME_CONFIG } from './runtime-config';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserRole,
} from '../lib/constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(RUNTIME_CONFIG);
  private readonly storageKey = 'forum.accessToken';
  private readonly token = signal<string | null>(this.readStoredToken());
  private readonly apiPrefix = '/api';

  readonly isAuthenticated = computed(() => !!this.token());
  readonly currentUser = computed(() => this.decodeUser(this.token()));

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.url('/auth/login'), request)
      .pipe(tap((response) => this.setToken(response.accessToken)));
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.url('/auth/register'), request);
  }

  logout(): void {
    this.setToken(null);
  }

  getToken(): string | null {
    return this.token();
  }

  private url(path: string): string {
    return `${this.config.backendBaseUrl}${this.apiPrefix}${path}`;
  }

  private setToken(token: string | null): void {
    this.token.set(token);
    try {
      if (token) {
        localStorage.setItem(this.storageKey, token);
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch {
      // Storage may be unavailable in tests or restricted browsers.
    }
  }

  private readStoredToken(): string | null {
    try {
      return localStorage.getItem(this.storageKey);
    } catch {
      return null;
    }
  }

  private decodeUser(token: string | null): AuthUser | null {
    if (!token) return null;
    const [, payload] = token.split('.');
    if (!payload) return null;
    try {
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      const claims = JSON.parse(atob(padded)) as { uid?: number; sub?: string; role?: UserRole };
      if (!claims.uid || !claims.sub || !claims.role) return null;
      return { id: claims.uid, username: claims.sub, role: claims.role };
    } catch {
      return null;
    }
  }
}
