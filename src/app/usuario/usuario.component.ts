import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user',
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  standalone: true,
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  newUser: User = { id: '', name: '', email: '', birthDate: new Date(), isAdmin: false, isHidden: false, password: '' };
  selectedUser: User | null = null;
  page: number = 1;
  pageSize: number = 10;
  totalUsers: number = 0;
  totalPages: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Obtener todos los usuarios
  getUsers(): void {
    this.userService.getUsers(this.page, this.pageSize).subscribe(
      (data) => {
        this.users = data.users;
        this.totalUsers = data.totalUsers;
        this.totalPages = data.totalPages;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  // Crear un nuevo usuario
  createUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.birthDate || !this.newUser.password) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }
    this.userService.createUser(this.newUser).subscribe(
      (data) => {
        this.users.push(data);
        this.newUser = { id: '', name: '', email: '', birthDate: new Date(), isAdmin: false, isHidden: false, password: '' }; // Resetear el formulario
        alert('Usuario creado exitosamente');
      },
      (error) => {
        console.error('Error al crear usuario:', error);
        alert('Error al crear usuario');
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
            alert('Usuario actualizado exitosamente');
          }
          this.selectedUser = null; // Limpiar selección
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
          alert('Error al actualizar usuario:' + JSON.stringify(error));
        }
      );
    }
  }

  // Ocultar un usuario
  hideUser(id: string, isHidden: boolean): void {
    this.userService.hideUser(id, isHidden).subscribe(
      (data) => {
        const index = this.users.findIndex((u) => u.id === data.id);
        if (index !== -1) {
          this.users[index].isHidden = isHidden;
          alert('Usuario ocultado exitosamente');
        }
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);
        alert('Error al ocultar usuario' + JSON.stringify(error));
      }
    );
  }

  // Seleccionar un usuario para editar
  selectUser(user: User): void {
    this.selectedUser = { ...user }; // Crear una copia para evitar modificar directamente
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getUsers();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getUsers();
    }
  }
}