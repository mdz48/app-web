import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.css'
})
export class SelectionComponent {
  tareas: string[] = ['Leer', 'Gimnasio', 'Deberes', 'Limpieza', 'Cuidado Personal'];
  seleccionados: string[] = [];

  constructor(private router: Router) {}

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
    const activeUser = localStorage.getItem('usuarioActivo')
    if (activeUser) {
      const data = {
        usuario: activeUser,
        tareas: this.seleccionados,
      };
      localStorage.setItem('seleccionados', JSON.stringify(data));
      alert('Selección guardada en localStorage con el usuario activo');
      this.router.navigate(['calendar']);
    } else {
      alert('No hay un usuario activo');
    }
  }
}
