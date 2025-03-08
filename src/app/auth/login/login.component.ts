import { Component, inject } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { appFeature } from '../../store/app.state';
import { appActions } from '../../store/app.actions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [ReactiveFormsModule, AsyncPipe]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  store = inject(Store);

  isProcessing$ = this.store.select(appFeature.selectIsProcessing);

  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  errorMsg: string | null = null;

  onSubmit() {
    const { email, password } = this.loginForm.value;
    if (email && password) {
      this.store.dispatch(appActions.login({ email, password }));
    }
  }
}
