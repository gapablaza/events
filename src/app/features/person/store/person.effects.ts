import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap, takeUntil, tap } from 'rxjs';

import { personActions } from './person.actions';
import { PersonService, UIService } from '../../../core/service';

@Injectable()
export class PersonEffects {
  // carga todas las personas
  loadAllPersons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(personActions.moduleOpened, personActions.loadAllPersons),
      switchMap(() =>
        this.personSrv.list().pipe(
          takeUntil(this.actions$.pipe(ofType(personActions.moduleClosed))),
          map((persons) => personActions.loadAllPersonsSuccess({ persons })),
          catchError(() => of(personActions.loadAllPersonsFailure()))
        )
      )
    )
  );

  // carga una persona
  // TO DO: Verificar si queda abierta la suscripción
  loadPerson$ = this.actions$.pipe(
    ofType(personActions.loadPerson),
    switchMap(({ id }) =>
      this.personSrv.get(id).pipe(
        map((person) => personActions.loadPersonSuccess({ person })),
        catchError(() => of(personActions.loadPersonFailure()))
      )
    )
  );

  // crea una persona
  createPerson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(personActions.createPerson),
      switchMap(({ person }) =>
        from(this.personSrv.add(person)).pipe(
          map(() => {
            this.router.navigate(['/person']);
            return personActions.createPersonSuccess({
              person,
              message: 'Persona creada correctamente',
            });
          }),
          catchError((err) => {
            const error =
              err instanceof Error ? err.message : 'Error inesperado';
            return of(personActions.createPersonFailure({ error }));
          })
        )
      )
    )
  );

  // edita una persona
  editPerson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(personActions.editPerson),
      switchMap(({ person }) =>
        from(this.personSrv.update(person)).pipe(
          map(() => {
            this.router.navigate(['/person']);
            return personActions.editPersonSuccess({
              person,
              message: 'Persona actualizada correctamente',
            });
          }),
          catchError((err) => {
            const error =
              err instanceof Error ? err.message : 'Error inesperado';
            return of(personActions.editPersonFailure({ error }));
          })
        )
      )
    )
  );

  showSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          personActions.createPersonSuccess,
          personActions.editPersonSuccess
        ),
        map((action) => action.message),
        tap((message) => {
          this.uiSrv.showSuccess(message);
        })
      ),
    { dispatch: false }
  );

  showError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          personActions.createPersonFailure,
          personActions.editPersonFailure
        ),
        map((action) => action.error),
        tap((error) => {
          this.uiSrv.showError(error);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private personSrv: PersonService,
    private uiSrv: UIService
  ) {}
}
