import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  private SERVICE_API_URL = '/api/quote';

  constructor(private http: HttpClient) {}

  public quote(
    base_currency: string,
    quote_currency: string,
    base_amount: string
  ) {
    const options = {
      params: new HttpParams({
        fromObject: {
          base_currency,
          quote_currency,
          // base_amount: (-1).toString(),
          base_amount: (parseFloat(base_amount) * 100).toString(),
        },
      }),
    };
    return this.http.get(this.SERVICE_API_URL, options);
  }
}
