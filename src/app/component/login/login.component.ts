import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    // Validar si los campos están vacíos
    if (this.username.trim() === '' || this.password.trim() === '') {
      alert('Por favor, ingresa un nombre de usuario y contraseña.');
      return;
    }

    // Obtener lista de usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Verificar si el usuario y la contraseña coinciden
    const user = users.find((u: { username: string, password: string }) =>
      u.username === this.username && u.password === this.password
    );

    if (user) {
      // Establecer el usuario activo en el localStorage
      localStorage.setItem('usuarioActivo', JSON.stringify(user.username));
      this.router.navigate(['selection']);  // Redirigir al usuario
    } else {
      alert('Credenciales incorrectas.');
    }
  }
}
