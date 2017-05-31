import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGrabberComponent } from './photo-grabber.component';

describe('PhotoGrabberComponent', () => {
  let component: PhotoGrabberComponent;
  let fixture: ComponentFixture<PhotoGrabberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoGrabberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoGrabberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
