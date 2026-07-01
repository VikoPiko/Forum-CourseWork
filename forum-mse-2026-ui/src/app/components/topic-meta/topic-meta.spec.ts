import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TopicMeta } from './topic-meta';

describe('TopicMeta', () => {
  let component: TopicMeta;
  let fixture: ComponentFixture<TopicMeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicMeta],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicMeta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});