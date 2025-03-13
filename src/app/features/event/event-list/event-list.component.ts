import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { eventFeature } from '../store/event.state';
import { eventActions } from '../store/event.actions';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  imports: [RouterLink],
})
export class EventListComponent implements OnInit {
  store = inject(Store);
  events = this.store.selectSignal(eventFeature.selectAvailableEvents);

  ngOnInit(): void {
    this.store.dispatch(eventActions.loadAllEvents());
  }
}
