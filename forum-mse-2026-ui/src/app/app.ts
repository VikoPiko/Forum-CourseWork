import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BackendStatus, BackendStatusService, Post } from './backend-status.service';

type PostsState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ok'; posts: Post[] }
  | { kind: 'error'; message: string };

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly backend = inject(BackendStatusService);

  protected readonly title = 'Forum MSE 2026';
  protected readonly description = 'CI/CD teaching frontend';

  protected readonly status = signal<BackendStatus | null>(null);
  protected readonly checking = signal(false);
  protected readonly posts = signal<PostsState>({ kind: 'idle' });

  protected statusLabel(): string {
    const value = this.status();
    if (value === 'reachable') return 'Backend is reachable';
    if (value === 'unavailable') return 'Backend is unavailable';
    if (value === 'unknown') return 'Backend status unknown';
    return 'Backend status not checked yet';
  }

  protected statusClass(): string {
    const value = this.status();
    if (value === 'reachable') return 'status status--ok';
    if (value === 'unavailable') return 'status status--err';
    if (value === 'unknown') return 'status status--warn';
    return 'status status--idle';
  }

  protected checkStatus(): void {
    this.checking.set(true);
    this.backend.checkHealth().subscribe({
      next: (value) => {
        this.status.set(value);
        this.checking.set(false);
      },
      error: () => {
        this.status.set('unavailable');
        this.checking.set(false);
      },
    });
  }

  protected loadPosts(): void {
    this.posts.set({ kind: 'loading' });
    this.backend.listPosts().subscribe({
      next: (posts) => this.posts.set({ kind: 'ok', posts }),
      error: () => this.posts.set({ kind: 'error', message: 'Could not load posts.' }),
    });
  }
}
