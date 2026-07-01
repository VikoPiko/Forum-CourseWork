import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { BackendStatusService } from './backend-status.service';
import { RUNTIME_CONFIG } from './runtime-config';

describe('BackendStatusService', () => {
  let service: BackendStatusService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RUNTIME_CONFIG, useValue: { backendBaseUrl: '' } },
      ],
    });
    service = TestBed.inject(BackendStatusService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reports "reachable" when health responds UP', async () => {
    const result = firstValueFrom(service.checkHealth());
    const req = http.expectOne('/api/actuator/health');
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'UP' });
    expect(await result).toBe('reachable');
  });

  it('reports "unknown" when health responds without UP', async () => {
    const result = firstValueFrom(service.checkHealth());
    http.expectOne('/api/actuator/health').flush({ status: 'OUT_OF_SERVICE' });
    expect(await result).toBe('unknown');
  });

  it('reports "unavailable" on network/HTTP error', async () => {
    const result = firstValueFrom(service.checkHealth());
    http
      .expectOne('/api/actuator/health')
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Network error' });
    expect(await result).toBe('unavailable');
  });

  it('prepends the configured backend base URL', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RUNTIME_CONFIG, useValue: { backendBaseUrl: 'https://example.test' } },
      ],
    });
    const svc = TestBed.inject(BackendStatusService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    const result = firstValueFrom(svc.checkHealth());
    httpCtrl.expectOne('https://example.test/api/actuator/health').flush({ status: 'UP' });
    expect(await result).toBe('reachable');
    httpCtrl.verify();
  });
});
