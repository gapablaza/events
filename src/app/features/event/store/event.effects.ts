import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs';

import { EventService, UIService } from '../../../core/service';
import { eventActions } from './event.actions';
import { eventFeature } from './event.state';

@Injectable()
export class EventEffects {

  // load all events
  loadAllEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(eventActions.loadAllEvents),
      switchMap(() =>
        this.eventSrv.events().pipe(
          takeUntil(this.actions$.pipe(ofType(eventActions.moduleClosed))),
          map((events) => eventActions.loadAllEventsSuccess({ events })),
          catchError(() => of(eventActions.loadAllEventsFailure()))
        )
      )
    )
  );

  // load one event with details
  initEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(eventActions.initEvent),
      switchMap(({ eventId }) =>
        this.eventSrv.eventWithDetails(eventId).pipe(
          takeUntil(this.actions$.pipe(ofType(eventActions.clearEvent))),
          map(({ event, activities, registrations }) =>
            eventActions.initEventSuccess({ event, activities, registrations })
          ),
          catchError((err) => {
            const error =
              err instanceof Error ? err.message : 'Error inesperado';
            return of(eventActions.initEventFailure({ error }));
          })
        )
      )
    )
  );

  // load all activities
  // loadAllActivities$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(
  //       eventActions.loadAllActivities
  //     ),
  //     switchMap(() =>
  //       this.eventSrv.activities().pipe(
  //         takeUntil(this.actions$.pipe(ofType(eventActions.moduleClosed))),
  //         map((activities) =>
  //           eventActions.loadAllActivitiesSuccess({ activities })
  //         ),
  //         catchError(() => of(eventActions.loadAllActivitiesFailure()))
  //       )
  //     )
  //   )
  // );

  // load all registrations
  // loadAllRegistrations$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(
  //       // eventActions.moduleOpened,
  //       eventActions.loadAllRegistrations),
  //     switchMap(() =>
  //       this.eventSrv.registrations().pipe(
  //         takeUntil(this.actions$.pipe(ofType(eventActions.moduleClosed))),
  //         map((registrations) =>
  //           eventActions.loadAllRegistrationsSuccess({ registrations })
  //         ),
  //         catchError(() => of(eventActions.loadAllRegistrationsFailure()))
  //       )
  //     )
  //   )
  // );

  // create registration
  createRegistration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(eventActions.createRegistration),
      withLatestFrom(this.store.select(eventFeature.selectEventSelected)),
      switchMap(([{ person, locality, activitiesIds, registrationData }, event]) =>
        from(
          this.eventSrv.registrate(
            event!.id,
            person,
            locality,
            activitiesIds,
            registrationData
          )
        ).pipe(
          map(() => {
            // this.router.navigate(['/event/registrations']);
            return eventActions.createRegistrationSuccess({
              message: 'Inscripción registrada correctamente',
            });
          }),
          catchError((err) => {
            const error =
              err instanceof Error ? err.message : 'Error inesperado';
            return of(eventActions.createRegistrationFailure({ error }));
          })
        )
      )
    )
  );

  // edit registration
  editRegistration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(eventActions.editRegistration),
      withLatestFrom(this.store.select(eventFeature.selectEventSelected)),
      switchMap(
        ([{
          updatedPerson,
          updatedLocality,
          updatedActivitiesIds,
          updatedRegistrationData,
        }, event]) =>
          from(
            this.eventSrv.editRegistration(
              event!.id,
              updatedPerson,
              updatedLocality,
              updatedActivitiesIds,
              updatedRegistrationData
            )
          ).pipe(
            map(() => {
              // this.router.navigate(['/person']);
              return eventActions.editRegistrationSuccess({
                message: 'Inscripción actualizada correctamente',
              });
            }),
            catchError((err) => {
              const error =
                err instanceof Error ? err.message : 'Error inesperado';
              return of(eventActions.editRegistrationFailure({ error }));
            })
          )
      )
    )
  );

  // delete registration
  deleteRegistration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(eventActions.deleteRegistration),
      withLatestFrom(this.store.select(eventFeature.selectEventSelected)),
      switchMap(([{ id }, event]) =>
        from(
          this.eventSrv.deleteRegistration(event!.id, id)
        ).pipe(
          map(() => {
            this.router.navigate(['/event/registrations']);
            return eventActions.deleteRegistrationSuccess({
              message: 'Inscripción eliminada correctamente',
            });
          }),
          catchError((err) => {
            const error =
              err instanceof Error ? err.message : 'Error inesperado';
            return of(eventActions.createRegistrationFailure({ error }));
          })
        )
      )
    )
  );

  showSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          eventActions.createRegistrationSuccess,
          eventActions.editRegistrationSuccess,
          eventActions.deleteRegistrationSuccess,
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
          eventActions.createRegistrationFailure,
          eventActions.editRegistrationFailure,
          eventActions.deleteRegistrationFailure,
          eventActions.initEventFailure,
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
    private eventSrv: EventService,
    private uiSrv: UIService
  ) {}
}
