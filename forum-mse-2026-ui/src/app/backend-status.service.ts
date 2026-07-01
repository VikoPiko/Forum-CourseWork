import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { RUNTIME_CONFIG } from './runtime-config';

export type BackendStatus = 'reachable' | 'unavailable' | 'unknown';

export interface HealthResponse {
  status?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class BackendStatusService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(RUNTIME_CONFIG);

  /** Same-origin path; nginx/dev-proxy forwards /api/* to the backend. */
  private readonly apiPrefix = '/api';

  private url(path: string): string {
    return `${this.config.backendBaseUrl}${this.apiPrefix}${path}`;
  }

  checkHealth(): Observable<BackendStatus> {
    return this.http.get<HealthResponse>(this.url('/actuator/health')).pipe(
      map((res) => (res?.status === 'UP' ? 'reachable' : 'unknown') as BackendStatus),
      catchError(() => of<BackendStatus>('unavailable')),
    );
  }

  listPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url('/posts'));
  }
}
