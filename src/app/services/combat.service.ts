import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combat } from '../models/combat.model';

@Injectable({
  providedIn: 'root',
})
export class CombatService {
  private apiUrl = 'http://localhost:7000/api/combat';

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
  getCombatById(id: number): Observable<Combat> {
    return this.http.get<Combat>(`${this.apiUrl}/${id}`);
  }

  // Actualizar un combate por ID
  updateCombat(id: number, combat: Combat): Observable<Combat> {
    return this.http.put<Combat>(`${this.apiUrl}/${id}`, combat);
  }

  // Eliminar un combate por ID
  deleteCombat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener boxeadores por ID del combate
  getBoxersByCombatId(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${id}/boxers`);
  }
}