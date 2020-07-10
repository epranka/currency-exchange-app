import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAmountComponent } from './base-amount.component';

describe('BaseAmountComponent', () => {
  let component: BaseAmountComponent;
  let fixture: ComponentFixture<BaseAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
