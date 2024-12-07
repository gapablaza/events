import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  template: `<button (click)="buttonClicked()">+ Info</button>`,
})
export class PersonListButtonComponent implements ICellRendererAngularComp {
  _params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this._params = params;
  }
  refresh(params: ICellRendererParams) {
    return true;
  }
  buttonClicked() {
    alert('Info');
    console.log(this._params.data);
  }
}
