export interface Attendance {
    id: string;
    activity_id: string;
    attendance_code: string;
    person_id: string;
    person_info: {
        name: string;
        first_name: string;
    }
    registration_time: number;
    attendance_time?: number;
    observations?: string;
}