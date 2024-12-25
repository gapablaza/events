import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community'; // Column Definition Type Interface

import { EventService, LocalityService } from '../../../core/service';
import { Activity, Locality, Registration } from '../../../core/model';

@Component({
  selector: 'app-event-import',
  template: `
    <p>
      Inscritos
      <a routerLink="add">+ Agregar</a>
    </p>
    <ag-grid-angular
      style="width: 100%; height: 500px;"
      class="ag-theme-quartz"
      [rowData]="registrations"
      [columnDefs]="colDefs"
      [pagination]="true"
      (gridReady)="onGridReady($event)"
    />
  `,
  imports: [AgGridAngular, RouterLink],
})
export class EventRegistrationsComponent implements OnInit {
  private _gridApi!: GridApi<Registration>;

  private _eventSrv = inject(EventService);
  private _localitySrv = inject(LocalityService);

  registrations: Registration[] = [];
  localities = signal<Locality[]>([]);
  activities = signal<Activity[]>([]);

  colDefs: (ColDef | ColGroupDef)[] = [
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
        `${r.data.person_info.name} ${r.data.person_info.middle_name}`,
      filter: true,
    },
    {
      headerName: 'Apellidos',
      valueGetter: (r) =>
        `${r.data.person_info.first_name} ${r.data.person_info.last_name}`,
      filter: true,
    },
    {
      headerName: 'Edad',
      valueFormatter: (r) => {
        if (r.data.person_info.birthday) {
          const age = this.calculateAge(r.data.person_info.birthday);
          return `${age} años (${r.data.person_info.birthday})`;
        } else {
          return '';
        }
      },
      filter: true,
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this._gridApi = params.api;

    this._eventSrv.registrations().subscribe((registrations) => {
      this.registrations = registrations;
      console.log(registrations);
    });
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

  ngOnInit(): void {
    this._localitySrv.list().subscribe((localities) => {
      this.localities.set(localities);
      console.log(this.localities());
    });

    this._eventSrv.activities().subscribe((activities) => {
      let tempColDef: (ColDef | ColGroupDef)[] = [];

      activities.forEach((activity) => {
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
          headerName: 'Días',
          valueGetter: (r) => r.data.activities_registered.length,
          width: 100,
          filter: true,
        },
        {
          field: 'total_cost',
          headerName: 'Monto Total',
          valueFormatter: (r) =>
            (r.data.total_cost || 0).toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP',
            }),
          filter: true,
        },
        { field: 'code', headerName: 'Código', filter: true },
        {
          field: 'person_info.gender',
          headerName: 'Sexo',
          width: 100,
          filter: true,
        },
        {
          field: 'requires_accommodation',
          headerName: 'Dentro del recinto',
          valueFormatter: (r) => (r.data.requires_accommodation ? 'Si' : 'No'),
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
          valueFormatter: (r) => (r.data.vehicle_owner ? 'Si' : 'No'),
          filter: true,
        },
        { field: 'xxx', headerName: 'Patologías', filter: true },
        {
          field: 'person_info.profession',
          headerName: 'Profesión u Oficio',
          filter: true,
        },
        { field: 'observations', headerName: 'Observaciones', filter: true }
      );

      this._gridApi.setGridOption('columnDefs', this.colDefs);

      this.activities.set(activities);
      console.log(this.activities());
    });
  }
}
