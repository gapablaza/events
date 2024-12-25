import { Routes } from '@angular/router';

import { EventImportComponent } from './event-import/event-import.component';
import { EventRegistrationsComponent } from './event-registrations/event-registrations.component';
import { EventRegistrationComponent } from './event-registration/event-registration.component';

export const EVENT_ROUTES: Routes = [
    {
        path: '',
        // component: ActivityComponent,
        children: [
            {
                path: '',
                title: 'Listado de Inscritos',
                component: EventRegistrationsComponent
            },
            {
                path: 'add',
                title: 'Nueva Inscripción',
                component: EventRegistrationComponent
            },
            {
                path: 'import',
                title: 'Importar Inscripciones',
                component: EventImportComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

export default EVENT_ROUTES;
