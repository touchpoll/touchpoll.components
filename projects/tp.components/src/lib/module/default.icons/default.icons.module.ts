import {inject, NgModule, PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {defaultIcons24} from './default.icons.24';
import {defaultIcons18} from './default.icons.18';

@NgModule({})
export class DefaultIconsModule {
  constructor() {
    const domSanitizer = inject(DomSanitizer);
    const matIconRegistry = inject(MatIconRegistry);
    const platformId = inject(PLATFORM_ID) as string;
    for (const [name, svgText] of Object.entries(defaultIcons24)) {
      const iconText: string =  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${isPlatformServer(platformId) ? '' : svgText}</svg>`;
      matIconRegistry.addSvgIconLiteral(name, domSanitizer.bypassSecurityTrustHtml(iconText));
    }
    
    for (const [name, svgText] of Object.entries(defaultIcons18)) {
      const iconText: string =  `<svg viewBox="0 0 18 18">${isPlatformServer(platformId) ? '' : svgText}</svg>`;
      matIconRegistry.addSvgIconLiteral(name, domSanitizer.bypassSecurityTrustHtml(iconText));
    }
  }
}
//
