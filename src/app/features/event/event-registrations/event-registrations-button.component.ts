import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-event-registrations-button',
  standalone: true,
  template: `
    <button
      class="bg-grey-500 hover:bg-grey-700 text-black px-2 rounded focus:outline-none focus:shadow-outline"
      (click)="buttonClicked()"
    >
      Editar
    </button>
  `,
  imports: [],
})
export class EventRegistrationButtonComponent
  implements ICellRendererAngularComp
{
  router = inject(Router);
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams) {
    return true;
  }
  buttonClicked() {
    this.router.navigate(['event/registrations/edit/', this.params.data.id]);
  }
}
