import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, switchMap } from 'rxjs';

import { eventFeature } from '../store/event.state';
import { Attendance } from '../../../core/model';
import { AttendanceListComponent } from '../../attendance/attendance-list/attendance-list.component';
import { ActivityService, UIService } from '../../../core/service';

@Component({
  selector: 'app-event-attendance',
  templateUrl: './event-attendance.component.html',
  imports: [AttendanceListComponent, RouterLink, FormsModule],
})
export class EventAttendanceComponent implements OnInit, OnDestroy {
  store = inject(Store);
  route = inject(ActivatedRoute);
  activitySrv = inject(ActivityService);
  uiSrv = inject(UIService);

  subs: Subscription = new Subscription();
  attendanceCode = '';
  loading = signal(false);

  event = this.store.selectSignal(eventFeature.selectEventSelected);
  activities = this.store.selectSignal(
    eventFeature.selectActivitiesWithCounter
  );
  registrations = this.store.selectSignal(eventFeature.selectRegistrations);

  activityId = signal<string | null>(null);
  activitySelected = computed(() => {
    return this.activities().find((a) => a.id === this.activityId());
  });
  activityRegistrations = computed(() =>
    this.registrations().filter((r) =>
      r.activities_registered?.includes(this.activityId() ?? '')
    )
  );
  attendance = signal<Attendance[]>([]);

  ngOnInit() {
    let attendanceSub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const activityId = params.get('activityId');
          this.activityId.set(activityId);
          if (!activityId || !this.event()) return [];
          return this.activitySrv.attendance(this.event()!.id, activityId);
        })
      )
      .subscribe((act) => {
        this.attendance.set(act);
      });
    this.subs.add(attendanceSub);
  }

  attendanceByCode(): void {
    if (!this.attendanceCode.trim()) return; // Evitar llamadas vacías

    this.loading.set(true); // Deshabilitar el botón mientras se procesa

    const eventId = this.event()?.id;
    const activityId = this.activitySelected()?.id;

    if (!eventId || !activityId) {
      this.loading.set(false);
      return;
    }

    this.activitySrv
      .attendanceByCode(eventId, activityId, this.attendanceCode)
      .subscribe({
        next: () => {
          this.uiSrv.showSuccess('Asistencia registrada');
          this.attendanceCode = ''; // Limpiar campo
          this.loading.set(false);
        },
        error: (err) => {
          this.uiSrv.showError('No se pudo registrar la asistencia');
          this.loading.set(false);
        },
      });
  }

  toggleCheck(a: Attendance, check: boolean) {
    if (!this.event() || !this.activityId() || !a.id) return;

    const eventId = this.event()!.id;
    const activityId = this.activityId()!;
    const attendanceId = a.id;

    if (check) {
      this.activitySrv
        .checkAttendance(eventId, activityId, attendanceId)
        .subscribe({
          next: () => {
            this.uiSrv.showSuccess('Asistencia registrada');
          },
          error: () => {
            this.uiSrv.showError('No se pudo registrar la asistencia');
          },
        });
    } else {
      this.activitySrv
        .uncheckAttendance(eventId, activityId, attendanceId)
        .subscribe({
          next: () => {
            this.uiSrv.showSuccess('Asistencia eliminada');
          },
          error: () => {
            this.uiSrv.showError('No se pudo eliminar la asistencia');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
