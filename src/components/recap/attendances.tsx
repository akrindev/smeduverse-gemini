import { useRecap } from "@/store/recap";
import format from "date-fns/format";
import id from "date-fns/locale/id";
import { Block, BlockTitle, List, ListItem } from "konsta/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RecapAttendance() {
  // page state
  const [page, setPage] = useState<number>(1);

  const [attendances, fetchAttendances] = useRecap((state) => [
    state.attendances,
    state.fetchAttendances,
  ]);

  // router
  const router = useRouter();

  useEffect(() => {
    fetchAttendances(page);
  }, [page, fetchAttendances]);

  //   make scroll listener to update page when scroll to bottom
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      setPage((prev) => prev + 1);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <BlockTitle>Kehadiran Terakhir</BlockTitle>
      <List strongIos outlineIos>
        {attendances.map((attendance) => (
          <ListItem
            key={attendance.id}
            link
            onClick={() => router.push(`/rekap/${attendance.student_id}`)}
            chevronMaterial={false}
            title={attendance.student.fullname}
            after={attendance.rombel.nama}
            // after={format(new Date(attendance.attendance_date), "HH:mm")}
            subtitle={`${attendance.student.nipd} | ${format(
              new Date(attendance.attendance_date),
              // must be like Sen, 23 Ags 21 08:00
              // if year is current yeat then remove the year
              new Date(attendance.attendance_date).getFullYear() ===
                new Date().getFullYear()
                ? "EEE, dd MMM HH:mm"
                : "EEE, dd MMM yy HH:mm",
              {
                locale: id,
              }
            )}`}
          />
        ))}
      </List>
    </>
  );
}
