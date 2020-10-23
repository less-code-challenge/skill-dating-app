import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSearchDialogComponent } from './user-profile-search-dialog.component';

describe('UserProfileSearchDialogComponent', () => {
  let component: UserProfileSearchDialogComponent;
  let fixture: ComponentFixture<UserProfileSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
