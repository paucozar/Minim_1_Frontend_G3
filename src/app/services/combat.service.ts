import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combat } from '../models/combat.model';

@Injectable({
  providedIn: 'root',
})
export class CombatService {
  private apiUrl = 'http://localhost:9000/api/combat';
  private idUrl = 'http://localhost:9000/api/combat/{id}';
  private boxersUrl = 'http://localhost:9000/api/combat/{id}/boxers';


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
    return this.http.get<Combat>(`${this.idUrl}/${id}`);
  }

  // Actualizar un combate por ID
  updateCombat(id: number, combat: Combat): Observable<Combat> {
    return this.http.put<Combat>(`${this.idUrl}/${id}`, combat);
  }

  // Eliminar un combate por ID
  deleteCombat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.idUrl}/${id}`);
  }

  // Obtener boxeadores por ID del combate
  getBoxersByCombatId(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.boxersUrl}/${id}/boxers`);
  }
}