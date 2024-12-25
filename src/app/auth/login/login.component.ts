import { Component, inject } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [RouterLink, ReactiveFormsModule]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authSrv = inject(AuthService);

  readonly loginForm = new FormGroup({
    email: new FormControl('gerson.eaa@gmail.com', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('123asd1', {
      validators: [Validators.required],
    }),
  });

  errorMsg: string | null = null;

  onSubmit() {
    const { email, password } = this.loginForm.value;
    this.authSrv.login(email!, password!).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.errorMsg = err.code;
        console.log(err);
      },
    });
  }
}
