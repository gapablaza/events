import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { EventRegistrationFormComponent } from '../event-registration-form/event-registration-form.component';

@Component({
  selector: 'app-event-registrations-button',
  template: `
    <button
      class="bg-grey-500 hover:bg-grey-700 text-black px-2 rounded focus:outline-none focus:shadow-outline"
      (click)="openModal()"
    >
      Editar
    </button>
  `,
  imports: [MatDialogModule],
})
export class EventRegistrationButtonComponent
  implements ICellRendererAngularComp
{
  router = inject(Router);
  dialog = inject(MatDialog);
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  // buttonClicked() {
  //   this.router.navigate(['event/registrations/edit/', this.params.data.id]);
  // }

  openModal() {
    const dialogRef = this.dialog.open(EventRegistrationFormComponent, {
      minWidth: '800px',
      data: {
        registration: this.params.data,
        view: 'modal',
      },
    });
  }
}
