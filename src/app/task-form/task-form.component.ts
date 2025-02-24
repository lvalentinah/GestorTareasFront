/**
 * Componente para el formulario de tareas.
 *
 * Este componente permite crear y actualizar tareas mediante un formulario reactivo.
 * También se encarga de cargar una tarea existente en modo edición y de mostrar alertas modales
 * para notificar al usuario sobre el estado de las operaciones.
 */

import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../task.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/**
 * Interfaz para definir la estructura de alertas modales.
 */
interface IModalAlerts {
  id: string;
  class?: string;
  value: string;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaskFormComponent implements OnInit {
  // Formulario reactivo para la tarea
  taskForm: FormGroup;

  // Referencias a elementos del DOM
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('tituloInput') tituloInput!: ElementRef;
  @ViewChild('descripcionTextArea') descripcionTextArea!: ElementRef;

  // Identificador de la tarea (si se está en modo edición)
  taskId?: string;
  // Bandera para indicar si se está en modo edición
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    @Inject(TaskService) private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Inicializar el formulario con validadores requeridos para cada campo
    this.taskForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  /**
   * Método de inicialización del componente.
   *
   * Se suscribe a los parámetros de la ruta para detectar si se recibe un ID de tarea;
   * en ese caso, activa el modo edición y carga la tarea correspondiente.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id') || undefined;
      if (this.taskId) {
        this.isEditMode = true;
        this.loadTask();
      }
    });
  }

  /**
   * Carga los datos de una tarea existente y los asigna al formulario.
   *
   * Llama al servicio de tareas para obtener la tarea por ID y actualiza los campos
   * del formulario y de los elementos del DOM correspondientes.
   */
  loadTask(): void {
    if (this.taskId) {
      console.log(`Fetching task with ID: ${this.taskId}`);
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task: Task) => {
          // Actualizar los campos del formulario con los datos de la tarea
          this.taskForm.patchValue({
            titulo: task.titulo,
            descripcion: task.descripcion
          });
          // Actualizar el valor de los elementos de entrada en el DOM
          setTimeout(() => {
            if (this.tituloInput && this.tituloInput.nativeElement) {
              (this.tituloInput.nativeElement as any).setValue(task.titulo);
              console.log('Titulo:', task.titulo);
            }
          }, 0);
          setTimeout(() => {
            if (this.descripcionTextArea && this.descripcionTextArea.nativeElement) {
              (this.descripcionTextArea.nativeElement as any).setText(task.descripcion);
              console.log('Descripción:', task.descripcion);
            }
          }, 0);
          console.log('Task:', task);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading task:', error);
        }
      });
    }
  }

  /**
   * Muestra un modal de alerta con la información proporcionada.
   *
   * @param title - Título del modal.
   * @param subTitle - Subtítulo o mensaje adicional.
   * @param icon - Icono a mostrar en el modal.
   * @param callback - Función opcional a ejecutar después de mostrar el modal.
   */
  showModal(
    title: string,
    subTitle: string,
    icon: string,
    callback?: () => void
  ) {
    const modalElement = this.modal.nativeElement as any;
    modalElement.setAttribute('title-modal', title);
    modalElement.setAttribute('sub-title', subTitle);
    modalElement.setAttribute('icon', icon);
    modalElement.openAlert();
    // Se podría ejecutar callback() si se desea, luego de mostrar el modal
  }

  /**
   * Navega a la lista de tareas.
   */
  navegarALista() {
    this.router.navigate(['/listar-tareas']);
  }

  /**
   * Actualiza el valor del campo 'titulo' del formulario al detectar cambios.
   *
   * @param event - Evento de cambio en el input del título.
   */
  onTituloChanged(event: any): void {
    this.taskForm.patchValue({ titulo: event.target.value });
    console.log('Titulo:', this.taskForm.value.titulo);
  }

  /**
   * Actualiza el valor del campo 'descripcion' del formulario al detectar cambios.
   *
   * @param event - Evento de cambio en el textarea de descripción.
   */
  onDescripcionChanged(event: any): void {
    this.taskForm.patchValue({ descripcion: event.target.value });
    console.log('Descripción:', this.taskForm.value.descripcion);
  }

  /**
   * Envía el formulario para crear o actualizar una tarea.
   *
   * Verifica si el formulario es válido y, dependiendo del modo (creación o edición),
   * llama al servicio correspondiente para crear o actualizar la tarea.
   */
  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = {
        titulo: this.taskForm.value.titulo || '',
        descripcion: this.taskForm.value.descripcion || ''
      };
      if (this.isEditMode && this.taskId) {
        // Preparar el objeto tarea con el ID para actualizar
        const updateTask: Task = {
          id: this.taskId,
          titulo: this.taskForm.value.titulo,
          descripcion: this.taskForm.value.descripcion
        };

        console.log('Attempting to update task:', updateTask);
        this.taskService.updateTask(updateTask).subscribe({
          next: (response) => {
            if (response) {
              console.log('Update successful with response:', response);
              this.showModal('Bien hecho!', 'La tarea se ha actualizado correctamente', 'success');
            } else {
              console.log('Update successful but no response body');
            }
            this.taskForm.reset();
            this.openAlert();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating task:', error);
            if (error.status) {
              console.error('Status:', error.status);
              console.error('Status Text:', error.statusText);
            }
            if (error.error) {
              console.error('Error body:', error.error);
            }
          }
        });
      } else {
        // Crear una nueva tarea
        this.taskService.createTask(task).subscribe({
          next: () => {
            this.taskForm.reset();
            this.showModal('Bien hecho!', 'La tarea se ha creado correctamente', 'success');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error creating task', error);
          }
        });
      }
    }
  }

  /**
   * Abre la alerta modal.
   *
   * Se utiliza para mostrar mensajes emergentes al usuario.
   */
  openAlert() {
    const modalElement = this.modal.nativeElement as any;
    modalElement.openAlert();
  }

  /**
   * Maneja el evento de clic en los botones del modal.
   *
   * Si el botón con ID '0' es presionado, redirige al usuario a la lista de tareas.
   *
   * @param event - Evento emitido desde el modal.
   */
  handleModalButtonClick(event: any) {
    if (event.detail.id === '0') {
      this.router.navigate(['/listar-tareas']);
    }
  }
}
