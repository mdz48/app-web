import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  daysInMonth: number[] = [];
  blankDays: number[] = [];
  selectedDay: number | null = null;
  tareasSeleccionadas: string[] = [];  // Tareas seleccionadas por el usuario activo
  selectedTareas: string[] = [];
  showForm: boolean = false;
  activeUser: string | null = localStorage.getItem('usuarioActivo');

  monthNames: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  weekDays: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  constructor() {
    this.loadSelectedTasks();
    this.generateCalendar();
  }

  // Cargar las tareas seleccionadas del localStorage
  loadSelectedTasks() {
    const storedData = localStorage.getItem('seleccionados');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.usuario === this.activeUser) {
        this.tareasSeleccionadas = parsedData.tareas;
      }
    }
  }

  generateCalendar() {
    const daysInCurrentMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const adjustedFirstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
    this.blankDays = Array(adjustedFirstDay).fill(0);
    this.daysInMonth = Array(daysInCurrentMonth).fill(0).map((_, i) => i + 1);
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  openForm(day: number) {
    this.selectedDay = day;
    this.showForm = true;
    this.selectedTareas = [...this.tareasSeleccionadas]; // Cargar tareas seleccionadas al abrir el formulario
  }

  saveProgress() {
    if (this.activeUser && this.selectedDay) {
      const key = `${this.currentYear}-${this.currentMonth + 1}-${this.selectedDay}`;
      const progress = {
        usuario: this.activeUser,
        fecha: key,
        tareas: this.selectedTareas
      };
      localStorage.setItem(key, JSON.stringify(progress));
      this.showForm = false; // Cerrar el formulario después de guardar
    }
  }

  // Método para manejar el cambio en las tareas seleccionadas
  onTareaChange(tarea: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;

    if (isChecked) {
      this.selectedTareas.push(tarea);
    } else {
      const index = this.selectedTareas.indexOf(tarea);
      if (index > -1) {
        this.selectedTareas.splice(index, 1);
      }
    }
  }

  isProgressLogged(day: number): boolean {
    const key = `${this.currentYear}-${this.currentMonth + 1}-${day}`;
    return !!localStorage.getItem(key);
  }
}
