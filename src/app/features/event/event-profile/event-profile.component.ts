import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { eventFeature } from '../store/event.state';

@Component({
    selector: 'app-event-profile',
    templateUrl: './event-profile.component.html',
    imports: [RouterLink]
})
export class EventProfileComponent {
  private store = inject(Store);

  event = this.store.selectSignal(eventFeature.selectEventSelected);
  registrationsCount = this.store.selectSignal(
    eventFeature.selectRegistrationsCount
  );
  activities = this.store.selectSignal(eventFeature.selectActivitiesWithCounter);
}
