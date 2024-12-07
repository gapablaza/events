import { Component, OnInit } from "@angular/core";

import { ActivityService } from "../../../core/service";
import { Activity } from "../../../core/model";

@Component({
    selector: "app-activity-list",
    templateUrl: "./activity-list.component.html",
    standalone: true,
    imports: [],
})
export class ActivityListComponent implements OnInit {
    activities: Activity[] = [];

    constructor(
        private activitySrv: ActivityService
    ) {}

    ngOnInit(): void {
        console.log('ActivityListComponent');

        // this.activitySrv.list().subscribe(activities => {
        //     this.activities = activities;
        //     console.log(activities);
        // })
    }
}