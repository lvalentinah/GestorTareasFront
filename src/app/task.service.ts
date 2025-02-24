/**
 * Servicio de gestión de tareas.
 *
 * Este servicio permite la creación, obtención, actualización y eliminación de tareas.
 * Se comunica con una API REST utilizando `HttpClient` y maneja la autenticación de usuarios mediante tokens.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Interfaz que representa la estructura de una tarea.
 */
export interface Task {
  id?: string; // Identificador único de la tarea
  titulo: string; // Título de la tarea
  descripcion: string; // Descripción detallada de la tarea
  username?: string; // Nombre de usuario asociado a la tarea
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /** URL base de la API de tareas */
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Obtiene las opciones de cabecera HTTP con el token de autenticación.
   *
   * @returns Un objeto con los encabezados HTTP necesarios para la autenticación.
   */
  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
  }

  /**
   * Obtiene la lista de tareas asociadas al usuario autenticado.
   *
   * @returns Un `Observable<Task[]>` con la lista de tareas del usuario.
   */
  getTasks(): Observable<Task[]> {
    const username = this.authService.getCurrentUser().username;
    return this.http.get<Task[]>(`${this.apiUrl}?username=${username}`, this.getHttpOptions());
  }

  /**
   * Obtiene una tarea específica por su ID.
   *
   * @param id - El identificador único de la tarea.
   * @returns Un `Observable<Task>` con la tarea solicitada.
   */
  getTaskById(id: string): Observable<Task> {
    const url = `${this.apiUrl}/${id}`;
    console.log(`GET request to: ${url}`);
    return this.http.get<Task>(url, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva tarea asociada al usuario autenticado.
   *
   * @param task - La tarea a crear.
   * @returns Un `Observable<Task>` con la tarea creada.
   */
  createTask(task: Task): Observable<Task> {
    task.id = uuidv4(); // Genera un ID único para la tarea
    task.username = this.authService.getCurrentUser().username; // Asigna el usuario actual a la tarea
    return this.http.post<Task>(this.apiUrl, task, this.getHttpOptions());
  }

  /**
   * Elimina una tarea por su ID.
   *
   * @param id - El identificador de la tarea a eliminar.
   * @returns Un `Observable<any>` indicando el resultado de la operación.
   */
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja errores de las solicitudes HTTP y los registra en la consola.
   *
   * @param error - Error de la respuesta HTTP.
   * @returns Un `Observable<never>` que lanza un error personalizado.
   */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /**
   * Obtiene el nombre de usuario actual desde el almacenamiento local.
   *
   * @returns El nombre de usuario si está disponible, una cadena vacía en caso contrario.
   */
  getCurrentUsername(): string {
    const user = localStorage.getItem('username');
    return user ? JSON.parse(user).username : '';
  }

  /**
   * Actualiza una tarea existente.
   *
   * @param task - La tarea con la información actualizada.
   * @returns Un `Observable<Task>` con la tarea actualizada.
   */
  updateTask(task: Task): Observable<Task> {
    const url = `${this.apiUrl}/${task.id}`;
    const updatePayload = {
      titulo: task.titulo,
      descripcion: task.descripcion
    };

    console.log('Making PUT request to:', url);
    console.log('With payload:', updatePayload);

    return this.http.put<Task>(url, updatePayload, this.getHttpOptions()).pipe(
      tap((response: Task) => console.log('Raw server response:', response)),
      catchError(error => {
        console.error('Server error:', error);
        return throwError(() => error);
      })
    );
  }
}
