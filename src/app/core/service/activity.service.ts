import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { filter, from, map, Observable, take, tap } from 'rxjs';

import { Activity, Attendance } from '../model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private firestore = inject(Firestore);
  private RUCACURA_ID = 'F5yR5ftWYE3GCpve1G85';

  list(): Observable<Activity[]> {
    const refActivities = query(
      collection(this.firestore, 'activity'),
      where('event_id', '==', this.RUCACURA_ID)
    );

    // const refActivities = collection(this.firestore, 'activity');
    let activities = collectionData(refActivities, {
      idField: 'id',
    }) as Observable<any[]>;

    return activities.pipe(
      map((activities) =>
        activities
          .map((activity) => {
            return { ...activity, id: activity.id } as Activity;
          })
          .sort((a, b) => (a.position || 0) - (b.position || 0))
      )
    );
  }

  get(activityId: string): Observable<Activity> {
    const refActivity = doc(this.firestore, `activity/${activityId}`);
    let activity = docData(refActivity) as Observable<any>;

    return activity.pipe(
      map((activity) => {
        return { ...activity.info, id: activityId } as Activity;
      })
    );
  }

  attendance(activityId: string): Observable<Attendance[]> {
    const attendanceRef = query(
      collection(this.firestore, 'attendance'),
      where('activity_id', '==', activityId)
    );

    return collectionData(attendanceRef, { idField: 'id' }) as Observable<
      Attendance[]
    >;
  }

  checkAttendance(attendanceId: string): void {
    const refAttendance = doc(this.firestore, `attendance/${attendanceId}`);
    updateDoc(refAttendance, {
      attendance_time: serverTimestamp(),
    });
  }

  attendanceByCode(attendanceCode: string): void {
    const codeRef = query(
      collection(this.firestore, 'attendance'),
      where('attendance_code', '==', attendanceCode)
    );

    from(getDocs(codeRef))
      .pipe(
        take(1),
        map((snapshot) => {
          return snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as Attendance;
          })[0];
        }),
        tap((attendance) => {
          if (!attendance) {
            alert('Codigo no encontrado');
          }
        }),
        filter((attendance) => !!attendance)
      )
      .subscribe((attendance) => {
        const refAttendance = doc(
          this.firestore,
          `attendance/${attendance.id}`
        );
        updateDoc(refAttendance, {
          attendance_time: serverTimestamp(),
        });
      });
  }
}
