import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { TopicDetail } from './topic-detail';
import { RUNTIME_CONFIG } from '../../runtime-config';

describe('TopicDetail', () => {
  let component: TopicDetail;
  let fixture: ComponentFixture<TopicDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RUNTIME_CONFIG, useValue: { backendBaseUrl: '' } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
