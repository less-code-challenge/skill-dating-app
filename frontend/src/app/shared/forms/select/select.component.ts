import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OfficeLocationTo } from 'src/app/skill-dating/model/office-location.to';

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
export class SelectComponent implements ControlValueAccessor {
  constructor(private ref: ChangeDetectorRef) {}
  public disabled: boolean;
  public selected: OfficeLocationTo;

  @ViewChild('input', { static: true, read: ElementRef })
  inputElementRef: ElementRef;
  @ViewChild('inputWrapper', { static: true, read: ElementRef })
  inputWrapperElementRef: ElementRef;

  @Input()
  label: string;
  @Input()
  required: boolean;
  @Input()
  options: OfficeLocationTo[];

  opened = false;
  filteredList: OfficeLocationTo[] = [];
  value = '';

  @HostListener('window:click', ['$event.target'])
  onClickBtn(target: ElementRef) {
    if (!this.inputWrapperElementRef.nativeElement.contains(target)) {
      this.onBlur();
      this.updateInputValue();
    }
  }

  onChanged: any = () => {};
  onTouched: any = () => {};
  onUserInput(event: any): void {
    const newValue = event.target.value.trim();
    this.filteredList = this.options
      .filter((val) => {
        const { region, country, office } = val;
        const [valueCountry, valueOffice] = newValue.split(',');
        if (valueOffice || valueOffice === '') {
          return (
            lowerCasedStartsWith(country, valueCountry) &&
            lowerCasedStartsWith(office, valueOffice)
          );
        }
        return (
          lowerCasedStartsWith(region, newValue) ||
          lowerCasedStartsWith(country, newValue) ||
          lowerCasedStartsWith(office, newValue)
        );
      })
      .splice(0, 15);
    this.opened = this.filteredList.length > 0;
  }

  selectOption(option: OfficeLocationTo): void {
    this.selected = option;
    this.onChanged(option);
    this.onBlur();
    this.updateInputValue();
  }
  writeValue(option: OfficeLocationTo): void {
    this.selected = option;
    this.updateInputValue();
    this.onChanged(option);
    this.ref.detectChanges();
  }
  onBlur(): void {
    this.opened = false;
    this.onTouched();
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
  private parseValue(option: OfficeLocationTo): string {
    return `${option.country}, ${option.office}`;
  }
  private updateInputValue(): void {
    this.inputElementRef.nativeElement.value = this.selected
      ? this.parseValue(this.selected)
      : '';
  }
}
function lowerCasedStartsWith(val1: string, val2: string): boolean {
  return val1.trim().toLowerCase().startsWith(val2.trim().toLowerCase());
}
