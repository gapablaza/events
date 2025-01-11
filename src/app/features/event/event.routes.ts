import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { EventRegistrationsComponent } from './event-registrations/event-registrations.component';
import { EventRegistrationAddComponent } from './event-registration-add/event-registration-add.component';
import { EventProfileComponent } from './event-profile/event-profile.component';
import { EventActivityComponent } from './event-activity/event-activity.component';
import { EventRegistrationEditComponent } from './event-registration-edit/event-registration-edit.component';
import { eventFeature } from './store/event.state';
import { EventEffects } from './store/event.effects';
import { EventComponent } from './event.component';
import { EventResolver } from './event-resolver.service';
import { authGuard } from '../../auth/guards';

export const EVENT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      EventResolver,
      provideState(eventFeature), 
      provideEffects(EventEffects)
    ],
    component: EventComponent,
    resolve: {
      eventActivities: EventResolver,
    },
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'Detalle del Evento',
        component: EventProfileComponent,
      },
      {
        path: 'registrations',
        title: 'Listado de Inscritos',
        component: EventRegistrationsComponent,
      },
      {
        path: 'registrations/add',
        title: 'Nueva Inscripción',
        component: EventRegistrationAddComponent,
      },
      {
        path: 'registrations/edit/:registrationId',
        title: 'Editar Inscripción',
        component: EventRegistrationEditComponent,
      },
      // {
      //   path: 'activity/:activityId',
      //   title: 'Registrados en la Actividad',
      //   component: EventActivityComponent,
      // },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default EVENT_ROUTES;
