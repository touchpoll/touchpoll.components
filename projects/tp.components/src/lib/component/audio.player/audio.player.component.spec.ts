import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AudioPlayerComponent} from './audio.player.component';
import {MatTestDialogOpenerModule} from '@angular/material/dialog/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

xdescribe('AudioPlayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;
  
  // const fakeSocketService = jasmine.createSpyObj(['orderAudioFileInfoSelect',]);
  // fakeSocketService.orderAudioFileInfoSelect.and.returnValue(of([]));
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
       imports: [AudioPlayerComponent,
         MatTestDialogOpenerModule,
         // IconsModule
       ],
       providers: [
         provideHttpClient(withInterceptorsFromDi()),
         provideHttpClientTesting()
       ]
     })
     .compileComponents();
    
    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
