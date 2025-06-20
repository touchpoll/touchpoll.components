import {booleanAttribute, ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {SaveAsDirective} from '../../directive/save.as/save.as.directive';

@Component({
  selector: 'tp-file-link',
  imports: [
    MatAnchor,
    MatIcon,
    SaveAsDirective,
    MatIconButton,
    MatButton,
  ],
  templateUrl: './file.link.component.html',
  styleUrl: './file.link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileLinkComponent{
  fileUrl = input.required<string>();
  fileName = input.required<string>();
  canRemove = input(false, {transform: booleanAttribute});
  onRemoveClick = output();
}
