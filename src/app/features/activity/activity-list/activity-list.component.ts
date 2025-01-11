import { Component, inject, OnInit, signal } from "@angular/core";

import { ActivityService } from "../../../core/service";
import { Activity } from "../../../core/model";

@Component({
    selector: "app-activity-list",
    templateUrl: "./activity-list.component.html",
    standalone: true,
    imports: []
})
export class ActivityListComponent implements OnInit {
    private _activitySrv = inject(ActivityService);

    activities = signal<Activity[]>([]);
    // activities: Activity[] = [];


    constructor(
        private activitySrv: ActivityService
    ) {}

    ngOnInit(): void {
        console.log('ActivityListComponent');

        this.activitySrv.list().subscribe(activities => {
            this.activities.set(activities);
            console.log(activities);
        })
    }
}