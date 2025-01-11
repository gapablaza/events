import { Component, inject } from '@angular/core';

import { PersonService } from '../../../core/service';
import { PersonFormComponent } from '../person-form/person-form.component';

@Component({
  selector: 'app-person-add',
  templateUrl: './person-add.component.html',
  standalone: true,
  imports: [PersonFormComponent],
})
export class PersonAddComponent {
  personSrv = inject(PersonService);
}
