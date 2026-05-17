import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
private apiUrl = '/api/auth/register'; // El proxy lo redirigirá a tu backend

constructor(private http: HttpClient) {}

registerUser(userData: any): Observable<any> {
return this.http.post(this.apiUrl, userData);
}
}
