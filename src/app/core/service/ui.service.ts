import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UIService {
  defaultSnackbarDuration = 3000;
  errorSnackbarDuration = 5000;

  private _toastr = inject(ToastrService);

  showError(message: string) {
    return this._toastr.error(message, undefined, {
      timeOut: this.errorSnackbarDuration,
    });
  }

  showSuccess(message: string) {
    return this._toastr.success(message, undefined, {
      timeOut: this.defaultSnackbarDuration,
    });
  }

  showInfo(message: string) {
    return this._toastr.info(message, undefined, {
      timeOut: this.defaultSnackbarDuration,
    });
  }
}
