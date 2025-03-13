import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { eventActions } from './store/event.actions';

@Component({
  selector: 'app-event',
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet],
})
export class EventComponent implements OnDestroy {
  store = inject(Store);

  ngOnDestroy(): void {
    this.store.dispatch(eventActions.moduleClosed());
  }
}
