import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSearchbarComponent } from './grid-searchbar.component';

describe('GridSearchbarComponent', () => {
  let component: GridSearchbarComponent;
  let fixture: ComponentFixture<GridSearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSearchbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
