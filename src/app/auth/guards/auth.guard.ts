import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { appFeature } from '../../store/app.state';

export const authGuard = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(appFeature.selectIsInit).pipe(
    filter((isInit) => !!isInit),
    switchMap(() => store.select(appFeature.selectIsAuth)),
    map((isAuth) => {
      if (!isAuth) {
        router.navigate(['/login']);
        return false;
      }

      return true;
    }),
    take(1)
  );
};
