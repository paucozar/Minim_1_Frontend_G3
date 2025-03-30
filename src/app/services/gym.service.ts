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
  getGymById(_id: string): Observable<Gym> {
    return this.http.get<Gym>(`${this.getUrl}/${_id}`);
  }

  // Actualizar un gimnasio por ID
  updateGym(gym: Gym): Observable<Gym> {
    console.log("id", gym._id)
    return this.http.put<Gym>(`${this.getUrl}/${gym._id}`, gym);
  }

  // Eliminar un gimnasio por ID
  deleteGym(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.getUrl}/${_id}`);
  }
  // Ocultar o mostrar un gimnasio por ID
hideGym(_id: string, isHidden: boolean): Observable<Gym> {
  return this.http.put<Gym>(`${this.getUrl}/${_id}/oculto`, { isHidden });
}
}