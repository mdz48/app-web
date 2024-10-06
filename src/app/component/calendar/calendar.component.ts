import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, RouterLink, NavbarComponent],
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

    const storedKeys = Object.keys(localStorage).filter(key => {
        return key.match(/^\d{4}-\d{1,2}-\d{1,2}$/); 
    });

    const sortedKeys = storedKeys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let lastDate: Date | null = null;

    sortedKeys.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key) || '{}');

        if (data && data.usuario === this.activeUser) {
            const tareasCount = data.tareas.length;

            if (tareasCount > maxTasks.count) {
                maxTasks = { date: key, count: tareasCount, totalTasks: tareasCount };
            }

            if (tareasCount < minTasks.count && tareasCount > 0) {
                minTasks = { date: key, count: tareasCount, totalTasks: tareasCount };
            }

            const [year, month, day] = key.split('-').map(Number);
            const registroFecha = new Date(year, month - 1, day);

            if (lastDate) {
                const diffInDays = (registroFecha.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

                if (diffInDays === 1) {
                    currentStreak++;
                } else {
                    currentStreak = 1; 
                }
            } else {
                currentStreak = 1; 
            }

            lastDate = registroFecha; 
            maxStreak = Math.max(maxStreak, currentStreak); 
        }
    });

    this.longestStreak = maxStreak;

    if (maxTasks.date) {
        const [year, month, day] = maxTasks.date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
        const average = (maxTasks.totalTasks / maxTasks.count).toFixed(1);
        this.mostCompletedTasks = { date: maxTasks.date, dayName, average: parseFloat(average), count: maxTasks.count };
    }

    if (minTasks.date && minTasks.count !== Infinity) {
        const [year, month, day] = minTasks.date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
        const average = (minTasks.totalTasks / minTasks.count).toFixed(1);
        this.leastCompletedTasks = { date: minTasks.date, dayName, average: parseFloat(average), count: minTasks.count };
    } else {
        this.leastCompletedTasks = { date: "Sin registro", dayName: "Sin registro", average: 0, count: 0 };
    }

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
      window.location.reload();
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
