import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyCard } from './reply-card';

describe('ReplyCard', () => {
  let component: ReplyCard;
  let fixture: ComponentFixture<ReplyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ReplyCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
