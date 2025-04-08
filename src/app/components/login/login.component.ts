import { Component, signal, inject, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LoginForm } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  protected readonly loginForm: FormGroup<LoginForm>;
  protected readonly loading: WritableSignal<boolean> = signal(false);
  protected readonly showErrorToast: WritableSignal<boolean> = signal(false);
  protected readonly showPassword: WritableSignal<boolean> = signal(false);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9_\-+]+$/)],
      }),
    });
  }

  protected get emailControl(): FormControl<string> {
    return this.loginForm.controls.email;
  }

  protected get passwordControl(): FormControl<string> {
    return this.loginForm.controls.password;
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value: boolean) => !value);
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.loading.set(true);

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/home']);
        this.loading.set(false);
      },
      error: () => {
        this.showErrorToast.set(true);
        this.loading.set(false);
        setTimeout(() => {
          this.showErrorToast.set(false);
          this.loginForm.reset();
        }, 10000);
      },
    });
  }
}
