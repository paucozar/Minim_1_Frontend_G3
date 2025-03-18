import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gym } from '../models/gym.model';

@Injectable({
  providedIn: 'root',
})
export class GymService {
  private apiUrl = 'http://localhost:9000/api/gym';
  private getUrl = 'http://localhost:9000/api/gym';
  private getIdUrl = 'http://localhost:9000/api/gym/{id}';


  constructor(private http: HttpClient) {}

  // Crear un nuevo gimnasio
  createGym(gym: Gym): Observable<Gym> {
    return this.http.post<Gym>(this.apiUrl, gym);
  }

  // Obtener todos los gimnasios
  getGyms(): Observable<Gym[]> {
    return this.http.get<Gym[]>(this.apiUrl);
  }

  // Obtener un gimnasio por ID
  getGymById(id: number): Observable<Gym> {
    return this.http.get<Gym>(`${this.getIdUrl}/${id}`);
  }

  // Actualizar un gimnasio por ID
  updateGym(id: number, gym: Gym): Observable<Gym> {
    return this.http.put<Gym>(`${this.getIdUrl}/${id}`, gym);
  }

  // Eliminar un gimnasio por ID
  deleteGym(id: number): Observable<void> {
    return this.http.delete<void>(`${this.getIdUrl}/${id}`);
  }
}