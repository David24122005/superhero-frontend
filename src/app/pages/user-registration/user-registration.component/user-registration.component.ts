import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
imports: [CommonModule,ReactiveFormsModule],
selector: 'app-user-registration',
templateUrl: './user-registration.component.html',
styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
registerForm!: FormGroup;
message: string = '';
isError: boolean = false;

constructor(private fb: FormBuilder, private usersService: UsersService) {}

ngOnInit(): void {
this.registerForm = this.fb.group({
nombre: ['', [Validators.required, Validators.minLength(3)]],
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required, Validators.minLength(6)]],
role: ['user'] // Valor por defecto
});
}

onSubmit() {
if (this.registerForm.valid) {
this.usersService.registerUser(this.registerForm.value).subscribe({
next: (res) => {
this.message = '¡Usuario registrado con éxito!';
this.isError = false;
this.registerForm.reset({ role: 'user' });
},
error: (err) => {
this.message = err.error.message || 'Error al registrar usuario';
this.isError = true;
}
});
}
}
}

