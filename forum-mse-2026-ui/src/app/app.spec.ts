import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { RUNTIME_CONFIG } from './runtime-config';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RUNTIME_CONFIG, useValue: { backendBaseUrl: '' } },
      ],
    }).compileComponents();
  });

  it('creates the root component', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the page title and description', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[data-cy="app-title"]')?.textContent).toContain('Forum MSE 2026');
    expect(root.querySelector('[data-cy="app-description"]')?.textContent).toContain(
      'CI/CD teaching frontend',
    );
  });

  it('shows the idle status label before any check is made', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const label = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-cy="status-label"]',
    );
    expect(label?.textContent).toContain('not checked yet');
  });
});
