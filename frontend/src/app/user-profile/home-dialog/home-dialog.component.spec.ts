import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDialogComponent } from './home-dialog.component';
import { SkillService } from '../skill.service';
import { Observable, of } from 'rxjs';
import { Skill } from '../../../../../backend/core/src/domain-model/skill';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeDialogComponent', () => {
  let component: HomeDialogComponent;
  let fixture: ComponentFixture<HomeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: SkillService,
          useValue: {
            findAll(): Observable<Skill[]> {
              return of([]);
            },
          },
        },
      ],
      declarations: [HomeDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
