import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { RecentSearchTo } from 'src/app/model/recent-search.to';


import { RecentSearchClientService } from '../recent-search.client';
@Injectable({ providedIn: 'root' })
export class RecentSearchesResolver
  implements Resolve<Observable<RecentSearchTo[]>> {
  constructor(
    private readonly recentSearchClientService: RecentSearchClientService
  ) {}

  resolve(): Observable<RecentSearchTo[]> {
    return this.recentSearchClientService.findAll();
  }
}
