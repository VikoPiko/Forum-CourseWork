import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicEditor } from './topic-editor';

describe('TopicEditor', () => {
  let component: TopicEditor;
  let fixture: ComponentFixture<TopicEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
