import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastSupplyComponent } from './forecast-supply.component';

describe('ForecastSupplyComponent', () => {
  let component: ForecastSupplyComponent;
  let fixture: ComponentFixture<ForecastSupplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastSupplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
