import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Activity, Locality, Person, Registration } from '../../../core/model';

export const eventActions = createActionGroup({
  source: 'Event',
  events: {
    // load all activities
    'Load All Activities': emptyProps(),
    'Load All Activities Success': props<{
      activities: Activity[];
      includeCounts?: boolean;
    }>(),
    'Load All Activities Failure': emptyProps(),

    // load all registrations
    'Load All Registrations': emptyProps(),
    'Load All Registrations Success': props<{
      registrations: Registration[];
    }>(),
    'Load All Registrations Failure': emptyProps(),

    // load one registration
    'Load Registration': props<{ id: string }>(),
    'Load Registration Success': props<{ registration: Registration }>(),
    'Load Registration Failure': emptyProps(),

    // create one registration
    'Create Registration': props<{
      person: Person;
      locality: Locality;
      activitiesIds: string[];
      registrationData: {
        totalCost?: number;
        totalPaid?: number;
        code?: string;
        insideEnclosure?: boolean;
        licensePlate?: string;
        vehicleOwner?: boolean;
        observations?: string;
      };
    }>(),
    'Create Registration Success': props<{ message: string }>(),
    'Create Registration Failure': props<{ error: string }>(),

    // edit one registration
    'Edit Registration': props<{
      updatedPerson: Person;
      updatedLocality: Locality;
      updatedActivitiesIds: string[];
      updatedRegistrationData: {
        totalCost?: number;
        totalPaid?: number;
        code?: string;
        insideEnclosure?: boolean;
        licensePlate?: string;
        vehicleOwner?: boolean;
        observations?: string;
      };
    }>(),
    'Edit Registration Success': props<{ message: string }>(),
    'Edit Registration Failure': props<{ error: string }>(),

    // delete one registration
    'Delete Registration': props<{ id: string }>(),
    'Delete Registration Success': props<{ message: string }>(),
    'Delete Registration Failure': props<{ error: string }>(),

    // person module status
    'Module Opened': emptyProps(),
    'Module Closed': emptyProps(),
  },
});
