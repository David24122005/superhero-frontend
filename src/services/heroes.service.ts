import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

export interface Heroe {
  id?: number;
  nombre: string;
  poder: string;
  fortaleza: string;
  resistencia: string;
  debilidad: string;
  imagen_url: string;
  esFavorito?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private readonly API_URL = '/api';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }

  getCatalog(): Observable<Heroe[]> {
    console.log('Llamando a getCatalog');
    console.log(`URL de la API: ${this.API_URL}/catalog`);
    return this.http.get<Heroe[]>(`${this.API_URL}/heroes/catalog`);
  }

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

  addFavorite(heroId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }
    return this.http.post(`${this.API_URL}/heroes/favorites`, { heroId }, { headers });
  }

  createHero(hero: { nombre: string, poder: string, fortaleza: string, resistencia: string, debilidad: string, imagen_url: string }): Observable<any> {
    if (!hero.nombre || !hero.poder || !hero.fortaleza || !hero.resistencia || !hero.debilidad || !hero.imagen_url) {
      throw new Error('Todos los campos del héroe son obligatorios');
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }

    return this.http.post(`${this.API_URL}/heroes`, hero, { headers });
  }

  updateHero(id: number, hero: { nombre: string, poder: string, fortaleza: string, resistencia: string, debilidad: string, imagen_url: string }): Observable<any> {
    if (!hero.nombre || !hero.poder || !hero.fortaleza || !hero.resistencia || !hero.debilidad || !hero.imagen_url) {
      throw new Error('Todos los campos del héroe son obligatorios');
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }

    return this.http.put(`${this.API_URL}/heroes/${id}`, hero, { headers });
  }

  deleteHero(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('No se encontró el token de autenticación');
    }

    return this.http.delete(`${this.API_URL}/heroes/${id}`, { headers });
  }
}