import { useEffect } from "react";
import { useAttendance } from "@/store/attendance";
import { Attendance } from "@/types/attendances";
import { Block, List, ListItem } from "konsta/react";
import { format } from "date-fns";

export default function LatestAttendances() {
  const [attendances, fetchAttendances] = useAttendance<
    [Attendance[], () => void]
  >((state) => [state.attendances, state.fetchAttendances]);

  console.log("att", attendances);

  // fetch attendances using use effect
  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  return (
    <>
      <Block>Kehadiran terakhir</Block>
      <Block>
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
      </Block>
    </>
  );
}
