import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private router: Router) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password: new FormControl('', [Validators.required])
    });
  }

  register() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = users.some((user: { username: string }) => user.username === this.registerForm.get('username')?.value);

    if (this.registerForm.invalid) {
      alert('Error en el formulario');
      return;
    }

    if (userExists) {
      alert('Este nombre de usuario ya existe. Elige otro.');
    } else {
      const newUser = {
        username: this.registerForm.get('username')?.value,
        password: this.registerForm.get('password')?.value
      };

      users.push(newUser);
      localStorage.clear(); 
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('usuarioActivo', JSON.stringify(this.registerForm.get('username')?.value));
      this.router.navigate(['selection']);
    }
  }
}
