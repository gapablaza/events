import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { PersonListComponent } from './person-list/person-list.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonAddComponent } from './person-add/person-add.component';
import { personFeature } from './store/person.state';
import { PersonEffects } from './store/person.effects';
import { PersonComponent } from './person.component';
import { authGuard } from '../../auth/guards';

export const PERSON_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState(personFeature), provideEffects(PersonEffects)],
    component: PersonComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'Listado de personas',
        component: PersonListComponent,
      },
      {
        path: 'add',
        title: 'Agregar persona',
        component: PersonAddComponent,
      },
      {
        path: 'edit/:personId',
        title: 'Editar persona',
        component: PersonEditComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default PERSON_ROUTES;
