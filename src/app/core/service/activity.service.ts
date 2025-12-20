import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, Observable, switchMap, throwError } from 'rxjs';

import { Activity, Attendance } from '../model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private firestore = inject(Firestore);

  list(eventId: string): Observable<Activity[]> {
    const refActivities = query(
      collection(this.firestore, `event/${eventId}/activities`)
    );

    return collectionData(refActivities, {
      idField: 'id',
    }) as Observable<Activity[]>;
  }

  get(eventId: string, activityId: string): Observable<Activity> {
    const refActivity = doc(
      this.firestore,
      `event/${eventId}/activities/${activityId}`
    );
    return docData(refActivity, {
      idField: 'id',
    }) as Observable<Activity>;
  }

  attendance(eventId: string, activityId: string): Observable<Attendance[]> {
    const attendanceRef = query(
      collection(
        this.firestore,
        `event/${eventId}/activities/${activityId}/registrations`
      )
    );

    return collectionData(attendanceRef, { idField: 'id' }) as Observable<
      Attendance[]
    >;
  }

  checkAttendance(
    eventId: string,
    activityId: string,
    attendanceId: string
  ): Observable<void> {
    const refAttendance = doc(
      this.firestore,
      `event/${eventId}/activities/${activityId}/registrations/${attendanceId}`
    );
    return from(
      updateDoc(refAttendance, {
        attendance_at: Timestamp.now(),
      })
    );
  }

  uncheckAttendance(
    eventId: string,
    activityId: string,
    attendanceId: string
  ): Observable<void> {
    const refAttendance = doc(
      this.firestore,
      `event/${eventId}/activities/${activityId}/registrations/${attendanceId}`
    );
    return from(
      updateDoc(refAttendance, {
        attendance_at: null,
      })
    );
  }

  attendanceByCode(
    eventId: string,
    activityId: string,
    attendanceCode: string
  ): Observable<void> {
    const registrationsRef = collection(
      this.firestore,
      `event/${eventId}/registrations`
    );
    const q = query(registrationsRef, where('code', '==', attendanceCode));

    return from(getDocs(q)).pipe(
      switchMap((snapshot) => {
        if (snapshot.empty) {
          return throwError(
            () => new Error('Código de inscripción no encontrado')
          );
        }

        const registrationDoc = snapshot.docs[0]; // Se asume que el código es único
        const personId = registrationDoc.id;

        const attendanceRef = doc(
          this.firestore,
          `event/${eventId}/activities/${activityId}/registrations/${personId}`
        );

        return from(getDoc(attendanceRef)).pipe(
          switchMap((attendanceSnapshot) => {
            // Validar si ya está registrada la asistencia
            if (attendanceSnapshot.data()?.['attendance_at']) {
              return throwError(
                () => new Error('La asistencia ya se encontraba registrada')
              );
            }

            // Registrar la asistencia si aún no existe
            return from(
              updateDoc(attendanceRef, {
                attendance_at: Timestamp.now(),
              })
            );
          })
        );
      })
    );
  }
}
