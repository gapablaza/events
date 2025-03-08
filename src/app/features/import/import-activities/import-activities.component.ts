import { Component, inject, OnInit } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

import { Activity } from '../../../core/model';
import activity_data from './activities.data';

@Component({
    selector: 'app-import-activities',
    template: '',
    imports: []
})
export class ImportActivitiesComponent implements OnInit {
  private _firestore = inject(Firestore);
  private PATH = 'event/rucacura-2025/activities';

  records = activity_data;

  ngOnInit(): void {
    console.log('ImportActivitiesComponent');

    let mapped = this.records.map((activity: Activity) => {
      this.saveActivity(activity);
    });

    console.log(mapped);
  }

  async saveActivity(activity: Activity) {
    const temp = {
      name: activity.name,
      short_name: activity.short_name,
      description: activity.description,
      position: activity.position,
    };

    await setDoc(doc(this._firestore, this.PATH, activity.id), temp);
  }
}
