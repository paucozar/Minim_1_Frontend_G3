import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ComentarioService } from '../services/comentario.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { tap } from 'rxjs/operators';
import { Comentario } from '../models/comentario.model';
import { CreateComentarioDTO } from '../models/comentario.model';
import { Router } from '@angular/router';
import { Gym } from '../models/gym.model';

@Component({
  selector: 'app-comentarios',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  standalone: true,
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
    comments: Comentario[] = [];
    filteredComments: Comentario[] = [];
    searchGymName: string = '';
    gyms: Gym[] = [];
    users: User[] = [];
    newComentario: Comentario = { _id: '', content: '', userId: '', gymId: '', createdAt: new Date(), updatedAt: new Date() };
    selectedComentario: Comentario | null = null;
    page: number = 1;
    pageSize: number = 10;
    totalComments: number = 0;
    totalPages: number = 0;
  
    constructor(private comentarioService: ComentarioService) { }
  
    ngOnInit(): void {
      this.getComments();
    }
  
    // Obtener todos los comentarios
    getComments(): void {
      this.comentarioService.getComments(this.page, this.pageSize).subscribe(
        (data) => {
          console.log('Comentarios obtenidos:', data);
          this.comments = data.comments;
          console.log('Comments', this.comments);
          this.filteredComments = this.comments; 
          this.totalComments = data.totalComments;
          this.totalPages = data.totalPages;
        },
        (error) => {
          console.error('Error al obtener comentarios:', error);
        }
      );
    }

    searchComments(): void {
      if (this.searchGymName.trim() === '') {
        this.filteredComments = this.comments; // Mostrar todos los comentarios si no hay búsqueda
      } else {
        this.filteredComments = this.comments.filter((comment) =>
          comment.gymId.toLowerCase().includes(this.searchGymName.toLowerCase())
        );
      }
    }
  
    createComment(): void {
      if (!this.newComentario.content || !this.newComentario.userId || !this.newComentario.gymId) {
        alert('Por favor, complete todos los campos requeridos');
        return;
      }
  
      this.comentarioService.createComment(this.newComentario).subscribe(
        (data) => {
          this.comments.push(data);
          this.newComentario = { _id: '', content: '', userId: '', gymId: '', createdAt: new Date(), updatedAt: new Date()}; // Resetear el formulario
          alert('Comentario creado exitosamente');
        },
        (error) => {
          console.error('Error al crear comentario:', error);
          alert('Error al crear comentario: ' + (error.error?.message || 'Error desconocido'));
        }
      );
    }
  
  
  
  
    // Actualizar un comentario
    updateComment(): void {
      if (this.selectedComentario) {
        console.log("update comment", this.selectedComentario);
        this.comentarioService.updateComment(this.selectedComentario).subscribe(
          (data) => {
            const index = this.comments.findIndex((c) => c._id === data._id);
            if (index !== -1) {
              this.comments[index] = data;
              alert('Comentario actualizado exitosamente');
            }
            this.selectedComentario = null; // Limpiar selección
          },
          (error) => {
            console.error('Error al actualizar comentario:', error);
            alert('Error al actualizar comentario:' + JSON.stringify(error));
          }
        );
      }
    }
  
    // Eliminar un comentario
    deleteComment(_id: string): void {
      this.comentarioService.deleteComment(_id).subscribe(
        () => {
          // Refresh the user list after successfully hiding/showing the user
          this.getComments();
          alert(`Comentario eliminado exitosamente`);
        },
        (error) => {
          console.error('Error al eliminar comentario:', error);
          alert('Error al eliminar comentario: ' + JSON.stringify(error));
        }
      );
    }
  
    // Seleccionar un comentario para editar
    selectComentario(comment: Comentario): void {
      this.selectedComentario = { ...comment }; // Crear una copia para evitar modificar directamente
    }
  
    previousPage(): void {
      if (this.page > 1) {
        this.page--;
        this.getComments();
      }
    }
  
    nextPage(): void {
      if (this.page < this.totalPages) {
        this.page++;
        this.getComments();
      }
    }
  }

