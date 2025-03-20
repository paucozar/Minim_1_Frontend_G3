import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combat } from '../models/combat.model';

@Injectable({
  providedIn: 'root',
})
export class CombatService {
  private apiUrl = 'http://localhost:9000/api/combat';



  constructor(private http: HttpClient) {}

  // Crear un nuevo combate
  createCombat(combat: Combat): Observable<Combat> {
    return this.http.post<Combat>(this.apiUrl, combat);
  }

  // Obtener todos los combates
  getCombats(): Observable<Combat[]> {
    return this.http.get<Combat[]>(this.apiUrl);
  }

  // Obtener un combate por ID
  getCombatById(_id: string): Observable<Combat> {
    return this.http.get<Combat>(`${this.apiUrl}/${_id}`);
  }

  // Actualizar un combate por ID
  updateCombat(combat: Combat): Observable<Combat> {
    return this.http.put<Combat>(`${this.apiUrl}/${combat._id}`, combat);
  }

  // Eliminar un combate por ID
  deleteCombat(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${_id}`);
  }

  // Obtener boxeadores por ID del combate
  getBoxersByCombatId(_id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${_id}/boxers`);
  }
}