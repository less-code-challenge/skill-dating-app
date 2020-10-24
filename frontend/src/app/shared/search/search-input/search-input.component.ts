import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'sd-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  onQueryChange(newQuery: string): void {
    console.log(newQuery);
  }
}
