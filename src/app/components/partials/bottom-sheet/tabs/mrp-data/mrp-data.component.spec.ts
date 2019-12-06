import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrpDataComponent } from './mrp-data.component';

describe('MrpDataComponent', () => {
  let component: MrpDataComponent;
  let fixture: ComponentFixture<MrpDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrpDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrpDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
