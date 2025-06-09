import {booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, input, linkedSignal, output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

type ModelChangeFunction = (value: number) => void;
type ModelTouchedFunction = () => void;

@Component({
  selector: 'tp-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RatingComponent),
    multi: true
  }],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
})
export class RatingComponent implements ControlValueAccessor {
  max = input<number>(5);
  value = input<number>(-1);
  readonly = input(false, {transform: booleanAttribute});
  color = input<string>('#f5b00e');
  valueChanged = output<number>();
  readonly array = computed(() => new Array(this.max()).fill(0));
  readonly internalValue = linkedSignal(() => this.value() != -1 ? this.value() : -1 );
  readonly isDisabled = linkedSignal(this.readonly);
  activeHoverIndex = -1;

  #onModelChange: ModelChangeFunction = () => {};
  #onModelTouched: ModelTouchedFunction = () => {};

  onClick(index: number): void{
    if (this.isDisabled()) {
      return;
    }
    this.internalValue.set(index);
    this.#onModelChange(this.internalValue());
    this.valueChanged.emit(this.internalValue());
  }

  onMouseenter(index: number): void{
    if (this.isDisabled()) {
      return;
    }
    this.activeHoverIndex = index;
  }

  onMouseleave(): void {
    if (this.isDisabled()) {
      return;
    }
    this.activeHoverIndex = -1;
  }

  registerOnChange(fn: ModelChangeFunction): void {
    this.#onModelChange = fn;
  }

  registerOnTouched(fn: ModelTouchedFunction): void {
    this.#onModelTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  writeValue(obj: number): void {
    this.internalValue.set(obj);
  }
}
