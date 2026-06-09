import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroesService, Heroe } from '../../../services/heroes.service';
import { FavoritesService } from '../../../services/favorites.service';
import { AuthService } from '../../../services/auth.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-hero-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-detail-modal.component.html',
  styleUrls: ['./hero-detail-modal.component.scss'],
})
export class HeroDetailModalComponent implements OnInit {
  @Input() hero: Heroe | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() heroUpdated = new EventEmitter<Heroe>();
  @Output() favToggled = new EventEmitter<Heroe>();

  private heroesService = inject(HeroesService);
  private favService = inject(FavoritesService);
  private authService = inject(AuthService);
  private notify = inject(NotifyService);

  editMode = false;
  saving = false;
  editData: Partial<Heroe> = {};

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    // Bloquear scroll del body mientras el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    document.body.style.overflow = '';
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  enterEditMode(): void {
    if (!this.hero) return;
    this.editData = { ...this.hero };
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editData = {};
  }

  saveChanges(): void {
    if (!this.hero?.id || !this.editData.nombre || !this.editData.poder || !this.editData.imagen_url) return;

    this.saving = true;

    const payload = {
      nombre: this.editData.nombre!,
      poder: this.editData.poder!,
      fortaleza: this.editData.fortaleza ?? '',
      resistencia: this.editData.resistencia ?? '',
      debilidad: this.editData.debilidad ?? '',
      imagen_url: this.editData.imagen_url!,
    };

    this.heroesService.updateHero(this.hero.id, payload).subscribe({
      next: (res: any) => {
        // Actualizar el hero local con los datos nuevos
        if (this.hero) {
          Object.assign(this.hero, payload);
          this.heroUpdated.emit(this.hero);
        }
        this.notify.show(`✅ ${payload.nombre} actualizado con éxito`, 'success');
        this.editMode = false;
        this.saving = false;
      },
      error: (err: any) => {
        this.notify.show('Error al actualizar el héroe', 'error');
        console.error(err);
        this.saving = false;
      },
    });
  }

  toggleFav(): void {
    if (!this.hero) return;

    if (!this.isLoggedIn) {
      this.notify.show('Inicia sesión para guardar favoritos 🔒', 'info');
      return;
    }

    if (this.hero.esFavorito) {
      this.favService.removeFavorite(this.hero.id!).subscribe({
        next: () => {
          this.hero!.esFavorito = false;
          this.favToggled.emit(this.hero!);
          this.notify.show('Eliminado de favoritos', 'info');
        },
        error: () => this.notify.show('No se pudo eliminar', 'error'),
      });
    } else {
      this.favService.addFavorite(this.hero.id!).subscribe({
        next: () => {
          this.hero!.esFavorito = true;
          this.favToggled.emit(this.hero!);
          this.notify.show(`${this.hero!.nombre} añadido a favoritos ❤️`, 'success');
        },
        error: (err: any) => {
          if (err.status === 400) {
            this.notify.show('Ya está en tus favoritos ❗', 'info');
          } else {
            this.notify.show('Error al añadir a favoritos', 'error');
          }
        },
      });
    }
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/Placeholder.png';
  }
}
