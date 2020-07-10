import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.less'],
})
export class CurrencySelectorComponent implements OnInit {
  @Input() name: string;
  @Input() label: string;
  @Input() value: string;
  @Input() currencies: string[];

  @Output() changed = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  handleChange(value: string) {
    this.changed.emit(value);
  }
}
