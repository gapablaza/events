import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { LocalityListComponent } from './features/locality/locality-list/locality-list.component';

export const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'locality',
        component: LocalityListComponent
    },
    {
        path: 'event',
        loadChildren: () => import('./features/event/event.routes').then(m => m.EVENT_ROUTES)
    },
    {
        path: 'activity',
        loadChildren: () => import('./features/activity/activity.routes').then(m => m.ACTIVITY_ROUTES)
    },
    {
        path: 'person',
        loadChildren: () => import('./features/person/person.routes').then(m => m.PERSON_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];

export default APP_ROUTES;