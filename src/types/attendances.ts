export interface AttendancesResponse {
  message: string;
  attendances: PagingAttendances;
}

export interface PagingAttendances {
  current_page: number;
  data: Attendance[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: any;
  path: string;
  per_page: number;
  prev_page_url: any;
  to: number;
  total: number;
}

export interface Attendance {
  id: number;
  student_id: string;
  rombongan_belajar_id: string;
  attendance_type: string;
  attendance_status: string;
  attendance_date: string;
  created_at: string;
  updated_at: string;
  student: Student;
  rombel: Rombel;
}

export interface Student {
  student_id: string;
  fullname: string;
  nipd: string;
}

export interface Rombel {
  id: string;
  nama: string;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}
