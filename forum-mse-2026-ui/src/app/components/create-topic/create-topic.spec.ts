import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CreateTopic } from './create-topic';
import { RUNTIME_CONFIG } from '../../runtime-config';

describe('CreateTopic', () => {
  let component: CreateTopic;
  let fixture: ComponentFixture<CreateTopic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTopic],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: RUNTIME_CONFIG, useValue: { backendBaseUrl: '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTopic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
