import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'app-person-list-button',
    template: `
    <button
      class="bg-grey-500 hover:bg-grey-700 text-black px-2 rounded focus:outline-none focus:shadow-outline"
      (click)="buttonClicked()"
    >
      Editar
    </button>
  `,
    imports: []
})
export class PersonListButtonComponent implements ICellRendererAngularComp {
  router = inject(Router);
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams) {
    return true;
  }
  buttonClicked() {
    console.log(this.params.data);
    this.router.navigate(['person/edit/', this.params.data.id]);
  }
}
