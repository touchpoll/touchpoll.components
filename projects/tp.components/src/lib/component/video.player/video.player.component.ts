import {booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute, output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {DefaultIconsModule} from '../../module/default.icons/default.icons.module';

@Component({
  selector: 'tp-video-player',
  imports: [
    MatIconButton,
    MatIcon,
    DefaultIconsModule
  ],
  templateUrl: './video.player.component.html',
  styleUrl: './video.player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoPlayerComponent {
  fileUrl = input.required<string>();
  canRemove = input(false, {transform: booleanAttribute});
  width = input(250, {transform: numberAttribute});
  onRemoveClick = output<void>();
}
