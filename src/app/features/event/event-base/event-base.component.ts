import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { eventActions } from '../store/event.actions';

@Component({
    selector: 'app-event-base',
    template: `<router-outlet></router-outlet>`,
    imports: [RouterOutlet]
})
export class EventBaseComponent implements OnDestroy {
  store = inject(Store);

  // ngOnInit(): void {
  //   this.store.dispatch(eventActions.moduleOpened());
  // }

  ngOnDestroy(): void {
    this.store.dispatch(eventActions.clearEvent());
  }
}
