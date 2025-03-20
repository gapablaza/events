import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';

import { Attendance, Registration } from '../../../core/model';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  imports: [],
})
export class AttendanceListComponent {
  registrations = input.required<Registration[]>();
  attendance = input.required<Attendance[]>();
  @Output() onCheck = new EventEmitter<Attendance>();
  @Output() onUncheck = new EventEmitter<Attendance>();

  sortedRegistrations = computed(() =>
    [...this.registrations()].sort((a, b) =>
      (a.person_info?.name || '').localeCompare(b.person_info?.name || '', 'es')
    )
  );

  checked = computed(() => {
    return this.sortedRegistrations().filter((r) =>
      this.attendance().some((a) => a.id === r.id && a.attendance_at !== null)
    );
  });

  unchecked = computed(() => {
    return this.sortedRegistrations().filter(
      (r) =>
        !this.attendance().some(
          (a) => a.id === r.id && a.attendance_at !== null
        )
    );
  });

  check(a: Attendance) {
    this.onCheck.emit(a);
  }

  uncheck(a: Attendance) {
    this.onUncheck.emit(a);
  }
}
