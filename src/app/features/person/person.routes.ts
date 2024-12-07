import { Routes } from '@angular/router';

import { PersonListComponent } from './person-list/person-list.component';
import { PersonImportComponent } from './person-import/person-import.component';

export const PERSON_ROUTES: Routes = [
    {
        path: '',
        title: 'Listado de personas',
        component: PersonListComponent,
        // children: [
        //     {
        //         path: '',
        //         title: 'Listado de personas',
        //         component: PersonListComponent
        //     },
        //     {
        //         path: ':personId',
        //         title: 'Perfil de la persona',
        //         component: ActivityProfileComponent
        //     }
        // ]
    },
    {
        path: 'import',
        title: 'Importar personas',
        component: PersonImportComponent,
    },
    {
        path: '**',
        redirectTo: ''
    }
];

export default PERSON_ROUTES;
