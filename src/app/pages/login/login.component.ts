import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true
    }),
    password: new FormControl('', {
      nonNullable: true
    }),
    remember: new FormControl(false, { nonNullable: true })
  });

  async submit(): Promise<void> {
    this.isSubmitting.set(true);

    await this.router.navigateByUrl('/dashboard');
    this.isSubmitting.set(false);
  }
}
