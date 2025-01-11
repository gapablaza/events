import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { LocalityService } from '../core/service';
import { appActions } from './app.actions';

@Injectable()
export class AppEffects {
  // Inicia sesión con email/pass
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.login),
      exhaustMap((action) =>
        this._authSrv.login(action.email, action.password).pipe(
          map((authUser) => {
            this._router.navigate(['/']);

            return appActions.loginSuccess({
              user: authUser,
            });
          }),
          catchError((error) => of(appActions.authFailure()))
        )
      )
    )
  );

  // Cierra sesión
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.logoutStart),
      switchMap(() =>
        this._authSrv.logout().pipe(
          map(() => {
            this._router.navigateByUrl('/');

            return appActions.logoutFinish();
          })
        )
      )
    )
  );

  // Comprueba si el usuario está logueado
  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.checkAuth),
      switchMap(() =>
        this._authSrv.authState().pipe(
          map((user) => {
            if (user) {
              return appActions.authSuccess({ user });
            } else {
              return appActions.authFailure();
            }
          }),
          catchError(() => of(appActions.authFailure()))
        )
      )
    )
  );

  // Carga localidades
  localities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loadLocalities, appActions.authSuccess),
      switchMap(() =>
        this._localitySrv.list().pipe(
          map((localities) => {
            return appActions.loadLocalitiesSuccess({ localities });
          }),
          catchError(() => of(appActions.loadLocalitiesFailure()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private _store: Store,
    private _router: Router,
    private _localitySrv: LocalityService,
    private _authSrv: AuthService
  ) {}
}
