import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  template: `<button (click)="buttonClicked()">+ Info</button>`,
  imports: [],
})
export class PersonListButtonComponent implements ICellRendererAngularComp {
  _router = inject(Router);
  _params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this._params = params;
  }
  refresh(params: ICellRendererParams) {
    return true;
  }
  buttonClicked() {
    console.log(this._params.data);
    this._router.navigateByUrl('person/edit/' + this._params.data.id);
  }
}
