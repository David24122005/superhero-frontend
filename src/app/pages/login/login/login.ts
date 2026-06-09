import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router,RouterOutlet,RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
selector: 'app-login',
imports: [ReactiveFormsModule,CommonModule,RouterLink],
templateUrl: './login.html',
styleUrl: './login.scss',
})

export class Login {

loginForm: FormGroup;
errorMessage: string = '';

constructor(
private fb: FormBuilder,
private authService: AuthService,
private router: Router
) {
this.loginForm = this.fb.group({
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required]]
});
}

onLogin() {
if (this.loginForm.valid) {
console.log('Formulario de login válido:', this.loginForm.value);
this.authService.login(this.loginForm.value).subscribe({
next: (res: any) => {
this.authService.setLoginData(res.nombre, res.token);
localStorage.setItem('user_email',this.loginForm.value.email);
this.router.navigate(['/catalog']); // Redirigir al catálogo al entrar
},
error: (err) => {
this.errorMessage = err.error.message || 'Credenciales inválidas';
}
});
}
}
}
