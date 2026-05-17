import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotifyService {
message = signal<string | null>(null);
type = signal<'success' | 'error' | 'info'>('info');

show(msg: string, type: 'success' | 'error' | 'info' = 'info') {
	this.message.set(msg);
	this.type.set(type);
	// Se limpia automáticamente tras 3 segundos
	setTimeout(() => {
	this.message.set(null);
	}, 3000);
  }
}
