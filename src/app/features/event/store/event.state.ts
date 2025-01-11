import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { Activity, Registration } from '../../../core/model';
import { eventActions } from './event.actions';

interface EventState {
  isInit: boolean;
  activities: Activity[];
  registrations: Registration[];

  isProcessing: boolean;
  error: string | null;
}

const initialState: EventState = {
  isInit: false,
  activities: [],
  registrations: [],

  isProcessing: false,
  error: null,
};

export const eventFeature = createFeature({
  name: 'event',
  reducer: createReducer(
    initialState,

    // load all activities
    on(eventActions.loadAllActivities, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(eventActions.loadAllActivitiesSuccess, (state, { activities }) => ({
      ...state,
      isInit: true,
      activities,
      isProcessing: false,
    })),
    on(eventActions.loadAllActivitiesFailure, (state) => ({
      ...state,
      isInit: true,
      activities: [],
      isProcessing: false,
    })),

    // load all registrations
    on(eventActions.loadAllRegistrations, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(
      eventActions.loadAllRegistrationsSuccess,
      (state, { registrations }) => ({
        ...state,
        registrations,
        isProcessing: false,
      })
    ),
    on(eventActions.loadAllRegistrationsFailure, (state) => ({
      ...state,
      registrations: [],
      isProcessing: false,
    })),

    // edit registration
    on(eventActions.editRegistration, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(eventActions.editRegistrationSuccess, (state) => ({
      ...state,
      isProcessing: false,
    })),
    on(eventActions.editRegistrationFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // delete registration
    on(eventActions.deleteRegistration, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(eventActions.deleteRegistrationSuccess, (state) => ({
      ...state,
      isProcessing: false,
    })),
    on(eventActions.deleteRegistrationFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // clear state
    on(eventActions.moduleClosed, () => initialState)
  ),
  extraSelectors: ({ selectRegistrations, selectActivities }) => ({
    // Selector para contar registros
    selectRegistrationsCount: createSelector(
      selectRegistrations,
      (registrations) => registrations.length
    ),
    // Selector para contar actividades con el campo registrationCount
    selectActivitiesWithCounter: createSelector(
      selectActivities,
      selectRegistrations,
      (activities, registrations) => {
        // Mapeamos las actividades agregando el conteo de registros
        return activities.map((activity) => ({
          ...activity,
          registrationCount: registrations.filter((registration) =>
            (registration.activities_registered || []).includes(activity.id)
          ).length,
        }));
      }
    ),
  }),
});
