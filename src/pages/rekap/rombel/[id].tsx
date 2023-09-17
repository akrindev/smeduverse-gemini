import KonstaLayouts from "@/components/konsta-layouts";
import WithNavbar from "@/components/with-navbar";
import { api } from "@/hooks/auth";
import { getAttendanceStatus } from "@/lib/attendance-status";
import format from "date-fns/format";
import {
  List,
  ListItem,
  Navbar,
  NavbarBackLink,
  Page,
  Preloader,
} from "konsta/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RekapRombel() {
  const [students, setStudents] = useState([]);
  const [rombel, setRombel] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { id } = router.query;

  const totalAttendance = students.reduce((count, student) => {
    if (student.latest_gemini_attendance) {
      return count + 1;
    }
    return count;
  }, 0);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/orbit/api/rekap/rombel?rombel_id=${id}&date=2023-08-28`)
        .then((res) => {
          if (res.status === 200) {
            const { anggota_rombel, ...rombel } = res.data;
            setStudents(anggota_rombel);
            setRombel(rombel);
          }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <KonstaLayouts>
      <Page>
        <WithNavbar>
          <Navbar
            title="Rekap Rombel"
            left={<NavbarBackLink text="Back" onClick={() => history.back()} />}
          />
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <Preloader />
            </div>
          ) : (
            <>
              {rombel && (
                <List strong>
                  <ListItem header={"Rombel"} title={rombel.nama} />
                  <ListItem
                    header={"Kompetensi Keahlian"}
                    title={`${rombel.jurusan.kode} - ${rombel.jurusan.nama}`}
                  />
                  <ListItem header={"Jumlah Siswa"} title={students.length} />
                  <ListItem
                    header={"Jumlah Kehadiran"}
                    title={totalAttendance || "0"}
                  />
                </List>
              )}
              {students && (
                <List strong>
                  {students.map((student) => (
                    <ListItem
                      link
                      key={student.student_id}
                      title={
                        <div>
                          <span className="font-semibold">
                            {student.fullname}
                          </span>
                          {" - "}
                          <span className="font-thin">({student.nipd})</span>
                        </div>
                      }
                      header={
                        <span className="text-lg text-green-600">
                          {student.latest_gemini_attendance &&
                            format(
                              new Date(
                                student.latest_gemini_attendance?.attendance_date
                              ),
                              "HH:mm"
                            ) +
                              ` - ${getAttendanceStatus(
                                student.latest_gemini_attendance
                                  ?.attendance_status
                              )}`}
                        </span>
                      }
                      onClick={() =>
                        router.push(`/rekap/${student.student_id}`)
                      }
                    />
                  ))}
                </List>
              )}
            </>
          )}
        </WithNavbar>
      </Page>
    </KonstaLayouts>
  );
}
