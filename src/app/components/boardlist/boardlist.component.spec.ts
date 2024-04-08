import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardlistComponent } from './boardlist.component';

describe('BoardlistComponent', () => {
  let component: BoardlistComponent;
  let fixture: ComponentFixture<BoardlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoardlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
