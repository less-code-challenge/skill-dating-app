import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true,
    },
  ],
})
export class InputComponent implements OnDestroy, ControlValueAccessor {
  constructor() {}
  public disabled: boolean;
  public _value: string = '';

  @Input()
  placeholder: string;

  @Input()
  set value(newValue: string) {
    this._value = newValue || '';
    this.onChanged();
  }

  @Output()
  valueChange = new EventEmitter<string>();

  onChanged: any = () => {};
  onTouched: any = () => {};

  onUserInput(event: any) {
    const newValue = event.target.value;
    this._value = newValue;
    this.valueChange.emit(newValue);
    this.onChanged();
  }
  writeValue(val: string): void {
    this._value = val || '';
    this.valueChange.emit(this._value);
    this.onChanged();
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy(): void {}
}
