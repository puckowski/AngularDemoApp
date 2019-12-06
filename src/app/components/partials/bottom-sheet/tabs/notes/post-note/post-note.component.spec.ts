import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostNoteComponent } from './post-note.component';

describe('PostNoteComponent', () => {
  let component: PostNoteComponent;
  let fixture: ComponentFixture<PostNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
