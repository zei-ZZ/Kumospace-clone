import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoboxComponent } from './videobox.component';

describe('VideoboxComponent', () => {
  let component: VideoboxComponent;
  let fixture: ComponentFixture<VideoboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
