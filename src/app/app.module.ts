import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CurrencySelectorComponent } from './rate-section/currency-selector/currency-selector.component';
import { WidgetComponent } from './widget/widget.component';
import { BaseAmountComponent } from './rate-section/base-amount/base-amount.component';
import { RateSectionComponent } from './rate-section/rate-section.component';
import { LoadingBarComponent } from './widget/loading-bar/loading-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { ResultsSectionComponent } from './results-section/results-section.component';

@NgModule({
  declarations: [
    AppComponent,
    CurrencySelectorComponent,
    WidgetComponent,
    BaseAmountComponent,
    RateSectionComponent,
    LoadingBarComponent,
    ResultsSectionComponent,
  ],
  imports: [BrowserModule, NgSelectModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
