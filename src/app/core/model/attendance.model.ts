import { Locality } from './locality.model';
import { Person } from './person.model';

export interface Attendance {
  id: string;
  attendance_at?: number;
  locality_id?: string;
  locality_info?: Locality;
  person_id: string;
  person_info?: Person;
  registered_at?: number;

  attendance_code?: string;
  observations?: string;
  event_id?: string;
  activity_id?: string;
  registration_time?: number;
  attendance_time?: number;
}
