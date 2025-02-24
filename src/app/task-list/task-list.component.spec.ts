import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService, Task } from '../task.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceStub: Partial<TaskService>;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    taskServiceStub = {
      getTasks: () => of([{
        id: '1',
        titulo: 'Test Task',
        descripcion: 'Test Description'
      }] as Task[]),
      deleteTask: (id: string) => of({} as any)
    };

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceStub },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;

    // Mock del componente sp-ml-modal
    const mockModalElement = document.createElement('sp-ml-modal');
    Object.defineProperty(mockModalElement, 'openAlert', {
      value: jasmine.createSpy('openAlert'),
      writable: true
    });

    // Configuramos las propiedades del modal
    Object.defineProperties(mockModalElement, {
      'is-close': { value: true },
      'icon': { value: 'information' },
      'title-modal': { value: 'Confirmación' },
      'sub-title': { value: '¿Está seguro que desea eliminar la tarea?' },
      'options-buttons': {
        value: '[{"id":"1","value":"Aceptar"},{"id":"0","value":"Cancelar"}]'
      },
      'buttonAlertClicked': {
        value: new EventTarget()
      }
    });

    // Asignamos el mock al ViewChild
    component.modal = {
      nativeElement: mockModalElement
    } as ElementRef;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    component.loadTasks();
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].titulo).toBe('Test Task');
  });

  it('should navigate to create task page', () => {
    component.navegarACrearTarea();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/crear-tarea']);
  });



  it('should delete task when modal is confirmed', () => {
    const deleteTaskSpy = spyOn(taskServiceStub, 'deleteTask' as any).and.returnValue(of({}));

    component.taskIdToDelete = '1';
    component.handleModalButtonClick({ detail: { id: '1' } });

    expect(deleteTaskSpy).toHaveBeenCalledWith('1');
    expect(component.taskIdToDelete).toBeUndefined();
  });

  it('should not delete task when modal is cancelled', () => {
    const deleteTaskSpy = spyOn(taskServiceStub, 'deleteTask' as any);

    component.taskIdToDelete = '1';
    component.handleModalButtonClick({ detail: { id: '2' } });

    expect(deleteTaskSpy).not.toHaveBeenCalled();
    expect(component.taskIdToDelete).toBeUndefined();
  });

  it('should update tasks array after successful deletion', () => {
    spyOn(taskServiceStub, 'deleteTask' as any).and.returnValue(of({}));

    component.tasks = [
      { id: '1', titulo: 'Task 1', descripcion: 'Description 1' },
      { id: '2', titulo: 'Task 2', descripcion: 'Description 2' }
    ];

    component.deleteTask('1');

    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].id).toBe('2');
  });
});
