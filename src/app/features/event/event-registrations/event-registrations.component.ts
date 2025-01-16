import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community'; // Column Definition Type Interface

import { Registration } from '../../../core/model';
import { appFeature } from '../../../store/app.state';
import { eventFeature } from '../store/event.state';
import { EventRegistrationButtonComponent } from './event-registrations-button.component';

@Component({
  selector: 'app-event-import',
  templateUrl: './event-registrations.component.html',
  standalone: true,
  imports: [AgGridAngular, RouterLink],
})
export class EventRegistrationsComponent implements OnInit {
  private _gridApi!: GridApi<Registration>;
  private store = inject(Store);

  localities = this.store.selectSignal(appFeature.selectLocalities);
  registrations = this.store.selectSignal(eventFeature.selectRegistrations);
  activities = this.store.selectSignal(eventFeature.selectActivities);

  colDefs: (ColDef | ColGroupDef)[] = [
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
      pinned: 'left',
      cellRenderer: EventRegistrationButtonComponent,
    },
    {
      headerName: 'Localidad - Sector',
      valueGetter: (r) =>
        this.localities().find((l) => l.id === r.data.locality_id)
          ?.display_name,
      filter: true,
    },
    {
      headerName: 'Nombres',
      valueGetter: (r) =>
        `${r.data.person_info.name} ${r.data.person_info.middle_name || ''}`,
      filter: true,
    },
    {
      headerName: 'Apellidos',
      valueGetter: (r) =>
        `${r.data.person_info.first_name} ${
          r.data.person_info.last_name || ''
        }`,
      filter: true,
    },
    {
      headerName: 'F. Nacimiento',
      field: 'person_info.birthday',
      filter: true,
    },
    {
      headerName: 'Edad',
      width: 100,
      cellClass: 'text-right',
      valueGetter: (r) => {
        if (r.data.person_info.birthday) {
          const age = this.calculateAge(r.data.person_info.birthday);
          return age < 10 ? `0${age}` : `${age}`;
        } else {
          return '';
        }
      },
      filter: 'agNumberColumnFilter',
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this._gridApi = params.api;

    this.initializeColumns();
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

  initializeColumns(): void {
    let tempColDef: (ColDef | ColGroupDef)[] = [];

    this.activities().forEach((activity) => {
      tempColDef.push({
        valueGetter: (r) =>
          r.data.activities_registered.includes(activity.id) ? 1 : 0,
        headerName: activity.short_name,
        width: 100,
        filter: true,
      });
    });

    this.colDefs.push({
      headerName: 'Actividades',
      children: tempColDef,
    });

    this.colDefs.push(
      {
        headerName: 'Ctdad.',
        valueGetter: (r) => r.data.activities_registered.length,
        width: 100,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'total_cost',
        headerName: 'Monto Total',
        cellClass: 'text-right',
        // valueFormatter: (r) =>
        //   (r.data.total_cost || 0).toLocaleString('es-CL', {
        //     style: 'currency',
        //     currency: 'CLP',
        //   }),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'total_paid',
        headerName: 'Monto Pagado',
        cellClass: 'text-right',
        // valueFormatter: (r) =>
        //   (r.data.total_cost || 0).toLocaleString('es-CL', {
        //     style: 'currency',
        //     currency: 'CLP',
        //   }),
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Diferencia',
        cellClass: 'text-right',
        valueGetter: (r) =>
          (r.data.total_cost || 0) - (r.data.total_paid || 0),
        filter: 'agNumberColumnFilter',
      },
      { field: 'code', headerName: 'Código', filter: true },
      {
        field: 'person_info.gender',
        headerName: 'Sexo',
        width: 100,
        filter: true,
      },
      {
        field: 'inside_enclosure',
        headerName: 'Dentro del recinto',
        cellDataType: 'boolean',
        // valueGetter: (r) => (r.data.inside_enclosure && r.data.inside_enclosure === 'true' ? 'Si' : 'No'),
        filter: true,
      },
      {
        field: 'license_plate',
        headerName: 'Patente Vehículo',
        filter: true,
      },
      {
        field: 'vehicle_owner',
        headerName: 'Dueño del Vehículo',
        cellDataType: 'boolean',
        // valueGetter: (r) => (r.data.vehicle_owner && r.data.vehicle_owner === 'true' ? 'Si' : 'No'),
        filter: true,
      },
      {
        field: 'person_info.medical_conditions',
        headerName: 'Condición médica',
        filter: true,
      },
      {
        field: 'person_info.profession',
        headerName: 'Profesión u Oficio',
        filter: true,
      },
      {
        field: 'person_info.email',
        headerName: 'Email',
        filter: true,
      },
      {
        field: 'person_info.phone',
        headerName: 'Teléfono',
        filter: true,
      },
      { field: 'observations', headerName: 'Observaciones', filter: true }
    );

    this._gridApi.setGridOption('columnDefs', this.colDefs);
  }

  ngOnInit(): void {}

  exportToCsv() {
    this._gridApi.exportDataAsCsv();
  }
}
