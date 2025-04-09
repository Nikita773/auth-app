import { Injectable, signal, WritableSignal, inject, effect } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Auth, AuthToken } from '../models/auth.model';
import { Router } from '@angular/router';
import { LocalStorageKeys } from '../enums/local-storage.enum';
import { AuthApiService } from './auth-api.service';
import { UserApiService } from './user-api.service';
import { MockUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly token: WritableSignal<string | null> = signal(this.loadToken());
  public readonly user: WritableSignal<MockUser | null> = signal(null);
  private readonly router: Router = inject(Router);
  private readonly authApi: AuthApiService = inject(AuthApiService);
  private readonly userApi: UserApiService = inject(UserApiService);

  constructor() {
    effect(() => {
      const token: string | null = this.token();
      if (token) {
        this.userApi.getUser(token).subscribe({
          next: (res: MockUser) => this.user.set(res),
          error: () => this.user.set(null),
        });
      } else {
        this.user.set(null);
      }
    });
  }

  public isLoggedIn(): boolean {
    return !!this.token();
  }

  public login(credentials: Auth): Observable<AuthToken> {
    return this.authApi
      .login(credentials)
      .pipe(switchMap((authToken: { token: string }) => this.checkAndSetToken(authToken)));
  }

  public logout(): void {
    this.token.set(null);
    localStorage.removeItem(LocalStorageKeys.Token);
    this.router.navigate(['/login']);
  }

  private loadToken(): string | null {
    return localStorage.getItem(LocalStorageKeys.Token);
  }

  private checkAndSetToken(authToken: AuthToken): Observable<AuthToken> {
    const tokenData: string = authToken.token;

    if (tokenData) {
      this.token.set(tokenData);
      localStorage.setItem(LocalStorageKeys.Token, tokenData);
    }

    return of(authToken);
  }
}
