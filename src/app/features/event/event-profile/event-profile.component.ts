import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { eventFeature } from '../store/event.state';

@Component({
  selector: 'app-event-profile',
  templateUrl: './event-profile.component.html',
  standalone: true,
  imports: [RouterLink],
})
export class EventProfileComponent {
  private store = inject(Store);

  registrationsCount = this.store.selectSignal(
    eventFeature.selectRegistrationsCount
  );
  activities = this.store.selectSignal(eventFeature.selectActivitiesWithCounter);
}
