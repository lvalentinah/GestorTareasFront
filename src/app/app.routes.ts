import { Routes } from '@angular/router';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'crear-tarea', component: TaskFormComponent },
  { path: 'listar-tareas', component: TaskListComponent },
  { path: 'editar-tarea/:id', component: TaskFormComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
