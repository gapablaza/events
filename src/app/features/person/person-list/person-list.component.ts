import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef, GridReadyEvent } from 'ag-grid-community'; // Column Definition Type Interface

import { PersonService } from '../../../core/service';
import { Person } from '../../../core/model';
import { PersonListButtonComponent } from './person-list-button.component';

@Component({
    selector: 'app-person-list',
    templateUrl: './person-list.component.html',
    imports: [AgGridAngular, RouterLink]
})
export class PersonListComponent {
  private _personSrv = inject(PersonService);

  persons: Person[] = [];

  colDefs: ColDef[] = [
    { field: 'rut', headerName: 'Rut', filter: true },
    { field: 'name', headerName: 'Nombre', filter: true },
    { field: 'middle_name', headerName: '2do Nombre', filter: true },
    { field: 'first_name', headerName: 'Apellido Paterno', filter: true },
    { field: 'last_name', headerName: 'Apellido Materno', filter: true },
    { field: 'birthday', headerName: 'Fecha de Nacimiento', filter: true },
    { field: 'email', headerName: 'Email', filter: true },
    { field: 'phone', headerName: 'Teléfono', filter: true },
    { field: 'address', headerName: 'Dirección', filter: true },
    { field: 'gender', headerName: 'Género', filter: true },
    { field: 'profession', headerName: 'Profesión u Oficio', filter: true },
    { field: 'license_plate', headerName: 'Patente', filter: true },
    { field: 'pathologies', headerName: 'Patologías', filter: true },
    { field: 'locality_name', headerName: 'Localidad / Sector', filter: true },
    { field: 'observations', headerName: 'Observaciones', filter: true },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: PersonListButtonComponent,
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this._personSrv.list().subscribe((persons) => {
      this.persons = persons;
      console.log(persons);
    });
  }
}
