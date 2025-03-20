import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); 
  private apiUrl = 'http://localhost:9000/api/users/login'; 

  constructor(private http: HttpClient, private router: Router) {}

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        console.log('Respuesta del backend:', response); // Depuración
  
        // Acceder correctamente al campo isAdmin dentro del objeto user
        if (response && response.user && response.user.isAdmin === true) {
          this.loggedIn.next(true);
          this.router.navigate(['/users']); // Redirigir a la gestión de usuarios
        } else if (response && response.user && response.user.isAdmin === false) {
          this.loggedIn.next(false);
          this.router.navigate(['/welcome']); // Redirigir a la página de bienvenida
        } else {
          console.error('Estructura de la respuesta inesperada:', response);
          alert('Error: Respuesta inesperada del servidor.');
        }
      })
    );
  }
  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

}