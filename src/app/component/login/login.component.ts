import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  login() {
    if (this.loginForm.invalid) {
      alert('Por favor, ingresa un nombre de usuario y contraseña.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((u: { username: string, password: string }) =>
      u.username === this.loginForm.get('username')?.value && 
      u.password === this.loginForm.get('password')?.value
    );

    if (user) {
      localStorage.clear();
      localStorage.setItem('usuarioActivo', JSON.stringify(user.username));
      this.router.navigate(['selection']);
    } else {
      alert('Credenciales incorrectas.');
    }
  }
}
