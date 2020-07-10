import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Exchange } from '../models/Exchange';

@Component({
  selector: 'app-rate-section',
  templateUrl: './rate-section.component.html',
  styleUrls: ['./rate-section.component.less'],
})
export class RateSectionComponent implements OnInit {
  @Input() exchange: Exchange;
  @Input() supportedCurrencies: string[];

  @Output() changed = new EventEmitter<Exchange>();

  constructor() {}

  ngOnInit(): void {}

  handleBaseCurrencyChange(base_currency: string) {
    const exchange: Exchange = { ...this.exchange, base_currency };
    this.changed.emit(exchange);
  }

  handleQuoteCurrencyChange(quote_currency: string) {
    const exchange: Exchange = { ...this.exchange, quote_currency };
    this.changed.emit(exchange);
  }

  handleBaseAmount(isValid, base_amount) {
    const exchange: Exchange = { ...this.exchange, isValid, base_amount };
    this.changed.emit(exchange);
  }
}
