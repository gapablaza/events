import { Routes } from '@angular/router';

import { authGuard } from '../../auth/guards';
import { ImportComponent } from './import.component';
import { ImportLocalitiesComponent } from './import-localities/import-localities.component';
import { ImportPersonsComponent } from './import-persons/import-persons.component';
import { ImportActivitiesComponent } from './import-activities/import-activities.component';
import { ImportRegistrationsComponent } from './import-registrations/import-registrations.component';

export const IMPORT_ROUTES: Routes = [
  {
    path: '',
    component: ImportComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'localities',
        title: 'Importar localidades',
        component: ImportLocalitiesComponent,
      },
      {
        path: 'persons',
        title: 'Importar Personas',
        component: ImportPersonsComponent,
      },
      {
        path: 'activities',
        title: 'Importar Actividades Rucacura 2025',
        component: ImportActivitiesComponent,
      },
      {
        path: 'registrations',
        title: 'Importar Inscripciones Rucacura 2025',
        component: ImportRegistrationsComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
