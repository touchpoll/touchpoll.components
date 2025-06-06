import {Directive, ElementRef, HostListener, inject, input} from '@angular/core';
import {saveAs} from 'file-saver';

@Directive({
  selector: '[msSaveAs]',
  standalone: true
})
export class SaveAsDirective {
  fileName = input.required<string>({alias: 'msSaveAs'});
  readonly #elementRef: ElementRef = inject(ElementRef);
  @HostListener('click', ['$event']) async onClick(event: PointerEvent){
    event.preventDefault();
    const fileUrl = this.#elementRef.nativeElement.getAttribute('href');
    const request = new XMLHttpRequest();
    request.open('GET', fileUrl, true);
    request.responseType = 'blob';
    request.onload = () => {
      const reader = new FileReader();
      reader.readAsDataURL(request.response);
      reader.onload =  (e) => saveAs( (e.target?.result ?? '') as string, this.fileName());
    };
    request.send();
  }

}
