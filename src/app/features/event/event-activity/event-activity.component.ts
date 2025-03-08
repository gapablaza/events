import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Attendance } from '../../../core/model';
import { EventService } from '../../../core/service';
import { AttendanceListComponent } from '../../attendance/attendance-list/attendance-list.component';

@Component({
    selector: 'app-event-activity',
    templateUrl: './event-activity.component.html',
    imports: [AttendanceListComponent]
})
export class EventActivityComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _eventService = inject(EventService);

  //   activityId = signal('');
  //   registrations$!: Observable<Attendance[]>;
  registrations = signal<Attendance[]>([]);

  ngOnInit(): void {
    // Obtiene el ID de la actividad desde la URL
    this._route.paramMap.subscribe((params) => {
      const activityId = params.get('activityId');
      if (activityId) {
        // this.activityId.set(activityId);

        // Llama al servicio para obtener los inscritos
        this._eventService
          .getActivityRegistrations(activityId)
          .subscribe((registrations) => {
            console.log(registrations);
            this.registrations.set(registrations);
          });
      }
    });
  }

  check(a: Attendance) {
    console.log(a);
    // this._eventService.checkAttendance(a.id);
  }
}
