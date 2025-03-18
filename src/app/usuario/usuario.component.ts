import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'] // Corregido: styleUrl -> styleUrls
})
export class UserComponent implements OnInit {
  users: User[] = [];
  newUser: User = { id: 0, name: '', age: 0, email: '' };
  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Obtener todos los usuarios
  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  // Crear un nuevo usuario
  createUser(): void {
    this.userService.createUser(this.newUser).subscribe(
      (data) => {
        this.users.push(data);
        this.newUser = { id: 0, name: '', age: 0, email: '' }; // Resetear el formulario
      },
      (error) => {
        console.error('Error al crear usuario:', error);
      }
    );
  }

  // Actualizar un usuario
  updateUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
        (data) => {
          const index = this.users.findIndex((u) => u.id === data.id);
          if (index !== -1) {
            this.users[index] = data;
          }
          this.selectedUser = null; // Limpiar selección
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
        }
      );
    }
  }

  // Eliminar un usuario
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        this.users = this.users.filter((u) => u.id !== id);
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    );
  }

  // Seleccionar un usuario para editar
  selectUser(user: User): void {
    this.selectedUser = { ...user }; // Crear una copia para evitar modificar directamente
  }
}