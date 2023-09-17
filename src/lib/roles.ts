import { api } from "@/hooks/auth";
import { AxiosResponse } from "axios";

export interface Roles {
  id: string;
  username: string;
  email: string;
  teacher?: Teacher;
  student?: Student;
  identity: Identity;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  teacher_id: string;
  fullname: string;
  niy: string;
  jenis_kelamin: string;
}

export interface Student {
  student_id: string;
  fullname: string;
  nipd: string;
  jenis_kelamin: string;
}

export interface Identity {
  teacher_id?: string;
  student_id?: string;
  fullname: string;
  niy?: string;
  nipd?: string;
  jenis_kelamin: string;
}

export const getRoles = async (role: string) => {
  const res = await api.get<{
    data: Roles[];
  }>(`/api/roles/gemini/get?role=${role.replace("-", " ")}`);

  return res.data.data;
};

export const assignRole = async (
  role: "ketarunaan" | "osis ketarunaan",
  userId: string
) => {
  const res = await api.post("/api/roles/gemini/assign", {
    role: role.replace("-", " "),
    user_id: userId,
  });

  // console.log(res)

  return res;
};

export const removeRole = async (
  role: string | "ketarunaan" | "osis ketarunaan",
  userId: string
) => {
  const res = await api.delete("/api/roles/gemini/remove", {
    data: {
      user_id: userId,
      role: role.replace("-", " "),
    },
  });

  // console.log('deleted', res)

  return res;
};
