import {TestBed} from '@angular/core/testing';
import {VideoPlayerComponent} from './video.player.component';

describe('VideoPlayerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayerComponent],
    }).compileComponents();
  });
  
  it('should create the app', () => {
    const fixture = TestBed.createComponent(VideoPlayerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
