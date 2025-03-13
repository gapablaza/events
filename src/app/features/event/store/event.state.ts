import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { Activity, Event, Registration } from '../../../core/model';
import { eventActions } from './event.actions';

interface EventState {
  isEventsInit: boolean;
  isInit: boolean;

  events: Event[];

  eventSelected: Event | null;
  activities: Activity[];
  registrations: Registration[];

  isProcessing: boolean;
  error: string | null;
}

const initialState: EventState = {
  isEventsInit: false,
  isInit: false,

  events: [],

  eventSelected: null,
  activities: [],
  registrations: [],

  isProcessing: false,
  error: null,
};

export const eventFeature = createFeature({
  name: 'event',
  reducer: createReducer(
    initialState,

    // load all events
    on(eventActions.loadAllEvents, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(eventActions.loadAllEventsSuccess, (state, { events }) => ({
      ...state,
      isEventsInit: true,
      events,
      isProcessing: false,
    })),
    on(eventActions.loadAllEventsFailure, (state) => ({
      ...state,
      isEventsInit: true,
      events: [],
      isProcessing: false,
    })),

    // select one event
    // on(eventActions.selectEvent, (state) => ({
    //   ...state,
    //   isProcessing: true,
    // })),
    // on(eventActions.selectEventSuccess, (state, { eventSelected }) => ({
    //   ...state,
    //   eventSelected,
    //   isProcessing: false,
    // })),
    // on(eventActions.selectEventFailure, (state) => ({
    //   ...state,
    //   eventSelected: null,
    //   isProcessing: false,
    // })),

    // init event
    on(eventActions.initEvent, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(
      eventActions.initEventSuccess,
      (state, { event, activities, registrations }) => ({
        ...state,
        eventSelected: event,
        activities,
        registrations,

        isInit: true,
        isProcessing: false,
      })
    ),
    on(eventActions.initEventFailure, (state) => ({
      ...state,
      eventSelected: null,
      activities: [],
      registrations: [],

      isInit: false,
      isProcessing: false,
    })),

    // load all activities
    on(eventActions.loadAllActivities, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(eventActions.loadAllActivitiesSuccess, (state, { activities }) => ({
      ...state,
      // isInit: true,
      activities,
      isProcessing: false,
    })),
    on(eventActions.loadAllActivitiesFailure, (state) => ({
      ...state,
      // isInit: true,
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
    on(eventActions.moduleClosed, () => initialState),

    // clear event
    on(eventActions.clearEvent, () => ({
      ...initialState,

      eventSelected: null,
      activities: [],
      registrations: [],

      isEventsInit: false,
    }))
  ),
  extraSelectors: ({
    selectEvents,
    selectRegistrations,
    selectActivities,
  }) => ({
    // Selector para retornar eventos no ocultos
    selectAvailableEvents: createSelector(selectEvents, (events) =>
      events.filter((event) => !event.hidden)
    ),
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
