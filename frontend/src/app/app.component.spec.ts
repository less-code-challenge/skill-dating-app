import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {SecurityService} from './shared/security/security.service';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent
      ],
      providers: [{provide: SecurityService, useValue: {$names: of('some-user@example.com')}}],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
