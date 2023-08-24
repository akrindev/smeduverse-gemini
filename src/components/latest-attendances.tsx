import { useEffect, useState } from "react";
import { useAttendance } from "@/store/attendance";
import { Attendance } from "@/types/attendances";
import { Block, List, ListItem, Toast } from "konsta/react";
import { format } from "date-fns";

export default function LatestAttendances() {
  // state toast
  const [toastLeftOpened, setToastLeftOpened] = useState(false);
  const [attendances, fetchAttendances] = useAttendance<
    [Attendance[], () => void]
  >((state) => [state.attendances, state.fetchAttendances]);

  // fetch attendances using use effect
  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  const onItemClicked = (id: number) => {
    console.log("item clicked", id);
    setToastLeftOpened(true);
  };

  return (
    <>
      <Block>Kehadiran terakhir</Block>
      <Block>
        <List strongIos outlineIos>
          {attendances.map((attendance) => (
            <ListItem
              key={attendance.id}
              link
              onClick={() => onItemClicked(attendance.id)}
              chevronMaterial={false}
              title={attendance.student.fullname}
              after={format(new Date(attendance.attendance_date), "HH:mm")}
              subtitle={`${attendance.student.nipd} - ${attendance.rombel.nama}`}
            />
          ))}
        </List>
      </Block>

      <Toast position='left' opened={toastLeftOpened}>
        <div className='shrink'>item clicked</div>
      </Toast>
    </>
  );
}
