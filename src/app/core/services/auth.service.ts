import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Auth, MockUser } from '../models/auth.model';
import { Router } from '@angular/router';
import { MOCK_USERS } from '../consts/mock-api.consts';
import { LocalStorageKeys } from '../enums/local-storage.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public user: WritableSignal<string | null> = signal<string | null>(this.loadUser());
  public token: WritableSignal<string | null> = signal<string | null>(this.loadToken());
  private readonly router: Router = inject(Router);

  public isLoggedIn(): boolean {
    return !!this.token();
  }

  public login({ email, password }: Auth): Observable<unknown> {
    const foundUser: MockUser | undefined = MOCK_USERS.find(
      (user: MockUser) => user.email === email && user.password === password,
    );

    if (foundUser) {
      this.user.set(foundUser.fullName);
      this.token.set(foundUser.token);

      localStorage.setItem(LocalStorageKeys.Token, foundUser.token);
      localStorage.setItem(LocalStorageKeys.User, foundUser.fullName);

      return of({ fullName: foundUser.fullName }).pipe(delay(1000));
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
    }
  }

  public logout(): void {
    this.user.set(null);
    this.token.set(null);

    localStorage.removeItem(LocalStorageKeys.Token);
    localStorage.removeItem(LocalStorageKeys.User);

    this.router.navigate(['login']);
  }

  private loadToken(): string | null {
    return localStorage.getItem(LocalStorageKeys.Token);
  }

  private loadUser(): string | null {
    return localStorage.getItem(LocalStorageKeys.User);
  }
}
