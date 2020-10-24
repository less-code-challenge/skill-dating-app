import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output,} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'ui-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements OnDestroy {
  inputControl = new FormControl();

  @Input()
  set value(newValue: string) {
    this.inputControl.setValue(newValue || '');
  }

  @Input()
  placeholder: string;

  @Output()
  valueChange = new EventEmitter<string>();

  private valueChangeSubscription: Subscription;

  constructor() {
    this.valueChangeSubscription = this.inputControl.valueChanges.subscribe(changedValue => {
      this.valueChange.emit(changedValue);
    });
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription.unsubscribe();
  }
}
