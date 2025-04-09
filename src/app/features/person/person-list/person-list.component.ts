import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'; // Column Definition Type Interface
import { AG_GRID_LOCALE_ES } from '@ag-grid-community/locale';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PersonListButtonComponent } from './person-list-button.component';
import { appFeature } from '../../../store/app.state';
import { personFeature } from '../store/person.state';
import { PersonFormComponent } from '../person-form/person-form.component';
import { Person } from '../../../core/model';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  imports: [AgGridAngular, MatDialogModule],
})
export class PersonListComponent {
  private _gridApi!: GridApi<Person>;
  private store = inject(Store);
  private dialog = inject(MatDialog);

  locale_text = AG_GRID_LOCALE_ES;
  localities = this.store.selectSignal(appFeature.selectLocalities);
  persons = this.store.selectSignal(personFeature.selectPersons);

  colDefs: ColDef[] = [
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
      pinned: 'left',
      cellRenderer: PersonListButtonComponent,
    },
    { field: 'rut', headerName: 'Rut', filter: true },
    { field: 'name', headerName: 'Nombre', filter: true },
    { field: 'middle_name', headerName: '2do Nombre', filter: true },
    { field: 'first_name', headerName: 'Apellido Paterno', filter: true },
    { field: 'last_name', headerName: 'Apellido Materno', filter: true },
    { field: 'birthday', headerName: 'Fecha de Nacimiento', filter: true },
    {
      headerName: 'Edad',
      width: 100,
      cellClass: 'text-right',
      valueGetter: (r) => {
        if (r.data.birthday) {
          const age = this.calculateAge(r.data.birthday);
          return age < 10 ? `0${age}` : `${age}`;
        } else {
          return '';
        }
      },
      filter: 'agNumberColumnFilter',
    },
    { field: 'email', headerName: 'Email', filter: true },
    { field: 'phone', headerName: 'Teléfono', filter: true },
    { field: 'address', headerName: 'Dirección', filter: true },
    { field: 'gender', headerName: 'Sexo', filter: true },
    { field: 'profession', headerName: 'Profesión u Oficio', filter: true },
    { field: 'license_plate', headerName: 'Patente', filter: true },
    {
      field: 'medical_conditions',
      headerName: 'Condición médica',
      filter: true,
    },
    {
      headerName: 'Localidad / Sector',
      valueGetter: (r) =>
        this.localities().find((l) => l.id === r.data.locality_id)
          ?.display_name,
      filter: true,
    },
    { field: 'observations', headerName: 'Observaciones', filter: true },
  ];

  onGridReady(params: GridReadyEvent) {
    // this._personSrv.list().subscribe((persons) => {
    //   this.persons = persons;
    //   console.log(persons);
    // });
  }

  calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    return today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate())
      ? age
      : age - 1;
  }

  openModal() {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      minWidth: '500px',
      data: {
        view: 'modal',
      },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  exportToCsv() {
    this._gridApi.exportDataAsCsv();
  }
}
