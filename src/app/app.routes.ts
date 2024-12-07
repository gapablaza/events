import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent
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