import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  today: number = new Date().getDate();
  daysInMonth: number[] = [];
  blankDays: number[] = [];
  selectedDay: number | null = null;
  tareasSeleccionadas: string[] = [];  
  selectedTareas: string[] = [];
  showForm: boolean = false;
  activeUser: string | null = localStorage.getItem('usuarioActivo');
  longestStreak: number = 0;
  mostCompletedTasks: { date: string; dayName: string; average: number; count: number } | null = null;
  leastCompletedTasks: { date: string; dayName: string; average: number; count: number } | null = null;
  userStats: { rachaActual: number, diaMaxTareas: string, diaMinTareas: string } | null = null;

  monthNames: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  weekDays: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  constructor() {
    this.loadSelectedTasks();
    this.generateCalendar();
    this.calcularEstadisticas();
  }

  ngOnInit() {
    this.cargarTareasSeleccionadas();
  }

  cargarTareasSeleccionadas() {
    const data = localStorage.getItem('seleccionados');
    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData && parsedData.tareas) {
        this.tareasSeleccionadas = parsedData.tareas;
      }
    }
  }

  calcularEstadisticas() {
    let currentStreak = 0;
    let maxStreak = 0;
    let maxTasks = { date: "", count: 0, totalTasks: 0 };
    let minTasks = { date: "", count: Infinity, totalTasks: 0 };

    const storedKeys = Object.keys(localStorage).filter(key => key !== "usuarioActivo");

    storedKeys.forEach(key => {
      const data = JSON.parse(localStorage.getItem(key) || '{}');

      if (data && data.usuario === this.activeUser) {
        const tareasCount = data.tareas.length;

        // Actualizar día con máximo de tareas completadas
        if (tareasCount > maxTasks.count) {
          maxTasks = { date: key, count: tareasCount, totalTasks: tareasCount };
        }

        // Actualizar día con mínimo de tareas completadas, si tiene tareas
        if (tareasCount < minTasks.count && tareasCount > 0) {
          minTasks = { date: key, count: tareasCount, totalTasks: tareasCount };
        }

        // Actualizar racha si es consecutivo con el día anterior
        const [year, month, day] = key.split('-').map(Number);
        const registroFecha = new Date(year, month - 1, day);
        const ayerFecha = new Date();
        ayerFecha.setDate(ayerFecha.getDate() - 1);

        if (registroFecha.getTime() === ayerFecha.getTime()) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
    });

    this.longestStreak = maxStreak;

    // Convertir la fecha a nombre del día y calcular el promedio
    if (maxTasks.date) {
      const [year, month, day] = maxTasks.date.split('-').map(Number);
      const dateObj = !isNaN(year) && !isNaN(month) && !isNaN(day) 
        ? new Date(year, month - 1, day) 
        : null;
      
      const dayName = dateObj ? dateObj.toLocaleDateString('es-ES', { weekday: 'long' }) : 'Fecha inválida';
      const average = (maxTasks.totalTasks / maxTasks.count).toFixed(1);
      this.mostCompletedTasks = { date: maxTasks.date, dayName, average: parseFloat(average), count: maxTasks.count };
    }

    if (minTasks.date) {
      const [year, month, day] = minTasks.date.split('-').map(Number);
      const dateObj = !isNaN(year) && !isNaN(month) && !isNaN(day) 
        ? new Date(year, month - 1, day) 
        : null;

      const dayName = dateObj ? dateObj.toLocaleDateString('es-ES', { weekday: 'long' }) : 'Fecha inválida';
      const average = (minTasks.totalTasks / minTasks.count).toFixed(1);
      this.leastCompletedTasks = { date: minTasks.date, dayName, average: parseFloat(average), count: minTasks.count };
    }

    // Guardar estadísticas en el objeto para mostrar en la interfaz
    this.userStats = {
      rachaActual: maxStreak,
      diaMaxTareas: this.mostCompletedTasks ? `${this.mostCompletedTasks.dayName} con un promedio de ${this.mostCompletedTasks.average} tareas` : "Sin registro",
      diaMinTareas: this.leastCompletedTasks ? `${this.leastCompletedTasks.dayName} con un promedio de ${this.leastCompletedTasks.average} tareas` : "Sin registro"
    };
  }

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
    if (day === this.today && this.currentMonth === new Date().getMonth() && this.currentYear === new Date().getFullYear()) {
      this.selectedDay = day;
      this.showForm = true;
      this.selectedTareas = [...this.tareasSeleccionadas];
    }
  }

  saveProgress() {
    if (this.activeUser && this.selectedDay === this.today) {
      const key = `${this.currentYear}-${this.currentMonth + 1}-${this.selectedDay}`;
      const progress = {
        usuario: this.activeUser,
        fecha: key,
        tareas: [...this.selectedTareas]
      };
      localStorage.setItem(key, JSON.stringify(progress));
      this.showForm = false;
    }
  }
  

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

  isToday(day: number): boolean {
    return day === this.today && this.currentMonth === new Date().getMonth() && this.currentYear === new Date().getFullYear();
  }
}
