import { Observable, of, throwError } from 'rxjs';
import { MOCK_USERS } from '../consts/mock-api.consts';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { MockUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  public getUser(token: string): Observable<MockUser> {
    const user: MockUser | undefined = MOCK_USERS.find((user: MockUser) => user.token === token);
    return user ? of(user).pipe(delay(500)) : throwError(() => new Error('User not found')).pipe(delay(500));
  }
}
