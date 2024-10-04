import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  tareas: string[] = ['Leer', 'Gimnasio', 'Deberes', 'Limpieza', 'Cuidado Personal'];
  seleccionados: string[] = [];

  onCheckboxChange(event: any) {
    const tarea = event.target.value;
    if (event.target.checked) {
      this.seleccionados.push(tarea);
    } else {
      const index = this.seleccionados.indexOf(tarea);
      if (index > -1) {
        this.seleccionados.splice(index, 1);
      }
    }
  }

  guardarSeleccion() {
    // Guardar la selección en localStorage
    localStorage.setItem('seleccionados', JSON.stringify(this.seleccionados));
    alert('Selección guardada en localStorage');
  }
}
