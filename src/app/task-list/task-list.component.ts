/**
 * Componente de lista de tareas.
 *
 * Este componente muestra una lista de tareas disponibles, permitiendo al usuario
 * navegar para crear o editar una tarea y eliminar tareas mediante una confirmación modal.
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskService, Task } from '../task.service';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaskListComponent implements OnInit {
  /** Arreglo que almacena las tareas obtenidas del servicio. */
  tasks: Task[] = [];

  /** ID de la tarea que se desea eliminar (se almacena temporalmente antes de la confirmación). */
  taskIdToDelete?: string;

  /** Referencia al elemento modal para la confirmación de eliminación. */
  @ViewChild('modal') modal!: ElementRef;

  constructor(private taskService: TaskService, private router: Router) {}

  /**
   * Método de inicialización del componente.
   *
   * Se ejecuta al cargar el componente y obtiene la lista de tareas desde el servicio.
   */
  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Carga la lista de tareas desde el servicio y la almacena en `tasks`.
   *
   * Si ocurre un error en la petición, se muestra en consola.
   */
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  /**
   * Maneja el evento del botón del modal para confirmar o cancelar la eliminación de una tarea.
   *
   * @param event - Evento emitido desde el modal.
   */
  handleModalButtonClick(event: any) {
    if (event.detail.id === '1' && this.taskIdToDelete) {
      this.deleteTask(this.taskIdToDelete);
    }
    this.taskIdToDelete = undefined;
  }

  /**
   * Navega a la pantalla de creación de tareas.
   */
  navegarACrearTarea() {
    this.router.navigate(['/crear-tarea']);
  }

  /**
   * Navega a la pantalla de edición de una tarea específica.
   *
   * @param id - ID de la tarea a editar.
   */
  navegarAEditarTarea(id: string) {
    this.router.navigate(['/editar-tarea', id]);
  }

  /**
   * Elimina una tarea llamando al servicio correspondiente.
   *
   * @param id - ID de la tarea a eliminar.
   */
  deleteTask(id: string): void {
    console.log(`Eliminando tarea con id: ${id}`);
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        console.log(`Tarea con id: ${id} eliminada`);
        // Remueve la tarea eliminada de la lista local
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: (error) => {
        console.error(`Error eliminando tarea con id: ${id}`, error);
      }
    });
  }

  /**
   * Muestra el modal de confirmación de eliminación antes de eliminar una tarea.
   *
   * @param id - ID de la tarea a eliminar.
   */
  confirmDeleteTask(id: string): void {
    this.taskIdToDelete = id;
    const modalElement = this.modal.nativeElement as any;
    modalElement.openAlert();
  }
}
