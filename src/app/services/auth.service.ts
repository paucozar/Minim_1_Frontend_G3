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
      tap(response => {
        if (response){
          this.loggedIn.next(true);
          this.router.navigate(['/users']);
        }
      })
    )
  }
  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

}