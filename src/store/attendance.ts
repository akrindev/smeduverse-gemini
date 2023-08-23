// it is a store management file for attendance
import { api } from "@/hooks/auth";
import { AttendancesResponse } from "@/types/attendances";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// interface for attendance
interface Attendance {
  attendances: Array<any>;
  fetchAttendances: () => Promise<any>;
}

// create a store for attendance
export const useAttendance = create<Attendance>((set, get) => ({
  attendances: [],
  //   fetch attendance from api
  fetchAttendances: async () => {
    const res = await api
      .get<AttendancesResponse>("/api/attendance/apel/latest")
      .then((res) => {
        // console the response
        // console.log(res.data);

        set({
          attendances: res.data.attendances.data,
        });
      });

    return res;
  },
}));
