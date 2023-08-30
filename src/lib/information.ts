import { api } from "@/hooks/auth"
import { AxiosResponse } from "axios";

export type Student = {
    student_id: string;
    fullname: string;
    nipd: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    photo: string;
    active: number;
    rombel_aktif: RombelAktif[];
}

type RombelAktif = {
    id: string;
    nama: string;
    tingkat_kelas: number;
    jurusan_id: number;
    tahun_ajaran_id: number;
    wali_id: string;
    image: string;
    status_aktif: number;
    created_at: string;
    updated_at: string;
    pivot: Pivot;
}

type Pivot = {
    student_id: string;
    rombongan_belajar_id: string;
}


const getStudentInformationById = async (student_id: string) => {

    if (!student_id) {
        return
    }

    const res: AxiosResponse<Student> = await api.get(`/api/student/information?student_id=${student_id}`)

    return res
}

export { getStudentInformationById }