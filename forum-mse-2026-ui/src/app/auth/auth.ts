import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="view view--narrow">
      <header class="view__header">
        <h2>Account</h2>
        <p>Login or create a regular forum user.</p>
      </header>

      @if (auth.isAuthenticated()) {
        <div class="notice notice--ok">
          Signed in as {{ auth.currentUser()?.username }}.
          <button type="button" (click)="logout()">Logout</button>
        </div>
      }

      <div class="two-column">
        <form class="panel" (ngSubmit)="login()">
          <h3>Login</h3>
          <label>
            Username
            <input name="loginUsername" [(ngModel)]="loginUsername" autocomplete="username" required />
          </label>
          <label>
            Password
            <input name="loginPassword" [(ngModel)]="loginPassword" type="password" autocomplete="current-password" required />
          </label>
          <button type="submit" [disabled]="busy()">Login</button>
        </form>

        <form class="panel" (ngSubmit)="register()">
          <h3>Register</h3>
          <label>
            Username
            <input name="registerUsername" [(ngModel)]="registerUsername" autocomplete="username" required />
          </label>
          <label>
            Password
            <input name="registerPassword" [(ngModel)]="registerPassword" type="password" autocomplete="new-password" required />
          </label>
          <button type="submit" [disabled]="busy()">Register</button>
        </form>
      </div>

      @if (message()) {
        <p class="notice" [class.notice--err]="messageKind() === 'error'" [class.notice--ok]="messageKind() === 'ok'">
          {{ message() }}
        </p>
      }

      <a routerLink="/topics">Back to topics</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected loginUsername = '';
  protected loginPassword = '';
  protected registerUsername = '';
  protected registerPassword = '';
  protected readonly busy = signal(false);
  protected readonly message = signal('');
  protected readonly messageKind = signal<'ok' | 'error'>('ok');

  protected login(): void {
    this.busy.set(true);
    this.message.set('');
    this.auth.login({ username: this.loginUsername, password: this.loginPassword }).subscribe({
      next: () => {
        this.busy.set(false);
        void this.router.navigateByUrl('/topics');
      },
      error: () => this.fail('Login failed. Check your username and password.'),
    });
  }

  protected register(): void {
    this.busy.set(true);
    this.message.set('');
    this.auth.register({ username: this.registerUsername, password: this.registerPassword }).subscribe({
      next: () => {
        this.busy.set(false);
        this.messageKind.set('ok');
        this.message.set('Registration complete. You can login now.');
        this.loginUsername = this.registerUsername;
      },
      error: () => this.fail('Registration failed. The username may already be taken.'),
    });
  }

  protected logout(): void {
    this.auth.logout();
  }

  private fail(message: string): void {
    this.busy.set(false);
    this.messageKind.set('error');
    this.message.set(message);
  }
}