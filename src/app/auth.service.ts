/**
 * Servicio de autenticación.
 *
 * Este servicio maneja el registro, inicio de sesión y cierre de sesión de usuarios.
 * Utiliza `HttpClient` para comunicarse con la API de autenticación y `BehaviorSubject`
 * para rastrear el estado de autenticación del usuario.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// URL base de la API de autenticación
const API_URL = 'http://localhost:3000/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Observable para rastrear el estado de autenticación del usuario */
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Verifica si hay un usuario almacenado en localStorage para mantener la sesión activa
    const user = localStorage.getItem('user');
    this.isAuthenticatedSubject.next(!!user);
  }

  /**
   * Registra un nuevo usuario en el sistema.
   *
   * @param username - Nombre de usuario.
   * @param password - Contraseña del usuario.
   * @returns Un `Observable` con la respuesta del servidor.
   */
  register(username: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/register`, { username, password });
  }

  /**
   * Inicia sesión de un usuario con las credenciales proporcionadas.
   *
   * @param username - Nombre de usuario.
   * @param password - Contraseña del usuario.
   * @returns Un `Observable` con la respuesta del servidor.
   *
   * Si la autenticación es exitosa, se almacena el usuario en `localStorage`
   * y se actualiza el estado de autenticación.
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('user', JSON.stringify(response));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Cierra la sesión del usuario actual.
   *
   * Se elimina la información del usuario almacenada en `localStorage` y
   * se actualiza el estado de autenticación a `false`.
   */
  logout(): void {
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Obtiene la información del usuario autenticado desde `localStorage`.
   *
   * @returns Un objeto con los datos del usuario si está autenticado, `null` en caso contrario.
   */
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Obtiene el token de autenticación del usuario actual.
   *
   * @returns Un string con el token si el usuario está autenticado, una cadena vacía en caso contrario.
   */
  getToken(): string {
    const user = this.getCurrentUser();
    return user ? user.token : '';
  }

  /**
   * Devuelve un `Observable` que indica si el usuario está autenticado.
   *
   * @returns Un `Observable<boolean>` que emite `true` si el usuario está autenticado y `false` si no lo está.
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
