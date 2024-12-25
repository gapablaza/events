import { Component, inject, OnInit } from '@angular/core';
import { Firestore, Timestamp } from '@angular/fire/firestore';

import registration_data from './registrations.data';
import { EventService } from '../../../core/service';

@Component({
  selector: 'app-event-import',
  templateUrl: './event-import.component.html',
  imports: [],
})
export class EventImportComponent implements OnInit {
  private _firestore = inject(Firestore);
  private _eventSrv = inject(EventService);

  records = registration_data;

  ngOnInit(): void {
    console.log('EventImportComponent');

    let mapped = this.records.map((registration) => {
      let temp = {
        // person_id: registration['person_id'],
        // person_info: registration['person_info'],
        // locality_id: registration['locality_id'],
        // locality_info: registration['locality_info'],
        code: registration['code'],
        totalCost: registration['total_cost'],
        // activities_registered: registration['activities_registered'],
        requiresAccommodation: registration['requires_accommodation'],
        licensePlate: registration['license_plate'],
        vehicleOwner: registration['vehicle_owner'],
        observations: registration['observations'],
        // registration_time: Timestamp.now(),
      };

    //   this._eventSrv.registerPerson(
    //     registration['person_id'],
    //     registration['locality_id'],
    //     registration['activities_registered'],
    //     temp
    //   ).then(() => {
    //     console.log('Registrado');
    //   }).catch((error) => {
    //     console.log(error);
    //   });

      //   addDoc(collection(this._firestore, 'attendance'), temp);
      return temp;
    });

    console.log(mapped);
  }
}
