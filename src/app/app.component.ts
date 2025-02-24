import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'Gestor de tareas';
  isAuthenticated: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  navigateToCrearTarea() {
    this.router.navigate(['/crear-tarea']);
  }

  logout(): void {
    this.authService.logout();
  }
}
