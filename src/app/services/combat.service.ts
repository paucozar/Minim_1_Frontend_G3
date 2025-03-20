import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Combat } from '../models/combat.model';

@Injectable({
  providedIn: 'root',
})
export class CombatService {
  private apiUrl = 'http://localhost:9000/api/combat';
  
  constructor(private http: HttpClient) {}

  // Crear nuevo combate
  createCombat(combat: Combat): Observable<Combat> {
    // Preparar datos para enviar al backend
    const combatData = {
      gym: combat.gym, // ID del gimnasio
      date: combat.date instanceof Date ? combat.date : new Date(combat.date),
      boxers: this.processBoxers(combat.boxers) // Asegurarse de que boxers sea un array
    };
    
    console.log('Datos enviados al servidor:', combatData);
    
    return this.http.post<Combat>(this.apiUrl, combatData)
      .pipe(catchError(this.handleError));
  }

  // Obtener todos los combates
  getCombats(): Observable<Combat[]> {
    return this.http.get<Combat[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Obtener combate por ID
  getCombatById(_id: string): Observable<Combat> {
    return this.http.get<Combat>(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }

  // Actualizar combate
  updateCombat(combat: Combat): Observable<Combat> {
    // Asegurarse de que tenemos un ID válido
    if (!combat._id) {
      return throwError(() => new Error('No se puede actualizar, falta el ID'));
    }

    const updateData = {
      gym: combat.gym,
      date: combat.date instanceof Date ? combat.date : new Date(combat.date),
      boxers: this.processBoxers(combat.boxers)
    };

    return this.http.put<Combat>(`${this.apiUrl}/${combat._id}`, updateData)
      .pipe(catchError(this.handleError));
  }

  // Eliminar combate
  deleteCombat(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener boxeadores por ID de combate
  getBoxersByCombatId(_id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${_id}/boxers`)
      .pipe(catchError(this.handleError));
  }

  // Ocultar/mostrar combate
  hideCombat(_id: string, isHidden: boolean): Observable<Combat> {
    return this.http.put<Combat>(`${this.apiUrl}/${_id}/oculto`, { isHidden })
      .pipe(catchError(this.handleError));
  }

  // Procesar datos de boxeadores, asegurarse de que sea un array
  private processBoxers(boxers: any): string[] {
    if (typeof boxers === 'string') {
      // Si es una cadena, dividir por comas
      return boxers.split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0); // Filtrar cadenas vacías
    } else if (Array.isArray(boxers)) {
      // Si ya es un array, asegurarse de que cada elemento sea válido
      return boxers
        .map(id => typeof id === 'string' ? id.trim() : String(id))
        .filter(id => id.length > 0);
    }
    // Si no es ni una cadena ni un array, devolver un array vacío
    return [];
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error de API:', error);
    
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor: Código de estado ${error.status}`;
      if (error.error && error.error.message) {
        errorMessage += `, Detalles: ${error.error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}