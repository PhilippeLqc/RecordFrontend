import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationprojectComponent } from './invitationproject.component';

describe('InvitationprojectComponent', () => {
  let component: InvitationprojectComponent;
  let fixture: ComponentFixture<InvitationprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationprojectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvitationprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
