import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';

import { PersonService } from '../../../core/service';
import { Locality, Person, Registration } from '../../../core/model';
import { appFeature } from '../../../store/app.state';
import { eventFeature } from '../store/event.state';
import { eventActions } from '../store/event.actions';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event-registration-form',
  templateUrl: './event-registration-form.component.html',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    RouterLink,
    NgClass,
  ],
})
export class EventRegistrationFormComponent implements OnInit {
  private store = inject(Store);
  private _fb = inject(FormBuilder);
  private personSrv = inject(PersonService);

  data = inject(MAT_DIALOG_DATA, { optional: true }) as {
    registration: Registration | null;
  } | null;
  dialogRef = inject(MatDialogRef<EventRegistrationFormComponent>, {
    optional: true,
  });

  localities = this.store.selectSignal(appFeature.selectLocalities);
  activities = this.store.selectSignal(eventFeature.selectActivities);

  persons = signal<Person[]>([]);
  registration = input<Registration | null>(null);

  isLoaded = signal(false);
  isProcessing = this.store.selectSignal(eventFeature.selectIsProcessing);
  mode = signal<'create' | 'update' | null>(null);
  view = signal<'modal' | 'page'>('modal');

  selectedPerson = signal<Person | null>(null);
  selectedLocality = signal<Locality | null>(null);

  readonly registrationForm = new FormGroup({
    id: new FormControl(''),
    person_id: new FormControl('', {
      validators: [Validators.required],
    }),
    locality_id: new FormControl('', {
      validators: [Validators.required],
    }),
    activities: new FormArray<any>([]),
    activities_registered: new FormControl('', {
      validators: [Validators.required],
    }),
    total_cost: new FormControl<number>(0, {
      validators: [Validators.required],
    }),
    total_paid: new FormControl<number>(0, {
      validators: [Validators.required],
    }),
    code: new FormControl<string>(''),
    registration_date: new FormControl<string>(''),
    inside_enclosure: new FormControl<boolean | string | null>(null),
    license_plate: new FormControl<string>(''),
    vehicle_owner: new FormControl<boolean | string | null>(null),
    observations: new FormControl<string>(''),
  });

  ngOnInit(): void {
    if (!this.data) {
      this.view.set('page');
    }

    const registrationData = this.data?.registration ?? this.registration();
    if (registrationData) {
      this.mode.set('update');

      // Precargar los datos de la persona
      this.selectedPerson.set(registrationData.person_info!);
      this.persons.set([registrationData.person_info!]);

      // Precargar los datos de la localidad
      this.selectedLocality.set(
        this.localities().find((l) => l.id === registrationData.locality_id)!
      );

      // Precargar los datos de la inscripción
      const selectedActivities = registrationData.activities_registered!;
      this.registrationForm.patchValue({
        ...registrationData,
        activities_registered: selectedActivities.join(','),
      });
      this.registrationForm.get('person_id')?.disable();

      // Marcar checkboxes de actividades seleccionadas
      this.populateCheckboxes(selectedActivities);
    } else {
      this.mode.set('create');
      this.populateCheckboxes();

      // Precarga la fecha actual en el campo registration_date
      // this.registrationForm.get('registration_date')?.setValue(new Date().toISOString().split('T')[0]);

      // TO DO: cambiar por autocompletado
      this.personSrv.list().subscribe((persons) => {
        this.persons.set(
          persons.sort((a, b) =>
            (a.name + ' ' + a.first_name).localeCompare(
              b.name + ' ' + b.first_name
            )
          )
        );

        // si se modifica la persona seleccionada de manera externa, se actualiza la de acá
        if (this.selectedPerson()) {
          let tempPerson = persons.find(
            (p) => p.id === this.selectedPerson()?.id
          );
          if (tempPerson) {
            this.selectedPerson.set(tempPerson);
          }
        }
      });
    }

    this.isLoaded.set(true);
  }

  populateCheckboxes(selectedActivities: string[] = []): void {
    const activityFormArray = this.registrationForm.get(
      'activities'
    ) as FormArray;
    activityFormArray.clear(); // Limpiar checkboxes previos

    this.activities().forEach((activity) => {
      const isSelected = selectedActivities.includes(activity.id);
      activityFormArray.push(this._fb.control(isSelected));
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      let tempInsideEnclosure: boolean | undefined = undefined;
      if (
        this.registrationForm.value.inside_enclosure === 'true' ||
        this.registrationForm.value.inside_enclosure === true
      ) {
        tempInsideEnclosure = true;
      }
      if (
        this.registrationForm.value.inside_enclosure === 'false' ||
        this.registrationForm.value.inside_enclosure === false
      ) {
        tempInsideEnclosure = false;
      }

      let tempVehicleOwner: boolean | undefined = undefined;
      if (
        this.registrationForm.value.vehicle_owner === 'true' ||
        this.registrationForm.value.vehicle_owner === true
      ) {
        tempVehicleOwner = true;
      }
      if (
        this.registrationForm.value.vehicle_owner === 'false' ||
        this.registrationForm.value.vehicle_owner === false
      ) {
        tempVehicleOwner = false;
      }

      const registrationData = {
        totalCost: this.registrationForm.value.total_cost ?? 0,
        totalPaid: this.registrationForm.value.total_paid ?? 0,
        code: this.registrationForm.value.code ?? undefined,
        registrationDate: this.registrationForm.value.registration_date ?? undefined,
        insideEnclosure: tempInsideEnclosure,
        licensePlate: this.registrationForm.value.license_plate ?? undefined,
        vehicleOwner: tempVehicleOwner,
        observations: this.registrationForm.value.observations ?? undefined,
      };

      if (this.mode() === 'update') {
        // Actualizar inscripción
        this.store.dispatch(
          eventActions.editRegistration({
            updatedPerson: this.selectedPerson()!,
            updatedLocality: this.selectedLocality()!,
            updatedActivitiesIds:
              this.registrationForm.value.activities_registered!.split(','),
            updatedRegistrationData: registrationData,
          })
        );
      } else {
        // Crear inscripción
        this.store.dispatch(
          eventActions.createRegistration({
            person: this.selectedPerson()!,
            locality: this.selectedLocality()!,
            activitiesIds:
              this.registrationForm.value.activities_registered!.split(','),
            registrationData,
          })
        );
      }

      this.dialogRef?.close();
    }
  }

  onSelectPerson(personId: string) {
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

    this.registrationForm.patchValue({
      activities_registered: selectedActivities ?? null,
    });
  }

  onDelete() {
    if (this.mode() === 'update') {
      const registrationData = this.data?.registration ?? this.registration();
      this.store.dispatch(
        eventActions.deleteRegistration({ id: registrationData!.id })
      );

      this.dialogRef?.close();
    }
  }
}
