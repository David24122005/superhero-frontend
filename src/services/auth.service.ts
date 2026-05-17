import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<{ nombre: string } | null>(null);
  private apiUrl = 'api/auth/login';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {
    // Only run this code in the browser
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user_name');
      const token = localStorage.getItem('token');
      if (savedUser && token) {
        this.currentUser.set({ nombre: savedUser });
      }
    }
  }

  setLoginData(nombre: string, token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('user_name', nombre);
    }
    this.currentUser.set({ nombre });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((res: any) => {
        if (res.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.clear();
    }
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}