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

  // 注册方法 - 更改为使用createUser
  registrar(): void {
    if (this.formularioRegistre.invalid) {
      Object.keys(this.formularioRegistre.controls).forEach(key => {
        const control = this.formularioRegistre.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // 获取表单数据
    const dades = this.formularioRegistre.value;
    
    // 使用createUser代替registerUser
    this.userService.createUser(dades).subscribe({
      next: () => {
        // 触发注册完成事件
        this.registreComplet.emit();
        // 重置表单
        this.formularioRegistre.reset();
      },
      error: (err) => {
        console.error('Error al registrar:', err);
      }
    });
  }
}