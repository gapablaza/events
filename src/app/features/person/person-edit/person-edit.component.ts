import { Component, effect, inject, input, signal } from '@angular/core';

import { PersonService } from '../../../core/service';
import { Person } from '../../../core/model';
import { PersonFormComponent } from "../person-form/person-form.component";

@Component({
    selector: 'app-person-edit',
    templateUrl: './person-edit.component.html',
    imports: [PersonFormComponent]
})
export class PersonEditComponent {
  personSrv = inject(PersonService);

  personId = input.required<string>();
  person = signal<Person | null>(null);

  constructor() {
    effect(() => {
      const id = this.personId();
      if (id) {
        this.personSrv.get(id).subscribe((person) => {
          this.person.set(person);
        });
      }
    });
  }
}
