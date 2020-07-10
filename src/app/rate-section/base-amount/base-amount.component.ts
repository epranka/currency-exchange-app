import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-base-amount',
  templateUrl: './base-amount.component.html',
  styleUrls: ['./base-amount.component.less'],
})
export class BaseAmountComponent implements OnInit {
  value: string = '';
  isValid: boolean = true;

  @Output() changed = new EventEmitter<[boolean, (string | undefined)?]>();

  constructor() {}

  ngOnInit(): void {}

  private sanitizeValue(value: string) {
    if (this.isValid && value) {
      const floatValue = parseFloat(value.replace(/\s+/g, ''));
      return (Math.round(floatValue * 100) / 100).toString();
    }
  }

  validateInput(e: KeyboardEvent) {
    const value = ((e.target as HTMLInputElement).value || '').trim();
    if (!value) {
      this.isValid = true;
      return this.changed.emit([true, '']);
    }
    // validate input value
    this.isValid = /^[0-9\s]*(\.[0-9\s]*)?$/.test(value);

    if (this.isValid) {
      this.changed.emit([true, this.sanitizeValue(value)]);
    } else {
      this.changed.emit([false]);
    }
  }

  sanitizeInput(e: FocusEvent) {
    if (this.isValid) {
      this.value = this.sanitizeValue(
        ((e.target as HTMLInputElement).value || '').trim()
      );
    }
  }
}
