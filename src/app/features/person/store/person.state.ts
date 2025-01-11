import { createFeature, createReducer, on } from '@ngrx/store';

import { Person } from '../../../core/model';
import { personActions } from './person.actions';

interface PersonState {
  isInit: boolean;
  persons: Person[];
  selectedPerson: Person | null;

  isProcessing: boolean;
  error: string | null;
}

const initialState: PersonState = {
  isInit: false,
  persons: [],
  selectedPerson: null,

  isProcessing: false,
  error: null,
};

export const personFeature = createFeature({
  name: 'person',
  reducer: createReducer(
    initialState,

    // load all persons
    on(personActions.loadAllPersons, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(personActions.loadAllPersonsSuccess, (state, { persons }) => ({
      ...state,
      isInit: true,
      persons,
      isProcessing: false,
    })),
    on(personActions.loadAllPersonsFailure, (state) => ({
      ...state,
      isInit: true,
      persons: [],
      isProcessing: false,
    })),

    // load person
    on(personActions.loadPerson, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(personActions.loadPersonSuccess, (state, { person }) => ({
      ...state,
      selectedPerson: person,
      isProcessing: false,
    })),
    on(personActions.loadPersonFailure, (state) => ({
      ...state,
      selectedPerson: null,
      isProcessing: false,
    })),

    // create person
    on(personActions.createPerson, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(personActions.createPersonSuccess, (state, { person }) => ({
      ...state,
    //   persons: [...state.persons, person],
      isProcessing: false,
    })),
    on(personActions.createPersonFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // edit person
    on(personActions.editPerson, (state) => ({
      ...state,
      isProcessing: true,
    })),
    on(personActions.editPersonSuccess, (state, { person }) => ({
      ...state,
      isProcessing: false,
    })),
    on(personActions.editPersonFailure, (state) => ({
      ...state,
      isProcessing: false,
    })),

    // reset
    on(personActions.moduleClosed, () => initialState)
  ),
});
