import { api } from "@/hooks/auth";
import { AttendancesResponse } from "@/types/attendances";
import { AxiosPromise, AxiosResponse } from "axios";
import { create } from "zustand";

interface RecapKehadiran {
  id: number;
  student: {
    fullname: string;
    nipd: string;
  };
  attendance_date: string;
  rombel: {
    nama: string;
  };
}

// recap state
interface RecapState {
  attendances: RecapKehadiran[];
  fetchAttendances: (page: number) => AxiosPromise<AttendancesResponse>;
}

export const useRecap = create<RecapState>((set, get) => ({
  attendances: [],
  fetchAttendances: async (page: number = 1) => {
    const res = await api
      .get<AttendancesResponse>(`/api/attendance/apel/latest?page=${page}`)
      .then((res: AxiosResponse<AttendancesResponse>) => {
        const newAttendances = res.data.attendances.data.filter(
          (attendance) => {
            if (!get().attendances.some((a) => a.id === attendance.id)) {
              return true;
            }
            return false;
          }
        );
        set((state) => ({
          attendances: [...state.attendances, ...newAttendances],
        }));
        return res;
      });

    return res;
  },
}));
