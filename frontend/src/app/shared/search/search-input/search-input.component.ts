import {Component, EventEmitter, HostBinding, Input, OnDestroy, Output} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'sd-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnDestroy {
  @Input()
  @HostBinding('class.dark-theme')
  darkTheme = false;

  @Input()
  query: string;

  @Input()
  placeholder: string;

  @Output()
  queryChange = new EventEmitter<string>();

  @Output()
  backClick = new EventEmitter<void>();

  private throttler = new Subject<string>();
  private throttlerSubscription: Subscription;

  constructor() {
    this.throttlerSubscription = this.throttler
      .asObservable()
      .pipe(
        debounceTime(700),
        distinctUntilChanged()
      )
      .subscribe(newQuery => this.queryChange.emit(newQuery));
  }

  notifyOnQueryChange(newQuery: string): void {
    this.throttler.next(newQuery);
  }

  notifyOnBackClick(): void {
    this.backClick.emit();
  }

  ngOnDestroy(): void {
    this.throttlerSubscription.unsubscribe();
  }
}
