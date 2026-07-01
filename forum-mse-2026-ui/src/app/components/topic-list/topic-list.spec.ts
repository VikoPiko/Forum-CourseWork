import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RUNTIME_CONFIG } from '../../runtime-config';

import { TopicList } from './topic-list';

describe('TopicList', () => {
  let component: TopicList;
  let fixture: ComponentFixture<TopicList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RUNTIME_CONFIG, useValue: { backendBaseUrl: '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});