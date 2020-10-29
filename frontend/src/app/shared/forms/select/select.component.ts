import { Component, Input } from '@angular/core';
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

  @Input()
  label: string;

  @Input()
  required: boolean;
  @Input()
  options: OfficeLocationTo[];

  opened = false;
  filteredList: OfficeLocationTo[] = [];
  value: string = '';

  onChanged: any = () => {};
  onTouched: any = () => {};

  onUserInput(event: any) {
    const newValue = event.target.value;
    this.filteredList = this.options.filter((val) => {
      const { region, country, office } = val;
      return (
        region.toLowerCase().indexOf(newValue.toLowerCase()) !== -1 ||
        country.toLowerCase().indexOf(newValue.toLowerCase()) !== -1 ||
        office.toLowerCase().indexOf(newValue.toLowerCase()) !== -1
      );
    });
    this.opened = this.filteredList.length > 0;
  }

  selectOption(option: any) {
    this.selected = option;
    this.onChanged(option);
    this.opened = false;
    this.value = `${option.country}, ${option.office}`;
  }
  writeValue(option: OfficeLocationTo): void {
    this.selected = option;
    this.value = `${option.country}, ${option.office}`;
    this.onChanged(option);
  }

  onBlur(event: any) {
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
}
