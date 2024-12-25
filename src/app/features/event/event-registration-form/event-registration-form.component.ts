import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

import {
  EventService,
  LocalityService,
  PersonService,
} from '../../../core/service';
import { Activity, Locality, Person } from '../../../core/model';

@Component({
  selector: 'app-event-registration-form',
  templateUrl: './event-registration-form.component.html',
  imports: [ReactiveFormsModule, RouterLink, NgFor],
})
export class EventRegistrationFormComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _personSrv = inject(PersonService);
  private _localitySrv = inject(LocalityService);
  private _eventSrv = inject(EventService);

  isLoaded = signal(true);

  persons = signal<Person[]>([]);
  localities = signal<Locality[]>([]);
  activities = signal<Activity[]>([]);
  selectedPerson = signal<Person | null>(null);
  selectedLocality = signal<Locality | null>(null);

  readonly registrationForm = new FormGroup({
    locality_id: new FormControl('', {
      validators: [Validators.required],
    }),
    // locality_info: new FormControl(''),
    person_id: new FormControl('', {
      validators: [Validators.required],
    }),
    // person_info: new FormControl(''),
    activities_registered: new FormControl('', {
      validators: [Validators.required],
    }),
    activities: new FormArray([]),
    total_cost: new FormControl<number>(0),
    code: new FormControl<string>(''),
    requires_accommodation: new FormControl<boolean | null>(null),
    license_plate: new FormControl<string>(''),
    vehicle_owner: new FormControl<boolean | null>(null),
    observations: new FormControl<string>(''),
  });

  ngOnInit(): void {
    this._localitySrv.list().subscribe((localities) => {
      this.localities.set(localities);
      console.log(this.localities());
    });

    this._eventSrv.activities().subscribe((activities) => {
      this.activities.set(activities);
      this.populateCheckboxes();
      console.log(this.activities());
    });

    this._personSrv.list().subscribe((persons) => {
      this.persons.set(persons.sort((a, b) => a.name.localeCompare(b.name)));
      console.log(persons);
    });
  }

  populateCheckboxes(): void {
    const activityFormArray = this.registrationForm.get(
      'activities'
    ) as FormArray;
    this.activities().forEach(() =>
      activityFormArray.push(this._fb.control(false))
    );
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this._eventSrv
        .registrate(
          this.selectedPerson()!,
          this.selectedLocality()!,
          this.registrationForm.value.activities_registered!.split(','),
          {
            code: this.registrationForm.value.code || undefined,
            totalCost: this.registrationForm.value.total_cost || undefined,
            requiresAccommodation:
              this.registrationForm.value.requires_accommodation || undefined,
            licensePlate:
              this.registrationForm.value.license_plate || undefined,
            vehicleOwner:
              this.registrationForm.value.vehicle_owner || undefined,
            observations: this.registrationForm.value.observations || undefined,
          }
        )
        .then(() => console.log('registro exitoso'))
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err.message : 'Error inesperado';
          alert(`Error al registrar: ${errorMessage}`);
        });
    }
    console.log(this.registrationForm.value);
  }

  onSelectPerson(personId: string) {
    console.log(personId);
    const person = this.persons().find((p) => p.id === personId);

    // si se encuentra a la persona
    if (person) {
      this.selectedPerson.set(person);
      this.registrationForm.patchValue({
        person_id: person.id,
        locality_id: person.locality_id,
      });

      // si la persona tiene localidad
      if (person.locality_id) {
        const locality = this.localities().find(
          (l) => l.id === person.locality_id
        );
        if (locality) {
          this.selectedLocality.set(locality);
        }
      } else {
        this.selectedLocality.set(null);
      }

      // si no se encuentra a la persona
    } else {
      this.selectedPerson.set(null);
      this.selectedLocality.set(null);
      this.registrationForm.patchValue({
        person_id: '',
        locality_id: '',
      });
    }
  }

  onSelectLocality(localityId: string) {
    console.log(localityId);
    const locality = this.localities().find((l) => l.id === localityId);
    if (locality) {
      this.selectedLocality.set(locality);
      this.registrationForm.patchValue({
        locality_id: locality.id,
      });
    } else {
      this.selectedLocality.set(null);
      this.registrationForm.patchValue({
        locality_id: '',
      });
    }
  }

  onSelectActivity() {
    const selectedActivities = this.registrationForm.value
      .activities!.map((checked: boolean, i: number) =>
        checked ? this.activities()[i].id : null
      )
      .filter((id: string | null) => id !== null)
      .join(','); // Generar la cadena con los IDs separados por coma

    // console.log('Selected Activity IDs:', selectedActivities);

    this.registrationForm.patchValue({
      activities_registered: selectedActivities ?? null,
    });
  }
}
