import { CommonModule } from '@angular/common';
import { Component, inject, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {
  



  date: Date = new Date("2025-08-14");
  Prova: string = "Este texto deberia estar en mayusculas";
  formularioLogin: FormGroup;
  authService = inject(AuthService);
  private router = inject(Router);
  @Output() loggedin = new EventEmitter<string>();
  @Output() exportLoggedIn = new EventEmitter<boolean>();

  constructor(private form: FormBuilder){
    this.formularioLogin = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]], 
    });
  }
ngOnInit(): void {
    this.formularioLogin = this.form.group({
      email: ['eve.holt@reqres.in', [Validators.required, Validators.email]], // Valor predeterminado para el email
      password: ['cityslicka', [Validators.required, Validators.minLength(8)]] // Valor predeterminado para la contraseña
    });
  }
  hasError(controlName:string, errorType:string){
    return this.formularioLogin.get(controlName)?.hasError(errorType) && this.formularioLogin.get(controlName)?.touched;  
  }

  login() {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }
  
    const loginData = this.formularioLogin.value;
  
    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/users']); // Redirigir al componente de usuarios
      },
      error: (error) => {
        console.error('Error en el login:', error);
        if (error.status === 404) {
          alert('Usuario no encontrado. Por favor, verifica tu email.');
        } else if (error.status === 400 || error.status === 401) {
          alert('Contraseña incorrecta. Por favor, verifica tu contraseña.');
        } else {
          alert('Error en el servidor. Inténtalo más tarde.');
        }
      }
    });
  }
}
