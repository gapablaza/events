import { Locality } from './locality.model';

export interface Person {
  id: string;
  rut?: string;
  name: string;
  middle_name?: string;
  first_name: string;
  last_name?: string;
  birthday?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: 'M' | 'F';
  profession?: string;
  license_plate?: string;
  medical_conditions?: string; // TO DO: Por definir estructura
  locality_id: string;
  locality_info?: Locality;
  observations?: string;
  hidden_at?: number; // Unix epoch time
  registered_at: number; // Unix epoch time
  updated_at?: number; // Unix epoch time
}
