import { useRecap } from "@/store/recap";
import format from "date-fns/format";
import { Block, BlockTitle, List, ListItem } from "konsta/react";
import { useEffect, useState } from "react";

export default function RecapAttendance() {
  // page state
  const [page, setPage] = useState<number>(1);

  const [attendances, fetchAttendances] = useRecap((state) => [
    state.attendances,
    state.fetchAttendances,
  ]);

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
            chevronMaterial={false}
            title={attendance.student.fullname}
            after={format(new Date(attendance.attendance_date), "HH:mm")}
            subtitle={`${attendance.student.nipd} - ${attendance.rombel.nama}`}
          />
        ))}
      </List>
    </>
  );
}
