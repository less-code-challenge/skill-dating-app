import {Component, Output, EventEmitter} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

// tslint:disable-next-line:no-any
type OnChangeFn = (newValue: any) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'sd-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  providers: [{provide: NG_VALUE_ACCESSOR, multi: true, useExisting: ChipComponent}]
})
export class ChipComponent implements ControlValueAccessor {
  @Output()
  closeClick = new EventEmitter<string>();

  value: string;

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
    this.value = obj;
  }

  close(): void {
    this.closeClick.emit(this.value);
  }
}
