import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, Output, EventEmitter, Input, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// tslint:disable-next-line:no-any
type OnChangeFn = (newValue: any) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'sd-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: ChipComponent },
  ],
})
export class ChipComponent implements ControlValueAccessor {
  @Output()
  closeClick = new EventEmitter<string>();
  @HostBinding('class.dark-theme') darkMode = false;

  _value: string;
  @Input()
  set value(val: string) {
    this._value = val;
  }

  @Input()
  disabled: boolean;
  @Input()
  set dark(dark: boolean) {
    this.darkMode = dark;
  }
  private onChangeFn: OnChangeFn;
  private onTouchedFn: OnTouchedFn;

  registerOnChange(fn: OnChangeFn): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouchedFn = fn;
  }

  // tslint:disable-next-line:no-any
  writeValue(obj: any): void {
    this._value = obj;
  }

  close(): void {
    this.closeClick.emit(this._value);
  }
}
