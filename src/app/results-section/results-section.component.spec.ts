import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsSectionComponent } from './results-section.component';

describe('ResultsSectionComponent', () => {
  let component: ResultsSectionComponent;
  let fixture: ComponentFixture<ResultsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
