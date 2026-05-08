import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private currentId = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  show(kind: ToastKind, title: string, message?: string, durationMs = 3500): void {
    const id: number = ++this.currentId;
    const toast: ToastMessage = { id, kind, title, message };

    this.toasts.update((items) => [...items, toast]);

    if (typeof window !== 'undefined') {
      window.setTimeout(() => this.dismiss(id), durationMs);
    }
  }

  dismiss(id: number): void {
    this.toasts.update((items) => items.filter((toast) => toast.id !== id));
  }
}
