import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingComponent } from './rating.component';
import {IconsModule} from '@modules/icons/icons.module';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
       RatingComponent,
       IconsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
