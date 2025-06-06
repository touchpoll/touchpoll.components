import {booleanAttribute, ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {SaveAsDirective} from '../../directive/save.as/save.as.directive';

@Component({
  selector: 'ms-file-link',
  imports: [
    MatAnchor,
    MatIcon,
    SaveAsDirective,
    MatIconButton,
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
