import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateSectionComponent } from './rate-section.component';

describe('RateSectionComponent', () => {
  let component: RateSectionComponent;
  let fixture: ComponentFixture<RateSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
