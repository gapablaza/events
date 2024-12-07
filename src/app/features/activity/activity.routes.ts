import { Routes } from '@angular/router';

import { ActivityComponent } from './activity.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivityProfileComponent } from './activity-profile/activity-profile.component';

export const ACTIVITY_ROUTES: Routes = [
    {
        path: '',
        component: ActivityComponent,
        children: [
            {
                path: '',
                title: 'Listado de actividades',
                component: ActivityListComponent
            },
            {
                path: ':activityId',
                title: 'Detalle de la actividad',
                component: ActivityProfileComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

export default ACTIVITY_ROUTES;
