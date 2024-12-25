import { Component, computed, EventEmitter, input, Output } from "@angular/core";

import { Attendance } from "../../../core/model";
import { NgClass } from "@angular/common";

@Component({
    selector: "app-attendance-list",
    templateUrl: "./attendance-list.component.html",
    imports: [NgClass]
})
export class AttendanceListComponent {
    attendance = input.required<Attendance[]>();
    @Output() onCheck = new EventEmitter<Attendance>();

    checked = computed(() => {
        return this.attendance().filter((a) => a.attendance_time && a.attendance_time > 0);
    });

    unchecked = computed(() => {
        return this.attendance().filter((a) => !a.attendance_time);
    });

    check(a: Attendance) {
        this.onCheck.emit(a);
    }
}