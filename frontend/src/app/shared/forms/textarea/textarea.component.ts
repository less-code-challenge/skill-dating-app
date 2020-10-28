import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextareaComponent,
      multi: true,
    },
  ],
})
export class TextareaComponent implements OnDestroy, ControlValueAccessor {
  public disabled: boolean;
  public _value = '';

  @Input()
  label: string;

  @Input()
  autofocus: boolean;

  @Input()
  required: boolean;

  @Input()
  placeholder = '';

  @Input()
  set value(newValue: string) {
    this._value = newValue || '';
    this.onChanged(this._value);
  }

  @Output()
  valueChange = new EventEmitter<string>();

  onChanged: any = () => {};
  onTouched: any = () => {};

  constructor(private element: ElementRef<HTMLInputElement>) {}
  onUserInput(event: any) {
    const newValue = event.target.value;
    this._value = newValue;
    this.valueChange.emit(this._value);
    this.onChanged(this._value);
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
  ngAfterContentChecked(): void {
    if (this.autofocus) {
      this.element.nativeElement.querySelector('input')?.focus();
    }
  }
  ngOnDestroy(): void {}
}
