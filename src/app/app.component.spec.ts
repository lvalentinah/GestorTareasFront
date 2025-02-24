import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        AppComponent
      ],
      providers: [AuthService]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Gestor de tareas' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Gestor de tareas');
  });

  it('should initialize isAuthenticated from AuthService', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(of(true));
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.isAuthenticated.subscribe(isAuth => {
      expect(isAuth).toBe(true);
    });
  });

  it('should navigate to crear-tarea when navigateToCrearTarea is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(router, 'navigate');

    app.navigateToCrearTarea();
    expect(router.navigate).toHaveBeenCalledWith(['/crear-tarea']);
  });

  it('should call logout from AuthService when logout is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(authService, 'logout');

    app.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
