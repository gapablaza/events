import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, filter, first, map, Observable, of, tap } from 'rxjs';

import { eventFeature } from './store/event.state';
import { eventActions } from './store/event.actions';

@Injectable()
export class EventResolver {
  store = inject(Store);

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const eventId = route.paramMap.get('eventId');

    if (!eventId) {
      return of(false);
    }

    return this.store.select(eventFeature.selectIsInit).pipe(
      tap((isInit) => {
        if (!isInit) {
          this.store.dispatch(eventActions.initEvent({ eventId }));
        }
      }),
      filter((isInit) => isInit),
      map(() => true),
      first(),
      catchError(() => of(false))
    );
  }
}
