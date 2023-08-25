import { api } from "@/hooks/auth";
import { AttendancesResponse } from "@/types/attendances";
import { AxiosPromise, AxiosResponse } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Attendance {
  attendances: Array<any>;
  fetchAttendances: () => Promise<AxiosResponse<AttendancesResponse>>;
  deleteAttendance: (id: number) => Promise<AxiosResponse<AttendancesResponse>>;
}

export const useAttendance = create<Attendance>((set, get) => ({
  attendances: [],
  fetchAttendances: async () => {
    const res = await api
      .get<AttendancesResponse>("/api/attendance/apel/latest")
      .then((res: AxiosResponse<AttendancesResponse>) => {
        set({
          attendances: res.data.attendances.data,
        });
        return res;
      });

    return res;
  },
  deleteAttendance: async (id: number) => {
    const res = await api
      .delete(`/api/attendance/apel/delete/${id}`)
      .then((res: AxiosResponse<AttendancesResponse>) => {
        // populate attendances
        get().fetchAttendances();

        return res;
      });

    return res;
  },
}));
