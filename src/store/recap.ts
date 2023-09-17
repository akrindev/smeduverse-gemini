import { api } from "@/hooks/auth";
import { Attendance, AttendancesResponse } from "@/types/attendances";
import { AxiosPromise, AxiosResponse } from "axios";
import { create } from "zustand";

// recap state
interface RecapState {
  attendances: Array<any>;
  fetchAttendances: (
    page?: number,
    date?: string,
    rombel_id?: number
  ) => Promise<void>;
  fetchAttendanceByStudentId: (
    student_id: string,
    month?: number,
    year?: number
  ) => AxiosPromise<{
    message: string;
    attendances: Attendance[];
  }>;
}

export const useRecap = create<RecapState>((set, get) => ({
  attendances: [],

  fetchAttendances: async (
    page: number = 1,
    date?: string,
    rombel_id?: number
  ) => {
    // console.log("fetching attendances date", date);
    const params = new URLSearchParams({
      page: page.toString(),
      date: date || "",
      rombel_id: rombel_id?.toString() || "",
    });
    const res = await api
      .get<AttendancesResponse>(`/api/attendance/apel/latest?${params}`)
      .then((res: AxiosResponse<AttendancesResponse>) => {
        const newAttendances = res.data.attendances.data.filter(
          (attendance) => {
            if (!get().attendances.some((a) => a.id === attendance.id)) {
              return true;
            }
            return false;
          }
        );
        // console
        // console.log("new attendances", newAttendances);
        // if date or rombel_id is not empty, then replace the attendances
        if (date || rombel_id) {
          set((state) => ({
            attendances: newAttendances,
          }));
        } else {
          set((state) => ({
            attendances: [...state.attendances, ...newAttendances],
          }));
        }
      });

    return res;
  },
  // fetch attendance by student_id
  // it didnt populate the state, but return the response
  fetchAttendanceByStudentId: async (
    student_id: string,
    month?: number,
    year?: number
  ) => {
    // student_id tidak boleh kosong
    if (!student_id) {
      return;
    }

    const params = new URLSearchParams({
      student_id: student_id,
      month: month?.toString() || "",
      year: year?.toString() || "",
    });

    const res: AxiosResponse = await api.get(
      `/api/attendance/apel/student?${params}`
    );

    return res;
  },
}));
