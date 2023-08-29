import { useEffect, useState } from "react";
import { useAttendance } from "@/store/attendance";
import {
  Block,
  BlockTitle,
  Dialog,
  DialogButton,
  List,
  ListItem,
  Preloader,
} from "konsta/react";
import { format } from "date-fns";

import success from "../assets/success.json";
import Lottie from "react-lottie";

export default function LatestAttendances() {
  // state toast
  const [deletedSuccessful, setDeletedSuccessful] = useState(false);
  // dialog to confirm delete
  const [dialogOpened, setDialogOpened] = useState(false);
  // is loading
  const [isLoading, setIsLoading] = useState(false);
  // selected id
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // count down item clicked
  const [countDownItemClicked, setCountDownItemClicked] = useState(0);

  const [attendances, fetchAttendances, deleteAttendance] = useAttendance(
    (state) => [
      state.attendances,
      state.fetchAttendances,
      state.deleteAttendance,
    ]
  );

  // fetch attendances using use effect
  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  // lottie default
  // these options are lottie options
  // it will be used to render lottie animation
  const successOptions = {
    loop: true,
    autoplay: true,
    animationData: success,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const onItemClicked = (id: number) => {
    setDialogOpened(true);
    // setToastLeftOpened(true);
    setSelectedId(id);
    setCountDownItemClicked(5);
  };

  // confirmed delte
  const onConfirmedDelete = () => {
    const successSound = new Audio("/sounds/eventually.ogg");

    setIsLoading(true);
    deleteAttendance(selectedId!).finally(() => {
      setDialogOpened(false);
      // setToastLeftOpened(true);
      setSelectedId(null);
      setIsLoading(false);
      setDeletedSuccessful(true);

      // play sound
      successSound.play();

      setTimeout(() => {
        setDeletedSuccessful(false);
      }, 3000);
    });
  };

  // use effect to handle count down
  useEffect(() => {
    if (countDownItemClicked === 0) return;
    const interval = setInterval(() => {
      setCountDownItemClicked((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownItemClicked]);

  return (
    <>
      <BlockTitle>Kehadiran terakhir</BlockTitle>
      <Block>
        {attendances.length === 0 ? (
          <Block strong>
            <p>Belum ada presensi untuk ditampilkan</p>
          </Block>
        ) : (
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
        )}
      </Block>

      {/* dialog to confirm delete */}
      <Dialog
        opened={dialogOpened}
        onBackdropClick={() => setDialogOpened(false)}
        title='Hapus kehadiran ini?'
        content='Kehadiran akan dihapus'
        buttons={[
          <DialogButton
            tabIndex={1}
            key='cancel'
            onClick={() => setDialogOpened(false)}>
            Batal
          </DialogButton>,
          <DialogButton
            tabIndex={2}
            key='delete'
            className='k-color-brand-red'
            onClick={onConfirmedDelete}
            disabled={countDownItemClicked > 0 || isLoading}>
            {isLoading ? (
              <Preloader />
            ) : (
              `Hapus ${
                countDownItemClicked > 0
                  ? "(" + countDownItemClicked + "d)"
                  : ""
              }`
            )}
          </DialogButton>,
        ]}
      />

      {/* dialog alert */}
      <Dialog
        opened={deletedSuccessful}
        onBackdropClick={() => setDeletedSuccessful(false)}
        title={
          <Lottie options={successOptions} speed={1} height={120} width={120} />
        }
        content={"Kehadiran berhasil dihapus"}
      />
    </>
  );
}
