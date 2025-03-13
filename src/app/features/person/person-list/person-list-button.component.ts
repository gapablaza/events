import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Person } from '../../../core/model';
import { PersonFormComponent } from '../person-form/person-form.component';

@Component({
  selector: 'app-person-list-button',
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
export class PersonListButtonComponent implements ICellRendererAngularComp {
  router = inject(Router);
  dialog = inject(MatDialog);
  params!: ICellRendererParams;

  @Output() edit = new EventEmitter<Person>();

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  // buttonClicked() {
  //   console.log(this.params.data);
  //   this.router.navigate(['person/edit/', this.params.data.id]);
  // }

  openModal() {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      minWidth: '500px',
      data: {
        person: this.params.data,
        view: 'modal',
      }
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}
