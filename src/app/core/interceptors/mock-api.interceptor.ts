import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockDataItem } from '../models/mock-api.model';
import { MOCK_API_DELAY_MS } from '../consts/mock-api.consts';
import { generateMockData } from '../helpers/mock-api.helper';

export const mockApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const isMockDataRequest: boolean = req.url.endsWith('/data') && req.method === 'GET';

  if (isMockDataRequest) {
    const mockData: MockDataItem[] = generateMockData();
    return of(new HttpResponse({ status: 200, body: mockData })).pipe(delay(MOCK_API_DELAY_MS));
  }

  return next(req);
};
