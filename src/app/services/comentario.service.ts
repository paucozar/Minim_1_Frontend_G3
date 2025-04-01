import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateComentarioDTO, Comentario } from '../models/comentario.model';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private createUrl = 'http://localhost:9000/api/comments/create';
  private listUrl = 'http://localhost:9000/api/comments';
  private updateUrl = 'http://localhost:9000/api/comments';
  private deleteUrl = 'http://localhost:9000/api/comments';

  constructor(private http: HttpClient) {}

  // Crear un nuevo comentario
  createComment(comment: Comentario): Observable<Comentario> {
    const commentData = {
      content: comment.content,
      userId: comment.userId,
      gymId: comment.gymId,
    };
    return this.http.post<Comentario>(this.createUrl, commentData);
  }

  // Obtener todos los comentarios
  getComments(page: number, pageSize: number): Observable<{comments: Comentario[], totalComments: number, totalPages: number, currentPage: number}> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<{comments: Comentario[], totalComments: number, totalPages: number, currentPage: number}>(this.listUrl, { params });
  }

  // Actualizar un comentario por ID
  updateComment(comment: Comentario): Observable<Comentario> {
    console.log("comment", comment)
    return this.http.put<Comentario>(`${this.updateUrl}/${comment._id}`, comment);
  }

  // Eliminar un comentario por ID
  deleteComment(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.deleteUrl}/${_id}`);
  }

}