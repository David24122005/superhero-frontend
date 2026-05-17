import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroesService, Heroe } from '../../../../services/heroes.service';
import { NotifyService } from '../../../../services/notify.service';
import { Router } from '@angular/router';

@Component({
selector: 'app-add-hero',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './add-hero.component.html',
styleUrls: ['./add-hero.component.scss']
})
export class AddHeroComponent {
// Inicializamos el objeto con todos los campos requeridos
heroData: Heroe = {
nombre: '',
poder: '',
fortaleza: '',
resistencia: '',
debilidad: '',
imagen_url: ''
};

private heroService = inject(HeroesService);
private notify = inject(NotifyService);
private router = inject(Router);

fileNameSelected: string = '';

// Captura el nombre del archivo seleccionado
onFileSelected(event: any) {
const file: File = event.target.files[0];

if (file) {
this.fileNameSelected = file.name;
// Guardamos solo el nombre (ej: "batman.png")
this.heroData.imagen_url = file.name;
}
}

// Getter para la ruta de la imagen en la previsualización
get fullImagePath(): string {
const imageName = this.heroData.imagen_url || 'placeholder.png';
// Si la imagen es un placeholder, asumimos que está en la misma carpeta o ajusta la ruta
return `assets/images/${imageName}`;
}

onSubmit() {
this.heroService.createHero(this.heroData).subscribe({
next: () => {
this.notify.show(`¡${this.heroData.nombre} ha sido reclutado! 🛡️`, 'success');
this.router.navigate(['/dashboard']); // Ajusta según tu ruta de catálogo
},
error: (err) => {
this.notify.show('Error al registrar al héroe. Revisa los datos.', 'error');
console.error('Error en el servidor:', err);
}
});
}
}
