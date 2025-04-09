import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { MockDataItem } from '../models/mock-api.model';

@Injectable({ providedIn: 'root' })
export class MockDataApiService {
  private readonly http: HttpClient = inject(HttpClient);

  public getMockDataItems(): Observable<MockDataItem[]> {
    return this.http.get<MockDataItem[]>('/data');
  }
}
