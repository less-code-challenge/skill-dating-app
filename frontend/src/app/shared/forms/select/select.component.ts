import {
  ChangeDetectorRef,
  Component,
  ElementRef,
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
  public disabled: boolean;
  public selected: OfficeLocationTo;

  @ViewChild('input', { static: true, read: ElementRef })
  inputElementRef: ElementRef;

  @Input()
  label: string;

  @Input()
  required: boolean;
  @Input()
  options: OfficeLocationTo[];

  opened = false;
  filteredList: OfficeLocationTo[] = [];
  value = '';

  onChanged: any = () => {};
  onTouched: any = () => {};

  constructor(private ref: ChangeDetectorRef) {}
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

  getValue(): string {
    return this.value;
  }
  blur(event: any): void {
    event.preventDefault();
  }
  selectOption(option: OfficeLocationTo): void {
    this.selected = option;
    this.onChanged(option);
    this.opened = false;
    this.inputElementRef.nativeElement.value = this.parseValue(option);
    this.ref.detectChanges();
  }
  writeValue(option: OfficeLocationTo): void {
    this.selected = option;
    this.inputElementRef.nativeElement.value = this.selected
      ? this.parseValue(option)
      : '';
    this.onChanged(option);
    this.ref.detectChanges();
  }

  onBlur(event: any): void {
    this.opened = false;
    this.onTouched(event);
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
}
function lowerCasedStartsWith(val1: string, val2: string): boolean {
  return val1.trim().toLowerCase().startsWith(val2.trim().toLowerCase());
}
