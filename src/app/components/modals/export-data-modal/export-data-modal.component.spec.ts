import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDataModalComponent } from './export-data-modal.component';

describe('ExportDataModalComponent', () => {
  let component: ExportDataModalComponent;
  let fixture: ComponentFixture<ExportDataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportDataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
