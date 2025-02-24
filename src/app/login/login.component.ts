/**
 * Componente de inicio de sesión.
 *
 * Este componente maneja el formulario de autenticación de usuarios en el portal de gestión de tareas.
 * Utiliza Angular Forms para la validación de campos, y AuthService para gestionar la autenticación.
 * También permite mostrar mensajes de error en caso de fallos en el inicio de sesión.
 */

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/**
 * Interfaz para la estructura de los mensajes emergentes (toast).
 */
interface IToast {
  type?: string;
  message?: string;
  titleToast?: string;
  textLink?: string;
  textDesc?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent implements OnInit {
  @ViewChild('toast') toast!: ElementRef; // Referencia a la notificación de error (toast)
  loginForm!: FormGroup; // Formulario de inicio de sesión
  loginElements: any[] = []; // Elementos del formulario de login
  loginTitle = 'Bienvenido al portal de gestión de tareas'; // Título del formulario

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {}

  /**
   * Inicializa el componente creando el formulario de login y configurando los elementos de entrada.
   */
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Campo requerido para usuario
      password: ['', Validators.required] // Campo requerido para contraseña
    });

    this.updateLoginElements();
  }

  /**
   * Configura los elementos de entrada del formulario con atributos personalizados.
   */
  updateLoginElements() {
    this.loginElements = [
      {
        component: "sp-at-input",
        name: "username",
        props: {
          idEl: "username",
          name: "username",
          label: "Usuario",
          placeholder: "Ingresa tu usuario",
          type: "TEXT",
          status: "ENABLED",
          required: "true",
          message: "Usuario es requerido",
        }
      },
      {
        component: "sp-at-input",
        name: "password",
        props: {
          idEl: "password",
          name: "password",
          label: "Contraseña",
          placeholder: "Ingresa tu contraseña",
          type: "PASSWORD",
          status: "ENABLED",
          required: "true",
          message: "Contraseña es requerida",
        }
      }
    ];
  }

  /**
   * Maneja el proceso de inicio de sesión cuando el usuario ingresa sus credenciales.
   *
   * @param event - Evento de envío del formulario con detalles de los campos ingresados.
   */
  login(event: any) {
    // Extraer valores de los campos del evento
    if (event && event.detail) {
      const details = event.detail.reduce((acc: { [x: string]: any }, item: { name: string | number; value: any }) => {
        acc[item.name] = item.value;
        return acc;
      }, {} as { username: string; password: string });

      // Actualizar el formulario con los valores obtenidos del evento
      this.loginForm.setValue({
        username: details.username || '',
        password: details.password || '',
      });
    }

    // Verificar si el formulario es válido antes de enviar la solicitud de autenticación
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          // Guardar la información del usuario autenticado en localStorage
          localStorage.setItem('user', JSON.stringify(response));
          // Redirigir al usuario a la lista de tareas
          this.router.navigate(['/listar-tareas']);
        },
        error: (error) => {
          console.error('Error al iniciar sesión', error);
          // Mostrar mensaje de error si las credenciales son incorrectas
          this.showToast(
            'Error',
            'Por favor revisa tus credenciales',
            'Usuario o contraseña incorrectos'
          );
        }
      });
    }
  }

  /**
   * Muestra un mensaje emergente (toast) con información de error o advertencia.
   *
   * @param type - Tipo de mensaje (Error, Éxito, Advertencia, etc.).
   * @param titleToast - Título del mensaje.
   * @param textDesc - Descripción del mensaje.
   */
  showToast(type: string, titleToast: string, textDesc: string) {
    const toastElement = this.toast.nativeElement as HTMLElement;
    toastElement.setAttribute('type', type);
    toastElement.setAttribute('titleToast', titleToast);
    toastElement.setAttribute('textDesc', textDesc);
    (toastElement as any).show(); // Llamar la función `show()` del elemento toast
  }
}
