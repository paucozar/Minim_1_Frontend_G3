import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true
})
export class RegisterComponent {
  formularioRegistre: FormGroup;
  
  @Output() registreComplet = new EventEmitter<void>();

  constructor(
    private form: FormBuilder,
    private userService: UserService
  ) {
    this.formularioRegistre = this.form.group({
      name: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      isAdmin: [false],
      isHidden: [false]
    });
  }

  teError(camp: string, tipusError: string): boolean {
    const control = this.formularioRegistre.get(camp);
    return !!control && control.touched && control.hasError(tipusError);
  }


  registrar(): void {
    if (this.formularioRegistre.invalid) {
      Object.keys(this.formularioRegistre.controls).forEach(key => {
        const control = this.formularioRegistre.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // Obtener datos del formulario
    const dades = this.formularioRegistre.value;
    

    this.userService.createUser(dades).subscribe({
      next: () => {
        // Activa el evento de finalización del registro
        this.registreComplet.emit();
        // Restablecer formularios
        this.formularioRegistre.reset();
      },
      error: (err) => {
        console.error('Error al registrar:', err);
      }
    });
  }
}