import { Component, inject, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef, GridReadyEvent } from 'ag-grid-community'; // Column Definition Type Interface

import { PersonService } from '../../../core/service';
import { Person } from '../../../core/model';
import { PersonListButtonComponent } from './person-list-button.component';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  standalone: true,
  imports: [AgGridAngular],
})
export class PersonListComponent implements OnInit {
  private _personSrv = inject(PersonService);

  persons: Person[] = [];

  colDefs: ColDef[] = [
    { field: 'rut', headerName: 'Rut', filter: true },
    { field: 'name', headerName: 'Nombre', filter: true },
    { field: 'middle_name', headerName: '2do Nombre', filter: true },
    { field: 'first_name', headerName: 'Apellido Paterno', filter: true },
    { field: 'last_name', headerName: 'Apellido Materno', filter: true },
    { field: 'birthday', headerName: 'Fecha de Nacimiento', filter: true },
    { field: 'email', filter: true },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: PersonListButtonComponent,
    },
  ];

  ngOnInit(): void {}

  onGridReady(params: GridReadyEvent) {
    this._personSrv.list().subscribe((persons) => {
      this.persons = persons;
      console.log(persons);
    });
  }
}
