import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-results-section',
  templateUrl: './results-section.component.html',
  styleUrls: ['./results-section.component.less'],
})
export class ResultsSectionComponent implements OnInit {
  @Input() exchange_rate: number;
  @Input() quote_amount: number;

  constructor() {}

  ngOnInit(): void {}
}
