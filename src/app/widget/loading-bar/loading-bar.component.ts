import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.less'],
})
export class LoadingBarComponent implements OnInit {
  @Input() isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
