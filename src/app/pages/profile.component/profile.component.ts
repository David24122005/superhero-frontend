import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { FavoritesService } from '../../../services/favorites.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private favService = inject(FavoritesService);
  private notify = inject(NotifyService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Datos actuales mostrados en el banner
  currentName = '';
  currentEmail = '';
  favorites: any[] = [];
  loadingFavs = true;

  // Estado de edición
  editingProfile = false;
  editingPassword = false;
  savingProfile = false;
  savingPassword = false;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  get userInitial(): string {
    return this.currentName?.charAt(0)?.toUpperCase() || '?';
  }

  get passwordMismatch(): boolean {
    const { newPassword, confirmPassword } = this.passwordForm.value;
    return !!(confirmPassword && newPassword !== confirmPassword);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentName = localStorage.getItem('user_name') || '';
      this.currentEmail = localStorage.getItem('user_email') || '';
    }

    this.profileForm = this.fb.group({
      nombre: [this.currentName, [Validators.required, Validators.minLength(2)]],
      email: [this.currentEmail, [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.loadFavorites();
  }

  // ── Perfil ─────────────────────────────────────────────────────────────────

  startEditProfile(): void {
    this.profileForm.patchValue({
      nombre: this.currentName,
      email: this.currentEmail,
    });
    this.editingProfile = true;
  }

  cancelEditProfile(): void {
    this.editingProfile = false;
    this.profileForm.reset({ nombre: this.currentName, email: this.currentEmail });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile = true;

    const { nombre, email } = this.profileForm.value;

    this.usersService.updateProfile({ nombre, email }).subscribe({
      next: (res: any) => {
        this.currentName = nombre;
        this.currentEmail = email;

        // Actualizar localStorage y signal del AuthService
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('user_name', nombre);
          localStorage.setItem('user_email', email);
        }
        this.authService.setLoginData(nombre, localStorage.getItem('token') || '');

        this.notify.show('✅ Perfil actualizado', 'success');
        this.editingProfile = false;
        this.savingProfile = false;
      },
      error: (err: any) => {
        this.notify.show(err?.error?.error || 'Error al actualizar perfil', 'error');
        this.savingProfile = false;
      },
    });
  }

  // ── Contraseña ─────────────────────────────────────────────────────────────

  startEditPassword(): void {
    this.passwordForm.reset();
    this.editingPassword = true;
  }

  cancelEditPassword(): void {
    this.editingPassword = false;
    this.passwordForm.reset();
  }

  savePassword(): void {
    if (this.passwordForm.invalid || this.passwordMismatch) return;
    this.savingPassword = true;

    const { newPassword } = this.passwordForm.value;

    this.usersService.updateProfile({ password: newPassword }).subscribe({
      next: () => {
        this.notify.show('✅ Contraseña actualizada', 'success');
        this.editingPassword = false;
        this.savingPassword = false;
        this.passwordForm.reset();
      },
      error: (err: any) => {
        this.notify.show(err?.error?.error || 'Error al cambiar contraseña', 'error');
        this.savingPassword = false;
      },
    });
  }

  // ── Favoritos ──────────────────────────────────────────────────────────────

  loadFavorites(): void {
    this.favService.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
        this.loadingFavs = false;
      },
      error: () => {
        this.loadingFavs = false;
      },
    });
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/Placeholder.png';
  }
}
