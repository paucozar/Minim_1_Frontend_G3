import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private registerUrl = 'http://localhost:9000/api/users/register';
  private listUrl = 'http://localhost:9000/api/users';
  private updateUrl = 'http://localhost:9000/api/users/{id}';
  private apiUrl = 'http://localhost:9000/api/users/{id}';

  constructor(private http: HttpClient) {}

  // Crear un nuevo usuario
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.registerUrl, user);
  }

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.listUrl);
  }

  // Actualizar un usuario por ID
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.updateUrl}/${id}`, user);
  }

  // Eliminar un usuario por ID
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}