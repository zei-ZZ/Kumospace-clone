import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSpacesComponent } from './user-spaces.component';

describe('UserSpacesComponent', () => {
  let component: UserSpacesComponent;
  let fixture: ComponentFixture<UserSpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSpacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
