import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private apiUrl = '/api/auth';
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private getAuthHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('token') || ''
      : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // NUEVO: actualizar nombre, email y/o contraseña del usuario logueado
  updateProfile(data: { nombre?: string; email?: string; password?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data, {
      headers: this.getAuthHeaders(),
    });
  }
}