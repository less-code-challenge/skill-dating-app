import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    },
  ],
})
export class SelectComponent implements OnDestroy, ControlValueAccessor {
  constructor() {}
  public disabled: boolean;
  public _value = '';
  public valueObject: number;

  @Input()
  label: string;

  @Input()
  required: boolean;
  _options:any;
  @Input()
  set options(val: any) {
    this._options = val;
  }

  @Input()
  set value(newValue: string) {
    this._value = newValue || '';
    this.onChanged(this._value);
  }

  @Output()
  valueChange = new EventEmitter<string>();

  onChanged: any = () => {};
  onTouched: any = () => {};

  onUserInput(event: any) {
    const newValue = event.target.value;
    this._value = newValue;
    const js = JSON.parse(this._value);
    this.valueChange.emit(js);
    this.onChanged(js);
  }
  writeValue(val: string): void {
    this._value = JSON.stringify(val) || '';
    this.valueChange.emit(val);
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
