import { Auth } from '../models/auth.model';
import { Observable, of, throwError } from 'rxjs';
import { MOCK_USERS } from '../consts/mock-api.consts';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { MockUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  public login({ email, password }: Auth): Observable<{ token: string }> {
    const foundUser: MockUser | undefined = MOCK_USERS.find(
      (user: MockUser) => user.email === email && user.password === password,
    );

    if (foundUser) {
      return of({ token: foundUser.token }).pipe(delay(1000));
    }

    return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
  }
}
