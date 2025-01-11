import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Person } from '../../../core/model';

export const personActions = createActionGroup({
  source: 'Person',
  events: {
    // load all persons
    'Load All Persons': emptyProps(),
    'Load All Persons Success': props<{ persons: Person[] }>(),
    'Load All Persons Failure': emptyProps(),

    // load one person
    'Load Person': props<{ id: string }>(),
    'Load Person Success': props<{ person: Person }>(),
    'Load Person Failure': emptyProps(),

    // create one person
    'Create Person': props<{ person: Person }>(),
    'Create Person Success': props<{ person: Person, message: string }>(),
    'Create Person Failure': props<{ error: string }>(),

    // edit one person
    'Edit Person': props<{ person: Person }>(),
    'Edit Person Success': props<{ person: Person, message: string }>(),
    'Edit Person Failure': props<{ error: string }>(),

    // person module status
    'Module Opened': emptyProps(),
    'Module Closed': emptyProps(),
  },
});
