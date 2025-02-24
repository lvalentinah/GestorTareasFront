import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'crear-tarea', component: TaskFormComponent },
  { path: 'listar-tareas', component: TaskListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'editar-tarea/:id', component: TaskFormComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
