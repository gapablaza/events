import { Person } from './person.model';

export interface Attendance {
  id: string;
  event_id?: string;
  activity_id?: string;
  person_id: string;
  person_info?: Person;
  attendance_code?: string;
  observations?: string;
  registration_time?: number;
  registered_at?: number;
  attendance_time?: number;
  attendance_at?: number;
}
