import { Component, effect, inject, input, signal } from '@angular/core';

import { PersonService } from '../../../core/service';
import { PersonFormComponent } from "../person-form/person-form.component";

@Component({
  selector: 'app-person-add',
  templateUrl: './person-add.component.html',
  imports: [PersonFormComponent],
})
export class PersonAddComponent {
  personSrv = inject(PersonService);
}
