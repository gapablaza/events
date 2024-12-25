import {
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-attendance-by-code',
    templateUrl: './attendance-by-code.component.html',
    imports: [
        FormsModule
    ]
})
export class AttendanceByCodeComponent {
  @Output() onCode = new EventEmitter<string>();
  attendanceCode = signal<string>('');

  onSubmit() {
    const code = this.attendanceCode();
    if (!code) return;

    console.log(code);
    this.onCode.emit(code);
    this.attendanceCode.set('');
  }
}
