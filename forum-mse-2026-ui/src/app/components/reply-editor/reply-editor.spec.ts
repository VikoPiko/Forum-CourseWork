import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyEditor } from './reply-editor';

describe('ReplyEditor', () => {
  let component: ReplyEditor;
  let fixture: ComponentFixture<ReplyEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(ReplyEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
