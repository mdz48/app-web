import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
  
    const user = users.find((u: { username: string, password: string }) => 
      u.username === this.username && u.password === this.password);
  
    if (user) {
      localStorage.setItem('usuarioActivo', JSON.stringify(user.username));  
      this.router.navigate(['selection']);
    } else {
      alert('Credenciales incorrectas.');
    }
  }
  
}
