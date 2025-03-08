import { Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';

import { EventRegistrationFormComponent } from '../event-registration-form/event-registration-form.component';
import { eventFeature } from '../store/event.state';

@Component({
    selector: 'app-event-registration-edit',
    templateUrl: './event-registration-edit.component.html',
    imports: [EventRegistrationFormComponent]
})
export class EventRegistrationEditComponent {
  store = inject(Store);

  registrationId = input.required<string>();
  registrations = this.store.selectSignal(eventFeature.selectRegistrations);
  registration = computed(() => {
    const foundRegistration = this.registrations().find(
      (registration) => registration.id === this.registrationId()
    );
    return foundRegistration || null;
  });
}
