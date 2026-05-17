import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NotifyService } from '../../../../services/notify.service';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../../services/auth.service';
import { FavoritesService } from '../../../../services/favorites.service';


@Component({
selector: 'app-favorites',
standalone: true,
imports: [CommonModule],
templateUrl: './favorites.component.html',
styleUrls: ['./favorites.component.scss'] // Puedes reutilizar el SCSS del catálogo
})
export class FavoritesComponent implements OnInit {
favorites: any[] = [];
loading = true;

private favService = inject(FavoritesService);
private notify = inject(NotifyService);
private cdr = inject(ChangeDetectorRef);
private router = inject(Router);
private authService = inject(AuthService);

ngOnInit() {
this.loadFavorites();
}

loadFavorites() {
this.favService.getFavorites().subscribe({
next: (data) => {
this.favorites = data.map(f => ({ ...f, esFavorito: true }));
this.loading = false;
this.cdr.detectChanges();
},
error: (err) => {
if (err.status === 401) {
this.notify.show('Debe loguearse para ver favoritos', 'info');
this.router.navigate(['/login']);
this.authService.logout();
} else {
this.notify.show('Error al cargar favoritos', 'error');
}
this.loading = false;
}
});
}

removeFromFavorites(heroe: any) {
this.favService.removeFavorite(heroe.id).subscribe({
next: () => {
// Filtramos el array para quitarlo de la vista inmediatamente
this.favorites = this.favorites.filter(h => h.id !== heroe.id);
this.notify.show(`${heroe.nombre} eliminado de favoritos`, 'info');
this.cdr.detectChanges();
},
error: () => this.notify.show('No se pudo eliminar', 'error')
});
}
}

