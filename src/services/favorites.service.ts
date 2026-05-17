import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = '/api';

  private getAuthHeaders(): HttpHeaders | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    
    const token = localStorage.getItem('token');
    if (!token || token === '') {
      return null;
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getFavorites(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    console.log('Obteniendo favoritos con token:', localStorage.getItem('token'));
    return this.http.get<any[]>(`${this.apiUrl}/heroes/favorites`, { headers });
  }

  addFavorite(heroeId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.post(`${this.apiUrl}/heroes/favorites`, { heroeId }, { headers });
  }

  removeFavorite(heroeId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.delete(`${this.apiUrl}/heroes/favorites/${heroeId}`, { headers });
  }
}