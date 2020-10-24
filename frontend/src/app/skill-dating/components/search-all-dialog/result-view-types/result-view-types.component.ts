import {Component, HostBinding, Input, Output, EventEmitter} from '@angular/core';
import {ResultViewType} from '../search-all-dialog.component';

@Component({
  selector: 'sd-result-view-types',
  templateUrl: './result-view-types.component.html',
  styleUrls: ['./result-view-types.component.scss']
})
export class ResultViewTypesComponent {
  @HostBinding('attr.role')
  role = 'tablist';

  @Input()
  selected: ResultViewType | null = ResultViewType.All;

  @Output()
  selectedTypeChange = new EventEmitter<ResultViewType>();

  resultViews: { type: ResultViewType, label: string }[] = [
    {type: ResultViewType.All, label: 'All results'},
    {type: ResultViewType.People, label: 'People'},
    {type: ResultViewType.Skills, label: 'Skills'},
  ];

  isResultViewTypeSelected(type: ResultViewType): boolean {
    return type === this.selected;
  }

  selectResultViewType(type: ResultViewType): void {
    this.selected = type;
    this.selectedTypeChange.emit(this.selected);
  }
}
