import { Locality } from './locality.model';
import { Person } from './person.model';

export interface Registration {
  id: string;
  person_id: string;
  person_info?: Person;
  locality_id: string;
  locality_info?: Locality;
  activities_registered?: string[];
  total_cost?: number;
  total_paid?: number;
  code?: string;
  inside_enclosure?: boolean;
  license_plate?: string;
  vehicle_owner?: boolean;
  observations?: string;
  registered_at: number; // Unix epoch time
  updated_at?: number; // Unix epoch time
}
