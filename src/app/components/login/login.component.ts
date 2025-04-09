import { Component, signal, inject, WritableSignal, OnInit, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LoginForm } from '../../core/models/auth.model';
import { timer } from 'rxjs';
import { SHOW_ERROR_TOAST_MS } from '../../core/consts/mock-api.consts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  protected loginForm!: FormGroup<LoginForm>;
  protected readonly loading: WritableSignal<boolean> = signal(false);
  protected readonly showErrorToast: WritableSignal<boolean> = signal(false);
  protected readonly showPassword: WritableSignal<boolean> = signal(false);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9_\-+]+$/)]],
    });
  }

  protected get isEmailInvalid(): boolean {
    return this.emailControl.invalid && this.emailControl.touched;
  }

  protected get isPasswordInvalid(): boolean {
    return this.passwordControl.invalid && this.passwordControl.touched;
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
      next: () => this.handleLoginSuccess(),
      error: () => this.handleLoginError(),
    });
  }

  private handleLoginSuccess(): void {
    this.loading.set(false);
    this.router.navigate(['/home']);
  }

  private handleLoginError(): void {
    this.loading.set(false);
    this.showErrorToast.set(true);

    timer(SHOW_ERROR_TOAST_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showErrorToast.set(false);
        this.loginForm.reset();
      });
  }
}
