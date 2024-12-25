import { Routes } from '@angular/router';

import { PersonListComponent } from './person-list/person-list.component';
import { PersonImportComponent } from './person-import/person-import.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonAddComponent } from './person-add/person-add.component';
import { LocalityImportComponent } from './person-import/locality-import.component';

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
        path: 'import',
        title: 'Importar personas',
        component: PersonImportComponent,
    },
    {
        path: 'import_localities',
        title: 'Importar Localidades',
        component: LocalityImportComponent,
    },
    {
        path: '**',
        redirectTo: ''
    }
];

export default PERSON_ROUTES;
