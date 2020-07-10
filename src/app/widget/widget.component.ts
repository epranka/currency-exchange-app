import { Component, OnInit } from '@angular/core';
import { Exchange } from '../models/Exchange';
import { ExchangeResult } from '../models/ExchangeResult';
import { WidgetService } from './widget.service';
import { Subscription, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.less'],
})
export class WidgetComponent implements OnInit {
  exchange: Exchange = {
    base_amount: undefined,
    base_currency: 'USD',
    quote_currency: 'EUR',
    isValid: true,
  };
  exchangeResult: ExchangeResult = null;
  isLoading: boolean = false;
  error: string | false = false;
  supportedCurrencies: string[] = ['USD', 'EUR', 'ILS'];

  private quoteSubscription: Subscription;

  constructor(private widgetService: WidgetService) {}

  ngOnInit(): void {}

  handleChange(exchange: Exchange) {
    this.exchange = exchange;

    if (exchange.isValid && exchange.base_amount) {
      if (exchange.base_currency === exchange.quote_currency) {
        this.error = false;
        this.exchangeResult = {
          exchange_rate: 1,
          quote_amount: parseInt(exchange.base_amount),
        };
      } else {
        this.quoteData();
      }
    } else if (exchange.isValid) {
      this.exchangeResult = null;
      this.error = false;
    }
  }

  private handleError() {
    return (response: any): Observable<any> => {
      console.log(response);
      if (typeof response.error?.error !== 'object') {
        return of({
          error: 'Sorry, something wrong with the service. Try again later',
        });
      }
      return of({ error: response.error.error.message });
    };
  }

  private quoteData() {
    const { base_currency, quote_currency, base_amount } = this.exchange;
    if (base_amount) {
      if (this.quoteSubscription) {
        this.quoteSubscription.unsubscribe();
      }
      this.isLoading = true;
      this.quoteSubscription = this.widgetService
        .quote(base_currency, quote_currency, base_amount)
        .pipe(catchError(this.handleError()))
        .subscribe((response) => {
          setTimeout(() => {
            this.isLoading = false;
          }, 200);
          if (response.error) {
            this.exchangeResult = null;
            this.error = response.error;
          } else {
            this.error = false;
            const exchangeResult = {
              exchange_rate: response.exchange_rate,
              quote_amount: response.quote_amount / 100,
            };
            this.exchangeResult = exchangeResult;
          }
        });
    }
  }
}
