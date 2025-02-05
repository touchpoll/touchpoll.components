import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {AudioPlayerComponent} from '../../../tp.components/src/lib/component/audio.player/audio.player.component';

@Component({
  selector: 'app-root',
  imports: [
   MatButton,
   AudioPlayerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test.app';
  
  
  run(): void{
    console.log('run');
    
    debugger
    var x = document.getElementById("myAudio");
    // @ts-ignore
    x.play();

  }
}
