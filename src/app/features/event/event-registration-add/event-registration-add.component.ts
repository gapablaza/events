import { Component } from '@angular/core';

import { EventRegistrationFormComponent } from '../event-registration-form/event-registration-form.component';

@Component({
    selector: 'app-event-registration-add',
    template: '<app-event-registration-form />',
    imports: [EventRegistrationFormComponent]
})
export class EventRegistrationAddComponent {}
