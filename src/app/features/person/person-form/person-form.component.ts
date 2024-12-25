import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

import { LocalityService, PersonService } from '../../../core/service';
import { Locality, Person } from '../../../core/model';

@Component({
  selector: 'person-form',
  templateUrl: './person-form.component.html',
  imports: [ReactiveFormsModule, RouterLink, NgFor],
})
export class PersonFormComponent implements OnInit {
  fb = inject(FormBuilder);
  personSrv = inject(PersonService);
  LocalitySrv = inject(LocalityService);

  isLoaded = signal(false);
  localities = signal<Locality[]>([]);
  mode = signal<'create' | 'update' | null>(null);
  person = input<Person | null>(null);
  errorMsg: string | null = null;

  readonly personForm = new FormGroup({
    id: new FormControl(''),
    rut: new FormControl(''),
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
    pathologies: new FormControl(''),
    locality_id: new FormControl(''),
    locality_name: new FormControl(''),
    observations: new FormControl(''),
  });

  ngOnInit(): void {
    console.log(this.person());

    this.LocalitySrv.list().subscribe((localities) => {
      this.localities.set(localities);

      if (this.person()) {
        this.mode.set('update');
        this.personForm.patchValue(this.person() as Person);
      } else {
        this.mode.set('create');
      }
      this.isLoaded.set(true);
    });
  }

  onSubmit() {
    if (this.personForm.valid) {
      // setear el locality_name en base al locality_id seleccionado
      const local_id = this.personForm.get('locality_id')?.value;
      const local = this.localities().find((l) => l.id === local_id);
      if (local) {
        this.personForm.get('locality_name')?.setValue(local.display_name);
      }

      if (this.person()) {
        // si está en modo edición
        this.personSrv
          .update(this.personForm.value as Person)
          .then(() => {
            console.log('Person updated');
          })
      } else {
        // si está en modo creación
        this.personSrv
          .add(this.personForm.value as Person)
          .then(() => {
            console.log('Person created');
          });
      }

      console.log(this.personForm.value);
    } else {
      console.log('error', this.personForm.value);
    }
  }
}
