import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {AudioPlayerComponent} from '../../../tp.components/src/lib/component/audio.player/audio.player.component';
import {VideoPlayerComponent} from '../../../tp.components/src/lib/component/video.player/video.player.component';
import {RatingComponent} from '../../../tp.components/src/lib/component/rating/rating.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    MatButton,
    AudioPlayerComponent,
    VideoPlayerComponent,
    RatingComponent,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test.app';
  
  controlRating = new FormControl<number>({value: 2, disabled: false}, {nonNullable: true});
  run(): void{
    console.log('run');
    
    debugger
    var x = document.getElementById("myAudio");
    // @ts-ignore
    x.play();

  }
}
