import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeroesService, Heroe } from '../../../../services/heroes.service';
import { AuthService } from '../../../../services/auth.service';
import { NotifyService } from '../../../../services/notify.service';
import { FavoritesService } from '../../../../services/favorites.service';
import { HeroDetailModalComponent } from '../../hero-detail-modal/hero-detail-modal.component'; // <-- NUEVO

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, HeroDetailModalComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotifyService);
  private favService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  heroes: Heroe[] = [];
  loading = true;
  selectedHero: Heroe | null = null; 

  constructor(private heroesService: HeroesService) {}

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes() {
    this.loading = true;
    this.heroesService.getCatalog().subscribe({
      next: (data: any) => {
        this.heroes = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.loading = false;
      },
    });
  }

  openModal(heroe: Heroe): void {
    this.selectedHero = heroe;
  }

  closeModal(): void {
    this.selectedHero = null;
  }

  onHeroUpdated(updated: Heroe): void {
    const idx = this.heroes.findIndex((h) => h.id === updated.id);
    if (idx !== -1) {
      this.heroes[idx] = { ...this.heroes[idx], ...updated };
      this.cdr.detectChanges();
    }
  }

  onFavToggled(heroe: Heroe): void {
    const idx = this.heroes.findIndex((h) => h.id === heroe.id);
    if (idx !== -1) {
      this.heroes[idx] = { ...this.heroes[idx], esFavorito: heroe.esFavorito };
      this.cdr.detectChanges();
    }
  }

  addToFavorites(heroes: any) {
    if (!this.authService.isLoggedIn()) {
      this.notify.show('¡ALTO AHÍ! Inicia sesión primero 🔒', 'info');
      return;
    }

    this.heroesService.addFavorite(heroes.id).subscribe({
      next: () => {
        const index = this.heroes.findIndex((h) => h.id === heroes.id);
        if (index !== -1) {
          this.heroes[index] = { ...this.heroes[index], esFavorito: true };
        }
        this.notify.show(`${heroes.nombre} añadido a tus favoritos ❤️`, 'success');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.notify.show('Tu sesión ha expirado 🔒', 'error');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 400) {
          this.notify.show(`${heroes.nombre} ya está en tus favoritos ❗`, 'info');
        } else {
          this.notify.show('Error al añadir a favoritos ❌', 'error');
        }
      },
    });
  }
}