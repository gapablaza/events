import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { UIService } from '../../../core/service';
import { Person } from '../../../core/model';
import { rutValidator } from '../../../shared';
import { appFeature } from '../../../store/app.state';
import { personActions } from '../store/person.actions';
import { personFeature } from '../store/person.state';

@Component({
    selector: 'person-form',
    templateUrl: './person-form.component.html',
    imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, RouterLink, NgClass]
})
export class PersonFormComponent implements OnInit {
  fb = inject(FormBuilder);
  store = inject(Store);
  uiSrv = inject(UIService);

  data = inject(MAT_DIALOG_DATA, { optional: true }) as { person: Person | null } | null;
  dialogRef = inject(MatDialogRef<PersonFormComponent>, { optional: true });

  localities = this.store.selectSignal(appFeature.selectLocalities);
  isProcessing = this.store.selectSignal(personFeature.selectIsProcessing);

  isLoaded = signal(false);
  mode = signal<'create' | 'update' | null>(null);
  view = signal<'modal' | 'page'>('modal');
  person = input<Person | null>(null);

  readonly personForm = new FormGroup({
    id: new FormControl(''),
    rut: new FormControl('', {
      validators: [rutValidator],
    }),
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    middle_name: new FormControl(''),
    first_name: new FormControl('', {
      validators: [Validators.required],
    }),
    last_name: new FormControl(''),
    birthday: new FormControl(''),
    email: new FormControl('', {
      validators: [Validators.email],
    }),
    phone: new FormControl(''),
    address: new FormControl(''),
    gender: new FormControl(''),
    profession: new FormControl(''),
    license_plate: new FormControl(''),
    medical_conditions: new FormControl(''),
    locality_id: new FormControl('', {
      validators: [Validators.required],
    }),
    // locality_name: new FormControl(''),
    observations: new FormControl(''),
  });

  ngOnInit(): void {
    if (!this.data) {
      this.view.set('page');
    }

    const personData = this.data?.person ?? this.person();
    if (personData) {
      this.mode.set('update');
      this.personForm.patchValue(personData);
    } else {
      this.mode.set('create');
    }
    this.isLoaded.set(true);
  }

  onSubmit() {
    if (this.personForm.valid) {
      // setear el locality_name en base al locality_id seleccionado
      const local_id = this.personForm.get('locality_id')?.value;
      const locality = this.localities().find((l) => l.id === local_id);

      const tempPerson = {
        ...this.personForm.value,
        locality_info: locality,
      } as Person;

      if (this.mode() === 'update') {
        // si está en modo edición
        this.store.dispatch(personActions.editPerson({ person: tempPerson }));
      } else {
        // si está en modo creación
        this.store.dispatch(personActions.createPerson({ person: tempPerson }));
      }

      this.dialogRef?.close(); // Cierra el modal si fue abierto en modo modal
      // console.log(this.personForm.value);
    } else {
      console.log('error', this.personForm.value);
    }
  }
}
