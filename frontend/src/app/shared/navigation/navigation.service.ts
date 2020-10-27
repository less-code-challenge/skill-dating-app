import {NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

export interface Paths {
  searchAll: string;
  searchProfiles: string;
  searchSkills: string;
}

type DialogPath = keyof Paths;

export const paths: Paths = {
  searchAll: 'search',
  searchProfiles: 'search/profiles',
  searchSkills: 'search/skills',
};

@Injectable()
export class NavigationService implements OnDestroy {
  private readonly lastPaths: Paths;
  private subscription: Subscription;

  constructor(private readonly router: Router) {
    this.lastPaths = {...paths};
    Object.keys(this.lastPaths).forEach(key => {
      const dialogPath = key as DialogPath;
      this.lastPaths[dialogPath] = `/${this.lastPaths[dialogPath]}`;
    });
  }

  keepLastPaths(): void {
    this.subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => {
        const navigationEndEvent = event as NavigationEnd;
        return navigationEndEvent.urlAfterRedirects;
      }),
    ).subscribe(url => {
      if (url?.startsWith(paths.searchSkills, 1)) {
        this.lastPaths.searchSkills = url;
      } else if (url?.startsWith(paths.searchProfiles, 1)) {
        this.lastPaths.searchProfiles = url;
      } else if (url?.startsWith(paths.searchAll, 1)) {
        this.lastPaths.searchAll = url;
      }
      console.log(this.lastPaths);
    });
  }

  goToLastUrlOfDialog(dialog: DialogPath): Promise<boolean> {
    return this.router.navigateByUrl(this.lastPaths[dialog]);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
