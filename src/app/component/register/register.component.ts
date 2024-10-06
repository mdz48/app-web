import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  register() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = users.some((user: { username: string }) => user.username === this.username);

    if (userExists) {
      alert('Este nombre de usuario ya existe. Elige otro.');
    } else {
      const newUser = {
        username: this.username,
        password: this.password
      };

      users.push(newUser);
      
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('usuarioActivo', JSON.stringify(this.username));
      this.router.navigate(['selection']);
    }
  }
}
